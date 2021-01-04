const { ipcRenderer } = require('electron');

const AppNotification = function (title, ops) {
  ipcRenderer.sendToHost('app-notification', {
    title,
    body: ops.body,
    icon: ops.icon,
  });
};

const requestPermission = function (callback) {
  window.Notification.permission = 'granted';
  callback(true);
};

window.Notification = AppNotification;
window.Notification.requestPermission = requestPermission;
