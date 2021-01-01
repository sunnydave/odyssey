import React from 'react';
import { useSelector } from 'react-redux';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import Popup from 'reactjs-popup';
import PropTypes from 'prop-types';
import styles from './DownloadPopup.css';
import {
  activeDownloads,
  completedDownloads,
} from '../../features/downloads/downloadSlice';

export default function DownloadPopup(props: any) {
  const { show, toggleDownloadPopup } = props;
  const currentActiveDownloads = useSelector(activeDownloads);
  const currentCompletedDownloads = useSelector(completedDownloads);
  return (
    <Popup open={show} modal>
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.close}
          onClick={() => toggleDownloadPopup()}
        >
          <i className="fa fa-times fa-1x" />
        </button>
        <div className={styles.header}> Downloads </div>
        <div className={styles.content}>
          <Tabs>
            <TabList>
              <Tab>Active Downloads</Tab>
              <Tab>Completed Downloads</Tab>
            </TabList>
            <TabPanel>
              {currentActiveDownloads.length > 0 ? (
                <div className={styles.downloadList}>
                  {currentActiveDownloads.map((downloadItem: any) => (
                    <div key={downloadItem.id} className={styles.downloadList}>
                      <span>{downloadItem.fileName}</span>
                      <span>{downloadItem.state}</span>
                      <progress
                        value={downloadItem.receivedBytes}
                        max={downloadItem.totalBytes}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <h1>No Active Downloads</h1>
              )}
            </TabPanel>
            <TabPanel>
              {currentCompletedDownloads.length > 0 ? (
                <div className={styles.downloadList}>
                  {currentCompletedDownloads.map((downloadItem: any) => (
                    <div key={downloadItem.id} className={styles.downloadItem}>
                      <span>{downloadItem.fileName}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <h1>No Completed Downloads</h1>
              )}
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Popup>
  );
}

DownloadPopup.propTypes = {
  show: PropTypes.bool.isRequired,
  toggleDownloadPopup: PropTypes.func.isRequired,
};
