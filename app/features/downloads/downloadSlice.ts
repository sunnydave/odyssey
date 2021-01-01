import { createSlice } from '@reduxjs/toolkit';
// eslint-disable-next-line import/no-cycle
import { RootState } from '../../store';

const downloadSlice = createSlice({
  name: 'downloads',
  initialState: { activeDownloads: [] as any, completedDownloads: [] as any },
  reducers: {
    newActiveDownload: (state, payloadAction) => {
      const { newDownload } = payloadAction.payload;
      console.log(`New Download ${newDownload}`);
      state.activeDownloads.push(newDownload);
    },
    downloadProgress: (state, payloadAction) => {
      const { downloadId, receivedBytes } = payloadAction.payload;
      const download = state.activeDownloads.find(
        (stateDownload: any) => stateDownload.id === downloadId
      );
      if (download) {
        download.receivedBytes = receivedBytes;
      }
    },
    downloadState: (state, payloadAction) => {
      const { downloadId, downloadState } = payloadAction.payload;
      const download = state.activeDownloads.find(
        (stateDownload: any) => stateDownload.id === downloadId
      );
      if (download) {
        download.state = downloadState;
      }
    },
    pauseDownload: (state, payloadAction) => {
      const { downloadId, isPaused } = payloadAction.payload;
      const download = state.activeDownloads.find(
        (stateDownload: any) => stateDownload.id === downloadId
      );
      if (download) {
        download.isPaused = isPaused;
      }
    },
    completeDownload: (state, payloadAction) => {
      const { downloadId, downloadState } = payloadAction.payload;
      const download = state.activeDownloads.find(
        (stateDownload: any) => stateDownload.id === downloadId
      );
      if (download) {
        download.state = downloadState;
        const downloadIndex = state.activeDownloads.findIndex(
          (stateDownload: any) => stateDownload.id === downloadId
        );
        if (downloadIndex > -1) {
          state.activeDownloads.splice(downloadIndex, 1);
        }
        state.completedDownloads.push(download);
      }
    },
  },
});

export const {
  newActiveDownload,
  downloadProgress,
  downloadState,
  pauseDownload,
  completeDownload,
} = downloadSlice.actions;

export default downloadSlice.reducer;

export const activeDownloads = (state: RootState) =>
  state.downloads.activeDownloads;

export const completedDownloads = (state: RootState) =>
  state.downloads.completedDownloads;
