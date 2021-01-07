const { ipcRenderer } = require('electron');

const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    // eslint-disable-next-line no-bitwise
    const r = (Math.random() * 16) | 0;
    // eslint-disable-next-line no-bitwise
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

class Notification {
  static permission = 'granted';

  constructor(title = '', options = {}) {
    this.title = title;
    this.options = options;
    this.notificationId = uuidv4();
    ipcRenderer.send('app-notification', {
      title: this.title,
      body: this.options.body,
      icon: this.options.icon,
      notificationId: this.notificationId,
    });

    ipcRenderer.once(`notification-onclick:${this.notificationId}`, () => {
      if (typeof this.onclick === 'function') {
        this.onclick();
      }
      ipcRenderer.sendToHost('notification-click');
    });
  }

  static requestPermission(cb = null) {
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
