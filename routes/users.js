var express = require("express");
var router = express.Router();
const { Decrypt } = require("../src/securityConfig/crypto");
const { Pool, Client } = require("pg");
const db = require("../src/Utils/dbConfig");
const { Authenticate } = require("../src/securityConfig/jwt");
var dbservice = require("../src/services/dbService");
var userController = require("../src/Controllers/userController");
var vendorController = require("../src/Controllers/vendorController");
var commonController = require("../src/Controllers/commonController");
var Multer = require("multer");
var { getToken } = require("../src/securityConfig/jwt");
var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    // Uploads is the Upload_folder_name
    cb(null, "public/uploads/userimages");
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

router.get("/checkpass", Authenticate, async function (req, res) {
  console.log(req.query.password)
  var result = {};
  try {
    let query = {
      text: 'select * from login_detail where "Email" = $1',
      values: [req.user.userEmail],
    };
    let resp = await dbservice.execute(query);
    if (resp.length > 0) {
      let password = await Decrypt(resp[0].Password);
      if ((password == req.query.password)) {
        result.message = "success";
      } else {
        result.message = "warning";
      }
    }
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.post(
  "/updateProfile",
  Authenticate,
  upload.single("profile-image"),
  async function (req, res) {
    var resp = {};

    if (req.file) {
      req.body.image = req.file.filename;
    } else {
      req.body.image = "";
    }

    try {
      result = await commonController.updateUserDetails(req);
    } catch (e) {
      console.log(e);
    }
    res.send(resp);
  }
);

router.get("/forgotpassword", async function (req, res) {
  var result = {};
  try {
    result = await commonController.forgotPass(req);
  } catch (e) {
    console.log(e);
  }
  res.send(result);
});

router.post("/createVendor", async function (req, res) {
  var result = {};
  try {
    result = await vendorController.createVendor(req);
  } catch (e) {
    console.log(e);
  }
  res.send({ message: result });
});

router.post("/signup", async function (req, res) {
  console.log(req.body);
  var result = {};
  try {
    result = await userController.createUser(req);
  } catch (e) {
    console.log(e);
  }
  res.send({ message: result });
});

router.get("/verifyEmailnMob", async function (req, res) {
  var email = req.query.email;
  var mobile = req.query.mobile;
  var client = new Client(db);
  console.log(email, mobile);
  try {
    client.connect();
  } catch (e) {
    res.send("Error while connecting to database");
  }

  const query = {
    text: 'select * from login_detail where "Email" = $1 or "Mobile" = $2',
    values: [email, mobile],
    rowAsArray: true,
  };
  try {
    client.query(query, async (err, resp) => {
      if (err) {
        res.send({ error: err });
        // errorLogger(err,query)
      } else if (resp) {
        if (resp.rowCount != 0) {
          resp.rowAsArray = true;
          console.log(resp.rows[0]);
          req.session.sessionFlash = {
            message: "Email or mobile already exist",
            type: "warning",
          };
          res.send(req.session.sessionFlash);
        } else {
          req.session.sessionFlash = {
            message: "Success",
            type: "success",
          };
          res.send(req.session.sessionFlash);
        }
      }

      await client.end();
    });
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/emailExistfor", async function (req, res) {
  var email = req.query.email;
  var mobile = req.query.mobile;
  var client = new Client(db);
  console.log(email, mobile);
  try {
    client.connect();
  } catch (e) {
    res.send("Error while connecting to database");
  }

  const query = {
    text: 'select * from login_detail where "Email" = $1 and "Mobile" = $2',
    values: [email, mobile],
    rowAsArray: true,
  };
  try {
    client.query(query, async (err, resp) => {
      if (err) {
        res.send({ error: err });
        // errorLogger(err,query)
      } else if (resp) {
        if (resp.rowCount != 0) {
          resp.rowAsArray = true;
          console.log(resp.rows[0]);
          req.session.sessionFlash = {
            message: "success",
            type: "success",
          };
          res.send(req.session.sessionFlash);
        } else {
          req.session.sessionFlash = {
            message: "Email or mobile not found",
            type: "warning",
          };
          res.send(req.session.sessionFlash);
        }
      }

      await client.end();
    });
  } catch (e) {
    res.status(500).send();
  }
});
router.post("/login", async function (req, res) {
  var email = req.body.email;
  let password = req.body.password;
  let resp = {};
  try {
    const query = {
      text: 'select * from login_detail where "Email" = $1 and "DeletedFlag"= 0 and "Status" = 0',
      values: [email],
    };
    resp = await dbservice.execute(query);
    if (resp.length != 0) {
      console.log(resp[0])
      let password1 = await Decrypt(resp[0].Password);
      if (password != password1) {
        console.log(resp[0]);
        req.session.sessionFlash = {
          message: "Invalid user credentials",
          type: "warning",
        };
        res.send(req.session.sessionFlash);
      } else {
        let userEmail = {};

        try {
          userEmail = await userController.fetchUserDetailsByEmail(
            resp[0].Email
          );
        } catch (e) {
          console.log(e);
        }

        var userObj = {
          id: userEmail[0].TUM_User,
          userType: resp[0].User_Type,
          userEmail: resp[0].Email,
        };
        const token = await getToken(userObj);
        console.log(token);
        res.cookie("token", token, {
          maxAge: 1000 * 60 * 60 * 24 * 24,
          secure: true, // set to true if your using https
          httpOnly: true,
        });
        let url = "/";
        res.send({ url: url });
      }
    } else {
      req.session.sessionFlash = {
        message: "Invalid user credentials",
        type: "warning",
      };
      res.send(req.session.sessionFlash);
    }
  } catch (e) {
    console.log(e);
  }
});
// res.send('respond with a resource');

module.exports = router;
