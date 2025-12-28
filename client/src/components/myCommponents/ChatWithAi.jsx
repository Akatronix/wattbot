// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import { Button } from "../ui/button";

// const ChatWithAi = () => {
//   const [messages, setMessages] = useState([
//     {
//       id: 1,
//       text: "Hello! I'm WattBot AI. How can I help you with your energy consumption today?",
//       sender: "ai",
//     },
//   ]);
//   const [inputValue, setInputValue] = useState("");

//   const handleSendMessage = () => {
//     if (inputValue.trim() === "") return;
//     const newUserMessage = {
//       id: messages.length + 1,
//       text: inputValue,
//       sender: "user",
//     };

//     setMessages([...messages, newUserMessage]);
//     setInputValue("");

//     // Simulate AI response after a delay
//     setTimeout(() => {
//       const aiResponse = {
//         id: messages.length + 2,
//         text: "I'm analyzing your energy data. Based on your current usage, I recommend turning off your air conditioner when not in use to save up to 20% on your energy bill.",
//         sender: "ai",
//       };
//       setMessages((prev) => [...prev, aiResponse]);
//     }, 1000);
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter" && !e.shiftKey) {
//       e.preventDefault();
//       handleSendMessage();
//     }
//   };

//   return (
//     <div>
//       <div className="flex flex-col h-[90vh]">
//         <div className="mb-6">
//           <h1 className="text-2xl font-bold text-gray-900">
//             Chat with WattBot AI
//           </h1>
//           <p className="text-gray-600">
//             Ask questions about your energy consumption
//           </p>
//         </div>

//         <Card className="flex-1 flex flex-col">
//           <CardHeader className="pb-3">
//             <CardTitle>Energy Assistant</CardTitle>
//             <CardDescription>Get insights and recommendations</CardDescription>
//           </CardHeader>

//           <CardContent className="flex-1 overflow-y-scroll px-4 py-2 space-y-4 ">
//             <div className="h-[45vh]">
//               {messages.map((message) => (
//                 <div
//                   key={message.id}
//                   className={`flex  ${
//                     message.sender === "user" ? "justify-end" : "justify-start"
//                   }`}
//                 >
//                   <div
//                     className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
//                       message.sender === "user"
//                         ? "bg-blue-500 text-white"
//                         : "bg-gray-100 text-gray-800"
//                     }`}
//                   >
//                     {message.text}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>

//           <div className="p-4 border-t">
//             <div className="flex space-x-2">
//               <textarea
//                 value={inputValue}
//                 onChange={(e) => setInputValue(e.target.value)}
//                 onKeyPress={handleKeyPress}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 placeholder="Type your message..."
//                 rows={2}
//               />
//               <Button
//                 onClick={handleSendMessage}
//                 className="bg-blue-600 hover:bg-blue-700 self-end"
//               >
//                 Send
//               </Button>
//             </div>
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// };







import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
// REMOVE the old useSocket import
// import useSocket from "@/useSocket";

// IMPORT the new useChat hook
import { useChat } from "@/hooks/useChat";

export default function ChatWithAi({ user, devices }) {
  const [input, setInput] = useState("");

  // Use the new hook to get state and functions
  const { messages, isThinking, sendMessage } = useChat();

  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim() || isThinking) return;

    // Call the sendMessage function from our store
    sendMessage(input, user, devices);
    setInput("");
  };

  // Auto-scroll to the bottom when a new message is added
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Only depend on messages now

  return (
    <div className="flex flex-col h-[90vh] max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Chat with Wattbot AI
        </h1>
        <p className="text-gray-600">
          Get real-time insights and recommendations about your energy usage
        </p>
      </div>

      {/* Chat Card */}
      <Card className="flex-1 flex flex-col shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle>Energy Assistant</CardTitle>
          <CardDescription>
            Real-time analysis from your connected devices
          </CardDescription>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto px-4 py-2 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.from === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 text-sm break-words ${
                  msg.from === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {isThinking && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-600 rounded-lg px-4 py-2 text-sm animate-pulse">
                ⚡ Wattbot is Thinking…
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </CardContent>

        {/* Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex space-x-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              placeholder="Ask Wattbot about your energy usage..."
              rows={2}
              className="flex-1 resize-none px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Button
              onClick={handleSend}
              disabled={isThinking || !input.trim()}
              className="bg-blue-600 hover:bg-blue-700 self-end"
            >
              {isThinking ? "Thinking…" : "Send"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}








// export default ChatWithAi;
