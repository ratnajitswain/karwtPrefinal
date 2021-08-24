var express = require("express");
var router = express.Router();
var userController = require("../../src/Controllers/userController");
var refService = require("../../src/services/refService");

router.get("/dashboard", async function (req, res) {
  let id = req.user.id;
  let result = {};
  try {
    result = await userController.fetchUserDetailsById(id);

    if (result.length != 0) {
      result[0].totalPoints = result[0].gen1 >= 3 ? result[0].total : 0;
      result[0].totalRef = result[0].gen1;
      result[0].refurl = "https://pre.karwt.com/" + result[0].refid;
    }
  } catch (e) {
    console.log(e);
  }

  let details = result;
  res.cookie("details", details, {
    maxAge: 1000 * 60 * 60 * 24 * 24,
    secure: false,
    httpOnly: true,
  });
  res.render("userDashboard", { result: result });
});



router.get("/fetch_userdetailsbyid", async function (req, res) {
  let id = req.user.id;
  let resp = {};
  try {
    resp = await userController.fetchUserDetailsById(id);
  } catch (e) {
    console.log(e);
  }
  res.send(resp);
});
router.get("/fetch_refdetailsById", async function (req, res) {
  let id = req.user.id;
  let resp = {};
  try {
    resp = await userController.fetchUserRefBy(id);
  } catch (e) {
    console.log(e);
  }
  console.log(resp);
  res.send(resp);
});
router.get("/fetch_vendorrefdetailsById", async function (req, res) {
  let id = req.user.id;
  let resp = {};
  try {
    resp = await userController.fetchVendorRefBy(id);
  } catch (e) {
    console.log(e);
  }
  res.send(resp);
});

module.exports = router;
