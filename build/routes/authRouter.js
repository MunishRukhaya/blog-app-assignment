"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authorController_1 = require("../controllers/authorController");
const authRouter = (0, express_1.Router)();
authRouter.post('/user/signup', userController_1.userSignup);
authRouter.post('/user/login', userController_1.userLogin);
authRouter.post('/author/signup', authorController_1.authorSignup);
authRouter.post('/author/login', authorController_1.authorLogin);
exports.default = authRouter;
