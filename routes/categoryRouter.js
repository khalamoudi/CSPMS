const express = require("express");
const router = express.Router();

const catController = require("../controllers/category");

router.post("/",(req,res) =>{
    if(req.isAuthenticated())
         catController.createCategory(req,res)
    else
        res.redirect('/auth/login')
     }),


router.post("/update/",(req,res) =>{
          if(req.isAuthenticated())
               catController.updateCategory(req,res)
          else
              res.redirect('/auth/login')
           }),

router.post("/delete/",(req,res) =>{
               if(req.isAuthenticated())
                    catController.deleteCategory(req,res)
               else
                   res.redirect('/auth/login')
                }),


router.get("/",(req,res) =>{
    if(req.isAuthenticated())
         catController.getCategory(req,res)
    else
        res.redirect('/auth/login')
     }),



module.exports = router;