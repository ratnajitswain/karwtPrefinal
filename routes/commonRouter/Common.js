
var express = require('express');
var router = express.Router();
var commonController = require('../../src/Controllers/commonController')


  router.get('/fetchBlogList',async function(req, res, next) {

    var result = {}
    try {
        result =await commonController.fetchBlogList()
    } catch (e) {
        console.log(e)
        
    }
   
    res.send(result)
  
  })
  router.get('/fetchBlogListSearch',async function(req, res, next) {

    var result = {}
    try {
        result =await commonController.fetchBlogListSearch(req)
    } catch (e) {
        console.log(e)

        
    }
    
    res.send(result)
  
  })

  router.get('/posts',async function(req, res, next) {

    var result = {}
    try {
        result =await commonController.fetchBlogById(req)
    } catch (e) {
        console.log(e)

        
    }
    var result1 = req.cookies.details
    result1[0].userType = req.user.userType
    res.render('posts',{blog:result,result: result1})
  
  })

  module.exports = router