var express = require("express");
var router = express.Router();
var adminController = require("../../src/Controllers/adminController");
var userController = require("../../src/Controllers/userController");

var vendorController = require("../../src/Controllers/vendorController");
var refService = require("../../src/services/refService");
var dbService = require("../../src/services/dbService");
var userController = require("../../src/Controllers/userController");
var { DateFormatter } = require("../../src/Utils/CommonUtils");

router.get("/dashboard", async function (req, res) {
  let id = req.user.id;
  let total;
  let total1;
  let total3;
  let result;
  try {
    let result1 = await adminController.getTotalRegisteredUsers();
    let result2 = await adminController.getRegisteredUsersForToday();
    result = await userController.fetchUserDetailsById(id);
    let details = result;
    res.cookie("details", details, {
      maxAge: 1000 * 60 * 60 * 24 * 24,
      secure: false,
      httpOnly: true,
    });
    let result3 = await adminController.viewVendorList();
    total = result1[0].count;
    total1 = result2[0].count;
    total3 = result3.length;
    console.log(result1, result2, result);
  } catch (e) {
    console.log(e);
  }

  res.render("adminDashboard", {
    result: result,
    totalUsers: total,
    todayRegistered: total1,
    totalVendor: total3,
  });
});

router.get("/manageUsers", async function (req, res) {
  let result = req.cookies.details;
  res.render("manageUser", { result: result });
});
router.get("/manageVendors", async function (req, res) {
  let result = req.cookies.details;
  res.render("manageVendor", { result: result });
});

router.get("/userChart", async function (req, res) {
  let resp = {};
  let resp1 = {};
  try {
    let query = {
      text: `select * from fetch_userRegdChart('user') order by count_date asc`,
    };
    resp = await dbService.execute(query);
    resp.forEach((s) => {
      s.date = DateFormatter.getStringDate(s.count_date);
    });
    let query1 = {
      text: `select * from fetch_userRegdChart('vendor') order by count_date asc`,
    };
    resp1 = await dbService.execute(query1);
    resp1.forEach((s) => {
      s.date = DateFormatter.getStringDate(s.count_date);
    });
  } catch (e) {
    console.log(e);
  }

  let result = [resp, resp1];
  res.send(result);
});

