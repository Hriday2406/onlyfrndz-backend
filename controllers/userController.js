const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const expressAsyncHandler = require("express-async-handler");

const userMembershipController = [
  [
    body("membershipPassword")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6 and 50 characters"),
  ],
  expressAsyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { membershipPassword } = req.body;

    if (membershipPassword !== process.env.MEMBERSHIP_PASSWORD)
      return res.json({ status: 400, message: "Incorrect password" });

    const status = await db.setMembershipStatus(req.user.id, true);
    if (!status)
      return res.json({
        status: 500,
        message: "Error updating membership status",
      });
    res.json({
      status: 200,
      message: "Membership status updated successfully",
    });
  }),
];

module.exports = userMembershipController;
