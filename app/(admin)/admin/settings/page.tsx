// "use client";

// // app/admin/settings/page.tsx
// import { useState } from "react";
// import {
//     CheckCircle, AlertCircle, Save, Plus, Trash2,
//     User, DollarSign, Bell, Shield, Building2, Mail,
// } from "lucide-react";

// // ── Types ──────────────────────────────────────────────────────────────────────
// interface Therapist { id: string; name: string; title: string; email: string; color: string; }
// interface SessionType { id: string; name: string; durationMin: number; priceKobo: number; }

// const COLORS = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f", "#3d5a7a"];

// // Therapists
// export function Therapists() {
//     const [therapists, setTherapists] = useState<Therapist[]>([
//         { id: "1", name: "Yetunde", title: "Clinical Psychologist", email: "yetunde@trymentel.com", color: "#4e8c6a" },
//         // { id: "2", name: "Dr. Chukwu", title: "Psychiatrist", email: "chukwu@mentel.com", color: "#3d8b8b" },
//         // { id: "3", name: "Dr. Bello", title: "Therapist", email: "bello@mentel.com", color: "#7b6fa9" },
//         // { id: "4", name: "Dr. Okonkwo", title: "Counselling Psychologist", email: "okonkwo@mentel.com", color: "#8b6e3d" },
//     ]);
//     return { therapists, setTherapists };
// }

// // Session types & pricing
// export function SessionTypes() {
//     const [sessionTypes, setSessionTypes] = useState<SessionType[]>([
//         { id: "1", name: "Initial Assessment", durationMin: 30, priceKobo: 0 },
//         { id: "2", name: "Single Session", durationMin: 50, priceKobo: 1000000 },
//         { id: "3", name: "Monthly Plan", durationMin: 200, priceKobo: 3500000 },
//         // { id: "4", name: "Group Session", durationMin: 90, priceKobo: 800000 },
//         // { id: "1", name: "Initial Assessment", durationMin: 90, priceKobo: 2500000 },
//         // { id: "2", name: "Individual Session", durationMin: 50, priceKobo: 1500000 },
//         // { id: "3", name: "Follow-up Session", durationMin: 50, priceKobo: 1500000 },
//         // { id: "4", name: "Group Session", durationMin: 90, priceKobo: 800000 },
//     ]);
//     return { sessionTypes, setSessionTypes };
// }
// // ── Settings page ──────────────────────────────────────────────────────────────
// export default function SettingsPage() {
//     const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
//     const [activeSection, setActiveSection] = useState<string>("practice");

//     // Practice info
//     const [practiceName, setPracticeName] = useState("Mentel - Mental Health");
//     const [practiceEmail, setPracticeEmail] = useState("contact@trymentel.com");
//     const [practicePhone, setPracticePhone] = useState("+234 703 136 2034");
//     const [practiceAddress, setPracticeAddress] = useState("Lagos, Nigeria");
//     const [currency, setCurrency] = useState("NGN");
//     const [timezone, setTimezone] = useState("Africa/Lagos");

//     const [newTherapist, setNewTherapist] = useState({ name: "", title: "", email: "", color: COLORS[0] });
//     const [addingTherapist, setAddingTherapist] = useState(false);
//     const { therapists, setTherapists } = Therapists();
//     const { sessionTypes, setSessionTypes } = SessionTypes();


//     const [editingType, setEditingType] = useState<string | null>(null);

//     // Notifications
//     const [notifNewLead, setNotifNewLead] = useState(true);
//     const [notifHighSev, setNotifHighSev] = useState(true);
//     const [notifNoShow, setNotifNoShow] = useState(true);
//     const [notifPayPending, setNotifPayPending] = useState(true);
//     const [notifEmail, setNotifEmail] = useState("admin@trymentel.com");

//     const showToast = (msg: string, ok = true) => {
//         setToast({ msg, ok }); setTimeout(() => setToast(null), 3000);
//     };

//     const addTherapist = () => {
//         if (!newTherapist.name.trim() || !newTherapist.email.trim()) return;
//         setTherapists(t => [...t, { ...newTherapist, id: Date.now().toString() }]);
//         setNewTherapist({ name: "", title: "", email: "", color: COLORS[0] });
//         setAddingTherapist(false);
//         showToast("Therapist added");
//     };

//     const removeTherapist = (id: string) => {
//         setTherapists(t => t.filter(th => th.id !== id));
//         showToast("Therapist removed");
//     };

