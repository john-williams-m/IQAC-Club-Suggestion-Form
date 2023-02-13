import { Alert, Box, Button, Divider, Snackbar, TextField, Typography, useTheme } from "@mui/material";
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import IQACLogo from '../assets/IQAC-logo.png'
import AttachFileIcon from '@mui/icons-material/AttachFile';

const formSchema = yup.object().shape({
    name: yup.string().trim().required('Required'),
    email: yup.string().email('Invalid email').required('Required'),
    phone: yup.number().min(1000000000).required('Required'),
    suggestion: yup.string().trim().required('Required'),
    // picture: yup.object()
})

export default function Form(props) {

    const [file, setFile] = useState()
    const [previewUrl, setPreviewUrl] = useState()
    const [isValid, setIsValid] = useState(false)

    const filePickerRef = useRef()

    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const theme = useTheme()
    const navigate = useNavigate()

    const initialValues = {
        name: '',
        email: '',
        phone: '',
        suggestion: '',
        picture: ''
    }

    const handleFormSubmit = async (values) => {
        console.log(values)
        console.log(typeof values.picture)
        if (!isValid) {
            console.log('Not valid')
            return
        }
        const formData = new FormData()
        formData.append('name', values.name)
        formData.append('email', values.email)
        formData.append('phone', values.phone)
        formData.append('suggestion', values.suggestion)
        formData.append('picture', values.picture)
        console.log(formData)
        setIsLoading(true)
        try {
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/`,
                {
                    method: 'POST',
                    body: formData,
                }
            )
            const responseData = await response.json()
            setIsLoading(false)
            if (!response.ok) {
                setError(false)
                setError(true)
                throw new Error(responseData.message || 'Form Submission failed', 500)
            }
            setError(false)
            props.handleState(responseData.id)
            navigate('/success')
        } catch (err) {
            setError(true)
            setErrorMsg(err.message)
        }
    }

    useEffect(() => {
        if (!file) {
            return
        }
        const fileReader = new FileReader();
        fileReader.onload = () => {
            setPreviewUrl(fileReader.result);
        };
        fileReader.readAsDataURL(file);
    }, [file])

    const formik = useFormik({
        initialValues,
        validationSchema: formSchema,
        onSubmit: handleFormSubmit
    })

    const fileChangeHandler = (event) => {
        let pickedFile
        if (event.target.files && event.target.files.length === 1 && event.target.files[0].size < 1000000 && event.target.files[0].type.startsWith('image/')) {
            pickedFile = event.target.files[0]
            setFile(pickedFile)
            setIsValid(true);
            formik.setFieldTouched('picture', true)
            formik.setFieldValue("picture", event.target.files[0]);
            formik.setFieldError('picture', false)
        } else {
            formik.setFieldValue('picture', '')
            formik.setFieldTouched('picture', true)
            setPreviewUrl(null)
            setIsValid(false)
        }
    }

    const handleClose = () => {
        setError(false)
    }

    return (
        <React.Fragment>
            <Snackbar open={error} autoHideDuration={4000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="error" sx={{ width: '100%', fontSize: '1rem', m: { xs: '2rem', md: '1rem' } }}>
                    {errorMsg}
                </Alert>
            </Snackbar>

            <Box sx={{
                display: 'flex',
                minHeight: '90vh',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <Box sx={{
                    bgcolor: 'white',
                    width: { xs: '90vw', sm: '80vw', md: '65vw', lg: '50vw' },
                    borderRadius: 5,
                    padding: { xs: '1rem', sm: '2rem' },
                    margin: { xs: '1rem', sm: '2rem' }
                }}>
                    <Box display={'flex'} justifyContent={'center'} flexDirection={'column'} sx={{
                        ".MuiTextField-root": {
                            marginTop: '1rem'
                        }
                    }} component={'form'} onSubmit={formik.handleSubmit}>
                        <Box display={'flex'} width={'100%'} flexDirection={'column'} alignItems={'center'} justifyContent={"center"}>
                            <Box width={'18rem'}>
                                <img src={IQACLogo} alt='IQACLogo' width={'100%'} />
                            </Box>
                            <Typography variant="body1" component={'p'}>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla,
                                possimus? Mollitia excepturi ratione doloremque nemo veritatis facere
                                praesentium, ipsum enim assumenda sit veniam corporis! Rerum quas
                                omnis in repellendus eaque.</Typography>
                        </Box>
                        <Divider sx={{
                            border: '0.5px solid black',
                            marginTop: '0.5rem'
                        }} />
                        <TextField
                            fullWidth
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            error={Boolean(formik.touched.name) && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                            id="name"
                            label="Full Name"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            error={Boolean(formik.touched.email) && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                            id="email"
                            label="Email"
                            variant="outlined"
                        />
                        <TextField
                            fullWidth
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            error={Boolean(formik.touched.phone) && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone && "Enter a valid phone number"}
                            id="phone"
                            label="Phone Number"
                            variant="outlined"
                        />
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>

                            <Box width={{ xs: '70%', sm: '55%', md: '45%', lg: '35%' }} margin='1rem'>
                                {previewUrl && <img src={previewUrl} width={'100%'} alt="Preview" />}
                                {!previewUrl && <Typography textAlign={'center'}>Select the image for preview. (Size must be less than 1MB)</Typography>}
                            </Box>
                            <Button variant="contained" startIcon={<AttachFileIcon />} component="label" sx={{
                                width: '15rem',
                                color: '#e1f5fe',
                                "&:hover": {
                                    bgcolor: theme.palette.action.hover
                                }
                            }}>
                                Attach image
                                <input
                                    id="picture"
                                    ref={filePickerRef}
                                    hidden
                                    accept=".jpg,.png,.jpeg"
                                    name="picture"
                                    type="file"
                                    onBlur={formik.handleBlur}
                                    onChange={fileChangeHandler} />
                            </Button>
                            {!isValid && formik.touched.picture && <Typography margin={'0.5rem'} color={'red'}>{formik.values.picture.size > 1000000 ? "Image is invalid" : "Required"}</Typography>}
                            {/* {!isValid && formik.touched.picture && <Typography margin={'0.5rem'} color={'red'}>Image is invalid</Typography>} */}
                        </Box>

                        <TextField
                            id="suggestion"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.suggestion}
                            error={Boolean(formik.touched.suggestion) && Boolean(formik.errors.suggestion)}
                            helperText={formik.touched.suggestion && formik.errors.suggestion}
                            label="Suggestion"
                            multiline
                            rows={4}
                        />
                        <Box display={'flex'} justifyContent={'space-between'} margin={'1rem 0rem'}>
                            <Button type="submit" variant="contained" sx={{
                                color: '#e1f5fe',
                                "&:hover": {
                                    bgcolor: theme.palette.action.hover
                                }
                            }}>{isLoading ? 'Submitting...' : 'Submit'}</Button>
                            {!isLoading && <Button onClick={() => {
                                formik.resetForm()
                                setPreviewUrl(null)
                            }} variant="outlined">Clear form</Button>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </React.Fragment>
    )
}