const { Router } = require("express");
const { authenticateToken } = require("../middleware/authMiddleware");
const {
  setMembershipController,
  getMembershipController,
} = require("../controllers/userController");

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello User Router!" });
});

userRouter.put("/membership", authenticateToken, setMembershipController);
userRouter.get("/membership", authenticateToken, getMembershipController);

module.exports = userRouter;
