import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            min: 2,
            max:50,
        }, 
        description:{
            type:String,
            required:true,
        },
        fullDescription:{
            type:String,
            default: ""
        },
        picturePath: {
            type: String,
            default: "",
        },
        courseCategory: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Categorie',
        },
        courseLevel: {
            type: String,
            default: "Beginner"
        },
        courseTime: {
            type: Number,
            default: "",
            required: true
        },
        coursePrice: {
            type: Number,
            default: 0, 
            required: true
        }
    },
    { timestamps: true}
    );

    const Course = mongoose.model("Course",CourseSchema);
    export default Course;