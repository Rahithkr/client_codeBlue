
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import { NextAuthOptions } from 'next-auth';
import axios from 'axios';
import dotenv from 'dotenv'

dotenv.config()
console.log("hii im google driver   ")

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID !,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET !
        }),
    ],
    callbacks:{
        async signIn({user,account}){
           
            
            if(account ?.provider=="google"){
                const {name,image,email}=user;
            //    try {

        
            //     const res= await fetch('http://localhost:5000/server/user/google',{
            //         method:"POST",
            //         headers:{
            //             "Content-Type":"application/json"
            //         },
                  
            //         body:JSON.stringify({
            //             name,
            //             email,
            //         })
            //     })
    
            //    } catch (error) {
            //     console.log(error);
                
            //    } 
            try {
                const response = await axios.post(
                    'http://localhost:5000/server/driver/google',
                  { email,image, name }
                );
                  
                if (response.status !== 200) {
                  throw new Error("backend failed to load the user details");
                }
              } catch (error) {
                console.error("error", error);
      }
            }
            return true; 
            }}
}

const handler=NextAuth(authOptions);

export {handler as GET,handler as POST}


