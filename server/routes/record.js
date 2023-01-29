const express = require('express');
const tracksRoutes = express.Router();
const { getDbCollection, registerNewUser, distanceBetCoords } = require('../helpers/helpers')

const ObjectId = require('mongodb').ObjectId;

tracksRoutes.route('/vehicles').get((req, res) => {
  getDbCollection('vehicles', (vehicles) => {
    vehicles.find({})
      .toArray()
      .then(result => { res.json(result) })
      .catch(err => {
        throw err;
      });
  })
});

tracksRoutes.route('/vehicles/:id').get((req, res) => {
  getDbCollection('vehicles', (vehicles) => {
    let query = { _id: ObjectId(req.params.id) };

    vehicles.findOne(query)
      .then(result => {
        res.json(result.pos)
      })
      .catch(err => {
        throw err;
      });
  })
})

tracksRoutes.route('/vehicles/add').post((req, res) => {
  getDbCollection('vehicles', (vehicles) => {
    const { driverName, email, phoneNumber, vehicleName, vehicleNo } = req.body;
    let newVehicle = {
      vehicleName: vehicleName,
      vehicleNo: vehicleNo
    }

    const plainPassword = (driverName.split(' ').join('').slice(0, 4) + vehicleNo.split(' ').join('').slice(0, 4)).toLowerCase()

    vehicles.insertOne(newVehicle)
      .then(result => {
        // register driver
        let driver = {
          name: driverName,
          phoneNumber: phoneNumber,
          email: email,
          password: plainPassword,
          vehicleId: result.insertedId.toHexString(),
        }
        getDbCollection('drivers', drivers => {
          registerNewUser(drivers, driver, res).catch(err => { throw err; });
        })
      })
      .catch(err => {
        throw err;
      });
  })
});

// This section will help you update a record by id.
tracksRoutes.route("/update/:id").post(function (req, res) {
  const currPos = req.body.pos;
  let vehiclesQuery = { _id: ObjectId(req.params.id) };
  let pathsQuery = { vehicleId: req.params.id };

  getDbCollection('paths', (paths) => {
    paths.findOne({ vehicleId: req.params.id })
    .then(result => {
      let prevCoords = null;
      if (result.paths) {
        const path = result.paths;
        prevCoords = path[path.length - 1].coords;
      }
      if (!prevCoords || distanceBetCoords(currPos.coords, prevCoords) !== 0) {
        paths.updateOne(pathsQuery, { $push: { paths: currPos }}, {upsert: true})
        .then(pathUpdateResult => {
          console.log('Paths updated:', pathUpdateResult);
        })
        .catch(err => { throw err; });
      }
    })
  })

  getDbCollection('vehicles', vehicles => {
    vehicles.updateOne(vehiclesQuery, { $set: { pos: req.body.pos }}, {upsert: true})
    .then(result => {res.json(result);})
    .catch(err => { throw err; });
  })
})

tracksRoutes.route('/paths/:id').get(function (req, res) {
  getDbCollection('paths', paths => {
    paths.findOne({ vehicleId: req.params.id })
      .then(result => {
        if (!result) res.status(404).json(result);
        else res.status(200).json(result);
      })
      .catch(err => { throw err })
  })
})

module.exports = tracksRoutes