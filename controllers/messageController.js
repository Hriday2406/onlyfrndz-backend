const asyncHandler = require("express-async-handler");
const db = require("../db/queries");
const { body, validationResult } = require("express-validator");

const getAllMessagesController = asyncHandler(async (req, res) => {
  const messages = await db.getAllMessages();

  if (!messages)
    return res.json({ status: 400, message: "Error getting messages" });

  const user = req.user;

  const newMessages = messages.map((message) => {
    let created_at = "--:-- - --/--/----",
      username = "ANONYMOUS";
    if (user?.isMember || user?.isAdmin) {
      created_at = message.created_at;
      username = message.username;
    } else if (user?.id === message.user_id) {
      created_at = message.created_at;
      username = "YOU";
    }
    return {
      id: message.id,
      user_id: message.user_id,
      title: message.title,
      message: message.message,
      created_at,
      username,
      can_delete: user?.isAdmin || user?.id === message.user_id,
    };
  });

  res.json({ status: 200, messages: newMessages });
});

const createMessageController = [
  [
    body("title")
      .trim()
      .isLength({ min: 1, max: 250 })
      .withMessage("Title must be between 1 and 250 characters"),
    body("message")
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage("Message must be between 1 and 1000 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { title, message } = req.body;
    const user = req.user;

    const status = await db.createMessage(user.id, title, message);
    if (!status)
      return res.json({ status: 400, message: "Error creating message" });

    res.json({ status: 200, message: "Message created successfully" });
  }),
];

const deleteMessageController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = req.user;
  const messageData = await db.getMessageById(id);

  if (!messageData)
    return res.json({ status: 400, message: "Message does not exist" });

  if (user.id !== messageData.user_id)
    return res.json({ status: 400, message: "You do not have permission" });

  const status = await db.deleteMessage(id);
  if (!status)
    return res.json({ status: 400, message: "Error deleting message" });

  res.json({ status: 200, message: "Message deleted successfully" });
});

const adminDeleteMessageController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = req.user;
  const messageData = await db.getMessageById(id);

  if (!messageData)
    return res.json({ status: 400, message: "Message does not exist" });

  if (user.id !== 2)
    return res.json({
      status: 400,
      message: "You do not have admin permission",
    });

  const status = await db.deleteMessage(id);
  if (!status)
    return res.json({ status: 400, message: "Error deleting message" });

  res.json({ status: 200, message: "Message deleted successfully" });
});

module.exports = {
  getAllMessagesController,
  createMessageController,
  deleteMessageController,
  adminDeleteMessageController,
};
