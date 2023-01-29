import React from "react";
import { NavLink } from "react-router-dom";

import {
  AppBar, Toolbar, Container, Typography, Menu, MenuItem, Button, IconButton,
  Tooltip, Avatar
} from "@mui/material";
import { Box } from "@mui/system";

import { AccountCircle as UserIcon, Logout as LogoutIcon } from '@mui/icons-material'
import Logo from "../components/Logo";


const NavBox = ({ display, children }) => {
  return (
    <Box sx={{ flexGrow: 1, display: "flex" }}>
      {children}
    </Box>
  )
}

const navItems = [
  { url: '/admin', icon: 'floppy', label: 'Dashboard' },
  { url: '/register', icon: 'floppy', label: 'Register' },
]

function Navigation({ logoutUser, user }) {
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    handleCloseUserMenu();
    logoutUser();
  }

  return (
    <AppBar elevation={2} position="sticky" color="transparent" sx={{
      backgroundColor: '#ffffffcc',
      backdropFilter: 'blur(4px)'
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Logo display='desktop' />
          <NavBox>
            {user && (<>
              {navItems.map((page) => (
                <Button
                  disableTouchRipple
                  key={page.label}
                  sx={{
                    color: 'grey',
                    my: 1, display: 'block',
                    '&.active': {
                      color: 'black'
                    },
                    '&.hover': {
                      backgroundColor: 'seagreen',
                      border: 'solid 1px seagreen'
                    }
                  }}
                  LinkComponent={NavLink} to={page.url}
                >{page.label}</Button>
              ))}
            </>)}
          </NavBox>

          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={user.name} sx={{ bgcolor: '#4191b7' }}>
                    <UserIcon />
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <Box marginX={2} marginY={2} sx={{ minWidth: 100 }}>
                  <Typography textAlign='center' variant="h6">
                    {user.name}
                  </Typography>
                  <Typography textAlign='center' variant="body1">
                    {user.email}
                  </Typography>
                </Box>
                <MenuItem onClick={handleLogout} sx={{ justifyContent: 'center', gap: 1 }}>
                  <LogoutIcon />
                  <Typography>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Button component={NavLink} variant='outlined' to='/login'>
              <Typography textAlign="center">Login</Typography>
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Navigation;