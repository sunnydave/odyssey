import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ipcRenderer } from 'electron';
import Loader from 'react-loader-spinner';
import log from 'electron-log';
import SideNav from './sidenav/SideNav';
import AppTabs from './apptabs/AppTabs';
import styles from './Home.css';
import {
  activeApp,
  appGroups,
  setActiveApp,
  setInitialState,
} from '../features/apps/appGroupSlice';
import FileUtils from '../utils/FileUtils';

export default function Home(): JSX.Element {
  const dispatch = useDispatch();
  const apps = useSelector(appGroups);
  const currentActiveApp = useSelector(activeApp);
  const [appsLoaded, setAppsLoaded] = useState(false);
  useEffect(() => {
    ipcRenderer.on('notification-click', (event, args) => {
      dispatch(setActiveApp({ activeAppId: args.appId }));
    });
    FileUtils.loadData('userApps')
      .then((data) => {
        setAppsLoaded(true);
        if (data) {
          dispatch(
            setInitialState({
              loadedApps: data.apps,
              loadedActiveApp: data.activeApp,
            })
          );
        }
        return true;
      })
      .catch((err) => {
        log.error('Error Loading Data from disk');
        log.error(err);
      });
  }, []);
  useEffect(() => {
    FileUtils.saveData('userApps', {
      apps,
      activeApp: currentActiveApp,
    });
  }, [apps, currentActiveApp]);
  return (
    <div className={styles.container}>
      <SideNav />
      {appsLoaded ? (
        <AppTabs />
      ) : (
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={3000} // 3 secs
        />
      )}
    </div>
  );
}
