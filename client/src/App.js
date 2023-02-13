import { Box, Container, CssBaseline, ThemeProvider, Typography } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import Form from './components/Form'
import Success from './components/Success'
import { CustomTheme } from './theme'


export default function App() {

  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmissionState = (id) => {
    setIsSubmitted(id)
  }

  return (
    <ThemeProvider theme={CustomTheme}>
      <CssBaseline />
      <Container maxWidth={"xl"} disableGutters sx={{
        background: 'linear-gradient(to bottom,#71c5ee,#025091)',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Form handleState={handleSubmissionState} />} />
            <Route path='/success' element={isSubmitted ? <Success /> : <Navigate to={'/'} />} />
          </Routes>
        </BrowserRouter>
        <Box sx={{
          backdropFilter: 'blur(10px)',
          marginTop: 'auto'
        }}>
          <Typography variant='body1' textAlign={'center'} color={'white'} component={'p'}>&copy; copyright 2023 DEXTERS All Rights Reserved.</Typography>
        </Box>
      </Container>
    </ThemeProvider>
  )
}