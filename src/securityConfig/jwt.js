const jwt = require('jsonwebtoken');
require('dotenv').config();

const getToken =async function (data) {
  let jwtSecretKey = process.env.APP_SECRET;

    const token =await jwt.sign(data, jwtSecretKey);
    return token;
}

const Authenticate = async function (req,res,next) {
    let token = req.cookies.token;
    let jwtSecretKey = process.env.APP_SECRET;
    try {
        const verified = await jwt.verify(token, jwtSecretKey);
        if(verified){
            req.user = verified
          next();
        }else{
            return res.redirect('/');
        }
    } catch (error) {
        return  res.redirect('/');
    }
}
const adminAuthenticate = async function (req,res,next) {
    let token = req.cookies.token;
    let jwtSecretKey = process.env.APP_SECRET;
    try {
        const verified = await jwt.verify(token, jwtSecretKey);
        if(verified){
            req.user = verified
            if(req.user.userType == 'admin'){
                next();
            }else{
                return res.redirect('/logout');
            }
          
        }else{
            return res.redirect('/');
        }
    } catch (error) {
        return  res.redirect('/');
    }
}

module.exports = { Authenticate, getToken,adminAuthenticate };