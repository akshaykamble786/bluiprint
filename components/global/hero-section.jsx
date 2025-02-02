'use client'

import { Button } from "@/components/ui/button"
import { MessagesContext } from "@/context/messages-context";
import { ArrowRight, LinkIcon } from "lucide-react"
import { useContext, useState } from "react"
import { LoginForm } from "../login-form";
import { UserDetailsContext } from "@/context/user-details-context";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";

export function HeroSection() {
  const [userInput, setUserInput] = useState("");
  const { messages, setMessages } = useContext(MessagesContext);
  const { userDetails, setUserDetails } = useContext(UserDetailsContext);
  const [openDialog, setOpenDialog] = useState(false);

  const createWorkspace = useMutation(api.workspace.createWorkspace);
  const router = useRouter();

  const onGenerate = async (input) => {
    if (!userDetails?.name) {
      setOpenDialog(true);
      return;
    }

    const msg = {
      role: 'user',
      content: input
    };

    try {
      setMessages([msg]);

      const workSpaceId = await createWorkspace({
        messages: [msg],
        user: userDetails?._id
      });

      setUserInput("");

      router.replace('/workspace/' + workSpaceId);
    } catch (error) {
      console.error("Error creating workspace:", error);
    }
  };


  return (
    <main className="flex-1 flex flex-col items-center mt-36 xl:mt-42 gap-2">

      <h1 className="text-3xl md:text-5xl font-semibold text-center mb-4">What do you want to build?</h1>
      <p className="text-white/60 text-md mb-8 text-foreground text-center">Prompt, run, edit, and deploy full-stack web apps.</p>

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

      <div className="flex flex-wrap items-center justify-center gap-2 mb-12 max-w-4xl">
        {[
          "Start a blog with Astro",
          "Build a mobile app with NativeScript",
          "Create a docs site with VitePress",
          "Scaffold UI with shadcn",
          "Draft a presentation with Slidev",
          "Code a video with ffmotion",
        ].map((suggestion, index) => (
          <Button key={index} onClick={() => onGenerate(suggestion)} variant="outline" className="bg-white/5 border-white/10 hover:bg-white/10">
            {suggestion}
          </Button>
        ))}
      </div>
      <LoginForm openDialog={openDialog} closeDialog={() => setOpenDialog(false)} />
    </main>
  )
}