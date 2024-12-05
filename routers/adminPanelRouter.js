const { Router } = require("express");
const adminPanelController = require("../controllers/adminPanelController");
const passport = require("passport");
const adminPanelRouter = Router();

adminPanelRouter.get('/', passport.userPassportAuth, adminPanelController.indexPage);

module.exports = adminPanelRouter;