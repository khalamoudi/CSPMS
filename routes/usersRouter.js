const express = require("express");
const router = express.Router();

const usersController = require("../controllers/user");


router.get("/",(req,res) =>{
    if(req.isAuthenticated())
        usersController.getUsers(req,res)
    else
        res.redirect('/auth/login')
     }),


module.exports = router;