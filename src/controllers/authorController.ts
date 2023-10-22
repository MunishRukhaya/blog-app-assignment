import { Request, Response, NextFunction } from "express"
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import Author from "../models/authorModel";
import { Blog } from "../models/blogModel";

const authorSignup = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await Author.findOne({ email: email });
        if (!existingUser) {
            const hash = await bcrypt.hash(password, 10);
            Author.create({ name, email, password:hash }).then((mentor) => {
                res.status(200).send({
                    success: true,
                    message: 'Student has been successfully signed up!',
                    data: {
                        _id: mentor._id,
                        name: mentor.name,
                        email: mentor.email
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

const authorLogin = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await Author.findOne({ email: email });
    if (existingUser) {
        const passCheck = await bcrypt.compare(password, existingUser.password);
        if (passCheck) {
            const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET!);
            res.status(200).cookie('isLogin', token).cookie('authorId', existingUser._id).send({
                success: true,
                message: 'Author has been successfully logged in!',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
            })
        } else {
            res.send({
                success: false,
                message: 'Incorrect Password',
                data: {
                    email: existingUser.email
                }
            })
        }
    } else {
        res.send({
            success: false,
            message: 'Author does not exist'
        })
    }
}

const authorProtect = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.isLogin;
    const id = req.cookies.authorId;
    let decoded = jwt.verify(token, process.env.JWT_SECRET!) as {id:string};
    if (id == decoded.id) {
        next();
    } else {
        res.send({
            success: false,
            message: 'Login verification failed. Please login again',
        })
    }
}

const postBlog = async (req:Request, res:Response)=> {
    const author = await Author.findById(req.cookies.authorId);
    const blog = {
        author:author,
        title:req.body.title,
        content:req.body.content
    };
    Blog.create(blog).then((blog)=> {
        res.status(200).send({
            success:true,
            message:'Blog successfully created',
            data:blog
        })
    })
}

export {
    authorSignup,
    authorLogin,
    authorProtect,
    postBlog
}