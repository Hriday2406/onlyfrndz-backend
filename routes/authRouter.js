const { Router } = require("express");
const {
  signUpController,
  loginController,
  adminLoginController,
} = require("../controllers/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const authRouter = Router();

authRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello Auth Router!" });
});

authRouter.post("/signup", signUpController);
authRouter.post("/login", loginController);
authRouter.post("/admin", adminLoginController);

authRouter.get("/test", authenticateToken, (req, res) => {
  res.json({ status: 200, message: "Hello User Autheticator!" });
});

module.exports = authRouter;
