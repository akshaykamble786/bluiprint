import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const CHAT_PROMPT = `You are an AI assistant who's experienced in React development. 
                              GUIDELINES:
                              - Tell user what you are building
                              - response less than 15 lines
                              - Skip code examples and commentary`
