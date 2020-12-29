import React, { createRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { ipcRenderer } from 'electron';
import styles from './WebviewAppTab.css';
import { updateTab } from '../../../features/apps/appGroupSlice';

export default function WebviewAppTab(props: any) {
  const dispatch = useDispatch();
  const { appId, tabId, tabUrl, appSeperateSession } = props;
  const webview = createRef<HTMLWebViewElement>();
  useEffect(() => {
    if (webview) {
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
      // webview.current.addEventListener('dom-ready', () => {
      //   webview.current.openDevTools();
      // });
      webview.current!.addEventListener('ipc-message', (event: any) => {
        ipcRenderer.send('app-notification', {
          title: event.args[0].title,
          body: event.args[0].body,
          icon: event.args[0].icon,
          appId,
          tabId,
        });
      });
    }
  }, [appId]);

  return (
    <webview
      ref={webview}
      src={tabUrl}
      className={styles.webview}
      id={tabId}
      allowpopups
      plugins
      webpreferences="allowRunningInsecureContent"
      preload={`file://${__dirname}/notification-preload.js`}
      partition={appSeperateSession ? `persist:${appId}` : `persist:odyssey`}
      useragent="Mozilla/5.0 (Macintosh; Intel Mac OS X 11_0_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.67 Safari/537.36"
    />
  );
}

WebviewAppTab.propTypes = {
  appId: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  tabUrl: PropTypes.string.isRequired,
  appSeperateSession: PropTypes.bool.isRequired,
};
