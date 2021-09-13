// importing express library
const express = require('express')
// use express module to create rest5 API's
const app = express()
const path = require('path')
// using cores for cross origin request
const cors = require('cors')
// use body parser to convet request into json
const bodyParser = require('body-parser')

//////////////////////////////////////////////////////////////////
const mongoose = require('mongoose')
const db=require('./Config/keys')
const port = 3000
var http = require('http').createServer(app)

/////// To connecte with mongoose database
console.log("MongoURI",db.MongoURI)
mongoose.connect(db.MongoURI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  }).catch(e => {
    console.log(e);
  })
  //app.use(expressLayouts)
  app.set('view engine', 'ejs')
  app.set('views', path.join(__dirname, 'views'))
  
  // Serve Static Files from /public
  app.use(express.static(path.join(__dirname, 'public')))
  app.use(cors())
  app.use(bodyParser.json())
  app.use(
    express.urlencoded({
      extended: false,
    }),
  )
  
  // Routes ----------------------------------------------
  app.use('/', require('./routes/pages'))

 
  app.use('/home', require('./routes/homePage'))
  
  
  http.listen(port, function () {
    console.log(`listening on port ${port}...`)
  })
  
  
  