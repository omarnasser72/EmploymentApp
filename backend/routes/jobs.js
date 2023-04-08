const router = require("express").Router();
const { body } = require("express-validator");
const conn = require("../db/dbConnection");
const admin = require("../middleware/admin");
const authorized = require("../middleware/authorize");
//admin [create, update, delete, list]

router.post("", admin, body(""), (req, res) => {
  res.status(200).json({
    msg: "job created",
  });
});

router.put("/update", (req, res) => {
  res.status(200).json({
    msg: "job updated",
  });
});

router.delete("/delete", (req, res) => {
  res.status(200).json({
    msg: "job deleted",
  });
});

router.get("/list", (req, res) => {
  res.status(200).json({
    msg: "jobs",
  });
});
module.exports = router;
