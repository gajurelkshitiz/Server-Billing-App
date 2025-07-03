import React from "react";

const PaymentStatusBadge = ({ status }: { status: "due" | "paid" | string }) => {
  const isPaid = status === "paid" || status === "Paid";
  
  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${
        isPaid
          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
          : "bg-amber-100 text-amber-700 border border-amber-300"
      }`}
    >
      {isPaid ? "Paid" : "Due"}
    </span>
  );
};

export default PaymentStatusBadge