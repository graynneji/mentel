"use client";

import { useState, useEffect, useCallback } from "react";
import { Send, Loader2, Wallet, RefreshCw, MessageSquareText, AlertCircle, CheckCircle2 } from "lucide-react";

interface SmsHistoryItem {
    id: string;
    createdAt: string;
    recipients: string[];
    message: string;
    status: string;
    segments: number | null;
    unitsBilled: number | null;
    costBilled: number | null;
    errorMessage: string | null;
}

const GSM7_LIMIT = 160; // single segment; longer messages split into multiple segments and cost more

export default function SmsAdminPage() {
    const [recipients, setRecipients] = useState("");
    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(false);
    const [sendResult, setSendResult] = useState<{ success: boolean; text: string } | null>(null);

    const [balance, setBalance] = useState<{ available: number; currency: string } | null>(null);
    const [balanceLoading, setBalanceLoading] = useState(true);

    const [history, setHistory] = useState<SmsHistoryItem[]>([]);
    const [historyLoading, setHistoryLoading] = useState(true);

    const recipientCount = recipients.split(/[,\n]/).map((r) => r.trim()).filter(Boolean).length;
    const segments = Math.max(1, Math.ceil(message.length / GSM7_LIMIT));

    const loadBalance = useCallback(async () => {
        setBalanceLoading(true);
        try {
            const res = await fetch("/api/admin/sms/balance");
            const data = await res.json();
            console.log("balance", data);
            if (data.success) setBalance({ available: data.available, currency: data.currency });
        } finally {
            setBalanceLoading(false);
        }
    }, []);

    const loadHistory = useCallback(async () => {
        setHistoryLoading(true);
        try {
            const res = await fetch("/api/admin/sms/history");
            const data = await res.json();
            if (data.success) setHistory(data.messages);
        } finally {
            setHistoryLoading(false);
        }
    }, []);

    useEffect(() => { loadBalance(); loadHistory(); }, [loadBalance, loadHistory]);

    async function handleSend(e: React.FormEvent) {
        e.preventDefault();
        setSendResult(null);

        const to = recipients.split(/[,\n]/).map((r) => r.trim()).filter(Boolean);
        if (to.length === 0 || !message.trim()) return;

        setSending(true);
        try {
            const res = await fetch("/api/admin/sms/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ to, message }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                setSendResult({ success: false, text: data.error ?? "Send failed." });
            } else {
                setSendResult({
                    success: true,
                    text: `Sent to ${to.length} recipient(s) — ${data.segments} segment(s), ₦${data.costBilled ?? "?"} billed.`,
                });
                setMessage("");
                setRecipients("");
                loadBalance();
                loadHistory();
            }
        } catch {
            setSendResult({ success: false, text: "Network error." });
        } finally {
            setSending(false);
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                    <h1 className="text-xl font-semibold text-[#1c3a3a] flex items-center gap-2">
                        <MessageSquareText size={18} /> SMS
                    </h1>
                    <p className="text-sm text-[#7a9088]">Send SMS via BestBulkSMS without leaving the dashboard.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl border bg-white" style={{ borderColor: "#e4eee8" }}>
                    <Wallet size={15} className="text-[#3d8b8b]" />
                    {balanceLoading ? (
                        <Loader2 size={13} className="animate-spin text-[#a0b8ac]" />
                    ) : balance ? (
                        <span className="text-sm font-semibold text-[#1c3a3a]">
                            {balance.currency} {balance?.available?.toLocaleString()}
                        </span>
                    ) : (
                        <span className="text-xs text-[#b94a4f]">Balance unavailable</span>
                    )}
                    <button onClick={loadBalance} className="text-[#a0b8ac] hover:text-[#3d8b8b]">
                        <RefreshCw size={12} />
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-5">
                {/* Compose */}
                <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e4eee8" }}>
                    <h2 className="text-sm font-semibold text-[#1c3a3a] mb-4">Compose</h2>
                    <form onSubmit={handleSend} className="flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5 text-[#7a9088]">
                                Recipients <span className="normal-case font-normal">(comma or newline separated — 080..., 234...)</span>
                            </label>
                            <textarea
                                className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white resize-none"
                                style={{ borderColor: "#e4eee8" }}
                                rows={3}
                                value={recipients}
                                onChange={(e) => setRecipients(e.target.value)}
                                placeholder="08012345678, 08098765432"
                            />
                            {recipientCount > 0 && <p className="text-xs text-[#a0b8ac] mt-1">{recipientCount} recipient(s)</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-medium uppercase tracking-widest mb-1.5 text-[#7a9088]">Message</label>
                            <textarea
                                className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none bg-white resize-none"
                                style={{ borderColor: "#e4eee8" }}
                                rows={5}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Your message..."
                            />
                            <p className="text-xs text-[#a0b8ac] mt-1">
                                {message.length} characters · {segments} segment{segments !== 1 ? "s" : ""}
                            </p>
                        </div>

                        {sendResult && (
                            <div
                                className="flex items-start gap-2 text-xs p-3 rounded-xl"
                                style={{
                                    background: sendResult.success ? "rgba(78,140,106,0.08)" : "rgba(185,74,79,0.08)",
                                    color: sendResult.success ? "#4e8c6a" : "#b94a4f",
                                }}
                            >
                                {sendResult.success ? <CheckCircle2 size={13} className="shrink-0 mt-0.5" /> : <AlertCircle size={13} className="shrink-0 mt-0.5" />}
                                {sendResult.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={sending || recipientCount === 0 || !message.trim()}
                            className="w-full py-3 rounded-xl text-white text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                            style={{ background: "linear-gradient(135deg, var(--sage-dark), var(--teal))" }}
                        >
                            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={14} />}
                            {sending ? "Sending…" : `Send to ${recipientCount || 0} recipient(s)`}
                        </button>
                    </form>
                </div>

                {/* History */}
                <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e4eee8" }}>
                    <h2 className="text-sm font-semibold text-[#1c3a3a] mb-4">Recent sends</h2>
                    {historyLoading ? (
                        <div className="flex items-center justify-center py-8 text-[#a0b8ac]">
                            <Loader2 size={18} className="animate-spin" />
                        </div>
                    ) : history.length === 0 ? (
                        <p className="text-xs text-[#a0b8ac] text-center py-8">No messages sent yet.</p>
                    ) : (
                        <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
                            {history.map((h) => (
                                <div key={h.id} className="p-3 rounded-xl" style={{ background: "#f7faf8" }}>
                                    <div className="flex items-center justify-between gap-2 mb-1">
                                        <span className="text-xs font-medium text-[#1c3a3a] truncate min-w-0">
                                            {h.recipients.length} recipient{h.recipients.length !== 1 ? "s" : ""}
                                        </span>
                                        <span
                                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                                            style={{
                                                background: h.status === "sent" ? "rgba(78,140,106,0.12)" : "rgba(185,74,79,0.1)",
                                                color: h.status === "sent" ? "#4e8c6a" : "#b94a4f",
                                            }}
                                        >
                                            {h.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#5a7a6e] truncate">{h.message}</p>
                                    <p className="text-[10px] text-[#a0b8ac] mt-1">
                                        {new Date(h.createdAt).toLocaleString()}
                                        {h.costBilled != null && ` · ₦${h.costBilled} billed`}
                                        {h.errorMessage && ` · ${h.errorMessage}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
