'use client'

import { Footer } from '@/components/global/footer'
import { Header } from '@/components/global/header'
import { ThemeProvider } from '@/components/theme-provider'
import { MessagesContext } from '@/context/messages-context';
import { UserDetailsContext } from '@/context/user-details-context';
import { api } from '@/convex/_generated/api';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useConvex } from 'convex/react';
import React, { useEffect, useState } from 'react'

const Providers = ({ children }) => {
    const [messages, setMessages] = useState([]);
    const [userDetails, setUserDetails] = useState();
    const convex = useConvex();

    useEffect(() =>{
        isAuthenticated();
    },[])

    const isAuthenticated = async () => {
        if(typeof window !== undefined){
            const user = JSON.parse(localStorage.getItem('user'));
            const result = await convex.query(api.users.getUser,{
                email: user?.email
            })
            setUserDetails(result);
        }
    }

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