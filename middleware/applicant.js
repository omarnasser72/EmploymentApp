const conn = require("../db/dbConnection");
const util = require("util"); //helper

const applicant = async (req, res, next) => {
  const query = util.promisify(conn.query).bind(conn);
  const { token } = req.headers;
  const admin = await query("select * from applicant where token = ?", [token]);
  if (admin[0]) {
    next();
  } else {
    res.status(403).json({
      msg: "you're not authorized to access this page",
    });
  }
};

module.exports = applicant;
