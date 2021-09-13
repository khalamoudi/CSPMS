const department = require('../models/department')
//// this function is used to create department in database

const createDepartment = async (req, res) => {
  try {
    let data = req.body
    let initialDepArtment = await department.find().lean()
    let check = initialDepArtment.find((element) => element.name === data.name)
    if (!check) {
      let result = await department.create({ ...data })
      let dep = await department.find()
      res.render('department.ejs', {
        data: { success: 'Department Created Successfully', department: dep },
      })
      // res.status(200).json({data: result })
    } else {
      // res.status(400).json({message: 'Department already exist' })
      res.render('department.ejs', {
        data: {
          error: 'Department already exist',
          department: initialDepArtment,
        },
      })
    }
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating department' })
  }
}


const getDepartment = async (req, res) => {
  let dep = await department.find().lean()
  res.render('department.ejs', { data: { department: dep } })
}

module.exports = {
  createDepartment,getDepartment
}
