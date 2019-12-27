import React, { useEffect, useState } from 'react';
import axios from 'axios'

const ConfirmEmail = props => {
  const [msg, setMsg] = useState('Loading...')

  const token = props.match.params.token
  useEffect(() => {
    const confirmEmail = async () => {
      // eslint-disable-next-line
      const res = await axios.get(`/api/email/confirm/${token}`)
        .then(res => {
          setMsg(res.data)
        })
        .catch(err => {
          setMsg(`${err.response.data}. Try login to resend active link`)
        })
      setTimeout(() => {
        props.history.push('/login')
      }, 5000)
    }
    confirmEmail()
    // eslint-disable-next-line
  }, []);
  return (
    <div>{msg}</div>
  );
}

export default ConfirmEmail;