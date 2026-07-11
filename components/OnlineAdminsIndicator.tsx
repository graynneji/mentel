"use client";

import { useState, useEffect, useCallback } from "react";
import { Users } from "lucide-react";

interface SessionInfo {
    sessionId: string;
    createdAt: number;
    lastSeenAt: number;
    ip: string;
    userAgent: string;
    online: boolean;
}

const HEARTBEAT_MS = 45_000;

function timeAgo(ms: number): string {
    const sec = Math.floor((Date.now() - ms) / 1000);
    if (sec < 60) return "just now";
    if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
    return `${Math.floor(sec / 3600)}h ago`;
}

function shortUA(ua: string): string {
    if (/iphone|ipad/i.test(ua)) return "iOS";
    if (/android/i.test(ua)) return "Android";
    if (/mac os/i.test(ua)) return "Mac";
    if (/windows/i.test(ua)) return "Windows";
    if (/linux/i.test(ua)) return "Linux";
    return "Unknown device";
}

/** Drop this in the admin sidebar. Sends a heartbeat and polls the online count. */
export default function OnlineAdminsIndicator({ collapsed }: { collapsed: boolean }) {
    const [onlineCount, setOnlineCount] = useState<number | null>(null);
    const [sessions, setSessions] = useState<SessionInfo[]>([]);
    const [open, setOpen] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/active-sessions");
            const data = await res.json();
            if (data.success) {
                setOnlineCount(data.onlineCount);
                setSessions(data.sessions);
            }
        } catch {
            /* best-effort — don't break the admin UI over this */
        }
    }, []);

    useEffect(() => {
        // Heartbeat keeps this session marked "online"; refresh reads the
        // current count. Both run immediately, then on an interval.
        const beat = () => fetch("/api/admin/heartbeat", { method: "POST" }).catch(() => {});
        beat();
        refresh();
        const interval = setInterval(() => {
            beat();
            refresh();
        }, HEARTBEAT_MS);
        return () => clearInterval(interval);
    }, [refresh]);

    if (collapsed) {
        return (
            <div className="flex items-center justify-center py-2" title={`${onlineCount ?? "…"} admin(s) online`}>
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
            </div>
        );
    }

    return (
        <div className="relative mb-2">
            <button
                onClick={() => setOpen((o) => !o)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-white/60 hover:text-white/90 hover:bg-white/8 transition-colors cursor-pointer"
            >
                <span className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <Users size={12} className="shrink-0" />
                <span className="text-[11px]">
                    {onlineCount === null ? "…" : `${onlineCount} online`}
                </span>
            </button>

            {open && (
                <div
                    className="absolute bottom-full left-0 mb-2 w-72 rounded-xl border bg-[#1c3a3a] shadow-xl p-2 z-30 max-h-72 overflow-y-auto"
                    style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                    <p className="text-[10px] uppercase tracking-widest text-white/40 px-2 pb-1.5">
                        Admin sessions (last 8h)
                    </p>
                    {sessions.length === 0 ? (
                        <p className="text-xs text-white/50 px-2 py-2">No active sessions found.</p>
                    ) : (
                        sessions.map((s) => (
                            <div key={s.sessionId} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/5">
                                <span
                                    className="w-1.5 h-1.5 rounded-full shrink-0"
                                    style={{ background: s.online ? "#34d399" : "rgba(255,255,255,0.25)" }}
                                />
                                <div className="min-w-0 flex-1">
                                    <p className="text-[11px] text-white/80 truncate">
                                        {shortUA(s.userAgent)} · {s.ip}
                                    </p>
                                    <p className="text-[10px] text-white/40">
                                        {s.online ? "Online now" : `Last seen ${timeAgo(s.lastSeenAt)}`}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
