import { DollarSign, Gift, Users, TrendingUp } from "lucide-react";
import BalanceCard from "@/components/dashboard/BalanceCard";
import RankCard from "@/components/dashboard/RankCard";
import StatCard from "@/components/dashboard/StatCard";
import ReferralSection from "@/components/dashboard/ReferralSection";
import RoiCard from "@/components/dashboard/RoiCard";

export default function DashboardPage() {
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
          <BalanceCard />
        </div>
        <div className="xl:col-span-4 flex">
          <RoiCard />
        </div>
        <div className="xl:col-span-4 flex">
          <RankCard />
        </div>
      </div>

      {/* BOTTOM STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard
          title="ROI"
          value="$311,321.01"
          icon={TrendingUp}
          change="+8.2%"
        />

        <StatCard
          title="WEEKLY BONUS"
          value="$0.00"
          icon={DollarSign}
          change="0.0%"
        />

        <StatCard
          title="REFERRAL BONUS"
          value="$0.00"
          icon={Gift}
          change="0.0%"
        />

        <StatCard
          title="DIRECT REFERRALS"
          value="20"
          icon={Users}
          change="+3 this week"
        />
      </div>
      <ReferralSection />
    </div>
  );
}
