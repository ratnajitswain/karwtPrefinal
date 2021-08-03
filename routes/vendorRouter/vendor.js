var express = require('express');
var router = express.Router();
var vendorController = require('../../src/Controllers/vendorController')
var commonController = require('../../src/Controllers/commonController')

router.get('/dashboard',async function (req, res){
  
  var result = {  }
  try {
    result = await vendorController.fetchVendorDetailsById(req.user.userEmail)
    
  } catch (e) {
    console.log(e)
  }
  let details = result

  res.cookie('details', details, {
   maxAge:1000*60*60*24*24,
   secure: false, 
   httpOnly: true,
 });
console.log(result)
    res.render('vendorDashboard',{result:result})

})




router.get('/fetch_vendordetailsbyid',async function (req, res){  
  let  resp={ }
    let id = req.user.userEmail
    try {
        resp = await vendorController.fetchVendorDetailsById(id)
    } catch (e) {
        
    }
    res.send(resp)
})


module.exports = router;