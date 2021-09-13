const UserDetail = require('../models/UserDetail')


const getUsers = async (req, res) => {
    let users = await UserDetail.find().lean()
    res.render('users.ejs', { data: { user: users } })
  }

  module.exports = {
      getUsers
  }
  