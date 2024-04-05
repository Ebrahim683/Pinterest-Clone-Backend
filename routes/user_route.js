import { Router } from "express";
import { fetchUser, fetchAllUser, updateUser, followUser } from "../controller/user_controller.js";

const userRouter = Router();

userRouter.get('/', fetchAllUser);
userRouter.get('/:id', fetchUser);
userRouter.patch('/update/:id', updateUser);
userRouter.patch('/follow/:id', followUser);

export default userRouter;