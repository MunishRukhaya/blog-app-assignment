import { Router } from "express";
import { userLogin, userSignup } from "../controllers/userController";
import { authorLogin, authorSignup } from "../controllers/authorController";

const authRouter = Router();

authRouter.post('/user/signup', userSignup);
authRouter.post('/user/login', userLogin);

authRouter.post('/author/signup', authorSignup);
authRouter.post('/author/login', authorLogin);

export default authRouter;