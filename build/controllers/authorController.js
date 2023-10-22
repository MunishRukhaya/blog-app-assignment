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
exports.postBlog = exports.authorProtect = exports.authorLogin = exports.authorSignup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authorModel_1 = __importDefault(require("../models/authorModel"));
const blogModel_1 = require("../models/blogModel");
const authorSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield authorModel_1.default.findOne({ email: email });
        if (!existingUser) {
            const hash = yield bcrypt_1.default.hash(password, 10);
            authorModel_1.default.create({ name, email, password: hash }).then((mentor) => {
                res.status(200).send({
                    success: true,
                    message: 'Student has been successfully signed up!',
                    data: {
                        _id: mentor._id,
                        name: mentor.name,
                        email: mentor.email
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
exports.authorSignup = authorSignup;
const authorLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const existingUser = yield authorModel_1.default.findOne({ email: email });
    if (existingUser) {
        const passCheck = yield bcrypt_1.default.compare(password, existingUser.password);
        if (passCheck) {
            const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, process.env.JWT_SECRET);
            res.status(200).cookie('isLogin', token).cookie('authorId', existingUser._id).send({
                success: true,
                message: 'Author has been successfully logged in!',
                data: {
                    _id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email
                }
            });
        }
        else {
            res.send({
                success: false,
                message: 'Incorrect Password',
                data: {
                    email: existingUser.email
                }
            });
        }
    }
    else {
        res.send({
            success: false,
            message: 'Author does not exist'
        });
    }
});
exports.authorLogin = authorLogin;
const authorProtect = (req, res, next) => {
    const token = req.cookies.isLogin;
    const id = req.cookies.authorId;
    let decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (id == decoded.id) {
        next();
    }
    else {
        res.send({
            success: false,
            message: 'Login verification failed. Please login again',
        });
    }
};
exports.authorProtect = authorProtect;
const postBlog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const author = yield authorModel_1.default.findById(req.cookies.authorId);
    const blog = {
        author: author,
        title: req.body.title,
        content: req.body.content
    };
    blogModel_1.Blog.create(blog).then((blog) => {
        res.status(200).send({
            success: true,
            message: 'Blog successfully created',
            data: blog
        });
    });
});
exports.postBlog = postBlog;
