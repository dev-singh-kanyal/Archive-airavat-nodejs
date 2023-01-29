import config from "../config/config"

const checkAuth = () => fetch(`${config.API_BASE_URL}/users/auth`, {
  method: 'POST',
  credentials: 'include',
  body: '',
  headers: {
    'Content-type': 'application/json'
  },
}).then(res => res.json());

/** 
 * Login the user with credentials in user object
 * @param {Object} user
 * @returns {Promise} Server response json
 */
const loginUser = (user) => fetch(`${config.API_BASE_URL}/users/login`, {
  method: 'POST',
  body: JSON.stringify(user),
  credentials: "include",
  headers: {
    'Content-type': 'application/json'
  },
}).then(res => {
  if (!res.ok) alert(`An error occured: ${res.statusText}`);
  return res.json();
})

export { checkAuth, loginUser }
