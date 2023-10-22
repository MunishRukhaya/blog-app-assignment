import { Router } from "express";
import { getBlogById, getBlogs, postComment, userProtect } from "../controllers/userController";

const userRouter = Router();

userRouter.use(userProtect);

userRouter.get('/blogs', getBlogs);
userRouter.get('/blog/:id', getBlogById);
userRouter.post('/blog/:id', postComment);

export default userRouter;