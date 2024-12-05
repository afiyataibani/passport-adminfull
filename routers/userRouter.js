const {Router} = require('express');
const userController = require('../controllers/userController');
const passport = require('passport');
const user = require("../models/userSchema");


const userRouter = Router();

userRouter.get('/signup', userController.signupPage);
userRouter.post('/signup', userController.signup);
userRouter.get('/login', userController.loginPage)
userRouter.post('/login', passport.authenticate('user', { failureRedirect: '/user/login', successRedirect: '/' }));
userRouter.get('/logout', userController.logout);
userRouter.get('/profile', passport.userPassportAuth, userController.profilePage);
userRouter.get("/edit-user/:id", userController.editUserPage);
userRouter.post("/edit-user/:userId", userController.editUser);

userRouter.post('/change-password/:id', userController.changePassword);

userRouter.get('/change-password', userController.changePasswordPage)

userRouter.post('/recover',userController.recoverPassword);

userRouter.get('/otp-verify',userController.otpVerifyPage);
userRouter.post('/otp-verify',userController.otpVerify);

userRouter.get('/forgotPassword', userController.forgotPasswordPage);
userRouter.post('/forgotPassword', userController.forgotPassword);

module.exports = userRouter;