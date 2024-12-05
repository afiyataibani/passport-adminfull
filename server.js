const express = require('express');
const path = require('path');
const db = require('./config/database');
const bodyParser = require('body-parser');
const LocalStrategy = require('./middlewares/passportLocal');
const passport = require('passport');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const {flashMessage} = require('./middlewares/flashMessage')

const port = 8081;

const app = express();

app.set('view engine', 'ejs');
app.use(cookieParser());

app.use(express.static(path.join(__dirname + '/assets')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'user',
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setUserData);
app.use(flash());
app.use(flashMessage)

app.use('/', require('./routers'));

app.listen(port, (err) => {
    if (!err) {
        db();
        console.log("Listening on port");
        console.log("http://localhost:" + port);
    }
})