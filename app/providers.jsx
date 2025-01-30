'use client'

import { Footer } from '@/components/global/footer'
import { Header } from '@/components/global/header'
import { ThemeProvider } from '@/components/theme-provider'
import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { useState } from 'react'

const Providers = ({ children }) => {
    const [messages, setMessages] = useState();
    const [userDetails, setUserDetails] = useState();
    
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <UserDetailsContext.Provider value={{ userDetails, setUserDetails }}>
                <MessagesContext.Provider value={{ messages, setMessages }}>
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
            </UserDetailsContext.Provider>
        </GoogleOAuthProvider>
    )
}

export default Providers