
var refService = require('../services/refService')
var dbService = require('../../src/services/dbService');
const { base64encode, base64decode } = require('nodejs-base64');
const { clearCache } = require('ejs');
const {DateFormatter} = require('../Utils/CommonUtils');

const adminController = {  
    viewUserList:async function (req, res, next){  
        var resp = {  }
 
         try {
 
             let query = {  
                 text:'select * from fetch_userList() ORDER BY userjoinedon asc',
                 values:[]
             } 
             resp = await dbService.execute(query)
             if(resp){  
                 resp.forEach(async(c)  => {
                     c.userjoinedon =await DateFormatter.getStringDate(c.userjoinedon)
                     if(c.userconst=='0'){  
                         c.userconst = c.userdist
                     }
                 });
             }
         } catch (e) {
             console.log(e)
         }
         console.log('***********',resp)
         return resp
     },


     viewVendorList:async function (req, res, next){  
        var resp = {  }
 
         try {
 
             let query = {  
                 text:'select * from fetch_vendorlist() order by vendorjoinedon asc',
                 values:[]
             } 
             resp = await dbService.execute(query)
             if(resp){  
                resp.forEach(async(c) => {
                    c.vendorjoinedon =await DateFormatter.getStringDate(c.vendorjoinedon)
                    if(c.vendorconst=='0'){  
                        c.vendorconst = c.vendordist
                    }
                });
            }
         } catch (e) {
             console.log(e)
         }
         return resp
     },

     getTotalRegisteredUsers:async function (req, res, next){  
        var resp = {  }
 
        try {
 
            let query = {  
                text:'select count(*) from login_detail where "DeletedFlag" = 0 AND "User_Type" = $1 AND "Status" = 0',
                values:['user']
            }
            resp = await dbService.execute(query)
         } catch (e) {
             console.log(e)
         }
         return resp
    },
     getRegisteredUsersForToday:async function (req, res, next){  
        var resp = {  }
 
        try {
            let today = new Date().toISOString();
            let dateFunction = await DateFormatter.getStringDate(today)
        
            let query = {  
                text:`select count(*) from login_detail where "Status" = 0 AND "DeletedFlag" = 0 AND TO_CHAR("CreatedOn" :: DATE, 'dd/mm/yyyy') = $1 AND "User_Type" = $2`,
                values:[dateFunction,'user']
            }
            resp = await dbService.execute(query)
         } catch (e) {
             console.log(e)
         }
         return resp
    },
     


     deleteUserById:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'update tbl_user_mstr set "TUM_User_DeletedFlag" = 1 where "TUM_User"=$1',
                 values:[req.query.id]
             } 
             let query1 = {  
                text:'update login_detail set "DeletedFlag" = 1 where "Email"=$1',
                values:[req.query.id]
            } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },



     deleteVendorById:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'update tbl_vendor_mstr set "TVM_Vendor_DeletedFlag"= 1 where "TVM_Vendor"=$1',
                 values:[parseInt(req.query.id)]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },

     createBlog:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'insert into admin_blogs("blog_Title","blog_Content") values($1,$2) ',
                 values:[req.body.blog_Title, req.body.blog_Content]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },

     fetchBlogList:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'select * from admin_blogs where "DeletedFlag" = 0  order by "CreatedOn" desc',
                 values:[]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },


     deleteBlog:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'update admin_blogs set "DeletedFlag"=1,"UpdatedOn"= now() where "blog_id" = $1',
                 values:[req.query.id]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },


     editBlog:async function (req){  
        var resp = {}
 
         try {
 
             let query = {  
                 text:'select * from admin_blogs where "blog_id" = $1',
                 values:[req.query.id]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },

     updateBlog:async function (req){  
        var resp = {}
   
        console.log(req.body)
 
         try {
 
             let query = {  
                 text:'update admin_blogs set "blog_Title"=$1, "blog_Content"=$2 where blog_id = $3',
                 values:[req.body.blog_Title,req.body.blog_Content,parseInt(req.body.blog_id)]
             } 
             resp = await dbService.execute(query)
 
         } catch (e) {
             console.log(e)
         }
         return resp
     },
     


}
module.exports = adminController