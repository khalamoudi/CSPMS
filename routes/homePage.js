const router = require('express').Router()
// Models

// Static Pages ================================================================
router.get('/', function(req, res, next) {
<<<<<<< HEAD
    if(req.isAuthenticated())
        res.render('home.ejs')
    else
        res.redirect('/auth/login')
=======
    res.render('home.ejs')
>>>>>>> 870c3a8169dadfefb2906b1203f4250da1047b71
})

module.exports = router;

