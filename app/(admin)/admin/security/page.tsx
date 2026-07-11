"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldAlert, Github, ExternalLink, AlertTriangle } from "lucide-react";

interface DomainGroup {
    host: string;
    count: number;
    firstSeen: string;
    lastSeen: string;
    sampleIps: string[];
}

export default function SecurityAdminPage() {
    const [domains, setDomains] = useState<DomainGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/admin/clone-alerts");
                const data = await res.json();
                if (data.success) setDomains(data.domains);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div>
            <div className="mb-5">
                <h1 className="text-xl font-semibold text-[#1c3a3a] flex items-center gap-2">
                    <ShieldAlert size={18} /> Security
                </h1>
                <p className="text-sm text-[#7a9088]">
                    Site clone detection and GitHub repository monitoring.
                </p>
            </div>

            {/* Clone detection */}
            <div className="rounded-2xl border bg-white p-5 mb-6" style={{ borderColor: "#e4eee8" }}>
                <h2 className="text-sm font-semibold text-[#1c3a3a] mb-1">Site clone detection</h2>
                <p className="text-xs text-[#7a9088] mb-4">
                    Every page load pings back to trymentel.com. If your own front-end code shows up
                    running on a different domain, it lands here — and you get an email the first time
                    each domain is seen (once per day per domain, so it can&apos;t spam you).
                </p>

                {loading ? (
                    <div className="flex items-center justify-center py-8 text-[#a0b8ac]">
                        <Loader2 size={18} className="animate-spin" />
                    </div>
                ) : domains.length === 0 ? (
                    <div className="text-center py-8">
                        <ShieldAlert size={22} className="mx-auto mb-2 text-[#c8ddd2]" />
                        <p className="text-xs text-[#a0b8ac]">No foreign domains detected. Nothing to review.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        {domains.map((d) => (
                            <div key={d.host} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(185,74,79,0.06)" }}>
                                <AlertTriangle size={14} className="shrink-0" style={{ color: "#b94a4f" }} />
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate" style={{ color: "#b94a4f" }}>{d.host}</p>
                                    <p className="text-xs truncate" style={{ color: "#7a9088" }}>
                                        {d.count} hit{d.count !== 1 ? "s" : ""} · first seen {new Date(d.firstSeen).toLocaleDateString()} · last seen {new Date(d.lastSeen).toLocaleString()}
                                    </p>
                                    <p className="text-[10px] text-[#a0b8ac] mt-0.5">Sample visitor IPs: {d.sampleIps.join(", ")}</p>
                                </div>
                                <a
                                    href={`https://${d.host}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs font-medium px-3 py-1.5 rounded-full border flex items-center gap-1 shrink-0"
                                    style={{ borderColor: "#e4eee8", color: "#3d8b8b" }}
                                >
                                    Visit <ExternalLink size={11} />
                                </a>
                            </div>
                        ))}
                    </div>
                )}

                <p className="text-[11px] text-[#a0b8ac] mt-4 leading-relaxed">
                    Worth knowing: the IP shown is whoever is <em>viewing</em> that domain, not necessarily
                    whoever built it. And this only catches clones that still include the original tracking
                    script — a careful copy that strips it out won&apos;t show up here.
                </p>
            </div>

            {/* GitHub webhook */}
            <div className="rounded-2xl border bg-white p-5" style={{ borderColor: "#e4eee8" }}>
                <h2 className="text-sm font-semibold text-[#1c3a3a] mb-1 flex items-center gap-1.5">
                    <Github size={15} /> GitHub fork notifications
                </h2>
                <p className="text-xs text-[#7a9088] mb-3">
                    If your repository is on GitHub, you can get an email the instant someone forks it —
                    complete with their actual GitHub username, unlike anonymous site scraping.
                </p>
                <ol className="text-xs text-[#5a7a6e] list-decimal ml-4 space-y-1">
                    <li>Your repo → Settings → Webhooks → Add webhook</li>
                    <li>Payload URL: <code className="font-mono">https://www.trymentel.com/api/webhooks/github</code></li>
                    <li>Content type: <code className="font-mono">application/json</code></li>
                    <li>Secret: generate one and add it to <code className="font-mono">.env</code> as <code className="font-mono">GITHUB_WEBHOOK_SECRET</code></li>
                    <li>Select events: check &quot;Forks&quot; (and &quot;Star&quot; if you want those too)</li>
                </ol>
            </div>
        </div>
    );
}
