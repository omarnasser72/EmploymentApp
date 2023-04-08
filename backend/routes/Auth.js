const router = require("express").Router();
const conn = require("../db/dbConnection");
const { body, validationResult } = require("express-validator");
const util = require("util"); //helper
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { log } = require("console");
//log in, Registration

router.post(
  "/registerAdmin",
  body("email").isEmail().withMessage("please, enter a valid email"),
  body("name")
    .isString()
    .withMessage("please, enter a valid name")
    .isLength({ min: 6, max: 20 })
    .withMessage("name should be between 6 and 20 character"),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("password should be between 8 and 20 character"),
  body("status")
    .isBoolean()
    .withMessage("please, enter status with 0 or 1 only"),
  async (req, res) => {
    try {
      //1) validation request [express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2) check if email exists
      //await / async
      const query = util.promisify(conn.query).bind(conn); // transform mysql query >> promise to use [await / async]
      const user = await query("select * from admin where email = ?", [
        req.body.email,
      ]);
      if (user.length > 0) {
        res.status(400).json({
          errors: [
            {
              msg: "email already exists",
            },
          ],
        });
      }

      //3) perpare object user to save
      const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        password: req.body.password,
        token: crypto.randomBytes(16).toString("hex"), // json web token, crypto >> random encryption standard
      };
      userData.password = bcrypt.hashSync(req.body.password, 10);

      //4) insert user object into database
      await query("insert into admin set ?", userData);
      res.status(200).json(userData);

      res.json("success");
    } catch (err) {
      console.log(err);
      //res.status(500).json({ err: err });
    }
  }
);

router.post(
  "/registerApplicant",
  body("email").isEmail().withMessage("please, enter a valid email"),
  body("name")
    .isString()
    .withMessage("please, enter a valid name")
    .isLength({ min: 6, max: 20 })
    .withMessage("name should be between 6 and 20 character"),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("password should be between 8 and 20 character"),
  body("status")
    .isBoolean()
    .withMessage("please, enter status with 0 or 1 only"),
  async (req, res) => {
    try {
      //1) validation request [express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2) check if email exists
      //await / async
      const query = util.promisify(conn.query).bind(conn); // transform mysql query >> promise to use [await / async]
      const user = await query("select * from applicant where email = ?", [
        req.body.email,
      ]);
      if (user.length > 0) {
        res.status(400).json({
          errors: [
            {
              msg: "email already exists",
            },
          ],
        });
      }

      //3) perpare object user to save
      const userData = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        status: req.body.status,
        password: req.body.password,
        token: crypto.randomBytes(16).toString("hex"), // json web token, crypto >> random encryption standard
        jobSearches: req.body.jobSearches,
      };
      userData.password = bcrypt.hashSync(req.body.password, 10);

      //4) insert user object into database
      await query("insert into applicant set ?", userData);
      res.status(200).json(userData);

      res.json("success");
    } catch (err) {
      console.log(err);
      //res.status(500).json({ err: err });
    }
  }
);

router.post(
  "/login",
  body("email").isEmail().withMessage("please, enter a valid email"),
  body("password")
    .isLength({ min: 8, max: 20 })
    .withMessage("password should be between 8 and 20 character"),
  async (req, res) => {
    try {
      //1) validation request [express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      //2) check if email exists
      //await / async
      var query = util.promisify(conn.query).bind(conn); // transform mysql query >> promise to use [await / async]
      var user = await query("select * from applicant where email = ?", [
        req.body.email,
      ]);
      var role = false;
      if (user.length == 0) {
        user = await query("select * from admin where email = ?", [
          req.body.email,
        ]);
        role = true;
        if (user.length == 0) {
          res.status(404).json({
            errors: [
              {
                msg: "email isn't found",
              },
            ],
          });
        }

        //3) compare hashed password
        /*const checkPassword = await bcrypt.compare(
        req.body.password,
        user[0].password
      );*/
        /*
      var checkPassword = false;
      if (req.body.password === user[0].password) checkPassword = true;
      else checkPassword = false;
      */
        const checkPassword = bcrypt.compareSync(
          req.body.password,
          user[0].password
        );
        console.log(checkPassword);
        if (checkPassword) {
          //delete user[0].password;
          return res.status(200).json(user[0]);
        } else {
          return res.status(404).json({
            errors: [
              {
                msg: "wrong password",
              },
            ],
          });
        }
        res.json("success");
      }
    } catch (err) {
      console.log(err);
      //res.status(500).json({ err: err });
    }
  }
);

module.exports = router;
