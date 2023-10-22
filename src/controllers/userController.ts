import { Request, Response, NextFunction } from "express"
import User from "../models/userModel"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Blog } from "../models/blogModel";

const userSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email: email });
        if (!existingUser) {
            const hash = await bcrypt.hash(password, 10);
            User.create({ name, email, password:hash }).then((student) => {
                res.status(200).send({
                    success: true,
                    message: 'User has been successfully signed up!',
                    data: {
                        _id: student._id,
                        name: student.name,
                        email: student.email
                    }
                })
            })
        } else {
            res.status(402).send({
                success: false,
                message: 'User already exists. Try with another email.',
                data: {
                    email: email
                }
            })
        }
    } catch (error: any) {
        res.status(500).send({
            success: false,
            message: `Error:${error}`
        })
    }
}

const userLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
        const passCheck = await bcrypt.compare(password, existingUser.password);
        if (passCheck) {
            const token = jwt.sign({ _id: existingUser._id }, process.env.JWT_SECRET!);
            res.status(200).cookie('isLogin', token).cookie('userId', existingUser._id).send({
                success: true,
                message: 'Student has been successfully logged in!',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
            })
        } else {
            res.status(402).send({
                success: false,
                message: 'Incorrect Password',
                data: {
                    email: existingUser.email
                }
            })
        }
    } else {
        res.status(402).send({
            success: false,
            message: 'User does not exist'
        })
    }

}

const userProtect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.isLogin;
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    if (decoded) {
        next();
    } else {
        res.status(402).send({
            success: false,
            message: 'Login verification failed. Please login again',
        })
    }
}

const getBlogs = async (req: Request, res: Response) => {
    const blogs = await Blog.find({}).select('-comments');
    res.send({
        success: true,
        message: 'Blogs fetched',
        data: blogs
    });
}

const getBlogById = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    res.status(200).send({
        success: true,
        message: 'blog successfully fetched',
        data: blog
    });
}

const postComment = async (req: Request, res: Response) => {
    const blogId = req.params.id;
    const blog = await Blog.findById(blogId);
    if (blog) {
        const user = await User.findById(req.cookies.userId).select('name');
        if(user) {
            const name = user.name;
            blog.comments.push({
                username: name,
                comment: req.body.comment
            })
            blog.save();
            res.status(200).send({
                success: true,
                message: 'Commented on blog',
                data: {
                    blog: blogId,
                    comment: req.body.comment
                }
            })
        }
    }
}

export {
    userSignup,
    userLogin,
    userProtect,
    getBlogs,
    getBlogById,
    postComment
}
