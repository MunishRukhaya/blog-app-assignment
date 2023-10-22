import { Router } from "express";
import { authorProtect, postBlog } from "../controllers/authorController";

const authorRouter = Router();
authorRouter.use(authorProtect);

authorRouter.post('/blog/new', postBlog);

export default authorRouter;