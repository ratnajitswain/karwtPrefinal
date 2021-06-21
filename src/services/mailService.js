

var nodemailer = require('nodemailer');

const mailService = {  
    sentEmail: async function(data) { 
        console.log('********',data) 
        var transporter = nodemailer.createTransport({
            host: 'mail.karwt.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL, // your domain email address
      pass: process.env.PASS // your password
    }
        });
        
        const mailOptions = {
            from: 'welcome@karwt.com', // sender address
            to: `${data.email}`, // list of receivers
            subject: 'KARWAT Registration', // Subject line
            html: `${data.message}`// plain text body
        };
        var message = ''
        transporter.sendMail(mailOptions, function (err, info) {
            if(err){  
                message = 'error'
                console.log(err)

            }
            else{  
                message = 'success'
                console.log(info);
            }
                
        })
      

        return message
    }
    
}
module.exports = mailService