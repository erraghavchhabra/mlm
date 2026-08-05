"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, XCircle, ShoppingBag, Loader2 } from "lucide-react";
import api from "@/lib/api";

export interface OrderItem {
  id: number | string;
  plan: string;
  amount: string;
  status: "Active" | "Pending" | "Cancelled" | string;
  date: string;
  trans_id?: string;
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Try fetching orders/purchased plans from API backend
        let fetchedOrders: OrderItem[] = [];
        let res: any = null;

        try {
          res = await api.get("/orders");
        } catch (e) {
          try {
            res = await api.get("/active-plans");
          } catch (e2) {
            res = await api.get("/my-orders");
          }
        }

        if (res?.data?.status && Array.isArray(res.data.data)) {
          fetchedOrders = res.data.data.map((item: any, idx: number) => ({
            id: item.id || item.trans_id || idx + 1,
            plan: item.plan_name || item.plan?.plan_name || item.description || item.name || "Package Plan",
            amount: typeof item.amount === "number" ? `$${item.amount.toLocaleString()}` : (item.amount?.toString().startsWith("$") ? item.amount : `$${item.amount || 0}`),
            status: item.status === 1 || item.status === "1" || item.status === "Active" ? "Active" : item.status === 0 || item.status === "Pending" ? "Pending" : "Cancelled",
            date: item.created_at ? new Date(item.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : item.date || new Date().toLocaleDateString(),
            trans_id: item.trans_id || item.transaction_id,
          }));
        }

        // Merge with locally recorded purchases if any
        let localPurchases: OrderItem[] = [];
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem("purchased_orders");
          if (stored) {
            try {
              localPurchases = JSON.parse(stored);
            } catch (err) {}
          }
        }

        if (fetchedOrders.length > 0) {
          setOrders(fetchedOrders);
        } else if (localPurchases.length > 0) {
          setOrders(localPurchases);
        } else {
          // Default initial fallback list if database is empty
          setOrders([
            {
              id: 1,
              plan: "Basic Plan",
              amount: "$100",
              status: "Active",
              date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to fetch user orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-light tracking-tight text-white">
            My Orders & Purchased Plans
          </h1>

          <p className="mt-2 text-white/55">
            View all your purchased investment packages and active plans.
          </p>
        </div>

        {/* Card Container */}
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-4 lg:p-6 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl">
          {/* Top Bar */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">Purchased Plans History</h2>
              <p className="mt-2 text-sm text-white/45">
                Detailed list of all packages you have purchased.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3">
              <ShoppingBag size={20} className="text-[#8B84FF]" />
              <span className="text-white">Total Purchased</span>
              <span className="rounded-full bg-[#8B84FF] px-3 py-1 text-sm font-semibold text-white">
                {orders.length}
              </span>
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
              Loading your orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center text-slate-400">
              No purchased plans found yet. You can buy packages from the Buy Package menu.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
              <table className="min-w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                      S.No / Txn ID
                    </th>

                    <th className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50">
                      Purchased Plan
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
                  {orders.map((order, index) => (
                    <tr
                      key={order.id || index}
                      className="border-b border-white/5 transition hover:bg-white/[0.05]"
                    >
                      <td className="px-6 py-5 font-mono text-sm font-medium text-white">
                        {order.trans_id || `#${order.id}`}
                      </td>

                      <td className="px-6 py-5">
                        <span className="inline-flex rounded-full border border-[#8B84FF]/30 bg-[#8B84FF]/10 px-4 py-2 text-sm font-medium text-[#C4C0FF]">
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
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                            <CheckCircle2 size={16} />
                            Active
                          </span>
                        ) : order.status === "Pending" ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400">
                            <Clock3 size={16} />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
