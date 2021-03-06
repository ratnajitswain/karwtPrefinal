var fs = require("fs");
var ejs = require("ejs");
var dbService = require("../../src/services/dbService");
const { Encrypt, Decrypt } = require("../../src/securityConfig/crypto");
const { base64encode, base64decode } = require("nodejs-base64");
const { clearCache } = require("ejs");
const DateFormatter = require("../Utils/CommonUtils");
const {Authenticate} = require("../securityConfig/jwt")
const { parse } = require("dotenv");
const mailService = require("../services/mailService");
const commonController = {
  fetchAllStates: async function (req, res, next) {
    let result = {};
    try {
      let query = {
        text: "select * from tbl_states_mstr",
        values: [],
      };
      result = await dbService.execute(query);
    } catch (e) {
      console.log(e);
    }
    return result;
  },
  fetchDistByStateId: async function (req, res, next) {
    let result = {};
    let stateId = parseInt(req.query.id);

    try {
      let query = {
        text: 'select * from tbl_dist_mstr where "TDM_State" = $1',
        values: [stateId],
      };
      result = await dbService.execute(query);
    } catch (e) {
      console.log(e);
    }
    return result;
  },
  fetchConstByDistId: async function (req, res, next) {
    let result = [];
    let distId = parseInt(req.query.id);

    try {
      let query = {
        text: 'select * from tbl_const_mstr where "TCM_Dist" = $1',
        values: [distId],
      };

      result = await dbService.execute(query);
      console.log(result);
      if (result.length == 0) {
        let resp1 = await dbService.execute(
          'select "TDM_Dist_Name" from tbl_dist_mstr where "TDM_Dist"=' +
            parseInt(req.query.id)
        );
        result.push({ TCM_Const_Name: resp1[0].TDM_Dist_Name, TCM_Const: "0" });
      }
    } catch (e) {
      console.log(e);
    }

    return result;
  },
  otpsent: async function (req) {
    var resp = {};
    var result = [];
    var characters = "1234567890";
    var charactersLength = characters.length;
    for (var i = 0; i < 5; i++) {
      result.push(
        characters.charAt(Math.floor(Math.random() * charactersLength))
      );
    }
    var otp = result.join("");
    req.session.otp = base64encode(otp);

    console.log(otp);

    try {
      resp.response = await mailService.emailsent(
        { otp: otp },
        req.query.email,
        "./views/emailtemp.ejs"
      );
      const re =
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      var x = re.test(req.query.email);
      if (x) {
        resp.message = "success";
      } else {
        resp.message = "invalid";
      }
    } catch (e) {
      console.log(e);
    }

    return resp;
  },
  fetchBlogList: async function (req) {
    var resp = {};

    try {
      let query = {
        text: 'select * from admin_blogs where "DeletedFlag" = 0  order by "CreatedOn" desc',
        values: [],
      };
      resp = await dbService.execute(query);
      if (resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
          resp[i].CreatedOn = await DateFormatter.DateFormatter.getStringDate(
            resp[i].CreatedOn
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
    return resp;
  },

  fetchBlogListSearch: async function (req) {
    var resp = {};

    try {
      resp = await dbService.execute(
        `select * from admin_blogs where "blog_Title" like '${req.query.blog}%' and  "DeletedFlag" = 0  order by "CreatedOn" desc`
      );
      if (resp.length > 0) {
        for (i = 0; i < resp.length; i++) {
          resp[i].CreatedOn = await DateFormatter.DateFormatter.getStringDate(
            resp[i].CreatedOn
          );
        }
      }
    } catch (e) {
      console.log(e);
    }
    return resp;
  },
  fetchBlogById: async function (req) {
   

    try {
let query = {}
        var resp = {};
        if(!req.query.id){
            query = {
                text:'SELECT * FROM admin_blogs where "DeletedFlag" = 0  ORDER BY blog_id DESC LIMIT 1',
                values:[]

            };
        }else{  
    
        
      query = {
        text: 'select * from admin_blogs where "DeletedFlag" = 0  and blog_id = $1',
        values: [req.query.id],
      };
    }
      resp = await dbService.execute(query);
    } catch (e) {
      console.log(e);
    }
    return resp;
  },

  forgotPass: async function (req) {
    let password = await Encrypt(req.query.password);
    if (req.query.email == "" || req.query.email == null) {
      
      req.query.email = req.user.userEmail;
    }
    var resp = {};
    try {
      q = {
        text: `select "User_Type" from login_detail where "Email"=$1`,
        values: [req.query.email],
      };
      var usertype = await dbService.execute(q);
      console.log(usertype);

      q1 = {
        text: `update login_detail set "Password"=$1 where "Email"=$2`,
        values: [password, req.query.email],
      };
      resp = await dbService.execute(q1);

      if (usertype.User_Type == "user" || usertype.User_Type == "admin") {
        let q2 = {
          text: `update tbl_user_mstr set "TUM_User_Password"=$1 where "TUM_User_Email"=$2`,
          values: [password, req.query.email],
        };
        let resp1 = await dbService.execute(q2);
      }
      if (usertype.User_Type == "vendor") {
        let q2 = {
          text: `update tbl_vendor_mstr set "TVM_Vendor_Password"=$1 where "TVM_Vendor_Email"=$2`,
          values: [password, req.query.email],
        };
        let resp1 = await dbService.execute(q2);
      }
      resp.message = "success";
    } catch (e) {
      console.log(e);
    }
    return resp;
  },
  updateUserDetails: async function (req) {
    var data = req.body;
    var resp = {};
    try {
      if (data.image != "") {
        if (req.user.userType == "user" || req.user.userType == "admin") {
          let q2 = {
            text: `update tbl_user_mstr set "TUM_User_Name"=$1, "TUM_User_Image"=$2,"TUM_User_State"=$3,"TUM_User_District"=$4, "TUM_User_Constituency"=$5,"TUM_User_Address"=$6,"TUM_User_PINno"=$7 where "TUM_User_Email"=$8`,
            values: [
              data.name,
              data.image,
              parseInt(data.state),
              parseInt(data.dist),
              parseInt(data.const),
              data.address,
              data.pin,
              req.user.userEmail,
            ],
          };
          resp = await dbService.executeUpdate(q2);
        }
        if (req.user.userType == "vendor") {
          let q2 = {
            text: `update tbl_vendor_mstr set "TVM_Vendor_Name"=$1, "TVM_Vendor_Image"=$2,"TVM_Vendor_State"=$3,"TVM_Vendor_District"=$4, "TVM_Vendor_Constituency"=$5,"TVM_Vendor_Address"=$6,"TVM_Vendor_PINno"=$7 where "TVM_Vendor_Email"=$8`,
            values: [
              data.name,
              data.image,
              data.state,
              data.dist,
              data.const,
              data.address,
              data.pin,
              req.user.userEmail,
            ],
          };
          resp = await dbService.executeUpdate(q2);
        }
      } else {
        if (req.user.userType == "user" || req.user.userType == "admin") {
          let q2 = {
            text: `update tbl_user_mstr set "TUM_User_Name"=$1, "TUM_User_State"=$2,"TUM_User_District"=$3, "TUM_User_Constituency"=$4,"TUM_User_Address"=$5,"TUM_User_PINno"=$6 where "TUM_User_Email"=$7`,
            values: [
              data.name,
              data.state,
              data.dist,
              data.const,
              data.address,
              data.pin,
              req.user.userEmail,
            ],
          };
          resp = await dbService.executeUpdate(q2);
        }
        if (req.user.userType == "vendor") {
          let q2 = {
            text: `update tbl_vendor_mstr set "TVM_Vendor_Name"=$1, "TVM_Vendor_State"=$2,"TVM_Vendor_District"=$3, "TVM_Vendor_Constituency"=$4,"TVM_Vendor_Address"=$5,"TVM_Vendor_PINno"=$6 where "TVM_Vendor_Email"=$7`,
            values: [
              data.name,
              data.state,
              data.dist,
              data.const,
              data.address,
              data.pin,
              req.user.userEmail,
            ],
          };
          resp = await dbService.executeUpdate(q2);
        }
      }
    } catch (e) {
      console.log(e);
    }
    return resp;
  },
};

module.exports = commonController;
