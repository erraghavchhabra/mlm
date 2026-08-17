"use client";

import { useEffect, useState } from "react";
import { DollarSign, Gift, Users, TrendingUp, Loader2 } from "lucide-react";
import BalanceCard from "@/components/dashboard/BalanceCard";
import RankCard from "@/components/dashboard/RankCard";
import StatCard from "@/components/dashboard/StatCard";
import ReferralSection from "@/components/dashboard/ReferralSection";
import RoiCard from "@/components/dashboard/RoiCard";
import api from "@/lib/api";

interface DashboardData {
  balance: string;
  roi: string;
  binary_bonus: string;
  referral_bonus: string;
  direct_referral: number;
  rank: string | null;
  left_business: string;
  right_business: string;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        if (res?.data?.status && res.data.data) {
          setData(res.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-200px)] items-center justify-center text-slate-400">
        <Loader2 className="mr-3 h-8 w-8 animate-spin text-[#8B84FF]" />
        Loading dashboard data...
      </div>
    );
  }

  const liveData = data || {
    balance: "0.00",
    roi: "0.00",
    binary_bonus: "0.00",
    referral_bonus: "0.00",
    direct_referral: 0,
    rank: "Unranked",
    left_business: "0.00",
    right_business: "0.00",
  };

  return (
    <div className="space-y-6">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl text-white">Dashboard Overview</h1>

          <p className="mt-2 text-base text-slate-400">
            Track your balance, referrals, commissions and business growth.
          </p>
        </div>
      </div>
      {/* TOP SECTION */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
        <div className="xl:col-span-4 flex">
          <BalanceCard balance={Number(liveData.balance)} />
        </div>
        <div className="xl:col-span-4 flex">
          <RoiCard roi={Number(liveData.roi)} leftBusiness={Number(liveData.left_business)} rightBusiness={Number(liveData.right_business)} />
        </div>
        <div className="xl:col-span-4 flex">
          <RankCard rank={liveData.rank || "Unranked"} />
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="ROI BONUS"
          value={`$${Number(liveData.roi).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={TrendingUp}
          change="Live"
        />

        <StatCard
          title="WEEKLY BONUS"
          value={`$${Number(liveData.binary_bonus).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={DollarSign}
          change="Live"
        />

        <StatCard
          title="REFERRAL BONUS"
          value={`$${Number(liveData.referral_bonus).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={Gift}
          change="Live"
        />

        <StatCard
          title="DIRECT BONUS"
          value={String(liveData.direct_referral)}
          icon={Users}
          change="Registered"
        />
      </div>
      <ReferralSection />
    </div>
  );
}
