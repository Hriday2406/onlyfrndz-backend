const { Router } = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const userMembershipController = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello User Router!" });
});

userRouter.put("/membership", authenticateToken, userMembershipController);

module.exports = userRouter;
