import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkAuth } from '../helpers/helpers';

const UnauthorizedComponent = () => (
  <div className='unauthorized-component'>
    <h2>Unauthorized</h2>
  </div>
);

const ProtectedComponent = ({ children, userState, handleUserState }) => {
  const history = useNavigate();
  useEffect(() => {
    checkAuth().then(res => {
      handleUserState(res);
      if (!res.isAuth) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
        return history('/login');
      };
    })
    .catch(err => {
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      handleUserState(null); 
      throw err 
    })
  })

  return userState ? children : <UnauthorizedComponent />
};

export default ProtectedComponent;