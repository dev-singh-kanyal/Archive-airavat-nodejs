import { React, useEffect, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import LayoutComponent from "./layout/layoutcomponent"
import { Home, Client, Admin, Registration, SignIn, SignUp } from "./pages"
import ProtectedComponent from "./components/ProtectedComponent"

import './styles/styles.scss'
import './styles/index.scss'
// test
import TestComp from "./test/FormComp"
import { checkAuth } from "./helpers/helpers"
import config from "./config/config"

function App() {
  const [user, setUser] = useState(null);

  const handleUserState = (res) => {
    console.log(res);
    if (!res || !res.isAuth) setUser(null);
  }

  useEffect(() => {
    const user = {
      id: localStorage.getItem('userId'),
      email: localStorage.getItem('userEmail'),
      name: localStorage.getItem('userName')
    }
    setUser(user);
    checkAuth().then(res => {
      console.log(res)
      if (!res.isAuth) {
        setUser(null);
        localStorage.removeItem('userId');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userName');
      };
    })
  }, [])

  const handleUser = (user) => {
    console.log(user);
    setUser(user);
    localStorage.setItem('userId', user.id);
    localStorage.setItem('userEmail', user.email);
    localStorage.setItem('userName', user.name);
  }

  const logoutUser = () => {
    fetch(`${config.API_BASE_URL}/users/logout`, {
      method: 'GET',
      credentials: "include",
      headers: {
        'Content-type': 'application/json'
      }
    }).then(res => {
      if (res.ok) {
        console.log('Logged out successfully')
      }
    }).catch(err => { throw err })
    .finally(() => {
      setUser(null);
      localStorage.removeItem('userId');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    })
  }

  return (
    <BrowserRouter>
      <LayoutComponent user={user} handleLogout={logoutUser}>
        <Routes>
          <Route path="/" element={<Home isUser={user ? true : false} />} />
          <Route path="/admin" element={
            <ProtectedComponent userState={user} handleUserState={handleUserState} >
              <Admin />
            </ProtectedComponent>
          } />
          <Route path="/client" element={<Client />} />
          <Route path="/register" element={
            <ProtectedComponent userState={user} handleUserState={handleUserState} >
              <Registration />
            </ProtectedComponent>
          } />
          <Route path="/login" element={
            <SignIn handleUser={handleUser} />
          } />
          <Route path="/signup" element={<SignUp />} />
          <Route path='/test' element={<TestComp />} />
        </Routes>
      </LayoutComponent>
    </BrowserRouter>
  );
}

export default App;
