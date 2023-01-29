import { Box, Button, TextField } from '@mui/material'
import React from 'react'

const TestComp = () => {
  return (
    <>
      <div style={{
        width: "100%",
        maxWidth: "640px",
        margin: "auto",
        padding: "2rem 0"
      }}>

        <Box component='form'>
          <TextField label='Your name' variant='outlined' required={true} />
          <Button type='submit' variant='outlined'>Submit</Button>
        </Box>
        
      </div>
    </>
  )
}

export default TestComp