// 6/24/2023
// based on code from https://github.com/apurvpatil18/CloneChatGpt/blob/master/controllers/openaiController.js

// Import the dotenv file
import dotenv from "dotenv";
dotenv.config();
// OpenAI stuff
import { Configuration, OpenAIApi } from "openai";


/* OpenAI API key */
const configuration = new Configuration({
    apiKey: process.env.REACT_OPENAI_API_KEY,
})

// Define the OpenAI configuration
const openai = new OpenAIApi(configuration);

// LOGGING IN
// VERY BASIC SETUP
export const sendChatGPTMessage = async (req, res) => {
    
    try {
        // Get the AI prompt from the user
        const { message } = req.body;

        // Send the message to ChatGPT
        const { data } = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-16k",
            //messages: [{"role":"user", "content":`${message}`}],
            //prompt: `${message}`
            messages: [{"role": "system", "content": "You are Evernova AI helpful assistant. You are an excellent writer, blogger who knows about everything."}, {role: "user", content: `${message}`}],
        });

        // Obtain the data and send it back
        if (data) {
            if (data.choices[0].message.content) {
                return res.status(200).json(data.choices[0].message.content);
            }
        }
        
        
    } catch (err) {
        // If the user could not send the API request, send an error to the user
        res.status(500).json({ error: err.message });
    }
}