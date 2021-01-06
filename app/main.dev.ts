/* eslint global-require: off, no-console: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import path from 'path';
import fs from 'fs';
import { app, BrowserWindow, ipcMain, Notification, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import contextMenu from 'electron-context-menu';
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let notificationsEnabled = true;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'resources')
    : path.join(__dirname, '../resources');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    titleBarStyle: process.platform === 'darwin' ? 'hidden' : 'default',
    frame: false,
    webPreferences:
      (process.env.NODE_ENV === 'development' ||
        process.env.E2E_BUILD === 'true') &&
      process.env.ERB_SECURE !== 'true'
        ? {
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
          }
        : {
            preload: path.join(__dirname, 'dist/renderer.prod.js'),
            nodeIntegration: true,
            webviewTag: true,
            enableRemoteModule: true,
          },
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (process.env.E2E_BUILD === 'true') {
  // eslint-disable-next-line promise/catch-or-return
  app.whenReady().then(createWindow);
} else {
  app.on('ready', createWindow);
}

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow();
});

app.on('web-contents-created', (_event, contents) => {
  if (contents.getType() === 'webview') {
    // eslint-disable-next-line no-shadow
    contents.on('new-window', (_event, url) => {
      _event.preventDefault();
      shell.openExternal(url);
    });
    contextMenu({
      window: contents,
      prepend: (_defaultActions, _params, _browserWindow) => [
        {
          label: 'Forward',
          visible: contents.canGoForward(),
          click: () => {
            contents.goForward();
          },
        },
        {
          label: 'Back',
          visible: contents.canGoBack(),
          click: () => {
            contents.goBack();
          },
        },
        {
          label: 'Reload',
          click: () => {
            contents.reload();
          },
        },
      ],
    });
  }
});

ipcMain.on('app-notification', (event, args) => {
  if (notificationsEnabled) {
    const notification = new Notification({
      title: args.title,
      body: args.body,
      icon: args.icon,
    });
    notification.show();
    notification.on('click', () => {
      mainWindow!.show();
      if (mainWindow!.isMinimized()) {
        mainWindow?.restore();
      }
      mainWindow?.focus();
      event.sender.send(`notification-onclick:${args.notificationId}`, {});
    });
  }
});

ipcMain.on('toggleNotification', (_event) => {
  notificationsEnabled = !notificationsEnabled;
});

ipcMain.handle('loadData', async (_event, filename) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, `${filename}.json`);
  fs.writeFileSync(filePath, '', { flag: 'a' });
  const data: string = fs.readFileSync(filePath, { encoding: 'utf8' });
  return data.length > 0 ? JSON.parse(data) : null;
});

ipcMain.handle('saveData', async (_event, filename, data) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
  return true;
});
