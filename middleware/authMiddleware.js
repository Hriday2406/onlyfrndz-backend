const jwt = require("jsonwebtoken");
const db = require("../db/queries");

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.SESSION_SECRET, (err, user) => {
    if (err) return res.json({ status: 403, message: "Invalid token" });
    req.user = user;
    next();
  });
};

const checkUser = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token === undefined) return next();

  jwt.verify(token, process.env.SESSION_SECRET, async (err, user) => {
    if (err) return next();
    const userData = await db.getUserById(user.id);

    req.user = {
      id: userData.id,
      isAdmin: userData.is_admin,
      isMember: userData.is_member,
    };
    next();
  });
};

module.exports = { authenticateToken, checkUser };
