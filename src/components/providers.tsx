'use client'

import {  ReactNode } from 'react'
import { ClerkProvider, SignInButton, SignOutButton, useAuth } from '@clerk/nextjs'
import { Authenticated, AuthLoading, ConvexReactClient, Unauthenticated } from 'convex/react'
import { ConvexProviderWithClerk } from 'convex/react-clerk'
import { ThemeProvider } from './theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { UnauthenticatedView } from '@/features/auth/components/unauthenticated-view'
import { AuthLoadingView } from '@/features/auth/components/auth_loading_view'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export const Providers = ({children}: {children: ReactNode}) => {
    return (
        <ClerkProvider>
            <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem
                    disableTransitionOnChange>
                        <TooltipProvider>
                        <Authenticated>
                            
                            {children}
                            
                        </Authenticated>

                        <Unauthenticated>
                            {/* <div className='flex items-center justify-center h-screen'>
                                <p className='text-2xl'>Please sign in to access the app.</p>
                                <SignInButton mode="modal">
                                    <button className='ml-4 px-4 py-2 bg-blue-500 text-white rounded'>Sign In</button>
                                </SignInButton>
                                <SignOutButton>
                                    <button className='ml-4 px-4 py-2 bg-red-500 text-white rounded'>Sign Out</button>
                                </SignOutButton>
                            </div> */}
                            <UnauthenticatedView />
                        </Unauthenticated>

                        <AuthLoading>
                            {/* <div className='flex items-center justify-center h-screen'>
                                <p className='text-2xl'>Loading...</p>
                            </div> */}
                        <AuthLoadingView />

                        </AuthLoading>
                    
                </TooltipProvider>
                </ThemeProvider>
            </ConvexProviderWithClerk>
        </ClerkProvider>

    )
}