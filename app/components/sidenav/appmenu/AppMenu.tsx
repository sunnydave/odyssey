import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import styles from './AppMenu.css';
import { deleteApp } from '../../../features/apps/appGroupSlice';

export default function AppMenu(props: any) {
  const dispatch = useDispatch();
  const { appId } = props;
  return (
    <div className={styles.appMenu}>
      <div
        role="button"
        className={styles.appMenuItem}
        onClick={() => dispatch(deleteApp({ appId }))}
        onKeyDown={() => dispatch(deleteApp({ appId }))}
        tabIndex={0}
      >
        <i className="fa fa-trash-alt fa-1x" />
        &nbsp; Delete App
      </div>
    </div>
  );
}

AppMenu.propTypes = {
  appId: PropTypes.string.isRequired,
};
