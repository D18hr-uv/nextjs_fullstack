import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import { connectToDatabase } from "@/lib/db";

export async function POST(request: NextRequest){
    try{
        const { email, password} = await request.json()

        if(!email || !password){
            return NextResponse.json(
                {error: "Email and password are required"},
                {status: 400}
            )
        }

        await connectToDatabase()
        const existingUser = await User.findOne({email})
        if(existingUser){
            return NextResponse.json(
                {error: "User Already exist"},
                {status:400}
            );
        }

        await User.create({
            email,
            password 
        })

        return NextResponse.json(
            {message: "User Registered successfully"},
            {status: 400}
        );
    } catch (error) {
        return NextResponse.json(
            {message: "Failed to Register user."},
            {status: 400}
        );
    }
}