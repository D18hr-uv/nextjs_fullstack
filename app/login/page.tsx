"use client";
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault;

        const result = await signIn("credentials", {
            email,
            password, 
            redirect: false,
        })

        if(result?.error){
            console.log(result.error);
        }else{
            router.push("/");
        }
    };
  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
            <input placeholder='Email' type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            <input placeholder='password' type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            <button type="submit">Login</button>
        </form>
        <div>
            {/* <button onClick={() => signIn("google")}>Login with Google</button> */}
            <p>Do not have an account? <a href="/register">Register</a></p>
        </div>
    </div>
  )
}

export default LoginPage