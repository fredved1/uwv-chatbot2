'use client'

import { useCallback } from 'react'
import UWVChatbot from '../components/UWVChatbot'

const API_BASE_URL = 'http://localhost:3000/api';

export default function Home() {
  // Verwijder de selectedModel state als deze niet wordt gebruikt
  
  const handleSendMessage = useCallback(async (message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/send-message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error('Error sending message:', error);
      return 'Sorry, er is een fout opgetreden bij het verzenden van uw bericht.';
    }
  }, [])

  const handleStartNewConversation = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/start-conversation`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.message;
    } catch (error) {
      console.error('Error starting new conversation:', error);
      return 'Sorry, er is een fout opgetreden bij het starten van een nieuwe conversatie.';
    }
  }, [])

  const handleGetAvailableModels = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/available-models`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      return data.models;
    } catch (error) {
      console.error('Error fetching available models:', error);
      return [];
    }
  }, [])

  const handleSelectModel = useCallback((model: string) => {
    fetch(`${API_BASE_URL}/select-model`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model }),
    }).catch(error => console.error('Error selecting model:', error));
  }, [])

  const handleClearMemory = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/clear-memory`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error('Error clearing memory:', error);
    }
  }, [])

  return (
    <UWVChatbot
      onSendMessage={handleSendMessage}
      onStartNewConversation={handleStartNewConversation}
      onGetAvailableModels={handleGetAvailableModels}
      onSelectModel={handleSelectModel}
      onClearMemory={handleClearMemory}
    />
  )
}