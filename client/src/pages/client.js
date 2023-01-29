import { React, useState, useEffect } from 'react'
import config from '../config/config';

const VehicleSelect = ({ vehicle, handleSetVehicle }) => {
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    const getVehicles = async () => {
      const response = await fetch(`${config.API_BASE_URL}/vehicles`);
      if (!response.ok) {
        const message = response.statusText;
        alert(`An error occured: ${message}`);
        return;
      }

      const vehicles = await (response.json());
      setVehicles(vehicles);
    }
    getVehicles();
  }, [])

  return (
    <div className='vehicle-select-form'>
      {!vehicle && (<>
        <h4>Enter your vehicle</h4>
        {vehicles.map((vehicle, i) => {
          return (
            <li key={i}>
              <button onClick={e => { handleSetVehicle(vehicle._id) }}>{vehicle.vehicleNo}</button>
            </li>
          )
        })}
      </>
      )}
    </div>
  )
}

const Client = () => {
  const [currentVehicle, setCurrentVehicle] = useState(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    // update location on db
    const pushCurrPos = async () => {
      await fetch(`${config.API_BASE_URL}/update/${currentVehicle}`, {
        method: "POST",
        body: JSON.stringify({ pos: pos }),
        headers: {
          'Content-Type': 'application/json'
        },
      })
    }

    // get location from gps
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(function (pos) {
        console.log(pos.timestamp, ': ', pos.coords.longitude, pos.coords.latitude);
        setPos({
          timestamp: pos.timestamp,
          coords: {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude
          }
        })

        if (currentVehicle) pushCurrPos();
      });
    }
  }, [pos, currentVehicle])

  return (
    <>
      <div className='client-component'>
        <h1>Client</h1>
        {pos && (
          <div>
            <p>Vehicle: {currentVehicle}</p>
            <p>Last updated: {pos.timestamp}</p>
            <p>Last updated: {pos.coords.lng}, {pos.coords.lat}</p>
          </div>
        )}
        <VehicleSelect handleSetVehicle={setCurrentVehicle} vehicle={currentVehicle} />
      </div>
    </>
  )
}

export default Client