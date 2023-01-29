import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemText
} from "@mui/material";

import { makeStyles } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu';

import { Link } from "react-router-dom";

const useStyles = makeStyles(() => ({
  link: {
    textDecoration: "none",
    color: "blue",
    fontSize: "20px",
  },
  icon: {
    color: "white"
  }
}));

function DrawerComponent({ navItems }) {
  const classes = useStyles();
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
          {navItems.map((item, i) => (
            <ListItem key={i} onClick={() => setOpenDrawer(false)}>
              <ListItemText>
                <Link to={item.url}>{item.name}</Link>
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
        <MenuIcon />
      </IconButton>
    </>
  );
}
export default DrawerComponent;