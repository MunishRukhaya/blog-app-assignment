import mongoose from 'mongoose';
import Author from './authorModel';
import { comment, commentSchema } from './commentModel';


interface blog {
  author:mongoose.Schema.Types.ObjectId,
  title:string,
  content:string,
  comments:comment[]
}

const blogSchema = new mongoose.Schema<blog>({
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Author,
        required:true
    },
    title:{
        type:String,
        required:true
    },
    content:{
        type:String,
        required:true
    },
    comments:{
        type:[commentSchema],
        default:[]
    }
})

const Blog = mongoose.model<blog>('blogs', blogSchema)

export {
    Blog
}