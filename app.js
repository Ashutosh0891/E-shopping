const express = require('express')

const app = express()

const bodyParser = require('body-parser')

const adminRoutes = require('./routes/admin')

const shopRoutes = require('./routes/shop')

const authRoutes = require('./routes/auth')

const path = require('path')

const errorControllers = require('./controllers/error')

const session = require('express-session');

const MongoDbStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb+srv://Ashutosh:Ashu%400891@cluster0.nk9ekdo.mongodb.net/shop'

const csrf = require('csurf');

const flash = require('connect-flash');

const multer = require('multer')

const mongoose = require('mongoose')
mongoose.set('strictQuery', false);

const User = require('./models/user');

const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: 'sessions'
})

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images")
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString + '-' + file.originalname);
  }
});

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==='image/png' || file.mimetype==='image/jpg' || file.mimetype==='image/jpeg'){
    cb(null,true)
  }
  else{
    cb(null,false)
  }
};

app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(bodyParser.urlencoded({ extended: false })) //Body-parser is the Node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it.
app.use(
  multer({ storage: fileStorage,fileFilter:fileFilter }).single('image')
); //middleware that handles file as input to upload file
//dest is used for destination directory

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname,'images')))

//resave and saveUninitialized set to false -sessions shouldnt be saved on any other http request
app.use(
  session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store })
)

app.use(csrfProtection);
app.use(flash())

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then(user => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch(err => {
      next(new Error(err)) //inside of async req i.e callbacks or promises error handling to be done in next
    });
});

//res.locals send info to every view using middleware
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;   //middleware to check whether user session is active or not
  res.locals.csrfToken = req.csrfToken();  //to check whether view have recieved csrf token or not
  next();
})


app.use('/admin', adminRoutes)
app.use(shopRoutes)
app.use(authRoutes)

app.get("/500", errorControllers.get500Page);

app.use(errorControllers.get404Page)


app.use((error, req, res, next) => {                  //error handling middleware
  // res.status(error.httpStatusCode).render(...);
  // res.redirect('/500');
  res.status(500).render('500', {
    pageTitle: 'Error!',
    path: '/500',
    isAuthenticated: req.session.isLoggedIn
  });
  console.log(error)
});

mongoose.connect(MONGODB_URI)
  .then(result => {
    app.listen(3000)
    console.log('connected to mongo successfully')
  })
  .catch(err => {
    console.log(err)
  })

