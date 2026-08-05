"use client";

import { useState, useEffect, useCallback } from "react";
import api from "@/lib/api";

export function useWallet(initialBalance = 12540) {
  const [balance, setBalance] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("wallet_balance");
      if (saved !== null) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) return parsed;
      }
    }
    return initialBalance;
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWalletBalance = useCallback(async (): Promise<number> => {
    setLoading(true);
    setError(null);
    try {
      let res: any = null;
      try {
        res = await api.get("/withdraw/balance");
      } catch (firstErr) {
        res = await api.get("/wallet/balance");
      }

      let newBalance = balance;

      if (res.data?.status && res.data?.data?.balance !== undefined) {
        newBalance = parseFloat(res.data.data.balance);
      } else if (res.data?.balance !== undefined) {
        newBalance = parseFloat(res.data.balance);
      } else if (typeof res.data?.data === "number") {
        newBalance = parseFloat(res.data.data);
      }

      setBalance(newBalance);
      if (typeof window !== "undefined") {
        localStorage.setItem("wallet_balance", newBalance.toString());
      }
      return newBalance;
    } catch (err) {
      const current = parseFloat(localStorage.getItem("wallet_balance") || initialBalance.toString());
      setBalance(current);
      return current;
    } finally {
      setLoading(false);
    }
  }, [balance, initialBalance]);

  useEffect(() => {
    fetchWalletBalance();

    const handleUpdate = () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wallet_balance");
        if (saved !== null) {
          const parsed = parseFloat(saved);
          if (!isNaN(parsed)) setBalance(parsed);
        }
      }
    };

    window.addEventListener("walletUpdated", handleUpdate);
    return () => window.removeEventListener("walletUpdated", handleUpdate);
  }, []);

  return { balance, loading, error, refreshWallet: fetchWalletBalance, setBalance };
}

export function updateLocalWalletBalance(newBalance: number) {
  if (typeof window !== "undefined") {
    localStorage.setItem("wallet_balance", newBalance.toString());
    window.dispatchEvent(new Event("walletUpdated"));
  }
}
