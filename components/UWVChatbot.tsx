'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Loader2, Send, RefreshCw, Trash2 } from "lucide-react"

type Message = {
  role: 'user' | 'assistant'
  content: string
}

type ChatbotProps = {
    onSendMessage: (message: string) => Promise<string>
    onStartNewConversation: () => Promise<string>
    onGetAvailableModels: () => Promise<string[]>
    onSelectModel: (model: string) => void
    onClearMemory: () => Promise<void>
}

export default function UWVChatbot({ 
  onSendMessage, 
  onStartNewConversation, 
  onGetAvailableModels,
  onSelectModel,
  onClearMemory
}: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [models, setModels] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const handleClearMemory = async () => {
    await onClearMemory();
    setMessages([]);
  }
  
  const fetchAvailableModels = useCallback(async () => {
    const availableModels = await onGetAvailableModels()
    setModels(availableModels)
    if (availableModels.length > 0) {
      onSelectModel(availableModels[0])
    }
  }, [onGetAvailableModels, onSelectModel])

  const startNewConversation = useCallback(async () => {
    setIsLoading(true)
    try {
      const openingMessage = await onStartNewConversation()
      setMessages([{ role: 'assistant', content: openingMessage }])
    } catch (error) {
      console.error('Error starting new conversation:', error)
      setMessages([{ role: 'assistant', content: 'Sorry, er is een fout opgetreden bij het starten van een nieuwe conversatie.' }])
    } finally {
      setIsLoading(false)
    }
  }, [onStartNewConversation])

  useEffect(() => {
    startNewConversation()
    fetchAvailableModels()
  }, [startNewConversation, fetchAvailableModels])

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSend = async () => {
    if (input.trim() === '') return

    setIsLoading(true)
    setMessages(prev => [...prev, { role: 'user', content: input }])
    setInput('')

    try {
      const response = await onSendMessage(input)
      setMessages(prev => [...prev, { role: 'assistant', content: response }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, er is een fout opgetreden.' }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-uwv-light-blue min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl mx-auto border-0 shadow-lg bg-white rounded-lg overflow-hidden">
        <div className="bg-uwv-blue text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-bold flex items-center">
            <div className="w-10 h-10 mr-2 relative">
              <Image 
                src="/uwv-logo.svg" // Zorg ervoor dat dit pad correct is
                alt="UWV Logo"
                layout="fill"
                objectFit="contain"
              />
            </div>
            UWV Chatbot
          </h2>
        </div>
        <div className="bg-white p-4">
          <div className="h-[400px] overflow-y-auto pr-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-uwv-blue text-white' // Hier veranderen we de tekstkleur naar wit voor gebruikersberichten
                      : 'bg-uwv-light-blue text-gray-800'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <div className="bg-gray-100 p-4 rounded-b-lg">
          <div className="flex space-x-2 w-full mb-4">
            <select
              className="w-[180px] bg-white border border-uwv-blue text-uwv-blue rounded-md p-2"
              onChange={(e) => {
                onSelectModel(e.target.value)
              }}
            >
              <option value="">Selecteer model</option>
              {models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <button
              onClick={startNewConversation}
              className="bg-white text-uwv-blue border border-uwv-blue hover:bg-uwv-light-blue px-4 py-2 rounded-md flex items-center"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Nieuwe conversatie
            </button>
            <button
              onClick={handleClearMemory}
              className="bg-white text-uwv-blue border border-uwv-blue hover:bg-uwv-light-blue px-4 py-2 rounded-md flex items-center"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Wis geheugen
            </button>
          </div>
          <div className="flex space-x-2 w-full">
            <input
              type="text"
              placeholder="Typ uw vraag hier..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow bg-white border border-uwv-blue rounded-md p-2 text-black placeholder-gray-500"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-uwv-blue text-white hover:bg-blue-700 px-4 py-2 rounded-md"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}