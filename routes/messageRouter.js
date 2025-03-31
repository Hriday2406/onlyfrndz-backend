const { Router } = require("express");
const {
  getAllMessagesController,
  createMessageController,
  deleteMessageController,
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

module.exports = messageRouter;
