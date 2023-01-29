const express = require('express');
const userRoutes = express.Router();
const { getDbCollection, findUserByToken, registerNewUser, generateToken } = require('../helpers/helpers');
const bcrypt = require('bcrypt');
const { ObjectID } = require('bson');

// Register a new user
userRoutes.route('/users/register').post((req, res) => {
  getDbCollection('users', users => {
    const { name, email, password, password2 } = req.body;
    if (password != password2) {
      return res.status(400).json({ message: "passwords doesn't match" });
    }

    const user = {
      name: name,
      email: email,
      password: password
    }

    registerNewUser(users, user, res).catch(err => { throw err; });
  })
})

// sign in
userRoutes.route('/users/login').post((req, res) => {
  let token = req.cookies.auth;

  // checked if already signed in
  findUserByToken('logged_in_users', token, (err, user) => {
    if (err) return res(err);
    if (user) return res.status(400).json({ error: true, message: 'You are already logged in' });

    // find user by email
    getDbCollection('users', users => {
      users.findOne({ 'email': req.body.email }).then(user => {
        if (!user) return res.json({ isAuth: false, message: 'Email does not exist' });

        bcrypt.compare(req.body.password, user.password)
          .then(isMatch => {
            if (!isMatch) return res.json({ isAuth: false, message: "Password mismatched" });

            // generate token
            generateToken('logged_in_users', user, res);
          })
      })
    })
  })
})


userRoutes.route('/drivers/:id').get((req, res) => {
  getDbCollection('drivers', (drivers) => {
    let query = { _id: ObjectID(req.params.id) };

    drivers.findOne(query)
      .then(result => { res.json(result) })
      .catch(err => {
        throw err;
      });
  })
})

// sign in
userRoutes.route('/drivers/login').post((req, res) => {
  let token = req.cookies.auth;

  findUserByToken('logged_in_drivers', token, (err, driver) => {
    if (err) return res(err);
    if (driver) return res.status(400).json({ error: true, message: 'You are already logged in' });

    getDbCollection('drivers', drivers => {
      drivers.findOne({ 'email': req.body.email }).then(driver => {
        if (!driver) return res.json({ isAuth: false, message: 'Email does not exist' });

        bcrypt.compare(req.body.password, driver.password).then(isMatch => {
          if (!isMatch) return res.json({ isAuth: false, message: "Password mismatched" });

          // generate token and sign in user
          generateToken('logged_in_drivers', driver, res);
        })
      })
    })
  })
})

// Drivers sign out
userRoutes.route('/drivers/logout').get((req, res) => {
  let token = req.cookies.auth;
  findUserByToken('logged_in_drivers', token, (err, driver) => {
    if (err) throw err;
    if (!driver) return res.status(400).json({ error: true });

    // if user found, clear token from db
    getDbCollection('logged_in_drivers', drivers => {
      drivers.deleteOne({ token: token })
        .then(() => {
          res.cookie('auth', '', { expires: new Date(0) }).sendStatus(200);
        })
        .catch(err => { res.sendStatus(400).json(err); })
    })
  })
})

// sign out
userRoutes.route('/users/logout').get((req, res) => {
  let token = req.cookies.auth;
  findUserByToken('logged_in_users', token, (err, driver) => {
    if (err) throw err;
    if (!driver) return res.status(400).json({ error: true });

    // if user found, clear token from db
    getDbCollection('logged_in_users', drivers => {
      drivers.deleteOne({ token: token })
        .then(() => {
          res.cookie('auth', '', { expires: new Date(0) }).sendStatus(200);
        })
        .catch(err => { res.sendStatus(400).json(err); })
    })
  })
})

// check authorized
userRoutes.route('/users/auth').post((req, res) => {
  let token = req.cookies.auth;

  findUserByToken('logged_in_users', token, (err, user) => {
    if (err) return res(err);
    if (!user) return res.status(401).json({ isAuth: false, message: 'Unauthorized' });

    return res.status(200).json({ isAuth: true, message: 'success' });
  })
})

userRoutes.route('/drivers/auth').post((req, res) => {
  let token = req.cookies.auth;

  findUserByToken('logged_in_drivers', token, (err, driver) => {
    if (err) return res(err);
    if (!driver) return res.status(401).json({ isAuth: false, message: 'Unauthorized' });

    return res.status(200).json({ isAuth: true, message: 'success' });
  })
})

module.exports = userRoutes