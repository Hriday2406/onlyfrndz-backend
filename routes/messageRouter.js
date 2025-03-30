const { Router } = require("express");
const {
  getAllMessagesController,
  createMessageController,
  deleteMessageController,
  adminDeleteMessageController,
} = require("../controllers/messageController");
const {
  authenticateToken,
  checkUser,
} = require("../middleware/authMiddleware");

const messageRouter = Router();

messageRouter.get("/", (req, res) => {
  res.json({ status: 200, message: "Hello Message Router!" });
});

messageRouter.get("/all", checkUser, getAllMessagesController);
messageRouter.post("/", authenticateToken, createMessageController);
messageRouter.delete("/:id", authenticateToken, deleteMessageController);
messageRouter.delete(
  "/admin/:id",
  authenticateToken,
  adminDeleteMessageController
);

module.exports = messageRouter;
