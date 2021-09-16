const router = require('express').Router()
// Models

// Static Pages ================================================================
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        {
        //res.render('home.ejs')
        console.log("data: ",req.user)
        res.render('home.ejs',{ data: req.user } )
        }
    else
        res.redirect('/auth/login')
})

module.exports = router;

