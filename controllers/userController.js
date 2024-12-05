const { request } = require("express");
const user = require("../models/userSchema");
const nodemailer = require("nodemailer");

module.exports.signupPage = (req, res) => {
  return res.render("./pages/signup");
};

module.exports.signup = async (req, res) => {
  try {
    console.log(req.body);
    let data = await user.create(req.body);
    console.log("User Created.");
    req.flash('success', "User Created Successfully");
    return res.redirect("/user/login");
  } catch (error) {
    console.log(error);
    return res.redirect("/user/signup");
  }
};

module.exports.loginPage = (req, res) => {
  return res.render("./pages/login");
};

module.exports.profilePage = (req, res) => {
  let user = req.user || {};
  return res.render("./pages/profile", {
    user,
  });
};

module.exports.logout = (req, res) => {
  req.logout(() => {
    req.flash('success', 'Logged out successfully')
    return res.redirect("/user/login");
  });
};

module.exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confPassword } = req.body;
    let { id } = req.params;
    let User = await user.findById(id);

    if (User.password === oldPassword) {
      if (oldPassword !== newPassword) {
        if (newPassword === confPassword) {
          User.password = newPassword;
          await User.save();
          console.log("password Change.");
          req.flash('success','Password Changes Successfully');
          return res.redirect("/user/logout");
        } else {
          req.flash('error', 'New Password and Confirm Password do not match')
          console.log("New Password and Confirm Password do not match.");
        }
      } else {
        req.flash('error', 'Old Password and New Password are same');
        console.log("Old Password and New Password are same..");
      }
    } else {
      req.flash('error', 'Old password is incorrect');
      console.log("Old Password is incorrect..");
    }

    return res.redirect(req.get("Referrer") || "/");
  } catch (error) {
    console.log(error);
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.changePasswordPage = (req, res) => {
  return res.render("./pages/change-password");
};

module.exports.editUserPage = async (req, res) => {
  try {
    let { id } = req.params;
    let userData = await user.findById(id);
    return res.render("./pages/edit-user", { user: userData });
  } catch (error) {
    console.log(error.message);
  }
};
module.exports.editUser = async (req, res) => {
  try {
    let { userId } = req.params;
    console.log(req.body);
    let userData = await user.findByIdAndUpdate(userId, req.body);
    req.flash('success', 'User updated')
    return res.redirect("/user/profile");
  } catch (error) {
    console.log(error);
    return res.redirect("/user/profile");
  }
};

module.exports.recoverPassword = async (req, res) => {
  try {
    let otp = Math.floor(100000 + Math.random() * 999999);
    const { email } = req.body;
    console.log(email);
    let User = await user.findOne({ email: email });
    if (User) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
          user: "afiyataibani07@gmail.com",
          pass: "bwjh cmey mwvj sgsy",
        },
      });

      const info = await transporter.sendMail({
        from: "<afiyataibani07@gmail.com>", // sender address
        to: `${User.email}`, // list of receivers
        subject: "OTP For Password Recovery", // Subject line
        text: "Hello Here is your OTP for password recovery", // plain text body
        html: `<b>${otp}</b>`, // html body
      });

      if (info.messageId) {
        res.cookie("otp", otp);
        res.cookie("id", User.id);
      }

      console.log("Message sent: %s", info.messageId);
      req.flash('success', 'OTP Message Sent')
      return res.redirect("/user/otp-verify");
    } else {
      console.log("User not found");
      req.flash('error', 'User not found');
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (error) {
    console.log(error);
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.otpVerifyPage = (req, res) => {
  return res.render("./pages/otp-verify");
};

module.exports.otpVerify = (req, res) => {
  if (req.body.otp == req.cookies.otp) {
    res.clearCookie("otp");
    req.flash('success', 'OTP Verification Success')
    return res.redirect("/user/forgotPassword");
  } else {
    console.log("otp not match");
    req.flash('error', 'OTP Verification Error');
    return res.redirect(req.get("Referrer") || "/");
  }
};

module.exports.forgotPasswordPage = (req, res) => {
  return res.render("./pages/forgotPassword");
};

module.exports.forgotPassword = async (req, res) => {
  try {
    let { newPassword, confirmPassword } = req.body;
    let User = await user.findById(req.cookies.id);
    console.log(User);
    if (newPassword == confirmPassword) {
      User.password = newPassword;
      await User.save();
      res.clearCookie("email");
      req.flash('success', 'Password has been changed');
      return res.redirect("/user/login");
    } else {
      return res.redirect(req.get("Referrer") || "/");
    }
  } catch (error) {
    console.log(error);
    return res.redirect(req.get("Referrer") || "/");
  }
};
