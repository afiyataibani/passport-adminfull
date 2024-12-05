const { Router } = require("express");
const adminPanelRouter = require("./adminPanelRouter");
const userRouter = require("./userRouter");

const router = Router();

router.use('/', adminPanelRouter)
router.use('/user', userRouter);

module.exports = router;