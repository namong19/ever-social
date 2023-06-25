import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { MainContainer, ChatContainer, MessageList, Message, TypingIndicator, MessageInput } from "@chatscope/chat-ui-kit-react"

const API_KEY ="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";

function App() {
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am Evernova-AI",
      sender: "Evernova-AI"
    }
  ]); // add an array [] here for the <MessageList> container

  const handleSend = async (message) => {
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing" // showing the outgoing message on the right
    }

    const newMessages = [...messages, newMessage]; // all the new messages, + the new message

    // update our message state
    setMessages(newMessages)
    
    // set a typing indicator (chatgpt is typing)
    setTyping(true);
    // process message to chatGPT (send it over and see the response)
    await processMessageToChatGPT(newMessages);
  }

  async function processMessageToChatGPT(chatMessages) {// messages is an array of messages
    // Format messages for chatGPT API
    // API is expecting objects in format of { role: "user" or "assistant", "content": "message here"}
    // So we need to reformat

    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if(messageObject.sender === "Evernova-AI") {
        role="assistant"
      } else {
        role = "user"
      }
      return { role: role, content: messageObject.message }
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like i am 10 years old."
    }

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        systemMessage, // always place this systemMessage at the front of our messages
        ...apiMessages // [message1, message2, message3]
      ]
    }

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiRequestBody)
    }).then((data) => {
      return data.json();
    }).then((data) => {
      // console.log(data);
      // console.log(data.choices[0].message.content)
      setMessages(
        [...chatMessages, {
          message: data.choices[0].message.content,
          sender: "Evernova-AI"
        }]
      );
      setTyping(false);
    });
  }

  return (
    <div className='App'>
      <div style={{position: "relative", height: "800px", width: "700px"}}>
        <MainContainer>
          <ChatContainer>
            <MessageList
              scrollBehavior='smooth'
              typingIndicator={typing ? <TypingIndicator content="Evernova-AI is typing" /> : null}
            >
              {messages.map((message, i) => {
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder='Type message here' onSend={handleSend} />
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
  )
    
}

export default App
