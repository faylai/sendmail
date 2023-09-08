const express = require("express");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
// Parse incoming requests data (https://github.com/expressjs/body-parser)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
// default options
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
const route = express.Router();

const port = process.env.PORT || 5000;

app.use('/v1', route);

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});


const transporter = nodemailer.createTransport({
    port: 465,
    host: "smtp.gmail.com",
    auth: {
        user: 'faylai@gmail.com',
        pass: '',
    },
    secure: true, // upgrades later with STARTTLS -- change this based on the PORT
});

route.post('/text-mail', (req, res) => {
    const {to, subject, text} = req.body;
    const mailData = {
        from: 'youremail@gmail.com',
        to: 'faylai@qq.com',
        subject: 'test',
        text: 'a test',
        html: '<b>Hey there! </b><br> This is our first message sent with Nodemailer<br/>',
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            return console.log(error);
        }
        res.status(200).send({message: "Mail send", message_id: info.messageId});
    });
});


route.post('/attachments-mail', (req, res) => {
    const {to_user, subject, content} = req.body;
    let attachments = Object.keys(req.files||{}).map((key) => {
        let file = req.files[key]
        return {
            filename: file.name,
            path: file.tempFilePath
        }
    })
    const mailData = {
        from: 'service@acanva.com',
        to: to_user || 'faylai@qq.com',
        subject: subject || 'ACV+ Application',
        html: content,
        attachments: attachments
    };

    transporter.sendMail(mailData, (error, info) => {
        if (error) {
            res.status(500).send({message: "mail send error see logs"});
            return console.log(error);
        }
        res.status(200).send({message: "mail send", message_id: info.messageId});
    });
});