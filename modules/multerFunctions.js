const multer = require("multer");


const Storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./public/uploads")
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+file.originalname);
    }
});

const upload = multer({
    storage: Storage
}).single("image");


// multer config for temporary storage images
const tempStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "./public/searched")
    },
    filename: (req, file, cb)=>{
        cb(null, Date.now()+file.originalname);
    }
});

const store = multer({
    storage : tempStorage
}).single("image");


module.exports = {
    upload , 
    store
};