import React from 'react'

import logoGif from "../media/logo.gif"
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import GitHubIcon from '@mui/icons-material/GitHub';
import HeartIcon from '@mui/icons-material/Favorite';

import { Container, Box } from '@mui/system';
import { Divider, Link, Typography } from '@mui/material';
import Logo from '../components/Logo';

export function Footer() {
  return (
    <>
      <Box paddingY={3} sx={{
        backgroundColor: '#e7e7e7d9'
      }}>
        <Container maxWidth='xl'>
          <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: { xs: 'center', sm: 'space-between' },
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
            }}>
              <Box sx={{
                display: 'flex',
                flexDirection: 'column',
              }}>
                {/* <img style={{
                  transform: 'translateX(-9px)'
                }} src={logoGif} alt='this is gif' className='' /> */}
                <Logo />
                <Typography variant='subtitle1'>
                  What do we do? What don't we do
                </Typography>
              </Box>
              <Box sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                width: '100%',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}>
                <TwitterIcon />
                <GitHubIcon />
                <FacebookIcon />
              </Box>
            </Box>

            <Box className='ListItems' sx={{ display: { md: 'block', xs: 'none' } }}>
              <Typography variant='h6'>
                Links
              </Typography>
              <ul className='lists'>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://iocl.com/'>
                    Transport Cell, NIT
                  </Link>
                </li>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/tripathics/iocl-tracker/'>
                    Project Repository
                  </Link>
                </li>
              </ul>
            </Box>

            <Box className='ListItems' sx={{ display: { md: 'block', xs: 'none' } }}>
              <Typography variant='h6'>
                Developers
              </Typography>
              <ul className='lists'>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/tripathics/iocl-tracker/issues'>
                    Report an Bug
                  </Link>
                </li>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/tripathics/iocl-tracker/'>
                    Support Us
                  </Link>
                </li>
              </ul>
            </Box>

            <Box className='ListItems' sx={{
              marginRight: 8,
              display: { sm: 'block', xs: 'none' }
            }}>
              <Typography variant='h6'>
                Made with <HeartIcon sx={{ fontSize: '1.2rem', transform: 'translateY(2px)' }} /> by
              </Typography>
              <ul className='lists'>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/tripathics'>
                    Chandrashekhar Tripathi
                  </Link>
                </li>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/pursottam6003'>
                    Pursottam Sah
                  </Link>
                </li>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/dev-singh-kanyal'>
                    Dev Singh Kanyal
                  </Link>
                </li>
                <li>
                  <Link color='CaptionText' underline='hover' target='_blank' rel='noreferrer'
                    href='https://github.com/daknya'>
                    Daknya Bam
                  </Link>
                </li>
              </ul>
            </Box>
          </Box>


          <Divider sx={{
            borderColor: 'rgba(0, 0, 0, 0.24)',
            margin: '0.5rem 0',
          }} />
          <Box sx={{ textAlign: "center" }}>
            <Typography variant='caption'>
              © 2022-Present, Airavat Pvt. Ltd.
            </Typography>
          </Box>
        </Container>
      </Box>
    </>

  )
}

export default Footer;