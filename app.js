const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv').config();
const cors = require("cors");
const cron = require('node-cron');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute.js');
const winningRoute = require('./routes/winningRoute.js');
const Misc = require("./models/misc.js")
const User = require("./models/user.js")
const nodemailer = require('nodemailer');
const PORT = process.env.PORT || 8000;

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors())

app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/winning', winningRoute);


app.post('/send-mail', (req, res) => {
    const { to, subject, text } = req.body;

    let transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: to,
        subject: subject,
        text: text
    };

    transport.sendMail(mailOptions, function (err, info) {
        if (err) {
            return res.status(500).json({ error: err.toString() });
        } else {
            return res.status(200).json({ message: 'Email sent successfully!', info: info });
        }
    });
});

cron.schedule('0 0 * * *', async () => {
    const r = await Misc.findOne({ identity: "reset" })
    if (r.resetToday == true) {
        await Misc.findByIdAndUpdate("6538a4eb6024c2e9299ec20a", { resetToday: false })
        console.log("no reset")
    }
    else {
        await User.updateMany({}, { $set: { tempPredictions: 1, addedPredictions: 0, editedPredictions: 0, adsViewed: 0, reset: true } });
        console.log("reset")
    }
});

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



