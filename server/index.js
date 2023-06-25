// 5/24/2023
// 5/27/2023 - added more routes
// 6/24/2023 - added openai route to move openai client code to the backend

// Imports
import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url"; // can set paths
import authRoutes from "./routes/auth.js"; // 5/26/2023 - route folder - path and routes for every feature
import userRoutes from "./routes/users.js"; // 5/27/2023
import postRoutes from "./routes/posts.js"; // 5/27/2023
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import { verifyToken } from "./middleware/auth.js";

// For bulk adding sample posts
// Do not delete
import { users, posts } from "./data/index.js";
import User from "./models/User.js";
import Post from "./models/Post.js";

// for OpenAI API calls
import openAIRoutes from "./routes/openai.js"; 

/* CONFIGURATIONS */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors()); // cross origin resource sharing
app.use("/assets", express.static(path.join(__dirname, 'public/assets'))); // set the directory of where we keep our assets

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public/assets");

    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
})

// use this to upload a file
const upload = multer({ storage });

/* ROUTES WITH FILES 

Use middleware to upload image to the public/assets folder

*/
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// ROUTES that can be moved to other folders
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/posts", postRoutes); // allow the user to upload their picture

// OPENAI ROUTE
app.use("/openai", openAIRoutes);


/* MONGOOSE SETUP */
const PORT = process.env.PORT || 6001;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, () => console.log(`Server Port: ${PORT}`));

    /* ADD DATA ONE TIME */
    // User.insertMany(users);
    // Post.insertMany(posts);
}).catch((error) => console.log(`${error} - did not connect`));
