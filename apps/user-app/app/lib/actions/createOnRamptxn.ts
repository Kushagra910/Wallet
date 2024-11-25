"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../auth";
import prisma from "@repo/db/client";


export async function createOnRampTransaction (amount : number , provider : string){
    const session = await getServerSession(authOptions);
    const token = (Math.random()*1000).toString(); // this token should come from bank (to identify who the user is)
    const userId = session?.user?.id;
    if(!userId){
        return {
          message: "User not logged in!!"
        }
    }
    await prisma.onRampTransaction.create({
      data : {
        userId : Number(userId),
        amount,
        provider,
        token:token,
        status : "Processing",
        startTime : new Date(),

      }
    })

    return {
      message:"OnRamp Transaction added"
    }
}