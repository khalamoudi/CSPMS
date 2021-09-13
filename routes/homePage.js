const router = require('express').Router()
// Models

// Static Pages ================================================================
router.get('/', function(req, res, next) {
    if(req.isAuthenticated())
        res.render('home.ejs')
    else
        res.redirect('/auth/login')
})

module.exports = router;

