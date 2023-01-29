import * as React from 'react';

import {
  Button, CssBaseline, TextField, FormControlLabel, Checkbox, Link,
  Typography, Container, Grid, Box
} from "@mui/material"

import IOCL from "../media/logo/Indian_Oil_Logo.svg"
import AIRAVAT_TALL from "../media/logo/airavatNew.png"
import { loginUser } from '../helpers/helpers'
import { useNavigate } from 'react-router-dom';

export function SignIn({ handleUser }) {
  const history = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const user = {
      email: data.get('email'),
      password: data.get('password'),
    }

    loginUser(user).then(res => {
      if (res.isAuth) {
        handleUser(res);
        history('/admin');
      }
      else history('/');
    })
      .catch(err => { throw err });
  };

  return (
    <Container maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <img src={AIRAVAT_TALL} style={{ width: "80px", height: "auto", marginBottom: "32px" }} alt="" />
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign in to your VSS Admin account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required={true}
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required={true}
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn