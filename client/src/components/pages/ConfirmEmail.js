import React, { useEffect, useState } from 'react';
import axios from 'axios'

const ConfirmEmail = props => {
  const [msg, setMsg] = useState('Loading...')

  const token = props.match.params.token
  useEffect(() => {
    const confirmEmail = async () => {
      const res = await axios.get(`/api/users/confirm/${token}`)
        .then(res => {
          setMsg(res.data)
        })
        .catch(err => {
          setMsg(`${err.response.data}. Try login to resend active link`)
        })
      // usuwanie z bazy tego linku
      setTimeout(() => {
        props.history.push('/login')
      }, 5000)
    }
    confirmEmail()
  }, []);
  return (
    <div>{msg}</div>
  );
}

export default ConfirmEmail;