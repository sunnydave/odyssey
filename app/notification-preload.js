const { ipcRenderer, Notification } = require('electron');

const AppNotification = function (title, ops) {
  ipcRenderer.sendToHost('app-notification', {
    title,
    body: ops.body,
    icon: ops.icon,
  });
};

window.Notification = AppNotification;
