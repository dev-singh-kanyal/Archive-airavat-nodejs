const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const SECRET = process.env.JWT_SECRET;

const { userAuthExpire, driverAuthExpire } = require('../config/config');
const dbo = require('../db/conn');
const { ObjectId } = require('mongodb');

/** 
 * @typedef {function(import('mongodb').Collection): void} Cb0
 */
/** 
 * @param {string} collection collection name
 * @param {Cb0} cb
 */
const getDbCollection = (collection, cb) => {
  cb(dbo.getDb().collection(collection));
}

/** 
 * @typedef {function(TypeError, import('mongodb').Document): void} Cb1
 * @callback cb
 */
/** 
 * @param {string} userLoginCollection User login collection name
 * @param {string} token The token to check
 * @param {Cb1} cb callback
 **/
const findUserByToken = (userLoginCollection, token, cb) => {
  if (!token) return cb(null, null);
  jwt.verify(token, SECRET, (err, decode) => {
    if (!decode) return cb(null, null);
    getDbCollection(userLoginCollection, users => {
      users.findOne({ userId: decode.id, token: token })
      .then(user => cb(null, user))
      .catch(err => cb(err));
    })
  })
}

/**
 * insert new user if email does not exist
 * @param {import('mongodb').Collection} collection MongoDB Collection  
 * @param {Object} newUser User object
 * @param {Response} res Response to client
 **/
const registerNewUser = (collection, newUser, res) => collection.findOne({ email: newUser.email })
  .then(result => {
    if (result) return res.status(400).json({ auth: false, message: 'Email exists' })

    bcrypt.hash(newUser.password, 10).then(hashedPassword => {
      const hashedUser = {
        name: newUser.name,
        email: newUser.email,
        password: hashedPassword,
      }

      if (newUser.vehicleId) hashedUser['vehicleId'] = newUser.vehicleId;

      console.log(hashedUser)

      collection.insertOne(hashedUser).then(result => {
        console.log(`New user signed up: ${result.insertedId}`);

        // if user is a driver
        if (newUser.vehicleId) {
          res.status(200).json({
            success: true,
            user: {
              userId: result.insertedId,
              vehicleId: newUser.vehicleId,
              userName: newUser.email,
              password: newUser.password
            }
          });
        } else {
          res.status(200).json({
            success: true,
            user: {
              userId: result.insertedId
            }
          });
        }
      })
        .catch(err => {
          throw err
        })
    })
  })

/**
 * Geneerate JWT token and sign in user
 * @param {string} userLoginCollection User login collection name
 * @param {import('mongodb').Document} user
 * @param {Response} res
 */
const generateToken = (userLoginCollection, user, res) => {
  const expiresInMin = userLoginCollection === 'logged_in_users' 
                        ? userAuthExpire : driverAuthExpire;
  const userId = user._id.toHexString()
  const token = jwt.sign({ id: userId }, SECRET, { expiresIn: 60 * expiresInMin });

  let query = { userId: user._id.toHexString() };
  let newValues = {$set: {
    createdAt: new Date(),
    userId: userId,
    token: token
  }}

  getDbCollection(userLoginCollection, loggedIn => {

    loggedIn.updateOne(query, newValues, {upsert: true})
    .then(result => {

      if (userLoginCollection === 'logged_in_drivers') {
        getDbCollection('vehicles', vehicles => {
          vehicles.findOne({_id: ObjectId(user.vehicleId)})
          .then(result => {
            const vehicle = {
              vehicleNo: result.vehicleNo,
              vehicleName: result.vehicleName,
            }
            return res.cookie('auth', token, { maxAge: expiresInMin * 60 * 1000 }).json({
              isAuth: true, id: user._id, email: user.email, name: user.name,
              vehicleId: user.vehicleId, vehicle: vehicle
            });
          })
        })
      } else {
        return res.cookie('auth', token, { maxAge: expiresInMin * 60 * 1000 }).json({
          isAuth: true, id: user._id, email: user.email, name: user.name
        });
      }
      console.log(result);
    }).catch(err => {throw err});
  })
}

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

/** 
 * Get distance between two earth coordinates in meters
 * 
 * @param {{lat: number, lng: number}} pos1 First coordinate 
 * @param {{lat: number, lng: number}} pos2 Second coordinate
 * @returns {number} Distance in meters
 */
function distanceBetCoords(pos1, pos2) {
  var earthRadiusKm = 6371;

  var dLat = degreesToRadians(pos2.lat- pos1.lat);
  var dLon = degreesToRadians(pos2.lng- pos1.lng);

  radLat1 = degreesToRadians(pos1.lat);
  radLat2 = degreesToRadians(pos2.lat);

  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(radLat1) * Math.cos(radLat2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return 1000 * earthRadiusKm * c;
}

module.exports = { getDbCollection, findUserByToken, registerNewUser, generateToken, distanceBetCoords }