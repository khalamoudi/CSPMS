const url = require('url')
const path = require('path')
const policy = require('../models/policy')
const policystatus = require('../models/policystatus')
const UserDetail = require('../models/UserDetail')
const user = require('../models/user')

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

const approvePolicy = async (req, res) => {
  try {
    let data = req.body
    data['status']='Approved'
    console.log("data",data)
    let doc = await policystatus.findOneAndUpdate({'id':data.id,'email':data.email}, data, {
      new: true,
      upsert: true
    });
    let plc = await policy.find({'enddate': {
      $gte: Date.now()
  }}).lean()
   console.log("plc",plc)
    res.render('newpolicies.ejs', {
      data: { success: 'Status Updated Successfully',policy: plc},
    })
   
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while updating Policy Status' })
  }
  
}

const holdPolicy = async (req, res) => {
  try {
    let data = req.body
    data['status']='Hold'
    console.log("data",data)
    let doc = await policystatus.findOneAndUpdate({'id':data.id,'email':data.email}, data, {
      new: true,
      upsert: true
    });
    let plc = await policy.find({'enddate': {
      $gte: Date.now()
  }}).lean()
    res.render('newpolicies.ejs', {
      data: { success: 'Status Updated Successfully',policy: plc},
    })
   
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while updating Policy Status' })
  }
  
  
}
const countPolicy = async (req, res) => {
 
  
  try {
    let data = req.body
    if (data.category!=="selectcategory"){
      
    var all=0;
    var actioned=0;
    var Approved=0;
    var hold=0;
    data['status']='Hold'
    console.log("data",data)
    policystatus.find({'category':data.category}).exec(function (err, results) {
      all = results.length
      console.log("overall",all)
    
    });
    policystatus.find({'email':data.email,'category':data.category}).exec(function (err, results) {
      actioned = results.length
      console.log("specific email",actioned)
    
    });
    
    policystatus.find({'email':data.email,'category':data.category,'status':'Hold'}).exec( await function (err, results) {
      hold = results.length
      Approved=actioned-hold
      console.log("hold",hold,Approved)
      var Data={all:all,actioned:actioned,Approved:Approved,hold:hold,nonactioned:all-actioned}
      console.log(Data)
      res.status(200).json({ data: Data })
    
    });
    
    }
    else{
    var all=0;
    var actioned=0;
    var Approved=0;
    var hold=0;
    data['status']='Hold'
    console.log("data",data)
    policystatus.find().exec(function (err, results) {
      all = results.length
      //console.log("overall",all)
    
    });
    policystatus.find({'email':data.email}).exec(function (err, results) {
      actioned = results.length
      //console.log("specific email",actioned)
    
    });
    policystatus.find({'email':data.email,'status':'Hold'}).exec( await function (err, results) {
      hold = results.length
      Approved=actioned-hold
      //console.log("hold",hold,Approved)
      var Data={all:all,actioned:actioned,Approved:Approved,hold:hold,nonactioned:all-actioned}
      console.log(Data)
      res.status(200).json({ data: Data })
    
    });
    
    
  }
  } catch (e) {
    console.log(e)
    res.status(400).json({ Error: "Error" })
  }
  
  
}
const countPersons = async (req, res) => {
 
  
  try {
    let data = req.body
    var all=0
    var admin=0;
    var members=0;
    var Managers=0;
    
    user.find().exec(function (err, results) {
      all = results.length
      console.log("overall",all)
    
    });
    user.find({'role':'Admin'}).exec(function (err, results) {
      admin = results.length
    
    });
    user.find({'role':'Manager'}).exec( await function (err, results) {
      Managers = results.length
      members=all-admin-Managers
      
      var Data={all:all,Managers:Managers,members:members,admin:admin}
      console.log(Data)
      res.status(200).json({ data: Data })
    
    });
    
    
   
  } catch (e) {
    console.log(e)
    res.status(400).json({ Error: "Error" })
  }
  
  
}

const countmembers = async (req, res) => {
 
  
  
    try {
      let data = req.body
      if (data.category!=="selectcategory"){
        
        var all=0;
        var members=0;
        var Approved=0;
        var hold=0;
        data['status']='Hold'
        console.log("data",data)
        policystatus.find().exec(function (err, results) {
          all = results.length
          //console.log("overall",all)
        
        });
        policystatus.find({'category':data.category}).exec(function (err, results) {
          members = results.length
          //console.log("specific email",actioned)
        
        });
        policystatus.find({'category':data.category,'status':'Approved'}).exec( await function (err, results) {
          Approved=results.length
          
        
        });
        policystatus.find({'category':data.category,'status':'Hold'}).exec( await function (err, results) {
          hold = results.length
          //console.log("hold",hold,Approved)
          var Data={all:all,members:members,Approved:Approved,hold:hold}
          console.log(Data)
          res.status(200).json({ data: Data })
        
        });
        
      
      }
      else{
      var all=0;
      var members=0;
      var Approved=0;
      var hold=0;
      data['status']='Hold'
      console.log("data",data)
      policystatus.find().exec(function (err, results) {
        all = results.length
        members=all
        //console.log("overall",all)
      
      });
      
      policystatus.find({'status':'Approved'}).exec( await function (err, results) {
        Approved=results.length
        
      
      });
      policystatus.find({'status':'Hold'}).exec( await function (err, results) {
        hold = results.length
        //console.log("hold",hold,Approved)
        var Data={all:all,members:members,Approved:Approved,hold:hold}
        console.log(Data)
        res.status(200).json({ data: Data })
      
      });
      
      
    }
    } catch (e) {
      console.log(e)
      res.status(400).json({ Error: "Error" })
    }
    
  
  
}

module.exports = { pendingPolicy, approvePolicy , holdPolicy,countPolicy,countPersons,countmembers }
