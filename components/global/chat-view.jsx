'use client'

import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { api } from '@/convex/_generated/api';
import { CHAT_PROMPT } from '@/lib/utils';
import axios from 'axios';
import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, LinkIcon, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext)
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [loading, setLoading] = useState(false);

  const GetWorkSpaceData = async () => {
    const result = await convex.query(api.workspace.GetWorkspace, {
      workSpaceId: id
    })
    setMessages(result?.messages);
    console.log(result?.messages)
  }

  useEffect(() => {
    id && GetWorkSpaceData();
  }, [id])

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role == 'user') {
        getAiResponse();
      }
    }
  }, [messages])

  const getAiResponse = async () => {
    try {
      if (loading) return;
      
      setLoading(true);
      const PROMPT = JSON.stringify(messages) + CHAT_PROMPT;
      
      if (messages[messages.length - 1]?.role === 'ai') return;
  
      const result = await axios.post('/api/gemini', {
        prompt: PROMPT
      });
      
      console.log(result.data.result);
      const airesp = { role: 'ai', content: result.data.result };
      
      setMessages(currentMessages => {
        if (currentMessages[currentMessages.length - 1]?.role === 'ai') {
          return currentMessages;
        }
        return [...currentMessages, airesp];
      });
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setLoading(false);
    }
  };

  const onGenerate = (input) => {
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setUserInput('');
  }

  return (
    <div className="w-full max-w-4xl mx-auto relative h-[85vh] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        {Array.isArray(messages) && messages.map((msg, index) => (
          <div key={index}
            className="p-3 rounded-lg mb-2 flex items-start gap-2 px-5">
            {msg.role === 'user' && userDetails?.picture && (
              <Image
                className='rounded-full'
                src={userDetails.picture}
                alt="user avatar"
                width={35}
                height={35}
              />
            )}
            <ReactMarkdown className='flex flex-col'>{msg.content}</ReactMarkdown>
            {loading && index === messages.length - 1 && (
              <div className='flex items-center gap-2'>
                <Loader2Icon className='animate-spin' />
                <h2>Generating response....</h2>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <textarea
            value={userInput}
            placeholder="How can Bluiprint help you today?"
            onChange={(e) => setUserInput(e.target.value)}
            className="outline-none border border-gray-700 rounded-xl p-4 bg-transparent w-full h-32 max-h-56 resize-none"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
            <LinkIcon className="size-5 opacity-40" />
            {userInput && (
              <ArrowRight
                onClick={() => onGenerate(userInput)}
                className='bg-blue-500 p-2 h-8 w-8 rounded-md cursor-pointer'
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatView