import React from "react"
import IOCL from "../media/logo/Indian_Oil_Logo.svg"
import AIRAVAT from "../media/logo/airavatNewBox.png"
import { NavLink } from "react-router-dom";

import { Typography } from "@mui/material";
  import { Box } from "@mui/system";

const Logo = () => (
    <Box sx={{ display: "flex", alignItems: "center", textDecoration: 'none' }} component={NavLink} to='/'>
        <Box sx={{ height: 64, mr: 1, padding: '8px 0' }}>
            <img src={AIRAVAT} style={{
                height: '100%'
            }} alt="" />
        </Box>
        <Typography
            variant='h5'
            noWrap
            sx={{
                mr: 2,
                display: { xs: 'none', sm: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'black',
                textDecoration: 'none',
            }}>
            AIRAVAT
        </Typography>
    </Box>)

export default Logo