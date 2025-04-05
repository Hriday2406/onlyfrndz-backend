const { Router } = require("express");
const {
  signUpController,
  loginController,
  forgotController,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello Auth Router!" });
});

authRouter.post("/signup", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/forgot", forgotController);

authRouter.get("/test", authenticateToken, (req, res) => {
  res.json({ status: 200, message: "Hello Authentication Router!" });
});

module.exports = authRouter;
