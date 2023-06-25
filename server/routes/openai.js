// 6/24/2023

import express from "express";
import { sendChatGPTMessage } from "../controllers/openai.js";
const router = express.Router(); // allows express to identify that these routes will be configured and put in separate files

// Post the message to the backend
router.post("/chat", sendChatGPTMessage);

export default router;