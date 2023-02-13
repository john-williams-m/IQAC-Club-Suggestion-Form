if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const morgan = require('morgan')
const helmet = require('helmet')
const multer = require('multer')
const mongoSanitize = require('express-mongo-sanitize');
const { check } = require('express-validator')
const { validationResult } = require('express-validator')
const { storage } = require('./middleware/cloudinary')
const fileUpload = multer({ storage })

const app = express()

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');

    next();
});

const { cloudinary } = require('./middleware/cloudinary');
const HttpError = require('./model/http-error');
const Form = require('./model/Form');

app.use(express.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }))

app.use(morgan('common'))

app.use(
    mongoSanitize({
        replaceWith: '_',
    }),
);

app.get('/', (req, res) => {
    res.status(200).json({ "message": "Working" })
})

app.post('/', fileUpload.single('picture'), [
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('phone').isNumeric().not().isEmpty(),
    check('suggestion').not().isEmpty()
], async (req, res, next) => {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passes, please check your data', 422));
    }
    if (req.file) {
        if (req.file.size > 1000000) {
            return next(new HttpError('Image Size is greater than 1MB', 422))
        }
    }
    try {
        const newFormData = req.body
        newFormData.picture = req.file != undefined ? req.file.path : 'Nil';
        const newData = new Form(newFormData)
        const response = await newData.save()
        res.status(201).json({ id: response._id.toString(), Message: 'Your response has been recorded' })
    } catch (err) {
        return next(new HttpError(err.message || 'Submission failed, try again later', err.code || 500))
    }
})

app.use((error, req, res, next) => {
    if (req.file) {
        cloudinary.uploader.destroy(req.file.filename)
    }
    res.status(error.code || 500)
    res.json({ message: error.message || 'Something went wrong!' })
})


const PORT = process.env.PORT || 6001
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/IQACSuggestionForm';
mongoose.connect(dbUrl).then(() => {
    app.listen(PORT, () => console.log(`DataBase connected and listening on port: ${PORT}`))
}).catch(err => { console.log(`Not able to connect! ${err}`) })