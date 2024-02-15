require('dotenv').config();

const client = require('twilio')(process.env.TWILIO_SID,process.env.TWILIO_AUTH_TOKEN);

function sendSMS(req,res,phone,otp,missingId){
    client.messages
    .create({
        body: `Your OTP is : ${otp}`,
        to: phone, // Text your number
        from: process.env.TWILIO_SENDER_NUMBER, // From a valid Twilio number
    })
  .then((message) => console.log(message.sid))
  .catch((err)=>{
    console.log("sms error..",err);
    res.render("verification",{missingId : missingId, status :"phone number does not exist"});
  });
}

module.exports = {sendSMS};
