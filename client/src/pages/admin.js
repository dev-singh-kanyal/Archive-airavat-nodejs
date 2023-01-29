import { React, useEffect, useState } from "react"
import { Box } from "@mui/system"
import { Skeleton } from "@mui/material"
import { useJsApiLoader, GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api"
import { VehicleList } from "../components/VehicleList"
import config from '../config/config'

const VehicleMarker = ({ id, position, vehicleNo, icon, handleClick }) => {
  const [pos, setPos] = useState(position);

  useEffect(() => {
    setInterval(() => {
      fetch(`${config.API_BASE_URL}/vehicles/${id}`)
        .then(res => res.json())
        .then(jsonRes => {
          if (jsonRes.coords) {
            setPos(jsonRes.coords);
          } else {
            console.log("Can't find vehicle with given ID");
          }
        }).catch(err => {
          console.log(err);
        })
    }, 10000)
  }, [])

  return (
    <Marker
      position={pos}
      onClick={() => { handleClick(pos) }}
      icon={{ url: icon, scaledSize: new window.google.maps.Size(30, 70) }}
      label={vehicleNo}
      className="hello"
    />
  )
}

const Admin = () => {
  const [vehicles, setVehicles] = useState([]);
  const [map, setMap] = useState(null);
  const [currVehicleDirections, setCurrVehicleDirections] = useState([]);
  const [currVehiclePins, setCurrVehiclePins] = useState([]);

  const fetchVehicles = async () => {
    console.log('Fetching vehicles...')
    fetch(`${config.API_BASE_URL}/vehicles`)
      .then(res => res.json())
      .then((jsonResponse) => {
        setVehicles(jsonResponse.filter(vehicle => vehicle.pos));
      })
      .catch(err => {
        console.log(err);
      })
  }

  const center = { lat: 24.832085897502783, lng: 93.91264484290599 }

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: config.GOOGLE_MAPS_API_KEY,
  })

  const icons = [
    "https://raw.githubusercontent.com/tripathics/iocl-tracker/master/client/src/media/Icons/carImage.png",
    "https://raw.githubusercontent.com/tripathics/iocl-tracker/master/client/src/media/Icons/ambulenceImage.png",
    "https://raw.githubusercontent.com/tripathics/iocl-tracker/master/client/src/media/Icons/truck.png",
    "https://raw.githubusercontent.com/tripathics/iocl-tracker/master/client/src/media/Icons/fireTruck.png",
    "https://raw.githubusercontent.com/tripathics/iocl-tracker/master/client/src/media/Icons/bulldozer.png"
  ]

  const handleVehicleSelect = (path) => {
    setCurrVehiclePins(path.pins);
    setCurrVehicleDirections(path.gmapPath);
  }

  return (
    <Box sx={{ minHeight: "inherit", position: "relative" }}>
      <VehicleList setCurrVehiclePath={handleVehicleSelect} fetchVehicles={fetchVehicles} vehicles={vehicles} map={map} isLoaded={isLoaded} />

      {!isLoaded ? <Skeleton component="div" variant="rectangular" sx={{ minHeight: 'inherit', width: '100%' }} /> : (
        <GoogleMap
          center={center}
          zoom={18}
          options={{ streetViewControl: false, mapTypeControl: false, fullscreenControl: false }}
          mapContainerStyle={{ minHeight: "inherit" }}
          onLoad={map => { setMap(map); console.log(`Map loaded`); fetchVehicles(); }}
        >
          {currVehicleDirections.length === 0 && (<>
            {vehicles.map((vehicle) => (
              <VehicleMarker key={vehicle._id}
                id={vehicle._id}
                position={vehicle.pos.coords}
                icon={icons[0]}
                vehicleNo={vehicle.vehicleNo}
                handleClick={(pos) => { map.panTo(pos); }}
              />
            ))}
          </>)}

          {currVehiclePins && (<>
            {currVehiclePins.map((pin, i) => (
              <Marker position={pin} 
              key={`currVPin${i}`} 
              label={`${String.fromCharCode(65 + i)}`} />
            ))}
            {currVehicleDirections.map((dir, i) => (
              <DirectionsRenderer directions={dir} options={{ suppressMarkers: true }} key={`directions${i}`} />
            ))}
          </>)}
          
        </GoogleMap>
      )}
    </Box>
  )
}

export default Admin