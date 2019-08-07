const http = require('http');
const path = require('path');
const fs = require('fs');
const { APP_PORT, APP_IP, APP_PATH } = process.env;
const qs = require('querystring');
const nodemailer = require('nodemailer');
const mailData = require('./mail-data');
const util = require('util');
const xhr = require('xmlhttprequest');
const bodyParser = require('body-parser');
const binary = require('binary');

var log_file = fs.createWriteStream(__dirname + '/debug.log', { flags: 'w' });
var log_stdout = process.stdout;

console.log = function(d) { //
    log_file.write(util.format(d) + '\r\n');
    log_stdout.write(util.format(d) + '\r\n');
};

const server = http.createServer((req, res) => {

    //console.log(req.code);

    let filePath = path.join(
        __dirname,
        'public',
        req.url === '/' ? 'index.html' : req.url
    );

    if(req.method === 'POST'){
        console.log('31: '+'Its a post method here!');
    }

    //обрабатываем данные клиента с формы
    //взято с https://stackoverflow.com/questions/4295782/how-to-process-post-data-in-node-js
    if (req.url === '/data') {
        console.log('34: req.url: ' + req.url);
        //console.log('34:if req.url: ' + req.toString());
        //let body = '';
        console.log('40: ' + req.body);
        console.log('************************');
        console.log('41: ' + req);

        req.on('data', (data) => {
            console.log('************************');
            console.log('45: ' + data);

            var g = binary.parse(data);
            console.log(g);

            //let d = bodyParser.text(data);


            // let obj_str = util.inspect(data);
            // console.log(obj_str);
            // console.log('44: ' + data);
           //body += data;

            // Если слишком большой POST - разрываем соединение
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            //if (body.length > 1e6)
          //      request.connection.destroy();
        });

        req.on('end', () => {
           // var post = qs.parse(body);
          //  console.log('****************************************************');
       //     console.log('Client\'s data: ' + post['name'] + ' : ' + post['phone'] + ' : ' + post['message']);

         //   console.log('****************************************************');
            // let transporter = nodemailer.createTransport({
            //     host: 'imap.yandex.ru',
            //     port: 993,
            //     auth: {
            //         user: mailData.user,
            //         pass: mailData.pass
            //     },
            //     secure: true
            // });

            // let mailOptions = {
            //     from: mailData.user,
            //     to: mailData.to,
            //     subject: post['name'] + ' : ' + post['phone'],
            //     text: post['message']
            // };

            //console.log(mailData.user);

            // transporter.sendMail(mailOptions, (error, info) => {
            //     if (error) {
            //         return console.log(error.message);
            //     }
            //     console.log("Message sent " + info.response);
            //
            // })
        });
    }

    let extName = path.extname(filePath);
    let contentType = 'text/html';

    switch (extName) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'text/json';
            break;
        case '.png':
            contentType = 'text/png';
            break;
        case '.jpg':
            contentType = 'text/jpg';
            break;
        case '.ico':
            contentType = 'text/ico';
            break;
    }
    //readFile
    fs.readFile(filePath, (err, content) => { //читаем содержимое filePath и отдаем в content

        if (err) {
            if (err.code === 'ENOENT') {
                //page not found
                fs.readFile(path.join(__dirname, 'public', '404.html'),
                    (err, content) => {
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(content, 'utf8');
                    })
            } else {
                //some server err
                res.writeHead(500);
                res.end(`Server Error: ${err.code}`);
            }
        } else {
            //success
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    })

}).listen(5000, () => {
    console.log('Server running at localhost:5000');
});

process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    console.log('Closing http server.');
    server.close(() => {
        console.log('Http server closed.');
        process.exit(0);
    });
});