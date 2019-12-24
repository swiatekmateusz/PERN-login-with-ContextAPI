import React, { useContext, Fragment } from 'react';
import { AlertContext } from '../../context/alertContext/AlertContext'

const Alerts = () => {
  const alertContext = useContext(AlertContext)
  const { alerts, deleteAlert } = alertContext


  return (
    <Fragment>
      {alerts.map(alert =>
        <div className={alert.type} key={alert.id}>
          <p>{alert.content}</p>
          <button onClick={() => deleteAlert(alert.id)}>X</button>
        </div>
      )}
    </Fragment>
  );
}

export default Alerts;