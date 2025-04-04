const { body, validationResult } = require("express-validator");
const db = require("../db/queries");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signUpController = [
  [
    body("fullName")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Full name must be between 1 and 100 characters"),
    body("username")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Username must be between 1 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6 and 50 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match");
      return true;
    }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { fullName, username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (await db.getUserByUsername(username))
      return res.json({ status: 400, message: "Username already exists" });
    if (await db.getUserByEmail(email))
      return res.json({ status: 400, message: "Email already exists" });

    let status = await db.createUser(fullName, username, email, hashedPassword);
    if (status)
      return res.json({ status: 200, message: "User created successfully" });
    res.json({ status: 500, message: "Error creating user" });
  }),
];

const loginController = [
  [
    body("username")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Username must be between 1 and 50 characters"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6 and 50 characters"),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { username, password } = req.body;

    const user = await db.getUserByUsername(username);
    if (!user) return res.json({ status: 400, message: "User does not exist" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.json({ status: 400, message: "Incorrect password" });

    jwt.sign(
      { id: user.id },
      process.env.SESSION_SECRET,
      { expiresIn: "1d" },
      (err, token) => {
        if (err)
          return res.json({ status: 500, message: `Error logging in: ${err}` });
        res.json({
          status: 200,
          message: "User logged in successfully",
          token,
        });
      }
    );
  }),
];

const forgotController = [
  [
    body("fullName")
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage("Full name must be between 1 and 100 characters"),
    body("username")
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage("Username must be between 1 and 50 characters"),
    body("email")
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 50 })
      .withMessage("Password must be between 6 and 50 characters"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password)
        throw new Error("Passwords do not match");
      return true;
    }),
  ],
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.json({ status: 400, errors: errors.array() });

    const { fullName, username, email, password } = req.body;

    const user = await db.getUserByUsername(username);
    if (!user) return res.json({ status: 400, message: "User does not exist" });

    if (user.full_name !== fullName)
      return res.json({ status: 400, message: "Full name does not match" });

    if (user.email !== email)
      return res.json({ status: 400, message: "Email does not match" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const status = await db.updateUserPassword(user.id, hashedPassword);
    if (status)
      return res.json({
        status: 200,
        message: "Password updated successfully",
      });
    res.json({ status: 500, message: "Error updating password" });
  }),
];

module.exports = { signUpController, loginController, forgotController };
