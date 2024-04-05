import "dotenv/config";
import express from "express";
import fileUpload from "express-fileupload";
import router from "./routes/app_route.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload({
  useTempFiles: true,
}));
app.use(router);

app.listen(PORT, () => {
  console.log('Server is running or port ' + PORT);
});