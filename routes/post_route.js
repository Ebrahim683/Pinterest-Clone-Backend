import Router from "express";
import { createPost, fetchAllPost, deletePost, giveLike, pinPost, fetchPinnedPost, searchPost } from "../controller/post_controller.js";

const postRouter = Router();

postRouter.post('/create/:id', createPost);
postRouter.get('/', fetchAllPost);
postRouter.delete('/:id', deletePost);
postRouter.post('/like/:id', giveLike);
postRouter.post('/pin', pinPost);
postRouter.get('/pin/:id', fetchAllPost);
postRouter.get('/search', searchPost);
postRouter.get('/pinedPost/:id', fetchPinnedPost);

export default postRouter;