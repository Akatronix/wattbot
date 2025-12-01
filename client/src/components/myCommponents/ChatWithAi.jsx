import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const ChatWithAi = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm WattBot AI. How can I help you with your energy consumption today?",
      sender: "ai",
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;
    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
    };

    setMessages([...messages, newUserMessage]);
    setInputValue("");

    // Simulate AI response after a delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: "I'm analyzing your energy data. Based on your current usage, I recommend turning off your air conditioner when not in use to save up to 20% on your energy bill.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="flex flex-col h-[90vh]">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Chat with WattBot AI
          </h1>
          <p className="text-gray-600">
            Ask questions about your energy consumption
          </p>
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <CardTitle>Energy Assistant</CardTitle>
            <CardDescription>Get insights and recommendations</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-scroll px-4 py-2 space-y-4 ">
            <div className="h-[45vh]">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex  ${
                    message.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs md:max-w-md rounded-lg px-4 py-2 ${
                      message.sender === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>

          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Type your message..."
                rows={2}
              />
              <Button
                onClick={handleSendMessage}
                className="bg-blue-600 hover:bg-blue-700 self-end"
              >
                Send
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatWithAi;
