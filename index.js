// including required files and libraries
require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const fs = require("fs");
const faceapi = require('face-api.js');
const canvas = require('canvas');
const nodemailer = require("nodemailer");


// using single email for informing police
const informingEmail = process.env.INFORMING_EMAIL;


// including required modules
const { missingPerson , FaceData, informedInfo } = require("./modules/mongoSchema");
const { upload , store } = require("./modules/multerFunctions");
const { connectDB } = require("./modules/dbConnection");
const { transporter} = require("./modules/nodemailerSetup");
const { sendSMS } = require("./modules/smsSender");
const { sendMailToPolice } = require("./modules/emailSender");


// middlewares
const app = express();
app.use(express.urlencoded({extended: false}));
app.set("view engine", "ejs");
app.use(express.static("public"));


// constant URLs 
const PORT = 5000;


// other variables
var otpMap = new Map;
const policeEmail = "lalit.kondekar.cs@ghrce.raisoni.net";

otpMap.clear();


// faceapi setup and canvas setup 
faceapi.env.monkeyPatch({ Canvas: canvas.Canvas, Image: canvas.Image, ImageData: canvas.ImageData });

const modelsPath = './models'; // Replace with the path to your face-api.js models

Promise.all([
    faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
    faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
    faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath)
]).then(() => {
    console.log('loaded all the models from the disk')
})


//Routes
app.get("/",async (req,res)=>{
    const missingEntries = await missingPerson.find({});
    const informedEntries = await informedInfo.find({});
    const maleEntries = await missingPerson.find({gender : "male"});
    const femaleEntries = await missingPerson.find({gender : "female"});
    
    // lengths 
    const totalMissingEntries = missingEntries.length;
    const totalInformedEntries = informedEntries.length;
    const totalMaleEntries = maleEntries.length;
    const totalFemaleEntries = femaleEntries.length;

    res.render("home", {
        page_name : "home",
        totalMissingEntries : totalMissingEntries,
        totalInformedEntries : totalInformedEntries,
        totalMaleEntries : totalMaleEntries,
        totalFemaleEntries : totalFemaleEntries
    });
})

app.get("/search", (req,res)=>{
    res.render("search", {page_name : "search"});
})

app.get("/upload", (req,res)=>{
    res.render("upload", {message : "Register the missing person",page_name : "upload"});
})

app.post("/upload", (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log("upload error: ", err);
            return res.status(500).send("Upload error");
        }

        // Load the uploaded image using face-api.js
        const imageBuffer = fs.readFileSync(req.file.path);
        const image = new canvas.Image();
        image.src = imageBuffer;

        // Detect faces in the uploaded image and compute face descriptors
        const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
        const faceDetectionResults = await faceapi.detectAllFaces(image, faceDetectionOptions)
            .withFaceLandmarks()
            .withFaceDescriptors();

        if (faceDetectionResults.length === 0) {
            // No face detected, delete the uploaded image and send a message
            fs.unlinkSync(req.file.path); // Delete the image
            return res.render("upload", { message: "No face detected in the uploaded image.",page_name: "upload" });
        }

        // Use the face descriptor from the uploaded image for matching
        const uploadedImageDescriptor = faceDetectionResults[0].descriptor;

        // Query the database to find matching face descriptors
        const matchingImages = await FaceData.find({}).exec();

        for (const entry of matchingImages) {
            const storedImageDescriptor = entry.faceDescriptor; // No need for new faceapi.FaceDescriptor()
            const distance = faceapi.euclideanDistance(uploadedImageDescriptor, storedImageDescriptor);

            // You can adjust the threshold for matching
            if (distance < 0.4) {
                fs.unlinkSync(req.file.path); // Delete the image
                return res.render("upload", { message: "The person in image already exist.",page_name: "upload" });
            }
        }

        // Face detected, proceed with storing missing person's entry
        const entry = new missingPerson({
            name: req.body.name.toLowerCase(),
            age: req.body.age,
            gender: req.body.gender,
            registrationDate: req.body.registrationDate,
            incidentPlace: req.body.incidentPlace.toLowerCase(),
            policeStation: req.body.policeStation.toLowerCase(),
            district: req.body.district.toLowerCase(),
            image: req.file.filename,
        });

        entry
            .save()
            .then(() => {
                console.log("upload successful.");

                // Store the face descriptor in the FaceData schema
                const uploadedImageDescriptor = faceDetectionResults[0].descriptor;
                const faceDataEntry = new FaceData({
                    imageFileName: req.file.filename,
                    faceDescriptor: Array.from(uploadedImageDescriptor), // Convert the descriptor to an array
                });

                faceDataEntry
                    .save()
                    .then(() => console.log("Face data stored successfully."))
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));

        res.redirect("/");
    });
});

app.get("/all", async(req,res)=>{
    const people = await missingPerson.find({});
    const list = `
    <h3>All Missing people</h3>
    <ol>
    ${people.map((person)=>{
        return `<li>
        <div>
        <p>${person.name}</p>
        <p>${person.age}</p>
        <a href="/person/${person.image}"><img src="/uploads/${person.image}" width="150px"></a>
        <hr>
        </div>
        </li>`
    })}
    </ol>`;

    res.send(list);
})

