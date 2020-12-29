import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import {
  activeApp,
  appGroups,
  newTab,
  closeTab,
  changeTabSelection,
} from '../../features/apps/appGroupSlice';
import styles from './AppTabs.css';
import NewAppTab from './newapptab/NewAppTab';
import WebviewAppTab from './WebviewAppTab/WebviewAppTab';

export default function AppTabs() {
  const dispatch = useDispatch();
  const apps = useSelector(appGroups);
  const currentActiveApp = useSelector(activeApp);
  return (
    <div className={styles.container}>
      {apps.map((app: any) => (
        <Tabs
          key={app.id}
          className={
            currentActiveApp === app.id ? styles.showTabs : styles.hideTabs
          }
          selectedIndex={app.activeTabIndex}
          onSelect={(index) => {
            dispatch(changeTabSelection({ appId: app.id, index }));
          }}
        >
          <TabList className={styles.tabList}>
            {app.openTabs.map((tab: any) => (
              <Tab
                key={tab.id}
                className={styles.tab}
                selectedClassName={styles.tabSelected}
              >
                <div>
                  {tab.favIcon ? (
                    <img
                      src={tab.favIcon}
                      alt={tab.title}
                      className={styles.tabIcon}
                    />
                  ) : null}
                  <span>{tab.title}</span>
                  {app.openTabs.length > 1 ? (
                    <button
                      className={styles.addTabButton}
                      type="button"
                      onClick={() =>
                        dispatch(closeTab({ appId: app.id, tabId: tab.id }))
                      }
                    >
                      <i className="fa fa-times fa-1x" />
                    </button>
                  ) : (
                    ''
                  )}
                </div>
              </Tab>
            ))}
            <button
              type="button"
              className={styles.addTabButton}
              onClick={() =>
                dispatch(
                  newTab({ appId: app.id, tabUrl: '', tabTitle: 'New Tab' })
                )
              }
            >
              <i className="fa fa-plus-circle fa-2x" />
            </button>
          </TabList>
          {app.openTabs.map((tab: any) => (
            <TabPanel
              forceRender
              key={tab.id}
              className={styles.tabPanel}
              selectedClassName={styles.tabPanelSelect}
            >
              {tab.url !== '' ? (
                <WebviewAppTab
                  appId={app.id}
                  tabId={tab.id}
                  tabUrl={tab.url}
                  appSeperateSession={app.separateSession}
                />
              ) : (
                <NewAppTab
                  appId={app.id}
                  tabId={tab.id}
                  urlSuffix={app.urlSuffix}
                  urlPlaceholder={app.urlPlaceholder}
                />
              )}
            </TabPanel>
          ))}
        </Tabs>
      ))}
    </div>
  );
}
