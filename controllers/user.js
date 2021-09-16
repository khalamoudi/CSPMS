const UserDetail = require('../models/UserDetail')
const user = require('../models/user')

const getUsers = async (req, res) => {
    let users = await UserDetail.find().lean()
    res.render('users.ejs', { data: { user: users } })
  }

  const updateUser = async (req, res) => {
    
    try {
      let data = req.body
      console.log("data",data)
      
      let initialusers = await UserDetail.findByIdAndUpdate(data.id, { role: data.role},
        async function (err, docs) {
        if (err){
        console.log(err)
        res.render('users.ejs', {
          data: { error: 'Status Not  Updated', user: initialusers },
        })
        }
        else{
            console.log("update1")
            let initialusers = await user.findByIdAndUpdate(data.userid, { role: data.role},
                async function (err, docs) {
                if (err){
                console.log(err)
                res.render('users.ejs', {
                  data: { error: 'Status Not  Updated', user: initialusers },
                })
                }
                else{
                    let users = await UserDetail.find().lean()
    
                    res.render('users.ejs', {
                      data: { success: 'Status Updated Successfully', user: users  },
                    })


                }

            });

           
        }
        });
    } catch (e) {
      console.log(e)
      res.json({ error: 'There is an error while updating user' })
    }

    
    
  }
  
  const deleteUser = async (req, res) => {
       
    try {
      let data = req.body
      console.log("data",data)
      
      let users = await UserDetail.findByIdAndRemove(data.id,
        async function (err, docs) {
        if (err){
        console.log(err)
        res.render('users.ejs', {
          data: { error: 'User Not  Deleted', user: users },
        })
        }
        else{

            let initialusers = await user.findByIdAndRemove(data.userid,
                async function (err, docs) {
                if (err){
                console.log(err)
                res.render('users.ejs', {
                  data: { error: 'user not deleted', user: initialusers },
                })
                }
                else{
                    let users = await UserDetail.find().lean()
    
                    res.render('users.ejs', {
                      data: { success: 'User Deleted Successfully', user: users  },
                    })


                }

            });
        }
        });
    } catch (e) {
      console.log(e)
      res.json({ error: 'There is an error while Deleting User' })
    } 
    
  }

  module.exports = {
      getUsers,deleteUser,updateUser
  }
  