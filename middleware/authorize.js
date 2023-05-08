const conn = require("../db/dbConnection");
const util = require("util"); //helper

const authorized = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const user = await query("select * from admin where token = ?", [token]);
  if (user[0]) {
    next();
  } else {
    res.status(403).json({
      msg: "you're not authorized to access this page",
    });
  }
};

module.exports = authorized;
