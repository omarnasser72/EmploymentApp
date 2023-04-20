const router = require("express").Router();
const conn = require("../db/dbConnection");
const authorized = require("../middleware/authorize");
const admin = require("../middleware/admin");
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/uploadimages");
const util = require("util"); //helper
const fs = require("fs");

//create job

router.post(
"",
admin,
upload.single("image"),
body("name")
.isString()
.withMessage("Enter a valid job name")
.isLength({min:10})
.withMessage("Job name should be at least 10 character"),

body("description")
.isString()
.withMessage("Enter a valid description")
.isLength({min:20})
.withMessage("Job name should be at least 20 character"),
async (req, res) => {
try{
//1) validation request [express validation]
const errors = validationResult(req);
if (!errors.isEmpty()) {
return res.status(400).json({ errors: errors.array() });
}

//2- Validate the image 
if(!req.file){
    return res.status(400).json({
        errors: [
          {
            msg: "Image is required",
          },
        ],
      });
}

//3- Prepare job object

const job = {
position: req.body.position,
description: req.body.description,
image_url: req.file.filename,
qualifications: req.body.qualifications,
maxCandidateNumber: req.body.maxCandidateNumber,
offer: req.body.offer
};

//4-Insert job into db

const query = util.promisify(conn.query).bind(conn);
await query("insert into jobs set ? ", job); 
res.status(200).json({
msg:"Job created" ,
});
} catch(err) {
    
    res.status(500).json(err);
}
}
);

//Update job

router.put(
  "/:id",
  admin,
  upload.single("image"),
  body("name")
  .isString()
  .withMessage("Enter a valid job name")
  .isLength({min:10})
  .withMessage("Job name should be at least 10 character"),
  
  body("description")
  .isString()
  .withMessage("Enter a valid description")
  .isLength({min:20})
  .withMessage("Description should be at least 20 character"),
  async (req, res) => {
  try{
  //1) validation request [express validation]
  const query = util.promisify(conn.query).bind(conn);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
  }

  //2- check if job exist or not
  const job = await query("select * from job where id = ?", [
    req.params.id,
  ]);

  if(!job[0]){
    res.status(404).json({ms:"job is not found"});
  }
  
  

  //3- Prepare job object
  
  const jobObject = {
  position: req.body.position,
  description: req.body.description,
  qualifications: req.body.qualifications,
  maxCandidateNumber: req.body.maxCandidateNumber,
  offer: req.body.offer
  };

  if(req.file){
    jobObject.image_url = req.file.filename;
    fs.unlinkSync("./upload/" + job[0].image_url ); //delete old image
  }
  
  //4- Update job

  await query("update job set ? where id = ? ", [
    jobObject,
    job[0].id
  ]); 
  res.status(200).json({
  msg:"Job updated" ,
  });
  } catch(err) {
      
      res.status(500).json(err);
    }
   }
  );


  //delete job

  router.delete(
    "/:id",
    admin,
    async (req, res) => {
    try{
    //1- check if job exist or not
    const query = util.promisify(conn.query).bind(conn);
    const job = await query("select * from job where id = ?", [
      req.params.id
    ]);
  
    if(!job[0]){
      res.status(404).json({ms:"job is not found"});
    }

    //2- Remove job image 
      fs.unlinkSync("./upload/" + job[0].image_url ); //delete old image
    await query("delete from job where id = ?", [job[0].id]); 
    res.status(200).json({
    msg:"Job deleted" ,
    });
    } catch(err) {
        
        res.status(500).json(err);
      }
     }
    );

//List [Admin , User]

router.get("", async (req, res) => {
const query = util.promisify(conn.query).bind(conn);
let search = "";
if(req.query.search){
  //Query Params
 search = `where name LIKE'%${req.query.search}%' or description LIKE '%${req.query.search}%'` ;
}
const job = await query(`select * from job ${search}`);
job.map(job => {
  job.image_url = "http://" + req.hostname + ":4000/" + job.image_url;
});
res.status(200).json(job);
});

// Show job [Admin , User]
router.get("/:id", async (req, res) =>{
const query = util.promisify(conn.query).bind(conn);
const job = await query("select * from job where id = ?", [
  req.params.id,
]);
if (!job[0]){
  res.status(404).json({ ms: "Job not found"});
}
job[0].image_url = "http://" + req.hostname + ":4000/" + job[0].image_url;
res.status(200).json(job[0]);
});


module.exports = router;