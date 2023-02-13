import { Box, Typography } from "@mui/material";
import { NavLink } from 'react-router-dom'

export default function Success() {
    return (

        <Box sx={{
            bgcolor: 'white',
            width: { xs: '90vw', sm: '80vw', md: '65vw' },
            borderRadius: 5,
            padding: { xs: '1rem', sm: '2rem' },
            margin: { xs: '1rem', sm: '2rem' },
        }}>
            <Typography variant="h5" fontWeight={700} textAlign='center'>Your response has been recorded</Typography>
            <Box margin={2}>
                <Typography variant="body1">Submit another response?</Typography>
                <NavLink to={'/'} style={{ textDecoration: 'none' }}>Click here</NavLink>
            </Box>
        </Box>

    )
}