import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const ComplaintChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help with your complaint today?", sender: "bot" }
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [customerInfo, setCustomerInfo] = useState({
    customerName: "",
    email: "",
    orderNumber: ""
  });
  const [step, setStep] = useState("welcome"); 
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const startChat = () => {
    // Check if any required fields are empty
    if (!customerInfo.customerName || !customerInfo.email) {
      setMessages([
        ...messages,
        { text: "Please fill in at least your name and email to continue.", sender: "bot" }
      ]);
      return;
    }
    
    // Add welcome message with customer name
    setMessages([
      ...messages,
      { text: `Thank you ${customerInfo.customerName}! How can I help with your complaint today?`, sender: "bot" }
    ]);
    setStep("chat");
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isSubmitting) return;

    // Add user message to chat
    const userMessage = { text: newMessage, sender: "user" };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    
    // Clear input and set loading
    setNewMessage("");
    setIsSubmitting(true);
    
    // Add temporary "typing" indicator
    setMessages(prevMessages => [
      ...prevMessages, 
      { text: "Processing your complaint...", sender: "bot", isLoading: true }
    ]);

    try {
      // Send complaint to server with customer info
      const response = await axios.post("http://localhost:5000/api/complaints", { 
        message: newMessage,
        customerName: customerInfo.customerName,
        email: customerInfo.email,
        orderNumber: customerInfo.orderNumber
      });
      
      console.log("Server response:", response.data);
      
      // Remove loading message
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      // Add bot response to chat
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: response.data.reply || "Thank you for your complaint. We'll review it and get back to you soon.", 
          sender: "bot" 
        }
      ]);
    } catch (error) {
      console.error("Error sending complaint:", error);
      
      // Remove loading message
      setMessages(prevMessages => 
        prevMessages.filter(msg => !msg.isLoading)
      );
      
      // Add error message
      setMessages(prevMessages => [
        ...prevMessages, 
        { 
          text: "Sorry, there was an error processing your complaint. Please try again later.", 
          sender: "bot",
          isError: true
        }
      ]);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo({
      ...customerInfo,
      [name]: value
    });
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Icon Button */}
      <button 
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center relative"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              ?
            </span>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 md:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4">
            <h3 className="font-medium">Customer Support</h3>
          </div>

          {/* Chat Content */}
          {step === "welcome" && (
            <div className="p-4">
              <p className="mb-4">To help us assist you better, please provide your information:</p>
              <form className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Your Name*</label>
                  <input 
                    type="text" 
                    name="customerName"
                    value={customerInfo.customerName}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email Address*</label>
                  <input 
                    type="email" 
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Number (if applicable)</label>
                  <input 
                    type="text" 
                    name="orderNumber"
                    value={customerInfo.orderNumber}
                    onChange={handleInputChange}
                    className="mt-1 w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500" 
                  />
                </div>
                <button
                  type="button"
                  onClick={startChat}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
                >
                  Start Chat
                </button>
              </form>
            </div>
          )}

          {step === "chat" && (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto max-h-80">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-2 ${
                      message.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                        message.sender === "user"
                          ? "bg-blue-500 text-white"
                          : message.isError 
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-200 text-gray-800"
                      }`}
                    >
                      {message.text}
                      {message.isLoading && (
                        <span className="ml-2 inline-block animate-pulse">...</span>
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="border-t p-4 flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your complaint here..."
                  className="flex-1 border rounded-l-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <button
                  type="submit"
                  className={`${
                    isSubmitting ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
                  } text-white px-4 rounded-r-lg`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send"}
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ComplaintChatbot;