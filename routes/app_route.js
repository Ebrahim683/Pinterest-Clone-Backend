import { Router } from "express";
import authRouter from "../routes/auth_route.js";
import userRouter from "./user_route.js";
import postRouter from "./post_route.js";
import categoryRouter from "./category_route.js";

const router = Router();
const URL = '/api/v1';
router.use(`${URL}/auth`, authRouter);
router.use(`${URL}/user`, userRouter);
router.use(`${URL}/post`, postRouter);
router.use(`${URL}/category`, categoryRouter);
export default router;