import React, { useState } from 'react';
import aiService from '../services/ai.service';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import Navbar from '../components/layout/Navbar';
import { Bot, Send, MessageCircle } from 'lucide-react';

interface Message {
  type: 'user' | 'ai';
  content: string;
}

/**
 * AI Assistant page for asking study-related questions
 */
const AIAssistant: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAskQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      setError('Please enter a question');
      return;
    }

    setError('');
    setIsLoading(true);

    // Add user message to chat
    const userMessage: Message = { type: 'user', content: question };
    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;
    setQuestion('');

    try {
      const response = await aiService.askQuestion({ question: currentQuestion });
      
      // Add AI response to chat
      const aiMessage: Message = { type: 'ai', content: response.answer };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to get answer from AI');
      // Remove the user message if request failed
      setMessages((prev) => prev.slice(0, -1));
      setQuestion(currentQuestion);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
    setQuestion('');
    setError('');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 p-4 rounded-full">
                <Bot className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800">AI Study Assistant</h1>
            <p className="text-gray-600 mt-2">Ask any study-related questions and get instant help</p>
          </div>

          {/* Chat Container */}
          <Card className="mb-6">
            <div className="space-y-4">
              {/* Messages */}
              <div className="min-h-[400px] max-h-[500px] overflow-y-auto space-y-4 p-4 bg-gray-50 rounded-lg">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <MessageCircle className="h-16 w-16 mb-4 text-gray-400" />
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm mt-2">Start by asking a study question below</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-4 ${
                          message.type === 'user'
                            ? 'bg-primary-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                        }`}
                      >
                        <div className="flex items-start space-x-2">
                          {message.type === 'ai' && (
                            <Bot className="h-5 w-5 text-primary-600 flex-shrink-0 mt-0.5" />
                          )}
                          <p className="whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}

                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 border border-gray-200 rounded-lg p-4">
                      <Loader size="sm" />
                    </div>
                  </div>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Input Form */}
              <form onSubmit={handleAskQuestion} className="flex gap-3">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Ask a study question..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  rows={3}
                  disabled={isLoading}
                />
                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isLoading}
                    disabled={isLoading}
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                  {messages.length > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={handleClearChat}
                      disabled={isLoading}
                    >
                      Clear
                    </Button>
                  )}
                </div>
              </form>

              {/* Tips */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">Tips for better results:</h4>
                <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
                  <li>Be specific and clear with your questions</li>
                  <li>Ask one question at a time</li>
                  <li>Provide context when needed</li>
                  <li>Feel free to ask follow-up questions</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AIAssistant;