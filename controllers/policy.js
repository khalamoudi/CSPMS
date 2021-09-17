const url = require('url')
const path = require('path')
const policy = require('../models/policy')
const category = require('../models/category')
const socket = require('../app')

//// this function is used to create send file from database
const getFile = async (req, res) => {
  try {
    const np = path.join(__dirname + '/../uploads')

    res.sendFile(np + '/' + req.params.id)
  } catch (e) {
    res.json({ error: "image doesn't found" })
  }
}

//// this function is used to create policy in database
const createPolicy = async (req, res) => {
  console.log('req', req.body)
  // console.log('req.file', req.file);
  try {
    let obj = {
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      enddate:req.body.enddate,
      startdate:Date.now(),
      file_url:
        url.format({
          protocol: req.protocol,
          host: req.get('host'),
        }) +
        '/policy/get/' +
        req.files.file[0].filename,
      file_path: req.files.file[0].path,

      thumbnail_url:
        url.format({
          protocol: req.protocol,
          host: req.get('host'),
        }) +
        '/policy/get/' +
        req.files.file1[0].filename,
      thumbnail_path: req.files.file1[0].path,
    }

    let result = await policy.create({ ...obj })
    let cat = await category.find().lean()
    let plc = await policy.find().lean()
    let a = await socket.sockets.emit('message', { type: 'policy'})
    res.render('policy.ejs', {
      data: {
        success: 'Policy Uploaded Successfully',
        category: cat,
        policy: plc,
      },
    })
  } catch (e) {
    console.log(e)
    res.json({ error: 'There is an error while creating policy' })
  }
}

const getPolicy = async (req, res) => {
  let cat = await category.find().lean()
  let pls = await policy.find().lean()
  return res.render('policy.ejs', {
    data: { category: cat, policy: pls },
  })
}

module.exports = { createPolicy, getFile , getPolicy }
