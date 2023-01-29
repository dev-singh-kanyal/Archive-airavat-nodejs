import { React } from 'react';
import { Button, CssBaseline, TextField, FormControlLabel, Checkbox, Grid, Box, Typography, Container, Autocomplete } from '@mui/material'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import logo from '../media/logo2.png'
import config from '../config/config';
import AIRAVAT_TALL from "../media/logo/airavatNew.png"

const theme = createTheme()
export function Registration() {
  const addVehicle = async (vehicle) => {
    const response = await fetch(`${config.API_BASE_URL}/vehicles/add`, {
      method: 'POST',
      body: JSON.stringify(vehicle),
      headers: {
        'Content-type': 'application/json'
      },
    })

    if (!response.ok) alert(`An error occured: ${response.statusText}`);
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const newVehicle = {
      vehicleNo: data.get('vehicleNo'),
      vehicleName:data.get('vehicleName'),
      driverName: data.get('driverName'),
      phoneNumber: data.get('phoneNumber'),
      email: data.get('email'),
      password: data.get('password'),
    }
    addVehicle(newVehicle);
    console.log({
      vehicleNo: data.get('vehicleNo'),
      vehicleName:data.get('vehicleName'),
      driverName: data.get('driverName'),
      phoneNumber: data.get('phoneNumber'),
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const vehiclesList =[
    { label: "Tata Sedan"},
    { label: "Mahindra Hatchback"},
    { label: "Estate Car"},
    { label: "Mahindra SUV"},
    { label: "Heavy Vehicles"},
    { label: "Camper Van"},
    { label: "Cement Mixer"},
    { label: "Delivery Van"},
    { label: "Fork Lift"},
    { label: "Taxi/Cab"},
    { label: "Crane"},
    { label: "Bulldozer"},
    { label: "Truck"},
    { label: "Oil Tanker"},
    { label:"Others"},
  ]

  return (

    <>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 4,
              marginBottom: 2,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >

            <img src={AIRAVAT_TALL} style={{ width: "80px", height: "auto" }} alt=""></img>

            <Typography component="h1" variant="h5">
              Vechicle Registration Forum
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>

                  <TextField
                    autoComplete="Vehicle Number"
                    name="vehicleNo"
                    required
                    fullWidth
                    id="vehicleNo"
                    label="Vehicle Registration Number"
                    autoFocus
                  />
                </Grid>

                <Grid item xs={12}>
                  <Autocomplete 
                    id="combo-box-demo"
                    options={vehiclesList}
                    renderInput={(params) => <TextField {...params} 
                    autoComplete="Vehicle Name"
                    name="vehicleName"
                    required
                    fullWidth
                    id="vehicleName"
                    label="Vehicle Name"
                    />}                  
                  />
                
                  </Grid>

                <Grid item xs={12}>

                  <TextField
                    autoComplete="Driver Name"
                    name="driverName"
                    required={true}
                    fullWidth
                    id="DriverName"
                    label="Driver Full Name"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="Phone Number"
                    name="phoneNumber"
                    required={true}
                    type="number"
                    fullWidth
                    id="phoneNumber"
                    label="Mobile Number"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    required={true}
                    fullWidth
                    id="email"
                    type="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Register Vehicle
              </Button>
            </Box>
          </Box>

        </Container>
      </ThemeProvider>
    </>

  )
}

export default Registration