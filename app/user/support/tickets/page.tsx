"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  MessageSquare,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import api from "@/lib/api";

export interface TicketItem {
  id: number;
  ticket_id: string;
  type: string;
  subject: string;
  description: string;
  stage: string;
  created_at: string;
}

export default function TicketsPage() {
  const router = useRouter();
  const [tickets, setTickets] = useState<TicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await api.get("/tickets");
        // API returns { status: true, tickets: [...] }
        const list: TicketItem[] = Array.isArray(res.data?.tickets)
          ? res.data.tickets
          : Array.isArray(res.data?.data)
          ? res.data.data
          : Array.isArray(res.data)
          ? res.data
          : [];
        setTickets(list);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "Failed to load tickets. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const handleReply = (ticket: TicketItem) => {
    // Use numeric id — backend does where('id', $id)
    router.push(`/user/support/tickets/${ticket.id}`);
  };

  return (
    <div className="relative overflow-hidden">
      <div className="relative z-10">
        {/* Heading */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-light tracking-tight text-white">
              Support Tickets
            </h1>
            <p className="mt-2 text-white/55">
              View and manage your support requests.
            </p>
          </div>

          <button
            onClick={() => router.push("/user/support/create-ticket")}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#5D58F8] shadow-[0_15px_35px_rgba(255,255,255,.12)] transition hover:scale-[1.02] hover:shadow-[0_20px_45px_rgba(255,255,255,.2)] active:scale-[0.98]"
          >
            <Plus size={16} />
            New Ticket
          </button>
        </div>

        {/* Card */}
        <div className="overflow-hidden rounded-[34px] border border-white/10 bg-white/5 p-4 shadow-[0_35px_80px_rgba(0,0,0,.45)] backdrop-blur-3xl lg:p-6">
          {/* Header row */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-medium text-white">Ticket History</h2>
              <p className="mt-2 text-sm text-white/45">
                All your support requests are listed below.
              </p>
            </div>

            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3">
              <MessageSquare className="text-[#8B84FF]" size={20} />
              <span className="text-white">Total Tickets</span>
              <span className="rounded-full bg-[#8B84FF] px-3 py-1 text-sm font-semibold text-white">
                {tickets.length}
              </span>
            </div>
          </div>

          {/* States */}
          {loading ? (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
              <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
              Loading tickets...
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              {error}
            </div>
          ) : tickets.length === 0 ? (
            <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-14 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8B84FF]/15">
                <MessageSquare className="h-8 w-8 text-[#8B84FF]" />
              </div>
              <div>
                <p className="text-white">No tickets yet</p>
                <p className="mt-1 text-sm text-white/40">
                  Create your first support ticket and we'll get back to you.
                </p>
              </div>
              <button
                onClick={() => router.push("/user/support/create-ticket")}
                className="mt-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white transition hover:bg-white/10"
              >
                <Plus size={14} />
                Create Ticket
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/[0.03]">
              <table className="min-w-full whitespace-nowrap">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.04]">
                    {["Sr No", "Ticket ID", "Reply", "Type", "Subject", "Description", "Date", "Status"].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-6 py-5 text-left text-xs font-semibold uppercase tracking-widest text-white/50"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>

                <tbody>
                  {tickets.map((ticket, index) => (
                    <tr
                      key={ticket.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.05]"
                    >
                      {/* Sr */}
                      <td className="px-6 py-5 text-white">{index + 1}</td>

                      {/* Ticket ID */}
                      <td className="px-6 py-5 font-mono text-white">
                        #{ticket.ticket_id}
                      </td>

                      {/* Reply button */}
                      <td className="px-6 py-5">
                        <button
                          onClick={() => handleReply(ticket)}
                          className="rounded-full bg-[#8B84FF] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#766cf5]"
                        >
                          Reply
                        </button>
                      </td>

                      {/* Type */}
                      <td className="px-6 py-5">
                        <span className="rounded-full border border-[#8B84FF]/30 bg-[#8B84FF]/10 px-4 py-2 text-sm text-[#C4C0FF]">
                          {ticket.type}
                        </span>
                      </td>

                      {/* Subject */}
                      <td className="px-6 py-5 text-white">{ticket.subject}</td>

                      {/* Description */}
                      <td className="max-w-xs whitespace-normal px-6 py-5 text-white/70">
                        {ticket.description}
                      </td>

                      {/* Date */}
                      <td className="px-6 py-5 text-white/65">
                        {new Date(ticket.created_at).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        {ticket.stage === "Open" ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                            <CheckCircle2 size={16} />
                            Open
                          </span>
                        ) : ticket.stage === "Pending" ? (
                          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-medium text-yellow-400">
                            <Clock3 size={16} />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                            <XCircle size={16} />
                            {ticket.stage}
                          </span>
                        )}
                      </td>
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