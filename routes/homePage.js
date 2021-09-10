const router = require('express').Router()
// Models

// Static Pages ================================================================
router.get('/', function(req, res, next) {
    res.render('home.ejs')
})

module.exports = router;

