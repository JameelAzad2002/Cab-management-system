const passport = require('passport');
const User = require('../models/user_data');
const bcrypt = require('bcrypt')

const user_index = (req,res) => {
    res.render('index', { user: req.user });
}

const user_login = (req,res) => {
    res.render('log-in');
}

const user_authenticate = passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log-in",
    failureFlash: true
})

const user_signup = (req,res) => {
    res.render('sign-up');
}

const user_create = async (req, res, next) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            mob_num: req.body.mob_num,
            hall: req.body.hall,
            password: hashedPassword
        });
        const result = await user.save();
        res.redirect("/log-in");
    } catch (err) {
        res.redirect('/sign-up')
        return next(err);
    };
}

const user_logout = (req, res, next) => {
    req.logOut(function (err) {
        if (err) {
            return next(err);
        }
        res.redirect("/")
    });
}

const user_profile = async (req,res) => {
    const id = req.params.id;
    const user = await User.findById(id);
    if(user){
        res.render('profile',{name: user.name, email: user.email, mob_num: user.mob_num, hall: user.hall});
    }
    else{
        res.status(404).render('404');
    }
}

module.exports= {
    user_index,
    user_login,
    user_authenticate,
    user_signup,
    user_create,
    user_logout,
    user_profile
}