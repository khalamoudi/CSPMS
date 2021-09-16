const router = require('express').Router()
const passport = require('passport');
const departmentModel = require('../models/department')
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
	res.redirect('/home/')
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