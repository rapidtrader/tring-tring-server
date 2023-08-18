const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const dotenv = require('dotenv').config();
const bodyParser = require('body-parser');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute.js');
const winningRoute = require('./routes/winningRoute.js');
const PORT = process.env.PORT || 8080;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/winning', winningRoute);


// DB Config
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
        })
    })
    .catch((error) => {
        console.log(error);
    })

    
