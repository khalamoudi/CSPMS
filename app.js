// importing express library
const express = require('express')
// use express module to create rest5 API's
const app = express()
const path = require('path')
// using cores for cross origin request
const cors = require('cors')
// use body parser to convet request into json
const bodyParser = require('body-parser')
const logger = require('morgan')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport')
const dotenv = require('dotenv');
const mongoose = require('mongoose')
var http = require('http').createServer(app)
const cluster = require("cluster"); 
const cpus = require("os").cpus().length;

// configure enviroment variables
dotenv.config();


//importing the routers
const categoryRoute = require('./routes/categoryRouter')
const departmentRoute = require('./routes/departmentRouter')
const policyRouter = require('./routes/policyRouter')
const pendingpolicyRouter = require('./routes/pendingpolicyRouter')
const authRouter = require('./routes/authRouter')
const usersRouter = require('./routes/usersRouter')

//importing the modules
const departmentModel = require('./models/department')
const categoryModel = require('./models/category')
const policyModel = require('./models/policy')

//////////////////////////////////////////////////////////////////

const db = require('./Config/keys')
const port = 3000


/////// To connecte with mongoose database
console.log("MongoURI", db.MongoURI)
mongoose.connect(db.MongoURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
}).catch(e => {
  console.log(e);
});

//Node's process ends, close the MongoDB connection
process.on('SIGINT',  () => {
  mongoose.connection.close( () => {
      console.log("Database disconnected through app termination")
      process.exit(0);
  })
})


//app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Middlewares => before and after request
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(
  express.urlencoded({
    extended: false,
  }),
)

// Serve Static Files from /public
app.use(express.static(path.join(__dirname, 'public')))

app.use(session({
  name: 'sessionId',
  secret: "khalid",
  saveUninitialized: false, // don't create sessions for not logged in users
  resave: false, //don't save session if unmodified

  // Where to store session data
  store: MongoStore.create({
      mongoUrl: db.MongoURI
  }),

  // cookies settings
  cookie: {
      secure: false,
      httpOnly: false, // if true, will disallow JavaScript from reading cookie data
      expires: new Date(Date.now() + 60 * 60 * 1000) // 1 hour;
  }
}))
// Passport Config
require('./Config/passport')(passport); // pass passport for configuration
// Passport init (must be after establishing the session above)
app.use(passport.initialize());
app.use(passport.session());


app.use(function (req, res, next) {
  res.locals.user = req.user || null;
  // res.locals is an object available to ejs templates. for example: <%= user %>
  next();
})

// Routes ----------------------------------------------
app.use('/', require('./routes/pages'))
app.use('/home', require('./routes/homePage'))
app.use('/department', departmentRoute)
app.use('/category', categoryRoute)
app.use('/policy', policyRouter)
app.use('/pendingpolicy',pendingpolicyRouter)
app.use('/auth', authRouter)
app.use('/user', usersRouter)


app.get('/home', async (req, res) => {
  let category = await categoryModel.find().lean()
  let material = await policyModel.find().lean()
  return res.render('policy.ejs', {
    data: { category: category, material: material },
  })
})



app.get('/test', async (req, res)=> {
  res.send('Hello World')
})

app.get('/departmenttest', async (req, res) => {
  let dep = await departmentModel.find().lean()
  if (dep.length >0)
  {res.send("Working DEPARTMENT")}
  else{res.send("Not Working")}
})
app.get('/categorytest', async (req, res) => {
  let category = await categoryModel.find().lean()
  if (category.length >0)
  {res.send("Working CATEGORY")}
  else{res.send("Not Working")}
})

// using socket .io for realtime connection if server to the client
const io = require('socket.io')(http)
  
//function us used to connect client with server
io.on('connection', (socket) => {
  console.log('connected...')

  //socket.emit("message","messege recieve")
})

const socketConnection = io

module.exports.sockets = socketConnection

/*
http.listen(port, function () {
  console.log(`listening on port ${port}...`)
})*/

if (cluster.isMaster) {
  // Checking whether the current cluser is master or not.Boolean value is returned
  console.log("Master CPU - ", process.pid);

  for (var i = 0; i < cpus; i++) {
    cluster.fork(); // Forking a new process from the cluster
  }

  cluster.on("exit", (worker) => {
    console.log("Worker Process has died - " + process.pid); // Process that exited/died.
    console.log("Process Remaining - " + Object.keys(cluster.workers).length); // Prints the number of running workers at any instance
    console.log("Starting New Working");
    cluster.fork(); // Creating a new process again after the previous process exited so that max number of cpus are utilised.
    console.log("Process Remaining - " + Object.keys(cluster.workers).length);
  });
} else {
  http
    .listen(port, function (){
      
        message = `Running Process: ${process.pid}`;
        console.log(message);
    });
}