//     const updateSessionType = (id: string, field: keyof SessionType, value: string | number) => {
//         setSessionTypes(t => t.map(s => s.id === id ? { ...s, [field]: value } : s));
//     };

//     const saveSection = () => {
//         showToast("Settings saved");
//     };

//     const SECTIONS = [
//         { id: "practice", icon: Building2, label: "Practice Info" },
//         { id: "therapists", icon: User, label: "Therapists" },
//         { id: "pricing", icon: DollarSign, label: "Pricing" },
//         { id: "notifications", icon: Bell, label: "Notifications" },
//         { id: "security", icon: Shield, label: "Security" },
//     ];

//     return (
//         <div className="flex flex-col gap-4 max-w-[900px]">
//             <style>{`
//         @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
//         input:focus, textarea:focus, select:focus { border-color: #4e7a5e !important; outline: none; }
//         .toggle { position:relative; display:inline-block; width:40px; height:22px; }
//         .toggle input { opacity:0; width:0; height:0; }
//         .slider { position:absolute; cursor:pointer; inset:0; background:#ddeae2; border-radius:99px; transition:.2s; }
//         .slider:before { position:absolute; content:""; height:16px; width:16px; left:3px; bottom:3px; background:white; border-radius:50%; transition:.2s; }
//         input:checked + .slider { background:#4e7a5e; }
//         input:checked + .slider:before { transform:translateX(18px); }
//       `}</style>

//             {toast && (
//                 <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
//                     style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
//                     {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.msg}
//                 </div>
//             )}

//             <div>
//                 <h1 className="text-[18px] font-bold text-[#1c3a3a]">Settings</h1>
//                 <p className="text-[12px] text-[#7a9088]">Configure your practice</p>
//             </div>

//             <div className="flex gap-4" style={{ alignItems: "flex-start" }}>
//                 {/* Side nav */}
//                 <div className="bg-white rounded-2xl border border-[#ddeae2] p-2 shadow-[0_1px_8px_rgba(28,58,58,0.04)] shrink-0 w-[180px]">
//                     {SECTIONS.map(({ id, icon: Icon, label }) => (
//                         <button key={id} onClick={() => setActiveSection(id)}
//                             className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none transition-colors mb-0.5"
//                             style={{
//                                 background: activeSection === id ? "#edf7f1" : "transparent",
//                                 color: activeSection === id ? "#3a7a58" : "#7a9088",
//                             }}>
//                             <Icon size={14} />
//                             {label}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Content */}
//                 <div className="flex-1 bg-white rounded-2xl border border-[#ddeae2] p-6 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">

//                     {/* ── Practice Info ── */}
//                     {activeSection === "practice" && (
//                         <div className="flex flex-col gap-4">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a] mb-1">Practice Information</div>
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Practice Name</label>
//                                     <input value={practiceName} onChange={e => setPracticeName(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Contact Email</label>
//                                     <input value={practiceEmail} onChange={e => setPracticeEmail(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Phone</label>
//                                     <input value={practicePhone} onChange={e => setPracticePhone(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Address</label>
//                                     <input value={practiceAddress} onChange={e => setPracticeAddress(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Currency</label>
//                                     <select value={currency} onChange={e => setCurrency(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                         <option value="NGN">NGN — Nigerian Naira (₦)</option>
//                                         <option value="USD">USD — US Dollar ($)</option>
//                                         <option value="GBP">GBP — British Pound (£)</option>
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Timezone</label>
//                                     <select value={timezone} onChange={e => setTimezone(e.target.value)}
//                                         className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
//                                         <option value="Africa/Lagos">Africa/Lagos (WAT +01:00)</option>
//                                         <option value="Europe/London">Europe/London (GMT)</option>
//                                         <option value="America/New_York">America/New_York (EST)</option>
//                                     </select>
//                                 </div>
//                             </div>
//                             <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
//                                 <button onClick={saveSection} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <Save size={13} /> Save Changes
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Therapists ── */}
//                     {activeSection === "therapists" && (
//                         <div className="flex flex-col gap-4">
//                             <div className="flex items-center justify-between">
//                                 <div className="text-[15px] font-semibold text-[#1c3a3a]">Therapists</div>
//                                 <button onClick={() => setAddingTherapist(a => !a)}
//                                     className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <Plus size={13} /> Add Therapist
//                                 </button>
//                             </div>

