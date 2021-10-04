const router = require('express').Router()
// Models
const category = require('../models/category')
// Static Pages ================================================================
router.get('/', async function(req, res, next) {
    if(req.isAuthenticated())
        {
        //res.render('home.ejs')
        let cat = await category.find().lean()
        console.log("data: ",req.user,cat)
        res.render('home.ejs',{ data: req.user,category: cat } )
        }
    else
        res.redirect('/auth/login')
})

module.exports = router;

