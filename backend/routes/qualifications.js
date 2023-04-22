const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const conn = require("../db/dbConnection");
const admin = require("../middleware/admin");
const authorized = require("../middleware/authorize");
const upload = require("../middleware/uploadImages");
const util = require("util");
const fs = require("fs");
const { query } = require("express");
//admin [create, update, delete, list]

//create(add)
router.post(
  "",
  admin,
  body("name")
    .isString()
    .withMessage("please, enter a valid qualfication name")
    .isLength({ min: 5 })
    .withMessage("qualfication name should be 5 characters at least"),
  body("description")
    .isString()
    .withMessage("please, enter a valid qualfication description")
    .isLength({ min: 5 })
    .withMessage("qualfication description should be 5 characters at least"),

  async (req, res) => {
    try {
      //1) validation request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2) prepare qualification object
      const qualfication = {
        name: req.body.name,
        description: req.body.description,
      };

      //3) insert qualification into database
      const query = util.promisify(conn.query).bind(conn);
      await query("insert into qualifications set ?", qualfication);
      res.status(200).json({
        msg: "qualfication created",
      });
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

//update
router.put(
  "/update/:id",
  admin,
  body("name")
    .isString()
    .withMessage("please, enter a valid qualfication name")
    .isLength({ min: 5 })
    .withMessage("qualfication name should be 5 characters at least"),
  body("description")
    .isString()
    .withMessage("please, enter a valid qualfication description")
    .isLength({ min: 5 })
    .withMessage("qualfication description should be 5 characters at least"),

  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      //1) validation request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //2) check if qualfication exist
      const qualfication = await query(
        "select * from qualifications where id = ?",
        [req.params.id]
      );

      if (!qualfication[0]) {
        res.status(404).json({
          msg: "qualfication doesn't exist",
        });
      }

      //3) prepare qualification object
      const qualficationObj = {
        name: req.body.name,
        description: req.body.description,
      };

      //3) insert qualification into database

      await query("update qualifications set ? where id = ?", [
        qualficationObj,
        qualfication[0].id,
      ]);
      res.status(200).json({
        msg: "qualfication updated successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  }
);

//delete
router.delete("/delete/:id", admin, async (req, res) => {
  try {
    const query = util.promisify(conn.query).bind(conn);
    //1) check if qualfication exist or not
    const qualification = await query(
      "select * from qualifications where id = ?",
      [req.params.id]
    );
    if (!qualification[0]) {
      res.status(404).json({ msg: "qualfication doesn't exist" });
    }
    //delete qualfication from database
    await query("delete from qualifications where id = ?", [
      qualification[0].id,
    ]);
    res.status(200).json({
      msg: "qualification deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//list
router.get("/list", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const qualfication = await query("select * from qualifications");
  res.status(200).json(qualfication);
});
module.exports = router;
