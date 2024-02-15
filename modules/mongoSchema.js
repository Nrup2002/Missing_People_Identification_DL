const mongoose = require("mongoose");
const { NumberInstance } = require("twilio/lib/rest/pricing/v2/number");


// missingPerson schema 
const missingSchema = new mongoose.Schema({
    name : {
        type : String,
        require : true
    },
    age : {
        type : Number,
        require : true
    },
    gender : {
        type : String,
        require : true
    },
    incidentPlace : {
        type : String,
    },
    registrationDate : {
        type : Date,
        require : true
    },
    policeStation : {
        type : String,
        require : true
    },
    district : {
        type : String,
        require : true
    },
    image : {
        type : String,
        require : true
    }
});


// facedata schema
const faceDataSchema = new mongoose.Schema({
    imageFileName: {
        type: String,
        required: true,
    },
    faceDescriptor: {
        type: Array, // Store the face descriptor as an array
        required: true,
    },
});


// informed info schema
const informedInfoSchema = new mongoose.Schema({
    missingId : {
        type : String,
        required : true
    },
    informer : [{
        name : {
            type : String,
            required : true
        },
        phone : {
            type : Number,
            required : true
        },
        location : {
            type : {
                type : String,
                enum : ['Point']
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
            }
        },
        otherInfo : {
            type : String
        }
    }]
});

informedInfoSchema.index({ location: '2dsphere' });



//Model
const missingPerson = mongoose.model("missingPeopleData", missingSchema);

const FaceData = mongoose.model("FaceData", faceDataSchema);

const informedInfo = mongoose.model("informedInfo", informedInfoSchema);

module.exports = {
    missingPerson ,
    FaceData,
    informedInfo
};