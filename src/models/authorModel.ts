import mongoose from "mongoose";

interface author  {
    name: string,
    email: string,
    password: string,
}

const authorSchema = new mongoose.Schema<author>({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
        minlength:8
    },
})

const Author = mongoose.model<author>('authors', authorSchema);
export default Author;