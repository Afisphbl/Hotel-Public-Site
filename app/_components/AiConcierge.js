"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { aiChat } from "../_lib/data-service-shared";

function AiConcierge({ hotelId }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = { role: "user", parts: [{ text: message }] };
    setChatHistory((prev) => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      const { response, checkoutUrl } = await aiChat(message, chatHistory, hotelId, session?.user);
      const assistantMessage = { role: "model", parts: [{ text: response }] };
      setChatHistory((prev) => [...prev, assistantMessage]);
      // If a checkout URL was provided, redirect after 5 seconds
      if (checkoutUrl) {
        setTimeout(() => {
          const redirectMsg = {
            role: "model",
            parts: [{ text: "Redirecting you to the payment gateway now... 🚀" }]
          };
          setChatHistory((prev) => [...prev, redirectMsg]);

          setTimeout(() => {
            window.location.href = checkoutUrl;
          }, 2000);
        }, 3000);
      }
    } catch (err) {
      console.error("Chat Error:", err);
      setChatHistory((prev) => [
        ...prev,
        { role: "model", parts: [{ text: "Sorry, I'm having trouble connecting. Please try again later." }] },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="bg-primary-900 border border-primary-800 rounded-lg shadow-2xl w-80 sm:w-96 flex flex-col mb-4 overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          <div className="bg-accent-500 p-4 flex justify-between items-center">
            <h3 className="text-primary-900 font-bold flex items-center gap-2">
              <span>🛎️</span> LuxeHotel Concierge
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-primary-900 hover:text-primary-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="h-80 overflow-y-auto p-4 space-y-4 scrollbar-dark">
            {chatHistory.length === 0 && (
              <p className="text-primary-400 text-sm italic text-center">
                Hi! I&apos;m your AI concierge. Ask me anything about our hotel or rooms!
              </p>
            )}
            {chatHistory.map((chat, index) => (
              <div
                key={index}
                className={`flex ${chat.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    chat.role === "user"
                      ? "bg-accent-600 text-primary-50 rounded-br-none"
                      : "bg-primary-800 text-primary-200 rounded-bl-none"
                  }`}
                >
                  {chat.parts[0].text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-primary-800 text-primary-200 p-3 rounded-lg rounded-bl-none animate-pulse">
                  Typing...
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t border-primary-800 bg-primary-950">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-primary-800 text-primary-100 px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-accent-500 text-sm"
              />
              <button
                type="submit"
                className="bg-accent-500 text-primary-900 px-3 py-2 rounded-md hover:bg-accent-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-accent-500 text-primary-900 p-4 rounded-full shadow-lg hover:bg-accent-600 transition-all hover:scale-110 active:scale-95 group relative"
      >
        {!isOpen ? (
          <div className="flex items-center gap-2">
            <span className="hidden group-hover:block absolute right-full mr-4 bg-primary-900 text-primary-100 px-3 py-1 rounded text-sm whitespace-nowrap border border-primary-700">
              Chat with AI
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </button>
    </div>
  );
}

export default AiConcierge;
