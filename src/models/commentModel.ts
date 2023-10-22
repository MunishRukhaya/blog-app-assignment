import mongoose from "mongoose"
import User from "./userModel"



interface comment {
    username:string,
    comment:string
}

const commentSchema = new mongoose.Schema<comment>({
    username:{
        type:String,
        required:true
    },
    comment:{
        type:String,
        required:true
    }
})

export {
    comment,
    commentSchema
}