"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;

  if (!from) {
    return {
      message: "Error while sending: User not authenticated",
    };
  }

  // Find the recipient by phone number
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  // Check if the recipient exists
  if (!toUser) {
    return {
      message: "Recipient not found",
    };
  }

  // Prevent users from transferring to themselves
  if (toUser.id === Number(from)) {
    return {
      message: "You cannot transfer money to yourself",
    };
  }

  // Start a transaction to perform the transfer
  try {
    await prisma.$transaction(async (tx) => {
      // Lock sender's balance for update
      await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

      // Fetch sender's balance
      const fromBalance = await tx.balance.findUnique({
        where: {
          userId: Number(from),
        },
      });

      // Check if the sender has sufficient funds
      if (!fromBalance || fromBalance.amount < amount) {
        throw new Error("Insufficient funds");
      }

      // Deduct amount from sender
      await tx.balance.update({
        where: {
          userId: Number(from),
        },
        data: { amount: { decrement: amount } },
      });

      // Add amount to recipient
      await tx.balance.update({
        where: { userId: toUser.id },
        data: { amount: { increment: amount } },
      });

      // Create the transfer record
      await tx.p2pTransfer.create({
        data: {
          fromUserId: Number(from),
          toUserId: toUser.id,
          amount: amount,
          timestamp: new Date(),
        },
      });
    });

    return {
      message: "Transfer successful",
    };
  } catch (error) {
    console.error("Transaction error:", error);
    return {
      message: error instanceof Error ? error.message : "Transaction failed",
    };
  }
}
