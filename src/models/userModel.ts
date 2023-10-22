import mongoose from "mongoose";

interface user  {
    name: string,
    email: string,
    password: string,
}

const userSchema = new mongoose.Schema<user>({
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
        required:true
    }
})

const User = mongoose.model<user>('users', userSchema);

export default User;