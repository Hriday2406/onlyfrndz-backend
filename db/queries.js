const pool = require("./pool");

// MESSAGE QUERIES

async function createMessage(userId, title, message) {
  try {
    const tempDate = `${new Date().getDate()}/${
      new Date().getMonth() + 1
    }/${new Date().getFullYear()}`;
    const tempTime = new Date().toString().slice(16, 21);
    const date = `${tempTime} - ${tempDate}`;
    await pool.query(
      "INSERT INTO messages (user_id, title, message, created_at) VALUES ($1, $2, $3, $4)",
      [userId, title, message, date]
    );
    return true;
  } catch (error) {
    throw new Error(`Error creating message: ${error.message}`);
  }
}

async function getAllMessages() {
  try {
    const result = await pool.query(
      "SELECT messages.*, users.username FROM messages JOIN users ON messages.user_id = users.id"
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Error getting all messages: ${error.message}`);
  }
}

async function getMessageById(id) {
  try {
    const result = await pool.query("SELECT * FROM messages WHERE id = $1", [
      id,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting message by ID: ${error.message}`);
  }
}

async function deleteMessage(id) {
  try {
    await pool.query("DELETE FROM messages WHERE id = $1", [id]);
    return true;
  } catch (error) {
    throw new Error(`Error deleting message: ${error.message}`);
  }
}

// USER QUERIES

async function createUser(fullName, username, email, password) {
  try {
    await pool.query(
      "INSERT INTO users (full_name, username, email, password, is_member, is_admin) VALUES ($1, $2, $3, $4, false, false)",
      [fullName, username, email, password]
    );
    return true;
  } catch (error) {
    throw new Error(`Error creating user: ${error.message}`);
  }
}

async function getUserById(id) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting user by ID: ${error.message}`);
  }
}

async function getUserByUsername(username) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting user by username: ${error.message}`);
  }
}

async function getUserByEmail(email) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows[0];
  } catch (error) {
    throw new Error(`Error getting user by email: ${error.message}`);
  }
}

async function setMembershipStatus(userId, status) {
  try {
    await pool.query("UPDATE users SET is_member = $1 WHERE id = $2", [
      status,
      userId,
    ]);
    return true;
  } catch (error) {
    throw new Error(`Error setting membership status: ${error.message}`);
  }
}

async function getMembershipStatus(userId) {
  try {
    const result = await pool.query(
      "SELECT is_member FROM users WHERE id = $1",
      [userId]
    );
    return result.rows[0].is_member;
  } catch (error) {
    throw new Error(`Error getting membership status: ${error.message}`);
  }
}

module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  deleteMessage,
  createUser,
  getUserById,
  getUserByUsername,
  getUserByEmail,
  setMembershipStatus,
  getMembershipStatus,
};
