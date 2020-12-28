import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './NewAppTab.css';
import { updateTab } from '../../../features/apps/appGroupSlice';

export default function NewAppTab(props) {
  const dispatch = useDispatch();
  const [url, setUrl] = useState('');
  const { appId, tabId, urlSuffix, urlPlaceholder } = props;
  const handleUrlChange = (event) => {
    setUrl(event.target.value);
  };
  const handleUrlSubmit = () => {
    let tabUrl = url;
    if (tabUrl && tabUrl !== '') {
      if (!tabUrl.startsWith('http://') || !tabUrl.startsWith('https://')) {
        tabUrl = `https://${tabUrl}`;
      }
      if (urlSuffix) {
        tabUrl = `${tabUrl}${urlSuffix}`;
      }
      dispatch(updateTab({ appId, tabId, tabUrl }));
    }
  };
  return (
    <form className={styles.container} onSubmit={() => handleUrlSubmit()}>
      <input
        type="text"
        name="url"
        value={url}
        onChange={(event) => handleUrlChange(event)}
        className={urlSuffix ? styles.urlInputWithSuffix : styles.urlInput}
        placeholder={urlPlaceholder || 'Type a URL'}
      />
      {urlSuffix ? <span>{urlSuffix}</span> : null}
    </form>
  );
}

NewAppTab.propTypes = {
  appId: PropTypes.string.isRequired,
  tabId: PropTypes.string.isRequired,
  urlSuffix: PropTypes.string,
  urlPlaceholder: PropTypes.string,
};

NewAppTab.defaultProps = {
  urlSuffix: null,
  urlPlaceholder: null,
};
