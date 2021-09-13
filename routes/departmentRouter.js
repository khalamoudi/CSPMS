const express = require("express");
const router = express.Router();

const depController = require("../controllers/department");


router.post("/",(req,res) =>{
    if(req.isAuthenticated())
        depController.createDepartment(req,res)
    else
        res.redirect('/auth/login')
     }),


router.get("/",(req,res) =>{
    if(req.isAuthenticated())
        depController.getDepartment(req,res)
    else
        res.redirect('/auth/login')
     }),


module.exports = router;