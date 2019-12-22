import React, { useEffect } from 'react';


// Confirm email inn useEffect
const ConfirmEmail = props => {
  const token = props.match.params.token
  useEffect(() => {
    //Uderzenie do API
  }, []);
  return (
    <div>{token}</div>
  );
}

export default ConfirmEmail;