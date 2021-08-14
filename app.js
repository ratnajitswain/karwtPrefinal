const express = require('express');
const path    = require('path');
const cors    = require('cors');
const csrf    = require('csurf');
const session = require('express-session');
const logger  = require('morgan');
const ejs     = require('ejs');
const flash   = require('express-flash');

const createError  = require('http-errors');
const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const compression  = require('compression');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {Authenticate,adminAuthenticate} = require('./src/securityConfig/jwt')
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(compression());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'starlord#6',
  name: 'session',
  saveUninitialized: true,
  proxy: true,
  resave: false,
  sameSite: 'lax',
  saveUninitialized: true,
  cookie:{
    httpOnly: true,   
    secure: process.env.NODE_ENV === 'production',   
    maxAge:1000*60*60*24*24
  }
}));

/**************Web Router Paths***************/
app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(express.static(path.join(__dirname, 'public')));
                                                                                                                          
app.use('/logout',Authenticate, function(req, res, next) {

  if(req.user){
      req.session.sessionFlash ={
      type:'success',
      message:"Log Out successfull"
    }
    
    req.session.destroy()
    res.clearCookie('token');
    res.clearCookie('details');
    res.redirect('/'); 
    
  }else{
     req.session.sessionFlash ={
      type:'warning',
      message:"Unknown Error..Try After SomeTime"
    }
    res.redirect('#');
  }
  
});
app.get('/favicon.ico', (req, res) => res.status(204));


/**************************Admin Routes**************************** */


var userRouter = require('./routes/userRouter/user');
var vendorRouter = require('./routes/vendorRouter/vendor');
var commonRouter = require('./routes/commonRouter/Common');
var login = require('./routes/users');

app.use('/user',Authenticate,userRouter)
app.use('/vendor',Authenticate,vendorRouter)
app.use('/common',Authenticate,commonRouter)
app.use('/login',login)


var adminRouter = require('./routes/adminRouter/admin');

app.use('/admin/',adminAuthenticate,adminRouter)



//catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req.url)
  let ref = (req.url).trim().substring(1)
  if(ref.length == 8){  
    console.log(ref)
    req.session.refId = ref 
  }
  
  res.redirect('/')
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log("ENV:"+req.app.get('env'))
  if (Object.prototype.isPrototypeOf.call(Error.prototype, err)) {
    return res.status(err.status || 500).render('error',{message:res.locals.message});
  }
  console.error('~~~ Unexpected error exception start ~~~');
  console.error(err);
  console.error('~~~ Unexpected error exception end ~~~');
  res.status(500).render('error',{message:res.locals.message});
});

module.exports = app;