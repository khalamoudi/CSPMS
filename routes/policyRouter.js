const express = require('express')
const router = express.Router()

const fs = require('fs')
const multer = require('multer')
const path = require('path')
const policyController = require('../controllers/policy')
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads/'))
  },
  filename: (req, file, cb) => {
    cb(null, +Date.now() + '-' + file.originalname)
  },
})

upload = multer({ storage: storage })
let uploadFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'file1', maxCount: 1 },
])


router.post("/", uploadFields, (req,res) =>{
    if(req.isAuthenticated())
        policyController.createPolicy(req,res)
    else
        res.redirect('/auth/login')
     }),

router.get('/get/:id',(req,res) =>{
  if(req.isAuthenticated())
        policyController.getFile(req,res)
  else
      res.redirect('/auth/login')
   }),


router.get('/',(req,res) =>{
  if(req.isAuthenticated())
        policyController.getPolicy(req,res)
  else
      res.redirect('/auth/login')
   }),
module.exports = router
