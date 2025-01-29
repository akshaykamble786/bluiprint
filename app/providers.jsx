'use client'

import { Footer } from '@/components/global/footer'
import { Header } from '@/components/global/header'
import { ThemeProvider } from '@/components/theme-provider'
import { MessagesContext } from '@/context/messages-context';
import React, { useState } from 'react'

const Providers = ({ children }) => {
    const [messages, setMessages] = useState();
    return (
                <MessagesContext.Provider value={{messages, setMessages}}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Header />
                        {children}
                        <Footer />
                    </ThemeProvider>
                </MessagesContext.Provider>
    )
}

export default Providers