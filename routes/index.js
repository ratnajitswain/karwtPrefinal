var express = require('express');
var router = express.Router();
var commonController = require('../src/Controllers/commonController')
var adminController = require('../src/Controllers/adminController')
var {sign,verify} = require('jsonwebtoken');
const { base64encode, base64decode } = require('nodejs-base64');
const mailService    = require('../src/services/mailService')
/* GET home page. */
router.get('/',async function(req, res, next) {

const token = req.cookies.token
if(!token) {
  res.render("index")
}
else{
let user = await verify(token, process.env.APP_SECRET)
console.log(user)
let url = {}
  url = '/'+user.userType+'/dashboard'
  res.redirect(url)
}
})




router.get('/about',async function(req, res, next){  
  res.render('about')
})

router.get('/contact',async function(req, res, next){  
  res.render('contact')
})
/* GET home page. */





router.get('/fetchAllStates',async function(req, res, next) {
  var result = {}
   try {
     result = await commonController.fetchAllStates()
   } catch (e) {
     console.log(e)
   }
   res.send(result)
   // res.render('index', { title: 'Express' });
 });


 router.post('/contactus',async function(req, res) {
   let resp  = {}
   try{
   resp = await mailService.emailsent(
    { res: req.body },
    "contact@karwt.com",
    "./views/contactusemail.ejs"
  );
   }catch(e){
     console.log(e)
   }
   res.send(req.body)
 })


 
router.get('/fetchDistByStateId',async function(req, res, next) {
  var result = {}
   try {
     result = await commonController.fetchDistByStateId(req)
   } catch (e) {
     console.log(e)
   }
   res.send(result)
   // res.render('index', { title: 'Express' });
 });

 router.get('/fetchConstByDistId',async function(req, res, next) {
  var result = {}
   try {
     result = await commonController.fetchConstByDistId(req)
   } catch (e) {
     console.log(e)
   }
   res.send(result)
   // res.render('index', { title: 'Express' });
 });

 router.get('/otpverify',async function(req, res, next) {
  var response = {}
  req.session.otp = ""
   try {
    response = await commonController.otpsent(req)
   } catch (e) {
     console.log(e)
   }
   console.log(response)
   res.send(response)
 });
 router.get('/otpcheck',async function(req, res, next) {
  var response = {}
console.log(req.session.otp==base64encode(req.query.otp))
  try{  
    if(req.session.otp==base64encode(req.query.otp)){  
      response.message ='success'
      req.session.otp = ''
      res.send(response)
    }else{  
     response.message = 'failed'
     res.send(response)
    }
  }
  catch(e){
    console.log(e)
  }
   
   console.log(response)
   
 });



module.exports = router;