//                             {/* Add form */}
//                             {addingTherapist && (
//                                 <div className="p-4 bg-[#f7faf8] rounded-xl border border-[#ddeae2]">
//                                     <div className="grid grid-cols-2 gap-3 mb-3">
//                                         <div>
//                                             <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Name</label>
//                                             <input value={newTherapist.name} onChange={e => setNewTherapist(t => ({ ...t, name: e.target.value }))} placeholder="Dr. Full Name"
//                                                 className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                         </div>
//                                         <div>
//                                             <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Title</label>
//                                             <input value={newTherapist.title} onChange={e => setNewTherapist(t => ({ ...t, title: e.target.value }))} placeholder="e.g. Clinical Psychologist"
//                                                 className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                         </div>
//                                         <div>
//                                             <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Email</label>
//                                             <input value={newTherapist.email} onChange={e => setNewTherapist(t => ({ ...t, email: e.target.value }))} placeholder="email@mentel.com"
//                                                 className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                         </div>
//                                         <div>
//                                             <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Colour</label>
//                                             <div className="flex gap-2">
//                                                 {COLORS.map(c => (
//                                                     <button key={c} onClick={() => setNewTherapist(t => ({ ...t, color: c }))}
//                                                         className="w-7 h-7 rounded-full border-2 cursor-pointer transition-all"
//                                                         style={{ background: c, borderColor: newTherapist.color === c ? "#1c3a3a" : "transparent" }} />
//                                                 ))}
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="flex gap-2 justify-end">
//                                         <button onClick={() => setAddingTherapist(false)} className="px-3 py-1.5 rounded-lg border border-[#ddeae2] bg-white text-[#7a9088] text-[11px] cursor-pointer">Cancel</button>
//                                         <button onClick={addTherapist} className="px-4 py-1.5 rounded-lg text-white text-[11px] font-semibold border-none cursor-pointer"
//                                             style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>Add</button>
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Therapist list */}
//                             <div className="flex flex-col gap-2">
//                                 {therapists.map(t => (
//                                     <div key={t.id} className="flex items-center gap-3 p-3.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
//                                         <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background: t.color }}>
//                                             {t.name.split(" ").map(w => w[0]).join("").slice(0, 2)}
//                                         </div>
//                                         <div className="flex-1 min-w-0">
//                                             <div className="text-[13px] font-semibold text-[#1c3a3a]">{t.name}</div>
//                                             <div className="text-[11px] text-[#7a9088]">{t.title} · {t.email}</div>
//                                         </div>
//                                         <button onClick={() => removeTherapist(t.id)}
//                                             className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f] cursor-pointer hover:bg-[#fff0f0] transition-colors">
//                                             <Trash2 size={13} />
//                                         </button>
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Pricing ── */}
//                     {activeSection === "pricing" && (
//                         <div className="flex flex-col gap-4">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a]">Session Pricing</div>
//                             <div className="text-[11px] text-[#7a9088] -mt-2">These are the default rates used when logging sessions. You can override per-session.</div>
//                             <div className="flex flex-col gap-2">
//                                 {sessionTypes.map(s => (
//                                     <div key={s.id} className="p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
//                                         <div className="flex items-center gap-3">
//                                             <div className="flex-1 min-w-0">
//                                                 {editingType === s.id ? (
//                                                     <input value={s.name} onChange={e => updateSessionType(s.id, "name", e.target.value)}
//                                                         className="w-full py-1.5 px-2.5 border border-[#ddeae2] rounded-lg text-[13px] bg-white text-[#1c3a3a] font-semibold" style={{ fontFamily: "inherit" }} />
//                                                 ) : (
//                                                     <div className="text-[13px] font-semibold text-[#1c3a3a]">{s.name}</div>
//                                                 )}
//                                             </div>
//                                             <div className="flex items-center gap-3">
//                                                 <div className="text-center">
//                                                     <div className="text-[9px] text-[#7a9088] mb-1">Duration</div>
//                                                     {editingType === s.id ? (
//                                                         <input type="number" value={s.durationMin} onChange={e => updateSessionType(s.id, "durationMin", parseInt(e.target.value))}
//                                                             className="w-16 py-1 px-2 border border-[#ddeae2] rounded-lg text-[12px] bg-white text-[#1c3a3a] text-center" style={{ fontFamily: "inherit" }} />
//                                                     ) : (
//                                                         <div className="text-[12px] font-semibold text-[#1c3a3a]">{s.durationMin}min</div>
//                                                     )}
//                                                 </div>
//                                                 <div className="text-center">
//                                                     <div className="text-[9px] text-[#7a9088] mb-1">Price (₦)</div>
//                                                     {editingType === s.id ? (
//                                                         <input type="number" value={s.priceKobo / 100} onChange={e => updateSessionType(s.id, "priceKobo", Math.round(parseFloat(e.target.value) * 100))}
//                                                             className="w-24 py-1 px-2 border border-[#ddeae2] rounded-lg text-[12px] bg-white text-[#1c3a3a] text-center" style={{ fontFamily: "inherit" }} />
//                                                     ) : (
//                                                         <div className="text-[12px] font-bold text-[#4e7a5e]">₦{(s.priceKobo / 100).toLocaleString()}</div>
//                                                     )}
//                                                 </div>
//                                                 <button onClick={() => setEditingType(editingType === s.id ? null : s.id)}
//                                                     className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer border transition-colors"
//                                                     style={{
//                                                         borderColor: editingType === s.id ? "#4e7a5e" : "#ddeae2",
//                                                         background: editingType === s.id ? "#edf7f1" : "white",
//                                                         color: editingType === s.id ? "#3a7a58" : "#7a9088",
//                                                     }}>
//                                                     {editingType === s.id ? "Done" : "Edit"}
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
//                                 <button onClick={saveSection} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <Save size={13} /> Save Pricing
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Notifications ── */}
//                     {activeSection === "notifications" && (
//                         <div className="flex flex-col gap-4">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a]">Notification Preferences</div>
//                             <div>
//                                 <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Notification Email</label>
//                                 <input value={notifEmail} onChange={e => setNotifEmail(e.target.value)}
//                                     className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                             </div>
//                             <div className="flex flex-col gap-3 pt-2">
//                                 {[
//                                     { label: "New lead submitted", sub: "Alert when someone completes the wellness check-in", val: notifNewLead, set: setNotifNewLead },
//                                     { label: "High severity lead", sub: "Alert when a lead scores in the High band", val: notifHighSev, set: setNotifHighSev },
//                                     { label: "Appointment no-show", sub: "Alert when a client misses their appointment", val: notifNoShow, set: setNotifNoShow },
//                                     { label: "Payment pending >48h", sub: "Alert when a payment stays pending for over 2 days", val: notifPayPending, set: setNotifPayPending },
//                                 ].map(({ label, sub, val, set }) => (
//                                     <div key={label} className="flex items-center justify-between p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
//                                         <div>
//                                             <div className="text-[13px] font-semibold text-[#1c3a3a]">{label}</div>
//                                             <div className="text-[11px] text-[#7a9088] mt-0.5">{sub}</div>
//                                         </div>
//                                         <label className="toggle">
//                                             <input type="checkbox" checked={val} onChange={e => set(e.target.checked)} />
//                                             <span className="slider" />
//                                         </label>
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
//                                 <button onClick={saveSection} className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <Save size={13} /> Save Preferences
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                     {/* ── Security ── */}
//                     {activeSection === "security" && (
//                         <div className="flex flex-col gap-4">
//                             <div className="text-[15px] font-semibold text-[#1c3a3a]">Security</div>
//                             <div className="p-4 bg-[#fff8f0] rounded-xl border border-[#f5e0c0]">
//                                 <div className="text-[12px] font-semibold text-[#7a5a2a] mb-1">Admin Password</div>
//                                 <div className="text-[11px] text-[#7a9088]">Change your admin password below. Use at least 12 characters with uppercase, numbers, and symbols.</div>
//                             </div>
//                             <div className="flex flex-col gap-3">
//                                 {["Current Password", "New Password", "Confirm New Password"].map(label => (
//                                     <div key={label}>
//                                         <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">{label}</label>
//                                         <input type="password" placeholder="••••••••••••"
//                                             className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
//                                     </div>
//                                 ))}
//                             </div>
//                             <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
//                                 <button onClick={() => showToast("Password updated")}
//                                     className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
//                                     style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
//                                     <Shield size={13} /> Update Password
//                                 </button>
//                             </div>
//                         </div>
//                     )}

