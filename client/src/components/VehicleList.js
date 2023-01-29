import React, { useState, useEffect } from "react";
import { Refresh as RefreshIcon, ArrowForwardIos as NextIcon, ArrowBackIos as PrevIcon } from "@mui/icons-material"
import { Button, Divider, IconButton, List, ListItem, Paper, Skeleton, Tooltip, Typography } from "@mui/material"
import { Container, Box } from "@mui/system"
import config from "../config/config";

const VehicleInfo = ({ vehicle, close, setVehiclePath }) => {
  const [distance, setDistance] = useState('')

  const { vehicleNo, _id } = vehicle;

  async function calculateRoute(/** @type {[]} */ path) {
    const pins = [];
    let gmapPath = [];
    let totalDistance = 0;

    for (let i = 0, size = path.length; i < size - 1; i++) {
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: path[i].coords,
        destination: path[i + 1].coords,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })

      gmapPath.push(results);
      totalDistance += results.routes[0].legs[0].distance.value;
      if (i === size - 2) {
        setVehiclePath({
          gmapPath: gmapPath,
          pins: path.map(p => p.coords)
        });
        setDistance(totalDistance);
      };
    };
  }

  useEffect(() => {
    fetch(`${config.API_BASE_URL}/paths/${_id}`)
      .then(res => res.json())
      .then(jsonRes => {
        if (jsonRes.paths) calculateRoute(jsonRes.paths);
        else setDistance('Not travelled yet.')
      })
      .catch(err => { console.log(err) });
  }, [])


  return (
    <Box sx={{margin: 2,}}>
      <Box sx={{
        mb: 2,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        gap: 1,
        alignItems: 'center'
      }}>
        <IconButton size="small" sx={{ borderRadius: 0, paddingLeft: 1.5 }} onClick={() => { close() }}>
          <PrevIcon fontSize="small" />
        </IconButton>
        <Typography fontSize={18} variant="h6">
          {vehicleNo}
        </Typography>

      </Box>
      <Typography>Distance travelled (in metres): {distance}</Typography>
    </Box>
  )
}


const VehicleListItem = ({ vehicle, pan, setCurrVehicle }) => {
  return (
    <ListItem sx={{
      margin: 0, padding: 0,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'stretch'
    }}>
      <Button sx={{
        borderRadius: 0, paddingY: 1.3, paddingX: 2, flexGrow: 1,
        flexShrink: 0, justifyContent: 'flex-start'
      }}
        color="inherit" onClick={() => { pan(vehicle.pos.coords) }}>
        <Typography>
          {vehicle.vehicleNo}
        </Typography>
      </Button>
      <Tooltip title="Details">
        <IconButton sx={{ borderRadius: 0, paddingX: 1.5 }}
          onClick={() => { setCurrVehicle(vehicle) }}
        >
          <NextIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  )
}


const VehicleList = ({ vehicles, fetchVehicles, map, isLoaded, setCurrVehiclePath }) => {
  const [currVehicle, setCurrVehicle] = useState(null);

  const closeInfo = () => {
    setCurrVehicle(null);
    setCurrVehiclePath({gmapPath: [], pins: []});
  }

  return (
    <Container maxWidth='xl' sx={{ height: 0 }}>
      <Paper elevation={3} sx={{
        top: '2rem',
        position: 'absolute',
        height: 'calc(100% - 4rem)',
        minWidth: 350,
        zIndex: 1,
        backdropFilter: 'blur(16px)',
        bgcolor: '#fffc'
      }}>
        <Box sx={{
          margin: 2,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {!isLoaded ? <Skeleton variant="rounded" animation="wave" height={48} sx={{ width: '100%' }} /> : (<>
            <Typography variant="h6" component="h3">
              Registered vehicles
            </Typography>
            <Tooltip title="Refresh locations">
              <IconButton onClick={() => { fetchVehicles(); console.log('clicked'); }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </>)}
        </Box>

        <Divider variant="fullWidth" />

        {!currVehicle && (
          <List sx={{ overflow: "auto" }}>
            {!isLoaded ? (<>
              <Skeleton variant="text" animation="wave" height={36} sx={{ mt: 2, mx: 2 }} />
              <Divider variant="middle" />
              <Skeleton variant="text" animation="wave" height={36} sx={{ mx: 2 }} />
            </>) : (<>
              {vehicles.map((vehicle, i) => (<React.Fragment key={`vehicleList${i}`} >
                <VehicleListItem map={map}
                  vehicle={vehicle}
                  pan={(p) => map.panTo(p)}
                  setCurrVehicle={(v) => { setCurrVehicle(v) }}
                />
                <Divider variant="middle" />
              </React.Fragment>))}
            </>)}
          </List>
        )}

        {currVehicle && (
          <VehicleInfo vehicle={currVehicle} close={closeInfo} setVehiclePath={setCurrVehiclePath} />
        )}
      </Paper>
    </Container>
  )
};


export { VehicleList };