var express = require('express');
var router = express.Router();
var commonController = require('../src/Controllers/commonController')
var adminController = require('../src/Controllers/adminController')
var jwt = require('jsonwebtoken');
const { base64encode, base64decode } = require('nodejs-base64');
/* GET home page. */
router.get('/',async function(req, res, next) {
var token = req.cookies.token
console.log(token)
if(!token) {
  console.log('jkujkjhjhghjghjghjghjghjg')
  res.render("index")
}
else{

  const decrypt = await jwt.verify(token, process.env.APP_SECRET);
req.session.userType = decrypt.User_Type;
req.session.userEmail = decrypt.Email;
console.log(decrypt)
let url = {}

  url = '/'+decrypt.User_Type+'/dashboard'
  res.redirect(url)
// res.send(states)
}
})




router.get('/about',async function(req, res, next){  
  res.render('about')
})

router.get('/contact',async function(req, res, next){  
  res.render('contact')
})
/* GET home page. */


router.get('/fetchBlogs',async function(req, res, next){  
  let result = []
  try {

      result =await adminController.fetchBlogList()
      
  } catch (e) {
      console.log(e)
  }
  res.send(result)
})



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
