import { createTheme, responsiveFontSizes } from "@mui/material";
import { cyan, lightBlue } from "@mui/material/colors";


export const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: lightBlue[500]
        },
        secondary: {
            main: cyan[500]
        },
        action: {
            hover: lightBlue[600]
        }
    },
    typography: {
        fontSize: 16
    }
})

export const CustomTheme = responsiveFontSizes(theme)