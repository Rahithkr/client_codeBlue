

import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import { NextAuthOptions } from 'next-auth';
import axios from 'axios';
import dotenv from 'dotenv'
import { baseUrl } from '@/utils/baseUrl';

dotenv.config()

const authOptions: NextAuthOptions = {
    providers: [    
        GoogleProvider({
            //kk
            // clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !,
            // clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET !
            clientId: '113220250837-5hnd3vup12nk15sq5050pcgfepj32776.apps.googleusercontent.com',
            clientSecret: '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' 
        }),
        FacebookProvider({
            clientId: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID !,
            clientSecret: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_SECRET !
        })
    ],
    debug: true,
    callbacks: {
        async signIn({ user, account }) {
            try {
                if (account?.provider === "google") {
                    const { name, image, email } = user;
                    const response = await axios.post(`${baseUrl}/server/user/google`, { email, image, name });
                    if (response.status !== 200) {
                        throw new Error("Backend failed to load the user details");
                    }
                } else if (account?.provider === "facebook") {
                    const { name, email } = user;
                    const response = await axios.post(`${baseUrl}/server/driver/facebook`, { email, name });
                    if (response.status !== 200) {
                        throw new Error("Backend failed to load the user details");
                    }
                }
                return true;
            } catch (error) {
                console.error("Error:", error);
                return false;
            }
        }
    }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };



