import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },

    description: {
        type:String,
    },

    status: {
        type:String,
        default:"pending",
    },

    dueDate: {
        type:Date,
        required:true
    }, 

    completed: {
        type:Boolean,
        default:false,
    },
});
export default mongoose.model("tasks",taskSchema);