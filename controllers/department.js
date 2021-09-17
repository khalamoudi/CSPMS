const department = require('../models/department')
const user = require('../models/user')
const UserDetail = require('../models/UserDetail')
//// this function is used to create department in database

const createDepartment = async (req, res) => {
  try {
    let data = req.body
    console.log('data',data)
    let initialDepArtment = await department.find().lean()
    let check = initialDepArtment.find((element) => element.name === data.name)
    if (!check) {
      let result = await department.create({ ...data })
      let dep = await department.find()
      let users = await user.find().lean()
      await user.findOneAndUpdate({'email':data.email},{'role':'Manager'}, {
        returnOriginal: false
      })
      await UserDetail.findOneAndUpdate({'email':data.email},{'role':'Manager'}, {
        returnOriginal: false
      })
      res.render('department.ejs', {
        data: { success: 'Department Created Successfully', department: dep,users:users },
      })
      // res.status(200).json({data: result })
    } else {
      let users = await user.find().lean()
      // res.status(400).json({message: 'Department already exist' })
      res.render('department.ejs', {
        data: {
          error: 'Department already exist',
          department: initialDepArtment,users:users
        },
      })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating department' })
  }
}

const updatedepartment = async (req, res) => {
  try {
    let data = req.body
    console.log("data",data)
    department.findOne({nick: 'noname'}).then(async function (doc){
      console.log("doc",doc)
      if (doc.email!=data.email){
      await user.findOneAndUpdate({'email':doc.email},{'role':'Member'}, {
        returnOriginal: false
      })
      await UserDetail.findOneAndUpdate({'email':doc.email},{'role':'Member'}, {
        returnOriginal: false
      })
    }

    });
    let initialdepartment = await department.findByIdAndUpdate(data.id, { name: data.name,description:data.description,email:data.email },
      async function (err, docs) {
      if (err){
      console.log(err)
      let users = await user.find().lean()
      res.render('department.ejs', {
        data: { error: 'department Not  Updated', department: initialdepartment,users:users },
      })
      }
      else{
        await user.findOneAndUpdate({'email':data.email},{'role':'Manager'}, {
          returnOriginal: false
        })
        await UserDetail.findOneAndUpdate({'email':data.email},{'role':'Manager'}, {
          returnOriginal: false
        })

        let cat = await department.find().lean()
        let users = await user.find().lean()
        res.render('department.ejs', {
          data: { success: 'Department Updated Successfully', department: cat ,users:users},
        })
      }
      });
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating Department' })
  }
  
}

const deletedepartment = async (req, res) => {
  try {
    let data = req.body
    console.log("data",data)
    
    let initialdepartment = await department.findByIdAndRemove(data.id,
      async function (err, docs) {
      if (err){
      console.log(err)
      let users = await user.find().lean()
      res.render('department.ejs', {
        
        data: { error: 'Department Not  Deleted', department: initialdepartment ,users:users},
      })
      }
      else{
        let cat = await department.find().lean()
        let users = await user.find().lean()
        res.render('department.ejs', {
          data: { success: 'Department Deleted Successfully', department: cat,users:users },
        })
      }
      });
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating department' })
  }
  
}

const getDepartment = async (req, res) => {
  let dep = await department.find().lean()
  let users = await user.find().lean()
  res.render('department.ejs', { data: { department: dep,users:users } })
}

module.exports = {
  createDepartment,getDepartment,deletedepartment,updatedepartment
}
