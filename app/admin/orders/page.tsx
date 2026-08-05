"use client";

import { CheckCircle2, Clock3, XCircle, ShoppingBag } from "lucide-react";

export default function OrdersPage() {
  const orders = [
    {
      id: 1,
      plan: "Starter Plan",
      amount: "$100",
      status: "Active",
      date: "23 Jul 2026",
    },
    {
      id: 2,
      plan: "Silver Plan",
      amount: "$250",
      status: "Pending",
      date: "21 Jul 2026",
    },
    {
      id: 3,
      plan: "Gold Plan",
      amount: "$500",
      status: "Cancelled",
      date: "18 Jul 2026",
    },
    {
      id: 4,
      plan: "Diamond Plan",
      amount: "$1000",
      status: "Active",
      date: "15 Jul 2026",
    },
    {
      id: 5,
      plan: "Royal Plan",
      amount: "$1500",
      status: "Pending",
      date: "12 Jul 2026",
    },
    {
      id: 6,
      plan: "Premium Plan",
      amount: "$2500",
      status: "Active",
      date: "09 Jul 2026",
    },
  ];

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        {/* ================= Heading ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white">
            Orders
          </h1>

          <p className="mt-2 text-white/55">View all your purchased plans.</p>
        </div>

        {/* ================= Card ================= */}

        <div
          className="
          overflow-hidden
          rounded-[34px]
          border
          border-white/10
          bg-white/5
          lg:p-6
          p-2
          shadow-[0_35px_80px_rgba(0,0,0,.45)]
          backdrop-blur-3xl
        "
        >
          {/* ================= Top ================= */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">Order History</h2>

              <p className="mt-2 text-sm text-white/45">
                All purchased plans are listed below.
              </p>
            </div>

            <div
              className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-white/10
              bg-white/5
              px-5
              py-3
            "
            >
              <ShoppingBag size={20} className="text-[#8B84FF]" />

              <span className="text-white">Total Orders</span>

              <span
                className="
                rounded-full
                bg-[#8B84FF]
                px-3
                py-1
                text-sm
                font-semibold
                text-white
              "
              >
                {orders.length}
              </span>
            </div>
          </div>
          {/* ================= Table ================= */}
          <div
            className="
            overflow-x-auto
            rounded-3xl
            border
            border-white/10
            bg-white/[0.03]
          "
          >
            <table className="min-w-full whitespace-nowrap">
              <thead>
                <tr className="border-b border-white/10 bg-white/[0.04]">
                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                    S.No.
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                    Plan
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                    Amount
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                    Status
                  </th>

                  <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                    Date
                  </th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="
                    border-b
                    border-white/5
                    transition
                    hover:bg-white/[0.05]
                  "
                  >
                    <td className="px-6 py-5 font-medium text-white">
                      {order.id}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className="
                        inline-flex
                        rounded-full
                        border
                        border-[#8B84FF]/30
                        bg-[#8B84FF]/10
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-[#C4C0FF]
                      "
                      >
                        {order.plan}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span className="font-semibold text-white">
                        {order.amount}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      {order.status === "Active" ? (
                        <span
                          className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-emerald-500/20
                          bg-emerald-500/10
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-emerald-400
                        "
                        >
                          <CheckCircle2 size={16} />
                          Active
                        </span>
                      ) : order.status === "Pending" ? (
                        <span
                          className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-yellow-500/20
                          bg-yellow-500/10
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-yellow-400
                        "
                        >
                          <Clock3 size={16} />
                          Pending
                        </span>
                      ) : (
                        <span
                          className="
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          border
                          border-red-500/20
                          bg-red-500/10
                          px-4
                          py-2
                          text-sm
                          font-medium
                          text-red-400
                        "
                        >
                          <XCircle size={16} />
                          Cancelled
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-5 text-white/65">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>{" "}
        </div>
      </div>
    </div>
  );
}
