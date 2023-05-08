const router = require("express").Router();
//const authorized = require("../middleware/authorize");
const conn = require("../db/dbConnection");
const util = require("util");
//const fs = require("fs");

//RequestJob got handled in requests.js
//showRequestedJobs got handled in requests.js

//Filter jobs by offer or by position & view jobs
router.get("/", async (req, res) => {
    const query = util.promisify(conn.query).bind(conn);
    let search = "";
    if(req.query.search) {
        search = `where position LIKE '%${req.query.search}%' or offer LIKE '%${req.query.search}%'`;
    }
    const resultJobs = await query(`select * from job ${search}`)
    if (!resultJobs[0]) {
            res.status(404).json({ msg: "Job not found !"});
    }
    res.status(200).json(resultJobs);
});

//viewJobs [admin, user]
// router.get("/:id", async (req, res) => {
//     const query = util.promisify(conn.query).bind(conn);
//     const resultViewJobs = await query("select * from job where id = ?" , [req.params.id]);
//     if (!resultViewJobs[0]) {
//         res.status(404).json({ msg: "Job not found !"});
//     }
//     //const resultViewJobs = await query("select * from job where id = ?" , [req.params.id]);
//     res.status(200).json(resultViewJobs);
// });

//filterJobs by offer 


//filterJobs by maxCandidateNumber



















module.exports = router;