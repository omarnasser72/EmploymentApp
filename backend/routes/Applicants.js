const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadImages");
const util = require("util"); //helper
const fs = require("fs");

//create Applicant

router.post(
  "",
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("Enter a valid personal name")
    .isLength({ min: 2 })
    .withMessage(" Name should be at least 2 character"),

  body("description")
    .isString()
    .withMessage("Enter a valid description")
    .isLength({ min: 20 })
    .withMessage("Description should be at least 20 character"),
  async (req, res) => {
    try {
      //1) validation request [express validation]
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //2- Validate the image
      if (!req.file) {
        return res.status(400).json({
          errors: [
            {
              msg: "Image is required",
            },
          ],
        });
      }

      //3- Prepare applicant object

      const applicant = {
        name: req.body.name,
        email: req.body.email,
        image_url: req.file.filename,
        password: req.body.password,
        phone: req.body.phone,
      };

      //4-Insert applicant into db

      const query = util.promisify(conn.query).bind(conn);
      await query("insert into applicant set ? ", applicant);
      res.status(200).json({
        msg: "applicant created",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//Update Applicant

router.put(
  "/:id",
  admin,
  upload.single("image"),
  body("name")
    .isString()
    .withMessage("Enter a valid personal name")
    .isLength({ min: 2 })
    .withMessage(" Name should be at least 2 character"),

  body("description")
    .isString()
    .withMessage("Enter a valid description")
    .isLength({ min: 20 })
    .withMessage("Description should be at least 20 character"),
  async (req, res) => {
    try {
      //1) validation request [express validation]
      const query = util.promisify(conn.query).bind(conn);
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      //2- check if applicant exist or not
      const applicant = await query("select * from applicant where id = ?", [
        req.params.id,
      ]);

      if (!applicant[0]) {
        res.status(404).json({ ms: "applicant is not found" });
      }

      //3- Prepare applicant object

      const applicantObject = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
      };

      if (req.file) {
        applicantObject.image_url = req.file.filename;
        fs.unlinkSync("./upload/" + applicantObject[0].image_url); //delete old image
      }

      //4- Update applicant

      await query("update applicant set ? where id = ? ", [
        applicantObject,
        applicantObject[0].id,
      ]);
      res.status(200).json({
        msg: "applicant updated",
      });
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

//delete applicant

router.delete("/:id", admin, async (req, res) => {
  try {
    //1- check if job exist or not
    const query = util.promisify(conn.query).bind(conn);
    const applicant = await query("select * from applicant where id = ?", [
      req.params.id,
    ]);

    if (!applicant[0]) {
      res.status(404).json({ ms: "applicant is not found" });
    }

    //2- Remove applicant image
    fs.unlinkSync("./upload/" + applicant[0].image_url); //delete old image
    await query("delete from applicant where id = ?", [applicant[0].id]);
    res.status(200).json({
      msg: "applicant deleted",
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

//List applicant [Admin , User]

router.get("", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  let search = "";
  if (req.query.search) {
    //Query Params
    search = `where name LIKE'%${req.query.search}%' or description LIKE '%${req.query.search}%'`;
  }
  const applicant = await query(`select * from applicant ${search}`);
  applicant.map((applicant) => {
    applicant.image_url =
      "http://" + req.hostname + ":4000/" + applicant.image_url;
  });
  res.status(200).json(applicant);
});

// Show applicant [Admin , User]
router.get("/:id", async (req, res) => {
  const query = util.promisify(conn.query).bind(conn);
  const applicant = await query("select * from applicant where id = ?", [
    req.params.id,
  ]);
  if (!applicant[0]) {
    res.status(404).json({ ms: "applicant not found" });
  }
  applicant[0].image_url =
    "http://" + req.hostname + ":4000/" + applicant[0].image_url;
  res.status(200).json(job[0]);
});

module.exports = router;
