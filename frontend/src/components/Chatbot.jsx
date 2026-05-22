import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Mic, MicOff, User, Bot, Loader2 } from 'lucide-react';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI Career Assistant. I can help with career advice, skills, roadmaps, interview prep, and resume tips. How can I help you today?", sender: 'ai' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    }
  }, [recognition]);

  const toggleListen = () => {
    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
    }
  };

  const getAIResponse = (text) => {
    const lowerText = text.toLowerCase();
    if (lowerText.includes('resume')) {
      return "For a great resume, keep it to one page, use action verbs (e.g., 'Developed', 'Managed'), and tailor it to the specific job description by including relevant keywords.";
    } else if (lowerText.includes('interview')) {
      return "To prepare for interviews, practice the STAR method (Situation, Task, Action, Result) for behavioral questions. Research the company and prepare a few good questions to ask them at the end.";
    } else if (lowerText.includes('skill') || lowerText.includes('learn')) {
      return "Based on current trends, learning Python, SQL, and Cloud platforms (AWS/Azure) are highly valuable. If you're into frontend, React and TypeScript are top skills to have.";
    } else if (lowerText.includes('roadmap')) {
      return "A standard Web Developer roadmap: HTML/CSS/JS -> Frontend Framework (React) -> Backend (Node.js/Python) -> Database (SQL/MongoDB) -> Deployment & CI/CD.";
    } else {
      return "That's a great question! While I'm just a demo assistant right now, typically I would analyze your profile and provide a highly personalized career recommendation. Is there anything specific about skills or interviews you'd like to ask?";
    }
  };

  const handleSend = async (customText) => {
    const textToSend = typeof customText === 'string' ? customText : input;
    if (!textToSend.trim()) return;

    const userMessage = { id: Date.now(), text: textToSend, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsTyping(true);

    try {
      const historyPayload = updatedMessages.slice(-10).map(m => ({
        text: m.text,
        sender: m.sender
      }));

      const response = await fetch('http://localhost:8080/recommendation/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyPayload.slice(0, -1)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch response');
      }

      const data = await response.json();
      const aiResponse = {
        id: Date.now() + 1,
        text: data.response || "No response generated.",
        sender: 'ai',
        suggestions: data.follow_up_suggestions || []
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackText = getAIResponse(textToSend);
      const aiResponse = {
        id: Date.now() + 1,
        text: fallbackText,
        sender: 'ai',
        suggestions: ["What skills should I learn?", "Tell me about interview prep", "Resume writing tips"]
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chatbot-wrapper">
      {/* Floating Button */}
      <button 
        className={`chatbot-toggle ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="chatbot-window glass-card">
          <div className="chatbot-header">
            <Bot className="bot-icon" size={24} />
            <div>
              <h3>AI Career Assistant</h3>
              <span className="status">Online</span>
            </div>
          </div>

          <div className="chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.sender === 'ai' && <Bot size={16} className="message-icon" />}
                  {msg.sender === 'user' && <User size={16} className="message-icon" />}
                  <div>
                    <p style={{ margin: 0 }}>{msg.text}</p>
                    {msg.sender === 'ai' && msg.suggestions && msg.suggestions.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                        {msg.suggestions.map((sug, idx) => (
                          <button 
                            key={idx} 
                            onClick={() => handleSend(sug)}
                            style={{ 
                              fontSize: '0.7rem', 
                              padding: '0.25rem 0.5rem', 
                              background: 'rgba(254, 129, 212, 0.1)', 
                              border: '1px solid var(--primary)', 
                              borderRadius: '6px', 
                              color: 'var(--primary)', 
                              cursor: 'pointer', 
                              transition: 'all 0.2s',
                              outline: 'none'
                            }}
                            onMouseEnter={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#000'; }}
                            onMouseLeave={(e) => { e.target.style.background = 'rgba(254, 129, 212, 0.1)'; e.target.style.color = 'var(--primary)'; }}
                          >
                            {sug}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="message ai typing">
                <div className="message-content">
                  <Bot size={16} className="message-icon" />
                  <div className="typing-indicator">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chatbot-input">
            {SpeechRecognition && (
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`} 
                onClick={toggleListen}
                title="Voice Input"
              >
                {isListening ? <Loader2 size={20} className="spin" /> : <Mic size={20} />}
              </button>
            )}
            <input 
              type="text" 
              placeholder="Ask me anything..." 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() && !isListening}>
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
