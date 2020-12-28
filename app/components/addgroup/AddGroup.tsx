import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Loader from 'react-loader-spinner';
import log from 'electron-log';
import { addAppGroup } from '../../features/apps/appGroupSlice';

export default function AddGroup() {
  const dispatch = useDispatch();
  const [appList, setAppList] = useState([]);
  useEffect(() => {
    axios
      .get('https://cdn.nerdyandnoisy.com/NaNSpace/apps_dev_v4.json')
      .then((response) => {
        setAppList(response.data);
        return appList;
      })
      .catch((error) => {
        log.error(error);
      });
  }, []);
  const addApp = (app) => {
    dispatch(addAppGroup(app));
  };
  return (
    <div className="grid-container">
      {appList && appList.length > 0 ? (
        appList.map((app, index) => (
          <div
            role="button"
            className="grid-item"
            key={app.name}
            onClick={() => addApp(app)}
            onKeyDown={() => addApp(app)}
            tabIndex={index}
          >
            <img src={app.icon} alt={app.name} className="app-group-icon" />
            <h4>{app.name}</h4>
          </div>
        ))
      ) : (
        <Loader type="Puff" color="#00BFFF" height={200} width={200} />
      )}
    </div>
  );
}
