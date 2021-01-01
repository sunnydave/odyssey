import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import NotificationBadge from 'react-notification-badge';
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
  const toggleOpenAddGroupPopup = () => {
    setOpenAddGroupPopup(!openAddGroupPopup);
  };
  const toggleDownloadPopup = () => {
    setOpenDownloadPopup(!openDownloadPopup);
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
                  closeOnDocumentClick
                >
                  <AppMenu appId={app.id} />
                </Popup>
              </button>
            </>
          ))}
        </header>
        <footer className={styles.footer}>
          <button
            type="button"
            className={styles.downloadButton}
            onClick={() => toggleDownloadPopup()}
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
            className={styles.button}
            onClick={() => toggleOpenAddGroupPopup()}
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
    </div>
  );
}
