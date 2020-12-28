import { ipcRenderer } from 'electron';
import log from 'electron-log';

export default class {
  static loadData = (filename: string) => {
    return ipcRenderer.invoke('loadData', filename);
  };

  static saveData = (filename: string, data: any) => {
    ipcRenderer
      .invoke('saveData', filename, data)
      .then((response) => log.info(response))
      .catch((error) => log.error(error));
  };
}
