const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('index', {layout: false});
});

app.get('/about', (req, res) =>{
    res.render('about', {layout: false});
});

app.get('/portfolio', (req, res) =>{
    res.render('portfolio', {layout: false});
});

app.get('/contact', (req, res) =>{
    res.render('contact', {layout: false});
});

app.post('/send', (req, res) => {
  const output = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Email: ${req.body.email}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;

//   create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.damiana.co.za',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'damian@damiana.co.za', // generated ethereal user
        pass: 'OT#55W4&m*kH'  // generated ethereal password
    },
    tls:{
      rejectUnauthorized:false
    }
  }, {layout: false});

//   setup email data with unicode symbols
  let mailOptions = {
      from: '"Nodemailer Contact" <damian@damiana.co.za>', // sender address
      to: 'damian@damiana.co.za, andrewsda28@gmail.com', // list of receivers
      subject: 'Contact Request', // Subject line
      text: 'Hello Damian?', // plain text body
      html: output // html body
  };

//   send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);   
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

      res.render('thank-you', {layout: false});
  });
  });

app.listen(3000, () => console.log('Server started...'));