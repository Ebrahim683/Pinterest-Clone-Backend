import express from "express";
import { createCategory } from "../controller/category_controller.js";

const categoryRouter = express();

categoryRouter.post('/create', createCategory);

export default categoryRouter;