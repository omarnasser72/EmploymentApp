//--------------------intialize express app-------------------
const express = require("express");
const app = express();

//---------------------global middleware------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("upload"));

const cors = require("cors");
const { Router } = require("express");
app.use(cors()); // allow http requests local hosts

//--------------required modules------------------
const auth = require("./routes/Auth");
const jobs = require("./routes/jobs");
const qualfications = require("./routes/qualifications");
const requests = require("./routes/requests");
const applicants = require("./routes/Applicants");
const ApplicantsM = require("./routes/ApplicantsM");
//----------------run the app module-----------------
app.listen(4000, "localhost", () => {
  console.log("SERVER IS RUNNING");
});

//----------------API Routes [Endpoints]-------------
app.use("/auth", auth);
app.use("/jobs", jobs);
app.use("/qualfications", qualfications);
app.use("/requests", requests);
app.use("/applicant", applicants);
app.use("/ApplicantsM", ApplicantsM);
