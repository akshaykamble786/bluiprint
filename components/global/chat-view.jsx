'use client'

import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { useConvex } from 'convex/react';
import { ArrowRight, LinkIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'

const ChatView = () => {
  const { id } = useParams();
  const convex = useConvex();
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext)
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);

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

  return (
    <div className="w-full max-w-4xl mx-auto relative h-[85vh] flex flex-col">
      {Array.isArray(messages) && messages.map((msg, index) => (
        <div key={index}
          className="p-3 rounded-lg mb-2 flex items-start gap-2 flex-1 overflow-y-scroll scrollbar-hide px-5">
          {msg.role === 'user' && userDetails?.picture && (
            <Image
              className='rounded-full'
              src={userDetails.picture}
              alt="user avatar"
              width={35}
              height={35}
            />
          )}
          <p className='text-gray-800 whitespace-pre-wrap'>{msg.content}</p>
        </div>
      ))}

      <div className="w-full max-w-2xl mb-8">
        <div className="relative">
          <textarea
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