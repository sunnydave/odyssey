import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { DownloadItem } from 'electron';
import { v4 as uuidv4 } from 'uuid';
import styles from './WebviewAppTab.css';
import {
  setActiveApp,
  updateTab,
  updateAppNotification,
} from '../../../features/apps/appGroupSlice';
import {
  newActiveDownload,
  downloadProgress,
  downloadState,
  completeDownload,
  pauseDownload,
} from '../../../features/downloads/downloadSlice';

export default function WebviewAppTab(props: any) {
  const dispatch = useDispatch();
  const { appId, tabId, tabUrl, appSeperateSession } = props;
  const webview = createRef<HTMLWebViewElement>();
  useEffect(() => {
    if (webview) {
      if (webview.current) {
        webview.current.setAttribute('allowpopups', '');
        webview.current.setAttribute('plugins', '');
      }
      webview
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .current!.getWebContents()
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .session.on('will-download', (event: any, item: DownloadItem) => {
          const downloadItem: any = {};
          downloadItem.id = uuidv4();
          downloadItem.fileName = item.getFilename();
          downloadItem.totalBytes = item.getTotalBytes();
          downloadItem.receivedBytes = item.getTotalBytes();
          downloadItem.state = item.getState();
          downloadItem.isPaused = item.isPaused();
          downloadItem.savePath = item.getSavePath();
          downloadItem.url = item.getURL();
          dispatch(newActiveDownload({ newDownload: downloadItem }));
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-shadow
          item.on('updated', (event: any, state: string) => {
            if (state === 'interrupted') {
              dispatch(
                downloadState({
                  downloadId: downloadItem.id,
                  downloadState: state,
                })
              );
            } else if (state === 'progressing') {
              if (item.isPaused()) {
                dispatch(
                  pauseDownload({
                    downloadId: downloadItem.id,
                    isPaused: item.isPaused(),
                  })
                );
              } else {
                dispatch(
                  downloadProgress({
                    downloadId: downloadItem.id,
                    receivedBytes: item.getReceivedBytes(),
                  })
                );
              }
            }
          });
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line no-shadow
          item.once('done', (event: any, state: string) => {
            if (state === 'completed') {
              dispatch(
                completeDownload({
                  downloadId: downloadItem.id,
                  downloadState: state,
                })
              );
            } else {
              dispatch(
                completeDownload({
                  downloadId: downloadItem.id,
                  downloadState: state,
                })
              );
            }
          });
        });

      webview.current!.addEventListener(
        'page-favicon-updated',
        (source: any) => {
          const { favicons } = source;
          const favicon = favicons[0];
          dispatch(updateTab({ appId, tabId, tabIcon: favicon }));
        }
      );
      webview.current!.addEventListener('page-title-updated', (event: any) => {
        let { title } = event;
        if (title && title.length > 15) {
          title = title.substr(0, 15);
        }
        dispatch(updateTab({ appId, tabId, tabTitle: title }));
      });
      webview.current!.addEventListener('ipc-message', (event: any) => {
        if (event.channel === 'console-log') {
          console.log(event.args);
        } else if (event.channel === 'notification-click') {
          dispatch(setActiveApp({ activeAppId: appId }));
        } else if (event.channel === 'notification-received') {
          dispatch(updateAppNotification({ appId, tabId }));
        }
      });
    }
  }, []);

  return (
    <webview
      ref={webview}
      src={tabUrl}
      className={styles.webview}
      id={tabId}
      webpreferences="allowRunningInsecureContent, nativeWindowOpen=yes"
      preload="./notification-preload.js"
      partition={appSeperateSession ? `persist:${appId}` : `persist:odyssey`}
      useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36"
    />
  );
}

WebviewAppTab.propTypes = {
  appId: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  tabUrl: PropTypes.string.isRequired,
  appSeperateSession: PropTypes.bool.isRequired,
};
