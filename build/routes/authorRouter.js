"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authorController_1 = require("../controllers/authorController");
const authorRouter = (0, express_1.Router)();
authorRouter.use(authorController_1.authorProtect);
authorRouter.post('/blog/new', authorController_1.postBlog);
exports.default = authorRouter;
