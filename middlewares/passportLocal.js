
const LocalStrategy = require('passport-local').Strategy;

const passport = require('passport');
const user = require('../models/userSchema');

passport.use('user', new LocalStrategy(async (username, password, done) => {
    try {
        let User = await user.findOne({ username });

        if (User) {
            if (User.password == password) {
                done(null, User);
            }
            else {
                done(null, false);
            }
        }
        else {
            done(null, false);
        }

    } catch (error) {
        done(error, false);
    }
}));

passport.serializeUser((User, done) => {
    return done(null, User.id);
})

passport.deserializeUser(async (id, done) => {
    let User = await user.findById(id);
    return done(null, User);
})

passport.userPassportAuth = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return res.redirect('/user/login');
    }
    next();
}

passport.setUserData = (req, res, next) => {
    if (req.isAuthenticated()) {
        res.locals.user = req.user;
    }
    next();
}


module.exports = passport;