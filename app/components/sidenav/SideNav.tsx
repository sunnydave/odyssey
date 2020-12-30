import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Popup from 'reactjs-popup';
import styles from './SideNav.css';
import {
  appGroups,
  activeApp,
  setActiveApp,
} from '../../features/apps/appGroupSlice';
import AddGroupPopup from '../addgroup/AddGroup';
import AppMenu from './appmenu/AppMenu';

export default function SideNav() {
  const dispatch = useDispatch();
  const apps = useSelector(appGroups);
  const currentActiveApp = useSelector(activeApp);
  const [openAddGroupPopup, setOpenAddGroupPopup] = useState(false);
  const toggleOpenAddGroupPopup = () => {
    setOpenAddGroupPopup(!openAddGroupPopup);
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
    </div>
  );
}
