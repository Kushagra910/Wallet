import { Card } from "@repo/ui/card";

export const Transaction = ({
  transactions,
}: {
  transactions: {
    amount: number;
    timestamp: Date;
    type: string;
  }[];
}) => {
  if (!transactions.length) {
    return (
      <Card title="Recent Transactions">
        <div className="text-center py-8">No Recent Transactions</div>
      </Card>
    );
  }

  return (
    <Card title="Transaction History">
      <div className="pt-2 w-full">
        {transactions.map((t, index) => (
          <div className="flex justify-between py-2" key={index}>
            <div>
              <div className="text-sm font-medium capitalize">{t.type}</div>
              <div className="text-slate-600 text-xs">{t.timestamp.toDateString()}</div>
            </div>
            <div className="flex flex-col justify-center">
              <span className={`text-sm font-bold ${t.type === "received" ? "text-green-600" : "text-red-600"}`}>
                {t.type === "received" ? "+" : "-"} Rs {t.amount / 100}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
