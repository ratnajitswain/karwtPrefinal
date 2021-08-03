var express = require('express');
var router = express.Router();
var userController = require('../../src/Controllers/userController')
var refService = require('../../src/services/refService')

router.get('/dashboard',async function (req, res){  
    let id = req.user.id
    let result = {}
    try {

        result = await userController.fetchUserDetailsById(id)
     

        let genRefCount = await refService.refCountfetch(result[0].userid)
                if(genRefCount.length != 0 ){  
                    result[0].gen1 = genRefCount[0]
                    result[0].gen2 = genRefCount[1]
                    result[0].gen3 = genRefCount[2]
                    result[0].gen4 = genRefCount[3]
                    result[0].gen5 = genRefCount[4]

                    result[0].totalPoints = (parseInt(genRefCount[0]) >= 3 ? parseInt(result[0].gen1)+parseInt(result[0].gen2)+parseInt(result[0].gen3)+parseInt(result[0].gen4)+parseInt(result[0].gen5) : 0 );
                    result[0].totalRef = result[0].gen1
                    result[0].refurl = req.headers.host+'/'+result[0].refid
                    
                }

           

        
    } catch (e) {
        console.log(e)
        
    }
    
   let details = result;
   res.cookie('details', details, {
    maxAge:1000*60*60*24*24,
    secure: false, 
    httpOnly: true,
  });
    res.render('userDashboard',{result:result})
})




router.get('/refCount',async function(req, res){  
    var result = {}
    try {
        result =await  refService.refCountfetch()
    } catch (e) {
        console.log(e)
    }
    res.send(result)
})

router.get('/fetch_userdetailsbyid',async function (req, res){  
    let id = req.user.id
  let  resp={}
    try {
        resp = await userController.fetchUserDetailsById(id)
    } catch (e) {
        console.log(e)
    }
    res.send(resp)
})
router.get('/fetch_refdetailsById',async function (req, res){  
    let id = req.user.id
    let  resp={}
      try {
          resp = await userController.fetchUserRefBy(id)
      } catch (e) {
        console.log(e)
      }
      console.log(resp)
      res.send(resp)
  })
  router.get('/fetch_vendorrefdetailsById',async function (req, res){  
    let id = req.user.id
    let  resp={}
      try {
          resp = await userController.fetchVendorRefBy(id)
      } catch (e) {
          console.log(e)
      }
      res.send(resp)
  })

module.exports = router;