router.get("/fetchUserList", async function (req, res) {
  var result = {};
  try {
    result = await adminController.viewUserList();
    console.log(result);
    if (result.length != 0) {
      for (i = 0; i < result.length; i++) {
            result[i].gen2to5 =
              parseInt(result[i].gen2) +
              parseInt(result[i].gen3) +
              parseInt(result[i].gen4) +
              parseInt(result[i].gen5);
          
        
        result[i].totalPoints =
          parseInt(result[i].gen1) >= 3
            ? result[i].total
            : 0;
        result[i].userref =
          '<a href="javascript:void();" onclick="fetch_refDetailsById(\'' +
          result[i].userid +
          '\')"><i class="fa fa-plus"></i>&nbsp&nbsp&nbsp</a>&nbsp&nbsp;<a href="javascript:void();" onclick="vendorRefBy(\'' +
          result[i].userid +
          '\')"><i class="fas fa-store"></i></a>';

        result[i].action =
          '&nbsp&nbsp;<a href="javascript:void();" onclick="viewUser(\'' +
          result[i].userid +
          '\')"><i class="fa fa-search"></i></a>' +
          '&nbsp&nbsp;<a href="javascript:void();" onclick="deleteUser(\'' +
          result[i].useremail +
          '\')"><i class="fa fa-trash"></i></a>';

        if (result[i].userstatus == "0") {
          result[i].status =
            '<a href="javascript:void();" onclick=active(\'' +
            result[i].useremail +
            '\',1)><i class="fas fa-toggle-on"></i></a>';
        } else {
          result[i].status =
            '<a href="javascript:void();" onclick="active(\'' +
            result[i].useremail +
            '\',0)"><i class="fas fa-toggle-off"></i></a>';
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
  console.log(result);
  res.json(result);
});

router.get("/fetch_vendorrefdetailsById", async function (req, res) {
  var resp = {};
  let id = req.query.id;
  try {
    resp = await userController.fetchVendorRefBy(id);
  } catch (e) {
    console.log(e);
  }
  resp.message = "hghgjhgjhjdtgytddy";
  console.log(resp);
  res.send(resp);
});

router.get("/fetch_refDetailsById", async function (req, res) {
  var result = {};
  var id = req.query.id;
  try {
    let query = {
      text: "select * from fetch_refdetails($1)",
      values: [parseInt(id)],
    };
    result = await dbService.execute(query);

    if (result.length != 0) {
      for (i = 0; i < result.length; i++) {
       
            result[i].gen2to5 =
              parseInt(result[i].gen2) +
              parseInt(result[i].gen3) +
              parseInt(result[i].gen4) +
              parseInt(result[i].gen5);
        
        
        result[i].totalPoints =
        result[i].totalPoints =
          parseInt(result[i].gen1) >= 3
            ? result[i].total
            : 0;
        result[i].userref =
          '<a href="javascript:void();" onclick="fetch_refDetailsById(\'' +
          result[i].userid +
          '\')"><i class="fa fa-plus"></i></a>';
      }
    }
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/activeuser", async function (req, res) {
  var result = {};
  try {
    let query = {
      text: 'update tbl_user_mstr set "TUM_User_Status"=$1 where "TUM_User_Email"=$2',
      values: [parseInt(req.query.status), req.query.email],
    };
    result = await dbService.execute(query);
    let query1 = {
      text: 'update login_detail set "Status"=$1 where "Email"=$2',
      values: [parseInt(req.query.status), req.query.email],
    };
    let result1 = await dbService.execute(query1);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/activevendor", async function (req, res) {
  var result = {};
  try {
    let query = {
      text: 'update tbl_vendor_mstr set "TVM_Vendor_Status"=$1 where "TVM_Vendor_Email"=$2',
      values: [parseInt(req.query.status), req.query.email],
    };
    result = await dbService.execute(query);
    let query1 = {
      text: 'update login_detail set "Status"=$1 where "Email"=$2',
      values: [parseInt(req.query.status), req.query.email],
    };
    let result1 = await dbService.execute(query1);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/fetchVendorList", async function (req, res) {
  let result = [];
  try {
    result = await adminController.viewVendorList();

    if (result.length != 0) {
      result.forEach((i) => {
        i.action =
          '&nbsp&nbsp;<a href="javascript:void();" onclick="viewVendor(\'' +
          i.vendoremail +
          '\')"><i class="fa fa-search"></i></a>' +
          '&nbsp&nbsp;<a href="javascript:void();" onclick="deleteVendor(\'' +
          i.vendoremail +
          '\')"><i class="fa fa-trash"></i></a>';

        if (i.vendorstatus == "0") {
          i.status =
            '<a href="javascript:void();" onclick=active(\'' +
            i.vendoremail +
            '\',1)><i class="fas fa-toggle-on"></i></a>';
        } else {
          i.status =
            '<a href="javascript:void();" onclick="active(\'' +
            i.vendoremail +
            '\',0)"><i class="fas fa-toggle-off"></i></a>';
        }
      });
    }
  } catch (e) {
    console.log(e);
  }

  res.send(result);
});

router.get("/fetch_vendordetailsbyid", async function (req, res) {
  let resp = {};
  let id = req.query.id;
  try {
    resp = await vendorController.fetchVendorDetailsById(id);
  } catch (e) {
    console.log(e);
  }
  console.log("66666666666666", resp);
  res.send(resp);
});

router.get("/fetch_userdetailsbyid", async function (req, res) {
  let resp = {};
  let id = req.query.id;
  try {
    resp = await userController.fetchUserDetailsById(id);
  } catch (e) {}
  res.send(resp);
});

router.get("/deleteUserById", async function (req, res) {
  let result = [];
  try {
    result = await adminController.deleteUserById(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/deleteVendorById", async function (req, res) {
  let result = [];
  try {
    result = await adminController.deleteVendorById(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.post("/createBlog", async function (req, res) {
  let result = [];
  try {
    result = await adminController.createBlog(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/manageBlogs", function (req, res) {
  let result = req.cookies.details;
  res.render("manageBlog", { result: result });
});

router.get("/fetchBlogList", async function (req, res) {
  let result = [];
  try {
    result = await adminController.fetchBlogList();

    result.forEach((item) => {
      item.action =
        '&nbsp&nbsp;<a href="javascript:void();" onclick="editblog(\'' +
        item.blog_id +
        '\')"><i class="fa fa-edit"></i></a>' +
        '&nbsp&nbsp;<a href="javascript:void();" onclick="deleteBlog(\'' +
        item.blog_id +
        '\')"><i class="fa fa-trash"></i></a>';
    });
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/deleteBlog", async function (req, res) {
  let result = {};
  try {
    result = await adminController.deleteBlog(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.get("/editBlog", async function (req, res) {
  let result = {};
  try {
    result = await adminController.editBlog(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.post("/updateBlog", async function (req, res) {
  console.log(req.body);
  let result = {};
  try {
    result = await adminController.updateBlog(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

var Multer = require("multer");
const { query } = require("express");
var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public/uploads/blogimages");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});

const upload = Multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

router.post("/imageUpload", upload.single("upload"), async function (req, res) {
  // var files = req.files;
  // console.log(files)
  let url = "/uploads/blogimages/" + req.file.filename;
  console.log(url);
  res.send({ url: url });
});

// router.post("/editref", async (req, res) => {
//     let resp = {}
//   try {
//     let query = {
//         text:'select "TUM_User" from tbl_user_mstr where "TUM_User_Email"=$1 or "TUM_User_Email"=$2 ORDER BY "TUM_User_CreatedOn"',
//         values:[req.body.uemail,req.body.remail]
//     }
//     resp = await dbService.execute(query)
//     console.log(resp)
//     if(resp.length != 2){
//         res.status(401).send('Email not found')
//     }
//     else{
        
//         let query1 = {
//             text:'update tbl_user_mstr set "TUM_User_Ref_By"=$1 where "TUM_User"=$2',
//             values: [parseInt(resp[0].TUM_User),parseInt(resp[1].TUM_User)]
//         }
//         resp = await dbService.execute(query1)
//         res.status(200)
//     }
//   } catch (err) {
//     res.status(500).send(err);
//   }
// });

module.exports = router;
