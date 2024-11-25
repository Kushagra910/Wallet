import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export async function getP2PTransactions() {
  // Retrieve session and user ID
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    throw new Error("User not authenticated");
  }

  const userId = Number(session.user.id);

  // Fetch sent transactions
  const sentTransactions = await prisma.p2pTransfer.findMany({
    where: { fromUserId: userId },
    select: {
      amount: true,
      timestamp: true,
      toUserId: true,
    },
  });

  // Fetch received transactions
  const receivedTransactions = await prisma.p2pTransfer.findMany({
    where: { toUserId: userId },
    select: {
      amount: true,
      timestamp: true,
      fromUserId: true,
    },
  });

  // Combine and format transactions
  const transactions = [
    ...sentTransactions.map((txn) => ({
      amount: txn.amount,
      timestamp: txn.timestamp,
      type: "sent"

    })),
    ...receivedTransactions.map((txn) => ({
      amount: txn.amount,
      timestamp: txn.timestamp,
      type: "received"
    })),
  ];

  // Sort transactions by timestamp (most recent first)
  transactions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return transactions;
}
