var refService = require('../services/refService')
var dbService = require('../../src/services/dbService');
const { base64encode, base64decode } = require('nodejs-base64');
const { clearCache } = require('ejs');
const vendorController = {


    

    createVendor: async function(req, res,next){ 
        let vendor = req.body
        var resp = {}
        valid = []

        
        var ref = req.session.refId
        
        

        var refu
        if(ref){  
            var refBy = {}

            try{  
                refBy = await refService.fetchRefBy(ref)
                refu = refBy[0].TUM_User 
            }
            catch(e){  
                console.log(e)
            }
        }
        else
        {  
            refu = '0'
          
        }

        

           
 
           let password = base64encode(req.body.password)
           try{   
                let query = {  
                    text:`INSERT INTO public.tbl_vendor_mstr(
                        "TVM_Vendor_Name", "TVM_Vendor_Password", "TVM_Vendor_Mobile", "TVM_Vendor_Email","TVM_Vendor_GST","TVM_Vendor_Business_Name","TVM_Vendor_Business_Type", "TVM_Vendor_Product_or_Service", 
                        "TVM_Vendor_State","TVM_Vendor_District","TVM_Vendor_Constituency", "TVM_Vendor_Address", "TVM_Vendor_PINno", "TVM_Vendor_Ref_By")
                        VALUES ($1, $2,$3 ,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
                    values:[vendor.name,password,vendor.mobile,vendor.email,vendor.gst,vendor.businessName,vendor.businessType,vendor.productservice,parseInt(vendor.state),parseInt(vendor.dist),parseInt(vendor.constituency),vendor.address,vendor.pin1,parseInt(refu)]
                }
                resp =await dbService.executeUpdate(query)
                if(resp=='success'){  
                    let query1 = {  
                        text:`INSERT INTO login_detail(
                            "Email","Mobile", "Password", "User_Type")
                            VALUES ($1, $2,$3,$4)`,
                        values:[vendor.email,vendor.mobile,password,'vendor']
                    }
                    let resp1 = await dbService.executeUpdate(query1)
                }
                

        }catch(e){  
            console.log(e)
        }

    
           return resp;

           
    },

    fetchVendorDetailsById: async function(id){  
        var resp = {}
 
        try {

            let query = {  
                text:'select * from fetch_vendordetailsbyid($1)',
                values:[id]
            } 
            resp = await dbService.execute(query)
            if(resp[0].userconst=='0'){  
                resp[0].userconst = resp[0].userdist
            }
        } catch (e) {
            console.log(e)
        }
        return resp
    
    }
    

}


module.exports = vendorController;