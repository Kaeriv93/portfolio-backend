// Import Dependencies
const express = require("express");
const router = express.Router();
const cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config

// Import JSON files
const projects = require("./projects.json");
const about = require("./about.json");

// Create our app object
const app = express();

// set up middleware
app.use(cors());
app.use(express.json());

//home route for testing our app
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/", router);

// route for retrieving projects
app.get("/projects", (req, res) => {
  // send projects via JSON
  res.json(projects);
});

// route for retrieving about info
app.get("/about", (req, res) => {
  // send projects via JSON
  res.json(about);
});

//declare a variable for our port number
const {PORT = 4000, GMAIL, PW} = process.env

const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth:{
    user: GMAIL,
    pass: PW
  },
});

contactEmail.verify((error) =>{
  if(error){
    console.log(error)
  }else{
    console.log("Ready to Send")
  }
});

router.post("/contact", (req,res) =>{
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const mail = {
    from: name,
    to: GMAIL,
    subject: `${subject}`,
    html: `<p>Name: ${name}</p>
           <p>Email:${email}</p>
           <p>Message:${message}</p> 
           `
  }
  contactEmail.sendMail(mail, (error) =>{
    if(error){
      res.json({status: "ERROR "});
    }else{
      res.json({status: "Message Sent"});
    }
  })
});

// turn on the server listener
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));