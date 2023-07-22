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
const sendMail =  require('./sendMail');
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
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(flash());

//routes
app.get('/about', (req, res) => {
    res.render('about');
});

app.post('/book', (req, res) => {
    const recepient = req.body;
    console.log(recepient);
    res.redirect('/paymentPage')
});

app.get('/paymentPage', (req,res) => {
    res.render('paymentPage')
});

app.post('/send-mail', (req,res)=>{
    sendMail();
    res.redirect('/');
});

//user routes
app.use('/',userRoutes);

//404 pages
app.use((req, res) => {
    res.status(404).render('404');
})