import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NotificationBadge from 'react-notification-badge';
import ReactTooltip from 'react-tooltip';
import { ipcRenderer } from 'electron';
import styles from './SideNav.css';
import {
  appGroups,
  activeApp,
  setActiveApp,
} from '../../features/apps/appGroupSlice';
import { activeDownloads } from '../../features/downloads/downloadSlice';
import AddGroupPopup from '../addgroup/AddGroup';
import AppMenu from './appmenu/AppMenu';
import DownloadPopup from '../downloadpopup/DownloadPopup';

export default function SideNav() {
  const dispatch = useDispatch();
  const apps = useSelector(appGroups);
  const currentActiveApp = useSelector(activeApp);
  const currentActiveDownloads = useSelector(activeDownloads);
  const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
  const [openDownloadPopup, setOpenDownloadPopup] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  useEffect(() => {
    ReactTooltip.rebuild();
  });
  const toggleOpenAddGroupPopup = () => {
    setOpenAddGroupPopup(!openAddGroupPopup);
  };
  const toggleDownloadPopup = () => {
    setOpenDownloadPopup(!openDownloadPopup);
  };
  const toggleNotifications = () => {
    ipcRenderer.send('toggleNotification');
    setNotificationsEnabled(!notificationsEnabled);
  };
  return (
    <div>
      <div className={styles.sidenav}>
        <header>
          {apps.map((app: any) => (
            <>
              <button
                key={app.id}
                type="button"
                className={
                  currentActiveApp === app.id
                    ? styles.appGroupButtonActive
                    : styles.appGroupButton
                }
                onClick={() => dispatch(setActiveApp({ activeAppId: app.id }))}
                data-tip={app.name}
              >
                <Popup
                  key={app.id}
                  trigger={
                    <img
                      src={app.icon}
                      alt={app.name}
                      className={styles.appGroupIcon}
                    />
                  }
                  position="right top"
                  on="right-click"
                  arrow={false}
                  contentStyle={{ padding: '0px', border: 'none' }}
                >
                  <AppMenu appId={app.id} />
                </Popup>
                <NotificationBadge
                  count={app.notificationCount}
                  effect={[null, null, { top: '-5px' }, { top: '0px' }]}
                  className={styles.appNotificationBadge}
                />
              </button>
            </>
          ))}
        </header>
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.downloadButton}
            onClick={() => toggleDownloadPopup()}
            data-tip="Downloads"
          >
            <i className="fa fa-download fa-2x" />
            <NotificationBadge
              count={currentActiveDownloads.length}
              effect={[null, null, { top: '-5px' }, { top: '0px' }]}
              className={styles.downloadButtonBadge}
            />
          </button>
          <br />
          <button
            type="button"
            className={styles.downloadButton}
            data-tip={
              notificationsEnabled
                ? 'Disable Notifications'
                : 'Enabled Notifications'
            }
            onClick={() => toggleNotifications()}
          >
            {notificationsEnabled ? (
              <i className="fa fa-bell fa-2x" />
            ) : (
              <i className="fa fa-bell-slash fa-2x" />
            )}
          </button>
          <br />
          <button
            type="button"
            className={styles.button}
            onClick={() => toggleOpenAddGroupPopup()}
            data-tip="Add App"
          >
            <i className="fa fa-plus-circle fa-3x" />
          </button>
        </footer>
      </div>
      <Popup open={openAddGroupPopup} modal>
        <div className={styles.modal}>
          <button
            type="button"
            className={styles.close}
            onClick={() => toggleOpenAddGroupPopup()}
          >
            <i className="fa fa-times fa-1x" />
          </button>
          <div className={styles.header}> Add App Groups </div>
          <div className={styles.content}>
            <AddGroupPopup />
          </div>
        </div>
      </Popup>
      <DownloadPopup
        show={openDownloadPopup}
        toggleDownloadPopup={toggleDownloadPopup}
      />
      <ReactTooltip place="right" type="dark" effect="solid" />
    </div>
  );
}
