const router = require('express').Router()
const { expect } = require('chai');
const passport = require('passport');
const departmentModel = require('../models/department')
const Vonage = require('@vonage/server-sdk')
const verificationcode=require('../models/verificationcode')
const vonage = new Vonage({
	apiKey: "fc65e090",
	apiSecret: "PNPR2lCnMWFKszjq"
  })
 

//const localStorage =require('localStorage' ) 
//  Signup ====================================================================
router.get('/signup', async (req, res) => {
  let dep = await departmentModel.find().lean()
  res.render('registration.ejs', { data: { department: dep } })
});


router.post('/signup', passport.authenticate('local-signup', {
	failureRedirect : '/auth/signup',
	failureFlash : false // flash messages
}), function(req, res, next)  {
	console.log("response",req.user)
	code=Math.random().toString(36).substring(4, 8);
	try {
		let data = req.body
		console.log('data',data)
		var newdata={'code':code,'email':req.user.email}
		let allcodes =  verificationcode.find().lean()
		let check=false
		if (allcodes.length>0)
		   { check = allcodes.find((element) => element.email === req.user.email)}
		if (!check) {
		  let result =  verificationcode.create({ ...newdata })
			const from = "Vonage APIs"
			const to = req.user.phone
			const text = "Verification code for CSPMS is :  " + code

			vonage.message.sendSms(from, to, text, (err, responseData) => {
				if (err) {
					res.render('registration2.ejs', {
						data: {
						success: 'Error Sedning COde',
						Response: req.user
						},
					})
				} else {
					if(responseData.messages[0]['status'] === "0") {
						console.log("Message sent successfully.");
						res.render('registration2.ejs', {
							data: {
							success: 'A verification SMS has been sent to your provided number.',
							Response: req.user
							},
						})
						
					} else {
						console.log(`Message failed with error: ${responseData.messages[0]['error-text']}`);
						res.render('registration2.ejs', {
							data: {
							success: `Message failed with error: ${responseData.messages[0]['error-text']}`,
							Response: req.user
							},
						})
						
					}
				}
			})


	
		
		}
		else{
			res.render('registration2.ejs', {
				data: {
				success: 'Code already Sent',
				Response: req.user
				},
			})
		}
	}
	catch{
		res.render('registration2.ejs', {
			data: {
			success: 'Error Sedning COde',
			Response: req.user
			},
		})
	}
	
});

// Login 
router.get('/login', function(req, res, next)  {
	if (req.user) {
		console.log("user get",res,req)
		res.redirect('/home/')
	} else {
		res.render('login')
	}
})

router.post('/login', passport.authenticate('local-login', {
	failureRedirect : '/auth/login',
	failureFlash : false // allow flash messages
}), function(req, res, next)  {
	//console.log("user post",req.user)
	res.redirect('/home/')
       //res.render('Home.ejs',{ data: req.user } )
});

// LOGOUT ==============================
router.get('/logout', function(req, res, next) {
	req.logout();
	res.redirect('/');
});




module.exports = router;