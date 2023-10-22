"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.postComment = exports.getBlogById = exports.getBlogs = exports.userProtect = exports.userLogin = exports.userSignup = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const blogModel_1 = require("../models/blogModel");
const userSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield userModel_1.default.findOne({ email: email });
        if (!existingUser) {
            const hash = yield bcrypt_1.default.hash(password, 10);
            userModel_1.default.create({ name, email, password: hash }).then((student) => {
                res.status(200).send({
                    success: true,
                    message: 'User has been successfully signed up!',
                    data: {
                        _id: student._id,
                        name: student.name,
                        email: student.email
                    }
                });
            });
        }
        else {
            res.status(402).send({
                success: false,
                message: 'User already exists. Try with another email.',
                data: {
                    email: email
                }
            });
        }
    }
    catch (error) {
        res.status(500).send({
            success: false,
            message: `Error:${error}`
        });
    }
});
exports.userSignup = userSignup;
const userLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield userModel_1.default.findOne({ email: email });
    if (existingUser) {
        const passCheck = yield bcrypt_1.default.compare(password, existingUser.password);
        if (passCheck) {
            const token = jsonwebtoken_1.default.sign({ _id: existingUser._id }, process.env.JWT_SECRET);
            res.status(200).cookie('isLogin', token).cookie('userId', existingUser._id).send({
                success: true,
                message: 'Student has been successfully logged in!',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
            });
        }
        else {
            res.status(402).send({
                success: false,
                message: 'Incorrect Password',
                data: {
                    email: existingUser.email
                }
            });
        }
    }
    else {
        res.status(402).send({
            success: false,
            message: 'User does not exist'
        });
    }
});
exports.userLogin = userLogin;
const userProtect = (req, res, next) => {
    const token = req.cookies.isLogin;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (decoded) {
        next();
    }
    else {
        res.status(402).send({
            success: false,
            message: 'Login verification failed. Please login again',
        });
    }
};
exports.userProtect = userProtect;
const getBlogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogs = yield blogModel_1.Blog.find({}).select('-comments');
    res.send({
        success: true,
        message: 'Blogs fetched',
        data: blogs
    });
});
exports.getBlogs = getBlogs;
const getBlogById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const blog = yield blogModel_1.Blog.findById(blogId);
    res.status(200).send({
        success: true,
        message: 'blog successfully fetched',
        data: blog
    });
});
exports.getBlogById = getBlogById;
const postComment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const blogId = req.params.id;
    const blog = yield blogModel_1.Blog.findById(blogId);
    if (blog) {
        const user = yield userModel_1.default.findById(req.cookies.userId).select('name');
        if (user) {
            const name = user.name;
            blog.comments.push({
                username: name,
                comment: req.body.comment
            });
            blog.save();
            res.status(200).send({
                success: true,
                message: 'Commented on blog',
                data: {
                    blog: blogId,
                    comment: req.body.comment
                }
            });
        }
    }
});
exports.postComment = postComment;