app.post("/searchFace", async (req, res) => {
    store(req, res, async (err) => {
        if (err) {
            console.log("upload error: ", err);
            res.status(500).send("Upload error");
        } else {
            // Load the uploaded image using face-api.js
            const imageBuffer = fs.readFileSync(req.file.path);
            const image = new canvas.Image();
            image.src = imageBuffer;

            // Detect faces in the uploaded image and compute the descriptor
            const faceDetectionOptions = new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 });
            const faceDetectionResults = await faceapi.detectAllFaces(image, faceDetectionOptions)
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (faceDetectionResults.length === 0) {
                fs.unlinkSync(req.file.path); // Delete the image
                res.send(`
                <div>
                    <h1>No face detected in the uploaded image</h1>
                    <p>Please upload a clear image with a proper face.</p>
                    <a href="/">Back</a>
                </div>
                `);
                return;
            }

            // Use the face descriptor from the uploaded image for matching
            const uploadedImageDescriptor = faceDetectionResults[0].descriptor;

            // Query the database to find matching face descriptors
            const matchingImages = await FaceData.find({}).exec();
            const matchingFileNames = [];

            for (const entry of matchingImages) {
                const storedImageDescriptor = entry.faceDescriptor; // No need for new faceapi.FaceDescriptor()
                const distance = faceapi.euclideanDistance(uploadedImageDescriptor, storedImageDescriptor);

                // You can adjust the threshold for matching
                if (distance < 0.4) {
                    matchingFileNames.push(entry.imageFileName);
                }
            }

            if (matchingFileNames.length > 0) {
                console.log(matchingFileNames);
                res.render("searchResultByFace",{
                    matchingPeople : matchingFileNames,
                    filename : req.file.filename
                });
                
            } else {
                res.send('No matching images found.');
            }
            
        }
    });
});

app.get("/person/:image", async(req,res)=>{
    const image = String(req.params.image);

    const person =await missingPerson.findOne({image : image});
    res.render("person",{person:person});
});

app.post("/searchByText", async(req,res)=>{
    const name = RegExp(req.body.name, 'i');
    const area = RegExp(req.body.area,'i');
    const age = req.body.age;

    var data;
    if(age){
        if(name && area){
            data = await missingPerson.find({name : name, policeStation : area, age : age});
        }else if(name && !area){
            data = await missingPerson.find({name: name, age : age});
        }else if(!name && area){
            data = await missingPerson.find({policeStation: area, age : age});
        }else{
            data = await missingPerson.find({age : age});
        }
    }else{
        if(name && area){
            data = await missingPerson.find({name : name, policeStation : area});
        }else if(name && !area){
            data = await missingPerson.find({name: name});
        }else if(!name && area){
            data = await missingPerson.find({policeStation: area});
        }else{
            data = await missingPerson.find({});
        }
    }
    
    res.render("searchResultByText", {matchingPeople : data});
    
});

app.get("/inform/:missingId",(req,res)=>{
    const missingId = req.params.missingId;
    res.render("verification",{missingId: missingId, status: "verify Yourself"});
});

app.post("/sendOtp",async (req,res)=>{
    const name = String(req.body.name);
    const phone = String(req.body.phone);
    const toPhone = "+91" + phone;
    const missingId = req.body.missingId;

    const sixDigitOTP = String(Math.floor(100000 + Math.random() * 900000));
    const msg = `Your OTP is ${sixDigitOTP}`;
    
    sendSMS(req,res,toPhone,sixDigitOTP,missingId);
    otpMap.set(phone,sixDigitOTP);
    
    console.log(otpMap);

});

app.post("/verifyOtp",async (req,res)=>{
    const missingId = String(req.body.missingId);
    const phone = String(req.body.phone);
    const otp = String(req.body.otp);

    if(otpMap.get(phone) === otp){
        console.log("correct");
        otpMap.clear();
        
        const data = await informedInfo.find({missingId : req.body.missingId});
        console.log(data);

        if(data.length != 0){
            const entry = await informedInfo.findOneAndUpdate(
                {missingId : req.body.missingId},
                {
                    $push : {
                        informer : {
                            name : req.body.name,
                            phone : phone,
                            location : {
                                type : 'Point',
                                coordinates : [req.body.longitude,req.body.latitude]
                            }
                        }
                    }
                },
                {new : true }
            );
            console.log(entry);

            console.log("location saved successfully added");
            sendMailToPolice(policeEmail , entry); //sending police mail with informed info entry
            res.render("successfullyInformed");

        }else{
            const entry = new informedInfo({
                missingId : req.body.missingId,
                informer : {
                    name : req.body.name,
                    phone : phone,
                    location : {
                        type : 'Point',
                        coordinates : [req.body.longitude,req.body.latitude]
                    }
                }
            });
            entry.save()
                .then(()=>{
                    console.log("location saved successfully");
                    sendMailToPolice(policeEmail,entry); //sending police mail with infomed info entry
                    res.render("successfullyInformed");
                })
                .catch((err)=>{
                    console.error("error in saving location", err);
                    res.redirect(`/inform/${missingId}`)
            })
        }
        
    }else{
        console.log("incorrect");
        otpMap.clear();
        res.render("verification",{missingId:missingId,status:"incorrect otp try again"});
        
    }
    otpMap.clear();

    // this is working fine 
});

// extra useful routes
app.get("/clearOtpMap", (req,res)=>{
    otpMap.clear();
})

app.get("/dashboard",async (req,res)=>{
    const missingEntries = await missingPerson.find({});
    const informedEntries = await informedInfo.find({});
    const maleEntries = await missingPerson.find({gender : "male"});
    const femaleEntries = await missingPerson.find({gender : "female"});
    
    // lengths 
    const totalMissingEntries = missingEntries.length;
    const totalInformedEntries = informedEntries.length;
    const totalMaleEntries = maleEntries.length;
    const totalFemaleEntries = femaleEntries.length;

    res.render("dashboard",{
        totalMissingEntries : totalMissingEntries,
        totalInformedEntries : totalInformedEntries,
        totalMaleEntries : totalMaleEntries,
        totalFemaleEntries : totalFemaleEntries
        
    })
})


//Listening port
app.listen(PORT, () => console.log("server running at port ", PORT));