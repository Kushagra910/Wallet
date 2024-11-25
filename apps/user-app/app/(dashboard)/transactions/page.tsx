
import { getP2PTransactions } from "../../lib/actions/getP2PTransactions";
import { Transaction } from "../../../components/Transaction";

type Transaction = {
    amount: number;
    timestamp: Date;
    type: string;
 
  };
  

export default async function () {
  let transactions:Transaction[] = [];

  try {
    // Fetch transactions from the server-side function
    transactions = await getP2PTransactions();
  } catch (error) {
    console.error("Error fetching transactions:", error);
  }

  return (
    <div className="p-4 w-2/3">
      <h1 className="text-2xl font-bold mb-4">Transactions</h1>
      <Transaction transactions={transactions} />
    </div>
  );
}
