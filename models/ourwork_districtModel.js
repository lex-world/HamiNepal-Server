const mongoose = require('mongoose')

const districtWiseOurwork_schema = new mongoose.Schema(
    {
        district_name:{
            type:String,
            unique: true,
            required:[true, "Please enter the district"]
        },
        photos:{
            type:[String],
            required:[true, "Please enter the photos"]
        },
        work_type:{
            type: String,
            unique: true,
            trim: true,
            required: [true, "A work must have a topic"]
        },
        description: {
            type: String,
            required: [true, "Our work must have a description"],
          }
    }
) 

const districtWiseOurwork = mongoose.model("districtWorks", districtWiseOurwork_schema);
module.exports = districtWiseOurwork