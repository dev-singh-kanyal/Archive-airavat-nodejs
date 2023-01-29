import { Box, Button, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { NavLink } from "react-router-dom";
import HeroVideo from "../media/video/homepage.mp4"

const Home = ({ isUser }) => {
    return (
        <Box className="home-component">
            <Box className="hero">
                <video style={{
                    zIndex: '-1',
                    position: 'absolute',
                    objectFit: 'cover'
                }} autoPlay={true} muted={true} loop={true}>
                    <source src={HeroVideo} />
                </video>
                <Container maxWidth="xl" sx={{
                    position: 'relative',
                    height: 'inherit'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        transform: 'translate(0%, -50%)'
                    }}>
                        <Typography sx={{ color: '#fff', textShadow: '0px 2px 3px black' }} variant="h1" component="h1">
                            AIRAVAT
                        </Typography>
                        <Typography variant="h4" sx={{ color: 'white', margin: '2rem 0' }}>
                            What do we do?
                            What don't we do
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4 }}>
                            {!isUser ? (<>
                                <Button size="large" color='neutral' variant="contained" LinkComponent={NavLink} to='/login'>
                                    Login
                                </Button>
                                <Button size="large" color='neutral' variant="outlined" LinkComponent={NavLink} to='/signup'>
                                    Sign up
                                </Button>
                            </>) : (<Button size="large" color='neutral' variant="contained" LinkComponent={NavLink} to='/admin'>
                                Dashboard
                            </Button>)}
                        </Box>
                    </Box>
                </Container>
            </Box>
        </Box>
    )
}

export default Home