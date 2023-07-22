const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const morgan = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/user_data');
const bcrypt = require('bcrypt');
const flash = require('express-flash');
const userRoutes = require('./routes/userRoutes');
const sendConfirmationMail =  require('./controllers/sendConfirmationMail');
const sendFeedbackMail = require('./controllers/sendFeedbackMail');
const dotenv = require("dotenv");

//connect to mongodb and start server
dotenv.config(); 
const dbURI = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@nodetut.npnqued.mongodb.net/cab-data?retryWrites=true&w=majority`;
mongoose.connect(dbURI)
    .then((result) => //listen for requests
        app.listen(3000, () => {
            console.log("connected to database")
            console.log("listening for req on port 3000");
        }))
    .catch((err) => console.log(err));

//express app
const app = express();

//view-engine
app.set('views', 'views');
app.set("view engine", 'ejs');


//passport config
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await User.findOne({ email: username });
            if (!user) {
                return done(null, false, { message: "Incorrect email" });
            };
            if (bcrypt.compare(password, user.password, (err, res) => {
                if (res) {
                  // passwords match! log user in
                  return done(null, user)
                } else {
                  // passwords do not match!
                  return done(null, false, { message: "Incorrect password" })
                }
              })) {
            };
        } catch (err) {
            return done(err);
        };
    })
);

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (id, done) {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

//middleware and static files
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(flash());

//routes
app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/book', (req, res) => {
    const recipient = req.body;
    req.session.userEmail = recipient.email;
    req.session.username = recipient.name;
    res.redirect('/paymentPage')
});

app.get('/paymentPage', (req,res) => {    
    res.render('paymentPage')
});

app.post('/send-mail', (req,res)=>{
    const recipientEmail = req.session.userEmail; // Access the email from the session
    const recipientName = req.session.username;
    const dateOfBooking = req.body.date;
    const subject = "Booking confirmed";
    const body = `Assalamualaikum ${recipientName}\n\nThis is to notify you that your cab booking booking has been confirmed for ${dateOfBooking}`
    sendConfirmationMail(recipientEmail, subject, body);
    res.redirect('/');
});

app.get('/contact-us', (req,res)=>{
    res.render('contact');
});

app.post('/contact-us', (req,res) => {
    const sender = req.body.name;
    const senderMail = req.body.email;
    const message = req.body.message;
    const mob_num = req.body.mob_num;
    const adminMail = process.env.ADMIN;
    const subject = "Feedback";
    const body = `Assalamualaikum\n\n ${message}\n\n From: ${sender}\nEmail: ${senderMail}\nMobile No.: ${mob_num}`
    sendFeedbackMail(adminMail,sender,subject,body);
    res.redirect('/contact-us')
});

//user routes
app.use('/',userRoutes);

//404 pages
app.use((req, res) => {
    res.status(404).render('404');
})