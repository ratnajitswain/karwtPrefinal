

var nodemailer = require('nodemailer');
const express = require('express');
const ejs = require('ejs');
var fs = require('fs');
const app = express();
const mailService = {  
    emailsent:async function(data,reciever,temppath){
        let resp = {}
        let transporter = nodemailer.createTransport({
            host: 'mail.karwt.com',
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USERNAME, // your domain email address
                pass: process.env.PASS // your password
            }
        });
        
      await  ejs.renderFile( temppath, data,async function (err, data) {
          if (err) {
              console.log(err);
          } else {
              var mainOptions = {
                  from: process.env.EMAIL,
                  to: reciever,
                  subject: 'Karwt Registration OTP',
                  html: data
              };
              console.log("html data ======================>", mainOptions.html);
            await  transporter.sendMail(mainOptions, function (err, info) {
                  if (err) {
                      console.log(err);
                      resp = err
                  } else {
                      resp = info.response
                  }
              });
          }
          
          });
          return resp
    }
    
}
module.exports = mailService