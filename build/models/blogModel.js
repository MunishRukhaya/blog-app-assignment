"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blog = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const authorModel_1 = __importDefault(require("./authorModel"));
const commentModel_1 = require("./commentModel");
const blogSchema = new mongoose_1.default.Schema({
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: authorModel_1.default,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    comments: {
        type: [commentModel_1.commentSchema],
        default: []
    }
});
const Blog = mongoose_1.default.model('blogs', blogSchema);
exports.Blog = Blog;
