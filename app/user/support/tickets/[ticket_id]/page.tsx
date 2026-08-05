"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Loader2,
  SendHorizonal,
  AlertCircle,
  User,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageSquareText,
} from "lucide-react";
import api from "@/lib/api";

interface ReplyThread {
  id: number;
  side: "user" | "admin";
  msg: string;
  image?: string;
  created_at: string;
}

interface TicketDetail {
  id: number;
  ticket_id: string;
  type: string;
  subject: string;
  description: string;
  stage: string;
  created_at: string;
  reply_threads?: ReplyThread[];
}

function StageBadge({ stage }: { stage: string }) {
  if (stage === "Open")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
        <CheckCircle2 size={12} /> Open
      </span>
    );
  if (stage === "Pending")
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
        <Clock3 size={12} /> Pending
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
      <XCircle size={12} /> {stage}
    </span>
  );
}

export default function TicketDetailPage() {
  const { ticket_id } = useParams<{ ticket_id: string }>();
  const router = useRouter();

  const [ticket, setTicket] = useState<TicketDetail | null>(null);
  const [threads, setThreads] = useState<ReplyThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [reply, setReply] = useState("");
  const [replyLoading, setReplyLoading] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ── Fetch ticket ── */
  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await api.get(`/tickets/${ticket_id}`);
        const body = res.data;

        // Handle: { status, ticket, threads } (most likely from Laravel)
        // OR:     { status, data: { ticket, threads } }
        // OR:     plain ticket object
        let ticketData: TicketDetail | null = null;
        let threadData: ReplyThread[] = [];

        if (body?.ticket && typeof body.ticket === "object") {
          ticketData = body.ticket;
          // Laravel returns key 'conversation' for the reply threads
          threadData = Array.isArray(body.conversation)
            ? body.conversation
            : Array.isArray(body.threads)
            ? body.threads
            : Array.isArray(body.ticket?.reply_threads)
            ? body.ticket.reply_threads
            : [];
        } else if (body?.data?.ticket) {
          ticketData = body.data.ticket;
          threadData = Array.isArray(body.data.conversation)
            ? body.data.conversation
            : Array.isArray(body.data.threads)
            ? body.data.threads
            : [];
        } else {
          // Fallback: whole body is the ticket object
          ticketData = body;
          threadData = Array.isArray(body?.reply_threads)
            ? body.reply_threads
            : [];
        }

        if (!ticketData?.id) {
          setFetchError("Ticket not found or invalid response.");
          return;
        }

        setTicket(ticketData);
        setThreads(threadData);
      } catch (err: any) {
        setFetchError(err.response?.data?.message || "Failed to load ticket.");
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [ticket_id]);

  /* ── Scroll to bottom on new message ── */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [threads]);

  /* ── Send reply ── */
  const handleReply = async () => {
    if (!reply.trim()) return;
    setReplyError(null);
    setReplyLoading(true);
    try {
      const res = await api.post("/tickets/reply", {
        ticket_id: ticket?.id,
        message: reply.trim(), // Laravel validates 'message' field
      });
      if (res.data?.status) {
        const newThread: ReplyThread = res.data.reply ?? {
          id: Date.now(),
          side: "user",
          msg: reply.trim(),
          created_at: new Date().toISOString(),
        };
        setThreads((prev) => [...prev, newThread]);
        setReply("");
      } else {
        setReplyError(res.data?.message || "Failed to send reply.");
      }
    } catch (err: any) {
      setReplyError(err.response?.data?.message || "Failed to send reply.");
    } finally {
      setReplyLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleReply();
    }
  };

  /* ── Loading ── */
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] text-slate-400">
        <Loader2 className="mr-3 h-6 w-6 animate-spin text-[#8B84FF]" />
        Loading ticket...
      </div>
    );
  }

  /* ── Error ── */
  if (fetchError || !ticket) {
    return (
      <div className="flex items-start gap-3 rounded-3xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-300">
        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
        {fetchError ?? "Ticket not found."}
      </div>
    );
  }

  const isClosed = ticket.stage === "Closed";

  return (
    <div className="relative overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#8B84FF]/10 blur-[120px]" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-[#5D58F8]/10 blur-[120px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Back */}
        <button
          onClick={() => router.push("/user/support/tickets")}
          className="inline-flex items-center gap-2 text-sm text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Tickets
        </button>

        {/* Ticket meta */}
        <div className="rounded-[28px] border border-white/10 bg-white/5 p-6 backdrop-blur-3xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-light text-white">
                  {ticket.subject}
                </h1>
                <StageBadge stage={ticket.stage} />
              </div>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-white/40">
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-white/60">
                  #{ticket.ticket_id}
                </span>
                <span>•</span>
                <span>{ticket.type}</span>
                <span>•</span>
                <span>
                  {new Date(ticket.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {ticket.description && (
            <p className="mt-4 border-t border-white/5 pt-4 text-sm leading-relaxed text-white/60">
              {ticket.description}
            </p>
          )}
        </div>

        {/* Thread card */}
        <div className="overflow-hidden rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-3xl">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-white/5 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B84FF]/15">
              <MessageSquareText size={18} className="text-[#8B84FF]" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Conversation Thread
              </p>
              <p className="text-xs text-white/35">{threads.length} message(s)</p>
            </div>
          </div>

          {/* Messages */}
          <div className="max-h-[500px] space-y-4 overflow-y-auto p-6">
            {threads.length === 0 && (
              <p className="py-10 text-center text-sm text-white/30">
                No messages yet. Send the first reply below.
              </p>
            )}

            {threads.map((thread) => {
              const isAdmin = thread.side === "admin";
              return (
                <div
                  key={thread.id}
                  className={`flex gap-3 ${isAdmin ? "flex-row" : "flex-row-reverse"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                      isAdmin ? "bg-[#8B84FF]/20" : "bg-white/10"
                    }`}
                  >
                    {isAdmin ? (
                      <ShieldCheck size={16} className="text-[#8B84FF]" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                      isAdmin
                        ? "rounded-tl-none border border-[#8B84FF]/20 bg-[#8B84FF]/10 text-white/85"
                        : "rounded-tr-none border border-white/5 bg-white/5 text-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {thread.msg}
                    </p>
                    <p
                      className={`mt-1.5 text-[10px] ${
                        isAdmin ? "text-[#8B84FF]/50" : "text-white/25"
                      }`}
                    >
                      {new Date(thread.created_at).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Reply box */}
          {!isClosed ? (
            <div className="space-y-3 border-t border-white/5 p-6">
              {replyError && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {replyError}
                </div>
              )}
              <div className="flex gap-3">
                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  onKeyDown={handleKeyDown}
                  rows={2}
                  placeholder="Write your reply… (Enter to send, Shift+Enter for new line)"
                  className="flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-[#8B84FF] focus:bg-white/10"
                />
                <button
                  onClick={handleReply}
                  disabled={replyLoading || !reply.trim()}
                  className="flex h-12 w-12 shrink-0 items-center justify-center self-end rounded-full bg-white text-[#5D58F8] shadow-[0_15px_35px_rgba(255,255,255,.12)] transition hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {replyLoading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <SendHorizonal size={18} />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-white/5 px-6 py-4 text-center text-xs text-white/30">
              This ticket is closed. Please{" "}
              <button
                onClick={() => router.push("/user/support/create-ticket")}
                className="text-[#8B84FF] underline underline-offset-2 hover:text-[#C4C0FF]"
              >
                create a new ticket
              </button>{" "}
              if you need further assistance.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