//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

// app/admin/settings/page.tsx
import { useState, useEffect, useCallback } from "react";
import {
    CheckCircle, AlertCircle, Save, Plus, Trash2,
    User, DollarSign, Bell, Shield, Building2, LogOut, RefreshCw,
} from "lucide-react";

interface Therapist { id: string; name: string; title: string; email: string; color: string; }
interface SessionType { id: string; name: string; durationMin: number; priceKobo: number; }
interface Practice {
    name: string; email: string; phone: string; address: string; currency: string; timezone: string;
}
interface Notifications {
    email: string; newLead: boolean; highSeverity: boolean; noShow: boolean; paymentPending: boolean;
}

const COLORS = ["#4e8c6a", "#3d8b8b", "#7b6fa9", "#8b6e3d", "#b94a4f", "#3d5a7a"];

const DEFAULT_PRACTICE: Practice = {
    name: "Mentel - Mental Health", email: "contact@trymentel.com",
    phone: "+234 703 136 2034", address: "Lagos, Nigeria",
    currency: "NGN", timezone: "Africa/Lagos",
};

export default function SettingsPage() {
    const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
    const [activeSection, setActiveSection] = useState("practice");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [therapists, setTherapists] = useState<Therapist[]>([]);
    const [sessionTypes, setSessionTypes] = useState<SessionType[]>([]);
    const [practice, setPractice] = useState<Practice>(DEFAULT_PRACTICE);
    const [notifications, setNotifications] = useState<Notifications>({
        email: "admin@trymentel.com", newLead: true, highSeverity: true, noShow: true, paymentPending: true,
    });

    const [newTherapist, setNewTherapist] = useState({ name: "", title: "", email: "", color: COLORS[0] });
    const [addingTherapist, setAddingTherapist] = useState(false);
    const [editingType, setEditingType] = useState<string | null>(null);

    // Passwords
    const [currentPass, setCurrentPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirmPass, setConfirmPass] = useState("");

    const showToast = (msg: string, ok = true) => {
        setToast({ msg, ok }); setTimeout(() => setToast(null), 3000);
    };

    const fetchSettings = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/settings");
            const data = await res.json();
            if (data.success) {
                setTherapists(data.therapists ?? []);
                setSessionTypes(data.sessionTypes ?? []);
                if (data.practice) setPractice(data.practice);
                if (data.notifications) setNotifications(data.notifications);
            }
        } finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchSettings(); }, [fetchSettings]);

    const saveSettings = async (patch: Record<string, unknown>) => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(patch),
            });
            const data = await res.json();
            if (data.success) showToast("Settings saved");
            else showToast("Failed to save", false);
        } finally { setSaving(false); }
    };

    const addTherapist = async () => {
        if (!newTherapist.name.trim() || !newTherapist.email.trim()) return;
        const updated = [...therapists, { ...newTherapist, id: Date.now().toString() }];
        setTherapists(updated);
        await saveSettings({ therapists: updated });
        setNewTherapist({ name: "", title: "", email: "", color: COLORS[0] });
        setAddingTherapist(false);
    };

    const removeTherapist = async (id: string) => {
        const updated = therapists.filter(t => t.id !== id);
        setTherapists(updated);
        await saveSettings({ therapists: updated });
    };

    const updateSessionType = (id: string, field: keyof SessionType, value: string | number) => {
        setSessionTypes(t => t.map(s => s.id === id ? { ...s, [field]: value } : s));
    };

    const saveSessionTypes = async () => {
        await saveSettings({ sessionTypes });
        setEditingType(null);
    };

    const handleLogout = async () => {
        try {
            await fetch("/api/admin/logout", { method: "POST" });
        } catch { /* ignore */ }
        window.location.href = "/admin/login";
    };

    const SECTIONS = [
        { id: "practice", icon: Building2, label: "Practice Info" },
        { id: "therapists", icon: User, label: "Therapists" },
        { id: "pricing", icon: DollarSign, label: "Pricing" },
        { id: "notifications", icon: Bell, label: "Notifications" },
        { id: "security", icon: Shield, label: "Security" },
    ];

    return (
        <div className="flex flex-col gap-4 max-w-[900px]">
            <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        input:focus, textarea:focus, select:focus { border-color: #4e7a5e !important; outline: none; }
        .toggle { position:relative; display:inline-block; width:40px; height:22px; }
        .toggle input { opacity:0; width:0; height:0; }
        .slider { position:absolute; cursor:pointer; inset:0; background:#ddeae2; border-radius:99px; transition:.2s; }
        .slider:before { position:absolute; content:""; height:16px; width:16px; left:3px; bottom:3px; background:white; border-radius:50%; transition:.2s; }
        input:checked + .slider { background:#4e7a5e; }
        input:checked + .slider:before { transform:translateX(18px); }
      `}</style>

            {toast && (
                <div className="fixed top-5 right-5 z-[9999] flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-[13px] font-medium shadow-lg"
                    style={{ background: toast.ok ? "#1c3a3a" : "#b94a4f", animation: "slideIn 0.2s ease" }}>
                    {toast.ok ? <CheckCircle size={14} /> : <AlertCircle size={14} />} {toast.msg}
                </div>
            )}

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-[18px] font-bold text-[#1c3a3a]">Settings</h1>
                    <p className="text-[12px] text-[#7a9088]">Configure your practice</p>
                </div>
                <button onClick={handleLogout}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f] text-[12px] font-medium cursor-pointer hover:bg-[#fff0f0] transition-colors">
                    <LogOut size={13} /> Logout
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="w-6 h-6 rounded-full border-2 border-[#4e8c6a] border-t-transparent animate-spin" />
                </div>
            ) : (
                <div className="flex gap-4" style={{ alignItems: "flex-start" }}>
                    {/* Side nav */}
                    <div className="bg-white rounded-2xl border border-[#ddeae2] p-2 shadow-[0_1px_8px_rgba(28,58,58,0.04)] shrink-0 w-[180px]">
                        {SECTIONS.map(({ id, icon: Icon, label }) => (
                            <button key={id} onClick={() => setActiveSection(id)}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none transition-colors mb-0.5"
                                style={{
                                    background: activeSection === id ? "#edf7f1" : "transparent",
                                    color: activeSection === id ? "#3a7a58" : "#7a9088",
                                }}>
                                <Icon size={14} /> {label}
                            </button>
                        ))}
                        <div className="mt-2 pt-2 border-t border-[#f0f4f2]">
                            <button onClick={handleLogout}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12px] font-medium cursor-pointer border-none transition-colors text-[#b94a4f] hover:bg-[#fff8f8]"
                                style={{ background: "transparent" }}>
                                <LogOut size={14} /> Logout
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl border border-[#ddeae2] p-6 shadow-[0_1px_8px_rgba(28,58,58,0.04)]">

                        {/* ── Practice Info ── */}
                        {activeSection === "practice" && (
                            <div className="flex flex-col gap-4">
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Practice Information</div>
                                <div className="grid grid-cols-2 gap-4">
                                    {([
                                        { label: "Practice Name", key: "name", type: "text" },
                                        { label: "Contact Email", key: "email", type: "email" },
                                        { label: "Phone", key: "phone", type: "tel" },
                                        { label: "Address", key: "address", type: "text" },
                                    ] as { label: string; key: keyof Practice; type: string }[]).map(({ label, key, type }) => (
                                        <div key={key}>
                                            <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">{label}</label>
                                            <input type={type} value={practice[key] as string}
                                                onChange={e => setPractice(p => ({ ...p, [key]: e.target.value }))}
                                                className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                        </div>
                                    ))}
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Currency</label>
                                        <select value={practice.currency} onChange={e => setPractice(p => ({ ...p, currency: e.target.value }))}
                                            className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                                            <option value="NGN">NGN — Nigerian Naira (₦)</option>
                                            <option value="USD">USD — US Dollar ($)</option>
                                            <option value="GBP">GBP — British Pound (£)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Timezone</label>
                                        <select value={practice.timezone} onChange={e => setPractice(p => ({ ...p, timezone: e.target.value }))}
                                            className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a] cursor-pointer" style={{ fontFamily: "inherit", appearance: "none" }}>
                                            <option value="Africa/Lagos">Africa/Lagos (WAT +01:00)</option>
                                            <option value="Europe/London">Europe/London (GMT)</option>
                                            <option value="America/New_York">America/New_York (EST)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
                                    <button onClick={() => saveSettings({ practice })} disabled={saving}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                        <Save size={13} /> {saving ? "Saving…" : "Save Changes"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Therapists ── */}
                        {activeSection === "therapists" && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="text-[15px] font-semibold text-[#1c3a3a]">Therapists</div>
                                    <button onClick={() => setAddingTherapist(a => !a)}
                                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12px] font-semibold text-white border-none cursor-pointer"
                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                        <Plus size={13} /> Add Therapist
                                    </button>
                                </div>

                                {addingTherapist && (
                                    <div className="p-4 bg-[#f7faf8] rounded-xl border border-[#ddeae2]">
                                        <div className="grid grid-cols-2 gap-3 mb-3">
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Name *</label>
                                                <input value={newTherapist.name} onChange={e => setNewTherapist(t => ({ ...t, name: e.target.value }))} placeholder="Full Name"
                                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Title</label>
                                                <input value={newTherapist.title} onChange={e => setNewTherapist(t => ({ ...t, title: e.target.value }))} placeholder="e.g. Clinical Psychologist"
                                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Email *</label>
                                                <input value={newTherapist.email} onChange={e => setNewTherapist(t => ({ ...t, email: e.target.value }))} placeholder="email@mentel.com"
                                                    className="w-full py-2 px-3 border border-[#ddeae2] rounded-xl text-[12px] bg-white text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-semibold text-[#7a9088] mb-1">Colour</label>
                                                <div className="flex gap-2">
                                                    {COLORS.map(c => (
                                                        <button key={c} onClick={() => setNewTherapist(t => ({ ...t, color: c }))}
                                                            className="w-7 h-7 rounded-full border-2 cursor-pointer transition-all"
                                                            style={{ background: c, borderColor: newTherapist.color === c ? "#1c3a3a" : "transparent" }} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => setAddingTherapist(false)} className="px-3 py-1.5 rounded-lg border border-[#ddeae2] bg-white text-[#7a9088] text-[11px] cursor-pointer">Cancel</button>
                                            <button onClick={addTherapist} disabled={!newTherapist.name.trim() || !newTherapist.email.trim() || saving}
                                                className="px-4 py-1.5 rounded-lg text-white text-[11px] font-semibold border-none cursor-pointer"
                                                style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                                {saving ? "Saving…" : "Add"}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-2">
                                    {therapists.length === 0 && (
                                        <p className="text-[12px] text-[#7a9088] text-center py-8">No therapists yet. Add one above.</p>
                                    )}
                                    {therapists.map(t => (
                                        <div key={t.id} className="flex items-center gap-3 p-3.5 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0" style={{ background: t.color }}>
                                                {t.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-[13px] font-semibold text-[#1c3a3a]">{t.name}</div>
                                                <div className="text-[11px] text-[#7a9088]">{t.title} · {t.email}</div>
                                            </div>
                                            <button onClick={() => removeTherapist(t.id)}
                                                className="w-8 h-8 rounded-lg flex items-center justify-center border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f] cursor-pointer hover:bg-[#fff0f0] transition-colors">
                                                <Trash2 size={13} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Pricing ── */}
                        {activeSection === "pricing" && (
                            <div className="flex flex-col gap-4">
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Session Pricing</div>
                                <div className="text-[11px] text-[#7a9088] -mt-2">Default rates when logging sessions. You can override per-session.</div>
                                <div className="flex flex-col gap-2">
                                    {sessionTypes.map(s => (
                                        <div key={s.id} className="p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                            <div className="flex items-center gap-3">
                                                <div className="flex-1 min-w-0">
                                                    {editingType === s.id ? (
                                                        <input value={s.name} onChange={e => updateSessionType(s.id, "name", e.target.value)}
                                                            className="w-full py-1.5 px-2.5 border border-[#ddeae2] rounded-lg text-[13px] bg-white text-[#1c3a3a] font-semibold" style={{ fontFamily: "inherit" }} />
                                                    ) : (
                                                        <div className="text-[13px] font-semibold text-[#1c3a3a]">{s.name}</div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="text-center">
                                                        <div className="text-[9px] text-[#7a9088] mb-1">Duration</div>
                                                        {editingType === s.id ? (
                                                            <input type="number" value={s.durationMin} onChange={e => updateSessionType(s.id, "durationMin", parseInt(e.target.value))}
                                                                className="w-16 py-1 px-2 border border-[#ddeae2] rounded-lg text-[12px] bg-white text-[#1c3a3a] text-center" style={{ fontFamily: "inherit" }} />
                                                        ) : (
                                                            <div className="text-[12px] font-semibold text-[#1c3a3a]">{s.durationMin}min</div>
                                                        )}
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="text-[9px] text-[#7a9088] mb-1">Price (₦)</div>
                                                        {editingType === s.id ? (
                                                            <input type="number" value={s.priceKobo / 100} onChange={e => updateSessionType(s.id, "priceKobo", Math.round(parseFloat(e.target.value) * 100))}
                                                                className="w-24 py-1 px-2 border border-[#ddeae2] rounded-lg text-[12px] bg-white text-[#1c3a3a] text-center" style={{ fontFamily: "inherit" }} />
                                                        ) : (
                                                            <div className="text-[12px] font-bold text-[#4e7a5e]">₦{(s.priceKobo / 100).toLocaleString()}</div>
                                                        )}
                                                    </div>
                                                    <button onClick={() => setEditingType(editingType === s.id ? null : s.id)}
                                                        className="px-3 py-1.5 rounded-lg text-[11px] font-medium cursor-pointer border transition-colors"
                                                        style={{
                                                            borderColor: editingType === s.id ? "#4e7a5e" : "#ddeae2",
                                                            background: editingType === s.id ? "#edf7f1" : "white",
                                                            color: editingType === s.id ? "#3a7a58" : "#7a9088",
                                                        }}>
                                                        {editingType === s.id ? "Done" : "Edit"}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
                                    <button onClick={saveSessionTypes} disabled={saving}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                        <Save size={13} /> {saving ? "Saving…" : "Save Pricing"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {activeSection === "notifications" && (
                            <div className="flex flex-col gap-4">
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Notification Preferences</div>
                                <div>
                                    <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Notification Email</label>
                                    <input value={notifications.email} onChange={e => setNotifications(n => ({ ...n, email: e.target.value }))}
                                        className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                </div>
                                <div className="flex flex-col gap-3 pt-2">
                                    {([
                                        { key: "newLead", label: "New lead submitted", sub: "Alert when someone completes the wellness check-in" },
                                        { key: "highSeverity", label: "High severity lead", sub: "Alert when a lead scores in the High band" },
                                        { key: "noShow", label: "Appointment no-show", sub: "Alert when a client misses their appointment" },
                                        { key: "paymentPending", label: "Payment pending >48h", sub: "Alert when a payment stays pending for over 2 days" },
                                    ] as { key: keyof Notifications; label: string; sub: string }[]).map(({ key, label, sub }) => (
                                        <div key={key} className="flex items-center justify-between p-4 bg-[#f7faf8] rounded-xl border border-[#e8f0ec]">
                                            <div>
                                                <div className="text-[13px] font-semibold text-[#1c3a3a]">{label}</div>
                                                <div className="text-[11px] text-[#7a9088] mt-0.5">{sub}</div>
                                            </div>
                                            <label className="toggle">
                                                <input type="checkbox" checked={notifications[key] as boolean}
                                                    onChange={e => setNotifications(n => ({ ...n, [key]: e.target.checked }))} />
                                                <span className="slider" />
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-end pt-2 border-t border-[#f0f4f2]">
                                    <button onClick={() => saveSettings({ notifications })} disabled={saving}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                        <Save size={13} /> {saving ? "Saving…" : "Save Preferences"}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* ── Security ── */}
                        {activeSection === "security" && (
                            <div className="flex flex-col gap-4">
                                <div className="text-[15px] font-semibold text-[#1c3a3a]">Security</div>
                                <div className="p-4 bg-[#fff8f0] rounded-xl border border-[#f5e0c0]">
                                    <div className="text-[12px] font-semibold text-[#7a5a2a] mb-1">Admin Password</div>
                                    <div className="text-[11px] text-[#7a9088]">Use at least 12 characters with uppercase, numbers, and symbols.</div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Current Password</label>
                                        <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="••••••••••••"
                                            className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">New Password</label>
                                        <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="••••••••••••"
                                            className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold text-[#7a9088] mb-1.5">Confirm New Password</label>
                                        <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} placeholder="••••••••••••"
                                            className="w-full py-2.5 px-3 border border-[#ddeae2] rounded-xl text-[13px] bg-[#f7faf8] text-[#1c3a3a]" style={{ fontFamily: "inherit" }} />
                                    </div>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-[#f0f4f2]">
                                    <button onClick={handleLogout}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer border border-[#f5e0e0] bg-[#fff8f8] text-[#b94a4f]">
                                        <LogOut size={13} /> Sign Out
                                    </button>
                                    <button onClick={() => {
                                        if (newPass !== confirmPass) { showToast("Passwords don't match", false); return; }
                                        if (newPass.length < 8) { showToast("Password too short", false); return; }
                                        showToast("Password updated");
                                        setCurrentPass(""); setNewPass(""); setConfirmPass("");
                                    }}
                                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[13px] font-semibold text-white border-none cursor-pointer"
                                        style={{ background: "linear-gradient(135deg,#4e7a5e,#3d8b8b)" }}>
                                        <Shield size={13} /> Update Password
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}