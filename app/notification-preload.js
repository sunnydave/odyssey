const { ipcRenderer, Notification } = require('electron');

console.log('Inside preload script');
const AppNotification = function (title, ops) {
  ipcRenderer.sendToHost('app-notification', {
    title,
    body: ops.body,
    icon: ops.icon,
  });
};

const requestPermission = function (callback) {
  callback(true);
};

window.Notification = AppNotification;
window.Notification.requestPermission = requestPermission;
