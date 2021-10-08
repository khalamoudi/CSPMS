const url = require('url')
const path = require('path')
const policy = require('../models/policy')
const UserDetail = require('../models/UserDetail')
const category = require('../models/category')
const nodemailer = require("nodemailer");
const socket = require('../app')

const {google}=require('googleapis')
const CLIENT_ID='1074942946188-ouiuutvf3vbr2s8c4drve261725hc4qt.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04syQ-uzN6OxFCgYIARAAGAQSNwF-L9Ir3FW5XIlA7Cng753IacDLLjEKAc1w_Yyb4nDzn_zidVO-E58F1axJjZRVU06XcrAt0f8'

//console.log("email",email,"password",password)
//// this function is used to create send file from database
const getFile = async (req, res) => {
  try {
    const np = path.join(__dirname + '/../uploads')

    res.sendFile(np + '/' + req.params.id)
  } catch (e) {
    res.json({ error: "image doesn't found" })
  }
}

//// this function is used to create policy in database
const createPolicy = async (req, res) => {
  console.log('req', req.body)
  // console.log('req.file', req.file);
  try {
    let obj = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      enddate:req.body.enddate,
      startdate:Date.now(),
      file_url:
        url.format({
          protocol: req.protocol,
          host: req.get('host'),
        }) +
        '/policy/get/' +
        req.files.file[0].filename,
      file_path: req.files.file[0].path,

      thumbnail_url:
        url.format({
          protocol: req.protocol,
          host: req.get('host'),
        }) +
        '/policy/get/' +
        req.files.file1[0].filename,
      thumbnail_path: req.files.file1[0].path,
    }

    let result = await policy.create({ ...obj })
    let cat = await category.find().lean()
    let plc = await policy.find().lean()
    let a = await socket.sockets.emit('message', { type: 'policy'})
    var email = "mycontextsquad2@gmail.com";
    var password = "Qwop@1405";
    console.log("email",email,"password",password)
    UserDetail.find({'role':'Manager'}, async function(err, result) {
      if (err) {
        console.log(err);
      } else {
        const oAuth2Client=new google.auth.OAuth2(CLIENT_ID,CLIENT_SECRET,REDIRECT_URI)
        oAuth2Client.setCredentials({refresh_token:REFRESH_TOKEN})
        const accessToken=await oAuth2Client.getAccessToken()
        var transporter = nodemailer.createTransport({
          service: "gmail",
        auth: {
          type:'OAuth2',
          user: 'cspmsgroup@gmail.com',
          clientId: CLIENT_ID,
          clientSecret:CLIENT_SECRET,
          refreshToken:REFRESH_TOKEN,
          accessToken:accessToken
        },
        });
        for (var i = 0; i < result.length; i++) { 
          console.log(result[i]['email']);
          var mailOptions = {
            from: 'cspmsgroup@gmail.com',
            to: result[i]['email'],
            subject: "CSPMS New Policy Added",
            text: "Visit out Site to check New Policies which are added now. Thanks " ,
          };
    
          transporter
            .sendMail(mailOptions)
            .then((result) => {
              console.log("done")
            })
            .catch((error) => {
              console.error(" email error",error);
    
              res.json({ error: 'There is an error while sedning email' })
            });
        
        
        }
        //console.log(result);
      }
    });
   
    res.render('policy.ejs', {
      data: {
        success: 'Policy Uploaded Successfully',
        category: cat,
        policy: plc,
      },
    })
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating policy' })
  }
}

const getPolicy = async (req, res) => {
  let cat = await category.find().lean()
  let pls = await policy.find().lean()
  return res.render('policy.ejs', {
    data: { category: cat, policy: pls },
  })
}

module.exports = { createPolicy, getFile , getPolicy }
