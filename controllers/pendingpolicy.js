const url = require('url')
const path = require('path')
const policy = require('../models/policy')
const policystatus = require('../models/policystatus')



//// this function is used to create policy in database
const pendingPolicy = async (req, res) => {
  console.log('req', req.body)
  // console.log('req.file', req.file);
  try {
    
    let plc = await policy.find({'enddate': {
      $gte: Date.now()
  }}).lean()
    console.log("plc",plc)
    res.render('newpolicies.ejs', {
      data: {
        policy: plc,
      },
    })
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating policy' })
  }
}



module.exports = { pendingPolicy }
