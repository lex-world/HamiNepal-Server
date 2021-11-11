const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const APIServices = require("../utils/apiServices")
const multer = require("multer");
const sharp = require("sharp");
const factory = require("./handlerFactory");
const News = require("../models/newsModel");

//@desc create news link 
//POST api/v1/news
//Admin

const multerstorage = multer.memoryStorage();

const multerFilter = (req, file, cb)=>{
    if (file.mimetype.startsWith("image")){
        cb(null, true);
    }else{
        cb(new AppError("Not an image, Please upload image file", 400), false)
    }
};

const upload = multer({
    storage:multerstorage,
    fileFilter:multerFilter
});

exports.uploadNewsPhoto = upload.single("photo");

exports.resizeNewsPhoto = catchAsync(async(req, res, next)=>{
    console.log("123")
    if(!req.file) return next();
    req.file.filename = `News-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
    .resize(500,500)
    .toFormat("jpeg")
    .jpeg({quality:90})
    .toFile(`public/img/news/${req.file.filename}`);

    req.body.photo = `${req.protocol}://${req.get("host")}/img/news/${req.file.filename}`;
    next();
});

exports.createNews = catchAsync(async(req,res,next)=>{
    news = await News.create(req.body);
    res.status(201).json({status:"success", data: news})
})

//@desc get all news
//GET api/v1/volunteer
//Public
exports.getAllNews = catchAsync(async (req, res, next) => {
    const features = new APIServices(News.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const news = await features.query;
  
    return res.status(200).json({
      status: "success",
      results: news.length,
      data: { news },
    });
  });

//@desc get single news
//GET api/v1/volunteer/:id
//Public

exports.getSingleNews = catchAsync(async(req, res, next) =>{
    const news = await News.findById(req.params.id)
    if(!news){
        return next(new AppError("No news found with that id", 400))
    }
})

//@desc delete news
//DELETE api/v1/news/:id
//Admin
exports.deleteNews = factory.deleteOne(News);

//@desc Create news
//PATCH api/v1/news/:id
//Admin
exports.updateNews = factory.updateOne(News);
