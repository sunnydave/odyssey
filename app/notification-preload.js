const { v4: uuidv4 } = require('uuid');
const { ipcRenderer } = require('electron');

console.log('Notification preload script');

class Notification {
  static permission = 'granted';

  constructor(title = '', options = {}) {
    this.title = title;
    this.options = options;
    this.notificationId = uuidv4();
    ipcRenderer.sendToHost('app-notification', {
      title: this.title,
      body: this.options.body,
      icon: this.options.icon,
      notificationId: this.notificationId,
    });

    ipcRenderer.once(`notification-onclick:${this.notificationId}`, () => {
      if (typeof this.onclick === 'function') {
        this.onclick();
      }
    });
  }

  static requestPermission(cb = null) {
    console.log('Request permission');
    if (!cb) {
      return new Promise((resolve) => {
        resolve(Notification.permission);
      });
    }

    if (typeof cb === 'function') {
      return cb(Notification.permission);
    }

    return Notification.permission;
  }

  // eslint-disable-next-line class-methods-use-this
  onClick() {}

  // eslint-disable-next-line class-methods-use-this
  close() {}
}

window.Notification = Notification;
