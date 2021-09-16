const express = require("express");
const router = express.Router();

const usersController = require("../controllers/user");


router.get("/",(req,res) =>{
    if(req.isAuthenticated())
        usersController.getUsers(req,res)
    else
        res.redirect('/auth/login')
     }),

router.post("/update/",(req,res) =>{
        if(req.isAuthenticated())
        usersController.updateUser(req,res)
        else
            res.redirect('/auth/login')
         }),

router.post("/delete/",(req,res) =>{
             if(req.isAuthenticated())
             usersController.deleteUser(req,res)
             else
                 res.redirect('/auth/login')
              }),
module.exports = router;