const express = require('express')
const router = express.Router()

const fs = require('fs')
const multer = require('multer')
const path = require('path')
const policyController = require('../controllers/pendingpolicy')
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


router.post("/hold/", uploadFields, (req,res) =>{
    if(req.isAuthenticated())
        policyController.holdPolicy(req,res)
    else
        res.redirect('/auth/login')
     }),

router.post("/approve/", uploadFields, (req,res) =>{
      if(req.isAuthenticated())
          policyController.approvePolicy(req,res)
      else
          res.redirect('/auth/login')
       }),


router.get('/',(req,res) =>{
  if(req.isAuthenticated())
        policyController.pendingPolicy(req,res)
  else
      res.redirect('/auth/login')
   }),
module.exports = router
