// 5-21-2023
// 6-24-2023 - Made changes to protect API key in .env file
import {
    EditOutlined,
    DeleteOutlined,
    AttachFileOutlined,
    ImageOutlined,
    MicOutlined,
    MoreHorizOutlined,
  } from "@mui/icons-material";

  import {
    Box,
    Divider,
    Typography,
    InputBase,
    useTheme,
    Button,
    IconButton,
    useMediaQuery,
  } from "@mui/material";
  import FlexBetween from "components/FlexBetween";
  import FlexVertical from "components/FlexVertical";
  import Dropzone from "react-dropzone";
  import UserImage from "components/UserImage";
  import WidgetWrapper from "components/WidgetWrapper";
  import { useState, useEffect } from "react";
  import { useDispatch, useSelector } from "react-redux";
  import { setPosts } from "state";
  import TextField from '@mui/material/TextField';
  import axios from "axios";
  
  const MyPostWidget = ({ picturePath }) => {
    const dispatch = useDispatch();
    const [isImage, setIsImage] = useState(false);
    const [image, setImage] = useState(null);
    const [postAI, setPostAI] = useState(""); // 6-24-2023 - represents the AI prompt
    const [post, setPost] = useState("");
    const { palette } = useTheme();
    const { _id } = useSelector((state) => state.user);
    const token = useSelector((state) => state.token);
    const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
    const mediumMain = palette.neutral.mediumMain;
    const medium = palette.neutral.medium;
  
    // 6/22/2023 determine whether the AI is generating content
    // use this to toggle the generate AI content button
    const [isAIContentDone, setIsAIContentDone] = useState(true);

    // Post the message
    const handlePost = async () => {
      const formData = new FormData();
      formData.append("userId", _id);
      formData.append("description", post);
      if (image) {
        formData.append("picture", image);
        formData.append("picturePath", image.name);
      }
  
      const response = await fetch(`http://localhost:3001/posts`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const posts = await response.json();
      dispatch(setPosts({ posts }));
      setImage(null);
      setPost("");

      // clear the AI Post input box
      setPostAI("");
    };

    // OPENAI STUFF
    const [messages, setMessages] = useState([
      {
        message: "Hello, I am your AI assistant!",
        sender: "Evernova-AI"
      }
    ]); // add an array [] here for the <MessageList> container

    // 6-24-2023 / New function - Send the AI prompt to ChatGPT
    const handleSendToChatGPT = async (message) => {

      // Set the message equal to the AI post content
      message = postAI; // generate an ai blog post based on the user's input.

      // new message is always from the user
      const newMessage = {
        message: message,
        sender: "user",
        direction: "outgoing" // showing the outgoing message on the right
      }

      const newMessages = [...messages, newMessage]; // all the new messages, + the new message

      // update our message state
      setMessages(newMessages)

      // Tell the user that the AI content is being generated.
      // Place this message in the 2nd input box
      setPost("AI is working...");
      setIsAIContentDone(false); // disable the generate AI content button
      
      // Send the message to the API and receive its response
      // https://ever-social.onrender.com
      // http://localhost:3001/openai/chat
      const { data } = await axios.post(`http://localhost:3001/openai/chat`, {
        message
    });

    setMessages( // show all messages thus far along with the new message
        [...newMessages, {
        message: data,
        sender: "Evernova-AI"
        }]
    );

    setPost(data);
    setIsAIContentDone(true);
  }

   
    return (
      <WidgetWrapper>
        <FlexBetween gap="1.5rem">
          <UserImage image={picturePath} />
              <InputBase
                placeholder="Need inspiration from Evernova-AI?"
                onChange={(e) => setPostAI(e.target.value)}
                value={postAI}
                width='75%'
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />
          </FlexBetween>
          <Divider sx={{ margin: "1.25rem 0" }} />
          <FlexBetween gap="1.5rem">
              <TextField
                placeholder="Or just write what's on your mind..."
                multiline
                rowsMax={4}
                
                variant='standard'
                onChange={(e) => setPost(e.target.value)}
                value={post}
                sx={{
                  width: "100%",
                  backgroundColor: palette.neutral.light,
                  borderRadius: "2rem",
                  padding: "1rem 2rem",
                }}
              />
          </FlexBetween>
        {isImage && (
          <Box
            border={`1px solid ${medium}`}
            borderRadius="5px"
            mt="1rem"
            p="1rem"
          >
            <Dropzone
              acceptedFiles=".jpg,.jpeg,.png"
              multiple={false}
              onDrop={(acceptedFiles) => setImage(acceptedFiles[0])}
            >
              {({ getRootProps, getInputProps }) => (
                <FlexBetween>
                  <Box
                    {...getRootProps()}
                    border={`2px dashed ${palette.primary.main}`}
                    p="1rem"
                    width="100%"
                    sx={{ "&:hover": { cursor: "pointer" } }}
                  >
                    <input {...getInputProps()} />
                    {!image ? (
                      <p>Add Image Here</p>
                    ) : (
                      <FlexBetween>
                        <Typography>{image.name}</Typography>
                        <EditOutlined />
                      </FlexBetween>
                    )}
                  </Box>
                  {image && (
                    <IconButton
                      onClick={() => setImage(null)}
                      sx={{ width: "15%" }}
                    >
                      <DeleteOutlined />
                    </IconButton>
                  )}
                </FlexBetween>
              )}
            </Dropzone>
          </Box>
        )}
  
        <Divider sx={{ margin: "1.25rem 0" }} />
  
        <FlexBetween>
          <FlexBetween gap="0.25rem" onClick={() => setIsImage(!isImage)}>
            <ImageOutlined sx={{ color: mediumMain }} />
            <Typography
              color={mediumMain}
              sx={{ "&:hover": { cursor: "pointer", color: medium } }}
            >
              Image
            </Typography>
          </FlexBetween>
  
          {isNonMobileScreens ? (
            <>
              <FlexBetween gap="0.25rem">
                <Button
                  disabled={!postAI || !isAIContentDone}
                  onClick={handleSendToChatGPT}
                  sx={{
                    color: palette.background.alt,
                    backgroundColor: palette.primary.main,
                    borderRadius: "3rem",
                  }}
                >
                  EN-AI 
                </Button>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <AttachFileOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Attachment</Typography>
              </FlexBetween>
  
              <FlexBetween gap="0.25rem">
                <MicOutlined sx={{ color: mediumMain }} />
                <Typography color={mediumMain}>Audio</Typography>
              </FlexBetween>
            </>
          ) : (
            <FlexBetween gap="0.25rem">
              <MoreHorizOutlined sx={{ color: mediumMain }} />
            </FlexBetween>
          )}

          {/* BUTTON starts as disabled */}
          <Button
            disabled={!post}
            onClick={handlePost}
            sx={{
              color: palette.background.alt,
              backgroundColor: palette.primary.main,
              borderRadius: "3rem",
            }}
          >
            POST
          </Button>
        </FlexBetween>
      </WidgetWrapper>
    );
  };
  
  export default MyPostWidget;