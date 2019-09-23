const http = require('http');
const path = require('path');
const fs = require('fs');
const {APP_PORT, APP_IP, APP_PATH} = process.env;
const nodeMailer = require('nodemailer');
const mailData = require('./mail-data');
const request = require('request');
const bodyParser = require('body-parser');
const express = require('express');
const log4js = require('log4js');

const app = express();

let clientNumber = 0;

log4js.configure({
    appenders: {
        out: {type: 'console'},
        error: {type: 'dateFile', filename: 'logs/error', "pattern": "-dd.log", alwaysIncludePattern: true},
        result: {type: 'dateFile', filename: 'logs/result', "pattern": "-dd.log", alwaysIncludePattern: true},
        default: {type: 'dateFile', filename: 'logs/default', "pattern": "-dd.log", alwaysIncludePattern: true}
    },
    categories: {
        error: {appenders: ['error'], level: 'error'},
        result: {appenders: ['result'], level: 'info'},
        default: {appenders: ['out', 'default'], level: 'info'}
    }

});
let loggererror = log4js.getLogger('error'); // initialize the var to use.
let loggeresult = log4js.getLogger('result'); // initialize the var to use.

app.use(express.static(
    path.join(__dirname, 'public')
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

function sendMail(name, phone, comment) {
    let transporter;
    //если почта на удаленном сервере - отправляем с localhost

    if (APP_PATH) {//на моем пк эта переменная не определена
        transporter = nodeMailer.createTransport({
            port: 25,
            host: 'localhost',
            tls: {
                rejectUnauthorized: false
            },
            secure: false
        });
    } else {
        transporter = nodeMailer.createTransport({
            service: 'Gmail',
            auth: {
                user: mailData.user,
                pass: mailData.pass
            },
            secure: false
        });
    }

    let mailOptions = {
        from: mailData.user,
        to: mailData.to,
        subject: name + ' : ' + phone,
        text: comment, //в пиьсме это поле не видно
        html: `<p>${comment}</p>`
    };

    clientNumber++;

    let information = clientNumber + ' : ' + mailOptions.subject + ' : ' + mailOptions.text + '\r\n';

    console.log(information);
    loggeresult.info(information);

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Message is not sent: " + error.message);
            loggererror.error("Message is not sent: " + error.message + '\r\n');
            return
        }
        console.log("Message sent: " + info.response);
        loggeresult.info("Message sent: " + info.response);
    });
}

app.post('/userData', (req, res) => {
    //recaptcha challenge
    const secretKey = '6Le6jbEUAAAAAJWaPaeYw7XPjumgyICbZzQI-tKk';
    let verificationUrl = "https://www.google.com/recaptcha/api/siteverify?secret=" +
        secretKey + "&response=" + req.body.secret;

    request(verificationUrl, function (error, response, body) {
        body = JSON.parse(body);

        // Success will be true or false depending upon captcha validation.
        if (body.success !== undefined && !body.success) {
            return res.json({"responseCode": 1, "responseDesc": "Failed captcha verification"});
        }
        res.json({"responseCode": 0, "responseDesc": "Success"});
    });

    sendMail(req.body.name, req.body.phone, req.body.comment);
});

app.use("*", function (req, res) {
    res.status(404).send("404");
});


if (APP_IP && APP_PORT) {
    app.listen(APP_PORT, APP_IP, () => {
        console.log(`Server running at http://${APP_IP}:${APP_PORT}/` + '\n');
    });
} else {
    app.listen(5000, 'localhost', () => {
        console.log(`Server running at http://localhost:5000/` + '\n');
    });
}


process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        process.exit(0);
    });
});
