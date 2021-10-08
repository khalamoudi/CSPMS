const UserDetail = require('../models/UserDetail')
const user = require('../models/user')
const nodemailer = require("nodemailer");

const {google}=require('googleapis')
const CLIENT_ID='1074942946188-ouiuutvf3vbr2s8c4drve261725hc4qt.apps.googleusercontent.com'
const CLIENT_SECRET='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'
const REDIRECT_URI='https://developers.google.com/oauthplayground'
const REFRESH_TOKEN='1//04syQ-uzN6OxFCgYIARAAGAQSNwF-L9Ir3FW5XIlA7Cng753IacDLLjEKAc1w_Yyb4nDzn_zidVO-E58F1axJjZRVU06XcrAt0f8'


const getUsers = async (req, res) => {
    let users = await UserDetail.find().lean()
    res.render('users.ejs', { data: { user: users } })
  }

  const updateUser = async (req, res) => {
    
    try {
      let data = req.body
      console.log("data",data)
      
      let initialusers = await UserDetail.findByIdAndUpdate(data.id, { role: data.role},
        async function (err, docs) {
        if (err){
        console.log(err)
        res.render('users.ejs', {
          data: { error: 'Status Not  Updated', user: initialusers },
        })
        }
        else{
            console.log("update1")
            let initialusers = await user.findByIdAndUpdate(data.userid, { role: data.role},
                async function (err, docs) {
                if (err){
                console.log(err)
                res.render('users.ejs', {
                  data: { error: 'Status Not  Updated', user: initialusers },
                })
                }
                else{
                    let users = await UserDetail.find().lean()
                   
                
    
                    res.render('users.ejs', {
                      data: { success: 'User Updated Successfully', user: users  },
                    })
                   
                    


                }

            });

           
        }
        });
    } catch (e) {
      console.log(e)
      res.json({ error: 'There is an error while updating user' })
    }

    
    
  }
  
  const deleteUser = async (req, res) => {
       
    try {
      let data = req.body
      console.log("data",data)
      
      let users = await UserDetail.findByIdAndRemove(data.id,
        async function (err, docs) {
        if (err){
        console.log(err)
        res.render('users.ejs', {
          data: { error: 'User Not  Deleted', user: users },
        })
        }
        else{

            let initialusers = await user.findByIdAndRemove(data.userid,
                async function (err, docs) {
                if (err){
                console.log(err)
                res.render('users.ejs', {
                  data: { error: 'user not deleted', user: initialusers },
                })
                }
                else{
                  console.log("User Deleted",docs)
                   var useremail=docs.email
                    let users = await UserDetail.find().lean()
    
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
                    var mailOptions = {
                      from: 'cspmsgroup@gmail.com',
                      to: useremail,
                      subject: "CSPMS User Account Deleted",
                      text: "Hi, Your account deleted from CSPMS . Thanks " ,
                    };
              
                    transporter
                      .sendMail(mailOptions)
                      .then((result) => {
                        res.render('users.ejs', {
                          data: { success: 'User Deleted Successfully', user: users  },
                        })
                      })
                      .catch((error) => {
                        console.error(" email error",error);
              
                        res.json({ error: 'There is an error while Sedning User Deleted Email' })
                      });



    

                }

            });
        }
        });
    } catch (e) {
      console.log(e)
      res.json({ error: 'There is an error while Deleting User' })
    } 
    
  }

  module.exports = {
      getUsers,deleteUser,updateUser
  }
  