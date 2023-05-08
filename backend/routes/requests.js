const router = require("express").Router();
const { body, validationResult } = require("express-validator");
const conn = require("../db/dbConnection");
const admin = require("../middleware/admin");
const authorized = require("../middleware/authorize");
const upload = require("../middleware/uploadImages");
const util = require("util");
const fs = require("fs");
const { query } = require("express");
const applicant = require("../middleware/applicant");
//admin [create, update, delete, list]

//create(add)
router.post(
  "",
  applicant || admin,
  body("job_id")
    .isString()
    .withMessage("please, enter a valid job id")
    .isLength({ min: 1 }),
  body("applicant_id")
    .isString()
    .withMessage("please, enter a valid applicant id")
    .isLength({ min: 1 }),
  body("status")
    .isString()
    .withMessage("please, enter a valid status value")
    .isLength({ max: 1 }),
  async (req, res) => {
    try {
      //1) validation request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2) prepare request object
      const request = {
        applicant_id: req.body.applicant_id,
        job_id: req.body.job_id,
        status: req.body.status,
      };

      //3) insert request into database
      const query = util.promisify(conn.query).bind(conn);
      await query("insert into requests set ?", request);
      res.status(200).json({
        msg: "request created",
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
  body("job_id")
    .isString()
    .withMessage("please, enter a valid job id")
    .isLength({ min: 1 }),
  body("applicant_id")
    .isString()
    .withMessage("please, enter a valid applicant id")
    .isLength({ min: 1 }),
  async (req, res) => {
    try {
      const query = util.promisify(conn.query).bind(conn);

      //1) validation request
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //2) check if request exist
      const request = await query("select * from requests where id = ?", [
        req.params.id,
      ]);

      if (!request[0]) {
        res.status(404).json({
          msg: "request doesn't exist",
        });
      }

      //3) prepare request object
      const requestObj = {
        applicant_id: req.body.applicant_id,
        job_id: req.body.job_id,
        status: req.body.status,
      };

      //3) insert request into database

      await query("update requests set ? where id = ?", [
        requestObj,
        request[0].id,
      ]);
      res.status(200).json({
        msg: "request updated successfully",
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
    //1) check if request exist or not
    const request = await query("select * from requests where id = ?", [
      req.params.id,
    ]);
    if (!request[0]) {
      res.status(404).json({ msg: "request doesn't exist" });
    }
    //delete request from database
    await query("delete from requests where id = ?", [request[0].id]);
    res.status(200).json({
      msg: "request deleted successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//list all requests
router.get("/list", admin, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const request = await query("select * from requests");
  res.status(200).json(request);
});

//Show the history of applicant requests for all jobs
router.get("/list/:id", admin, async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const request = await query(
    "select * from requests where applicant_id = ? ",
    req.params.id
  );
  res.status(200).json(request);
});
module.exports = router;
