import { createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const appGroupSlice = createSlice({
  name: 'appGroup',
  // initialState: { appGroups: FileUtils.loadData('userApps.json') },
  initialState: { apps: [], activeApp: '' },
  reducers: {
    setInitialState: (state, payloadAction) => {
      const { loadedApps, loadedActiveApp } = payloadAction.payload;
      state.apps = loadedApps;
      state.activeApp = loadedActiveApp;
    },
    addAppGroup: (state, appGroup) => {
      const newApp = appGroup.payload;
      newApp.id = uuidv4();
      const newTabId = uuidv4();
      newApp.openTabs = [
        {
          id: newTabId,
          url: newApp.appUrl,
          title: newApp.appUrl !== '' ? newApp.appUrl : newApp.name,
          favIcon: '',
        },
      ];
      newApp.activeTab = newTabId;
      newApp.activeTabIndex = 0;
      state.apps.push(newApp);
      state.activeApp = newApp.id;
    },
    setActiveApp: (state, payloadAction) => {
      const { activeAppId } = payloadAction.payload;
      state.activeApp = activeAppId;
    },
    deleteApp: (state, payloadAction) => {
      const { appId } = payloadAction.payload;
      const selectedAppIndex = state.apps.findIndex(
        (stateApp) => stateApp.id === appId
      );
      if (selectedAppIndex > -1) {
        state.apps.splice(selectedAppIndex, 1);
      }
      if (state.activeApp === appId && state.apps.length > 0) {
        state.activeApp = state.apps[0].id;
      }
    },
    newTab: (state, payloadAction) => {
      const { appId, tabUrl, tabTitle } = payloadAction.payload;
      const newTabId = uuidv4();
      const selectedApp = state.apps.find((stateApp) => stateApp.id === appId);
      selectedApp.openTabs.push({
        id: newTabId,
        url: tabUrl,
        title: tabTitle,
        favIcon: '',
      });
      selectedApp.activeTab = newTabId;
      selectedApp.activeTabIndex = selectedApp.openTabs.length - 1;
    },
    closeTab: (state, payloadAction) => {
      const { appId, tabId } = payloadAction.payload;
      const selectedApp = state.apps.find((stateApp) => stateApp.id === appId);
      const tabIndex = selectedApp.openTabs.findIndex(
        (appTab) => appTab.id === tabId
      );
      if (tabIndex === selectedApp.activeTabIndex) {
        selectedApp.activeTabIndex = 0;
      }
      selectedApp.openTabs.splice(tabIndex, 1);
    },
    updateTab: (state, payloadAction) => {
      const { appId, tabId, tabUrl, tabIcon, tabTitle } = payloadAction.payload;
      const selectedApp = state.apps.find((stateApp) => stateApp.id === appId);
      const selectedTab = selectedApp.openTabs.find((tab) => tab.id === tabId);
      if (tabUrl) {
        selectedTab.url = tabUrl;
        selectedTab.title = tabUrl;
      }
      if (tabIcon) {
        selectedTab.favIcon = tabIcon;
      }
      if (tabTitle) {
        selectedTab.title = tabTitle;
      }
    },
    changeTabSelection: (state, payloadAction) => {
      const { appId, index } = payloadAction.payload;
      const selectedApp = state.apps.find((stateApp) => stateApp.id === appId);
      selectedApp.activeTabIndex = index;
    },
  },
});

export const {
  setInitialState,
  addAppGroup,
  setActiveApp,
  newTab,
  closeTab,
  updateTab,
  deleteApp,
  changeTabSelection,
} = appGroupSlice.actions;

export default appGroupSlice.reducer;

export const appGroups = (state: RootState) => state.appGroups.apps;

export const activeApp = (state: RootState) => state.appGroups.activeApp;
