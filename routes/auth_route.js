import { Router } from "express";
import { registerUser,loginUser } from "../controller/auth_controller.js";

const authRoute = Router()

authRoute.post('/register', registerUser);
authRoute.post('/login', loginUser);

export default authRoute