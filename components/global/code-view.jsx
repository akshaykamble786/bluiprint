'use client'

import { MessagesContext } from "@/context/messages-context";
import { UserDetailsContext } from "@/context/user-details-context";
import { api } from "@/convex/_generated/api";
import lookup from "@/lib/data/lookup";
import prompt from "@/lib/data/prompt";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
} from "@codesandbox/sandpack-react";
import { useConvex, useMutation } from "convex/react";
import React, { useContext, useEffect, useState } from "react";
import SandpackPreviewClient from "./sandpreview-client";
import axios from "axios";
import { useParams } from "next/navigation";
import { ActionContext } from "@/context/action-context";
import { Loader2Icon } from "lucide-react";

function CodeView() {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('code');
  const convex = useConvex();
  const [files, setFiles] = useState(lookup?.DEFAULT_FILE);
  const { messages, setMessages } = useContext(MessagesContext);
  const { action, setAction } = useContext(ActionContext);
  // const updateFiles = useMutation(api.workspace.UpdateFiles);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);

  useEffect(() => {
    id && GetFiles();
  }, [id])

  useEffect(() => {
    setActiveTab('preview');
  }, [action])

  useEffect(() => {
    if (messages?.length > 0) {
      const role = messages[messages.length - 1].role;
      if (role == 'user') {
        GenerateAiCode();
      }
    }
  }, [messages]);

  const GetFiles = async () => {
    setLoading(true);
    const result = await convex.query(api.workspace.GetWorkspace, {
      workSpaceId: id
    })
    const mergedFiles = { ...lookup.DEFAULT_FILE, ...result?.fileData };
    setFiles(mergedFiles);
    setLoading(false);
  }

  const GenerateAiCode = async () => {
    setLoading(true);
    console.log("Generating ai code");
    const PROMPT = JSON.stringify(messages) + " " + prompt.CODE_GEN_PROMPT;
    const result = await axios.post('/api/gen-code', {
      prompt: PROMPT
    });
    console.log(result.data);
    const aiResp = result.data;
    const mergedFiles = { ...lookup.DEFAULT_FILE, ...aiResp?.files };
    setFiles(mergedFiles);
    // await updateFiles({
    //   workSpaceId: id,
    //   files: aiResp?.files
    // });
    setActiveTab('code');
    setLoading(false);
  }


  return (
    <div className='relative'>
      <div className='bg-[#181818] w-full p-2 border'>
        <div className='flex items-center flex-wrap shrink-0 bg-black p-1 w-[140px] gap-3 justify-center rounded-full'>
          <h2 onClick={() => setActiveTab('code')} className={`text-sm cursor-pointer ${activeTab == 'code' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Code</h2>
          <h2 onClick={() => setActiveTab('preview')} className={`text-sm cursor-pointer ${activeTab == 'preview' && 'text-blue-500 bg-blue-500 bg-opacity-25 p-1 px-2 rounded-full'}`}>Preview</h2>
        </div>
      </div>
      <SandpackProvider template="react" theme={'dark'}
        files={files}
        customSetup={{
          dependencies: {
            ...lookup.DEPENDANCY
          }
        }}
        options={{
          externalResources: ['https://cdn.tailwindcss.com']
        }}
      >
        <SandpackLayout >
          {activeTab == 'code' ? <>
            <SandpackFileExplorer style={{ height: '80vh' }} />
            <SandpackCodeEditor style={{ height: '80vh' }} />
          </> : <>
            <SandpackPreviewClient />
          </>}
        </SandpackLayout>
      </SandpackProvider>
      {loading && <div className='p-10 bg-gray-900 opacity-80 absolute top-0 rounded-lg w-full h-full flex items-center justify-center'>
        <Loader2Icon className='animate-spin h-10 w-10 text-white' />
        <h2 className='text-white'>Crafting your code...</h2>
      </div>}
    </div>
  )
};

export default CodeView;