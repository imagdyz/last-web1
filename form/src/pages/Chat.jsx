import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Phone, Send, Paperclip, Smile, MoreVertical, ShieldCheck, ChevronLeft } from "lucide-react";
import { DOCTORS } from '../data/doctors';

export default function Chat() {
    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const doctorId = Number(id);
    const doctor =
        location.state?.doctor ||
        DOCTORS.find((d) => d.id === doctorId) ||
        DOCTORS[0];

    const [messages, setMessages] = useState([
        { id: 1, text: `مرحباً بك! أنا الدكتور ${doctor.name}. كيف يمكنني مساعدتك اليوم؟`, sender: 'doctor', time: '10:00 ص' },
        { id: 2, text: "أهلاً دكتور، أردت الاستفسار عن نتائج التحاليل الأخيرة الخاصة بي.", sender: 'user', time: '10:05 ص' },
        { id: 3, text: "بالتأكيد، دعني أفتح ملفك الطبي. هل يمكنك الانتظار لحظة؟", sender: 'doctor', time: '10:06 ص' },
    ]);
    const [newMessage, setNewMessage] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!newMessage.trim()) return;
        
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        
        const newMsg = {
            id: messages.length + 1,
            text: newMessage.trim(),
            sender: 'user',
            time: timeStr
        };
        
        setMessages([...messages, newMsg]);
        setNewMessage("");

        setTimeout(() => {
            setMessages(prev => [...prev, {
                id: prev.length + 1,
                text: "لقد فهمت ذلك. دعنا نحدد موعداً لمناقشة هذا الأمر بالتفصيل.",
                sender: 'doctor',
                time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
            }]);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#fcfdfe] flex flex-col font-sans" dir="rtl">
            {/* Header Section */}
            <header className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm border-b border-slate-100">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 hover:bg-slate-100 transition-all"
                    >
                        <ArrowRight size={20} />
                    </button>
                    <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate(`/doctor/profile/${doctor.id}`, { state: { doctor } })}>
                        <div className="relative">
                            <img src={doctor.img} alt={doctor.name} className="w-11 h-11 rounded-2xl object-cover border border-slate-100 shadow-md group-hover:scale-105 transition-transform" />
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white shadow-sm"></div>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <h1 className="text-sm font-black text-slate-900">{doctor.name}</h1>
                                <ShieldCheck size={14} className="text-blue-500" />
                            </div>
                            <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">نشط الآن</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button 
                        onClick={() => navigate('/doctor/call', { state: { doctor } })} 
                        className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                    >
                        <Phone size={18} />
                    </button>
                </div>
            </header>

            {/* Chat Messages */}
            <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-transparent to-blue-50/20">
                <div className="flex justify-center my-6">
                    <span className="px-4 py-1.5 bg-slate-100/50 text-slate-400 text-[10px] font-black rounded-full uppercase tracking-[2px]">اليوم</span>
                </div>
                
                {messages.map((msg) => {
                    const isDoctor = msg.sender === 'doctor';
                    return (
                        <div key={msg.id} className={`flex ${isDoctor ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                            <div className={`max-w-[80%] flex gap-3 ${isDoctor ? 'flex-row' : 'flex-row-reverse'}`}>
                                {isDoctor && (
                                    <img src={doctor.img} alt={doctor.name} className="w-8 h-8 rounded-xl self-end mb-1 shadow-sm" />
                                )}
                                <div className="flex flex-col">
                                    <div className={`px-5 py-3.5 rounded-[24px] shadow-sm relative ${
                                        isDoctor 
                                            ? 'bg-white border border-slate-100 text-slate-800 rounded-br-sm' 
                                            : 'bg-blue-600 text-white rounded-bl-sm shadow-blue-600/20'
                                    }`}>
                                        <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold text-slate-400 mt-2 ${isDoctor ? 'text-right' : 'text-left'}`}>
                                        {msg.time}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input Area */}
            <footer className="bg-white/80 backdrop-blur-xl p-6 border-t border-slate-100 sticky bottom-0">
                <div className="max-w-4xl mx-auto flex items-center gap-3">
                    <div className="flex-1 bg-slate-50 rounded-[28px] border border-slate-200 flex items-center px-2 py-2 focus-within:border-blue-500 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-blue-500/5 transition-all">
                        <button className="w-10 h-10 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center">
                            <Smile size={20} />
                        </button>
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSend();
                                }
                            }}
                            placeholder="اكتب رسالتك هنا..."
                            className="flex-1 bg-transparent border-none outline-none text-sm px-3 py-2 text-slate-900 font-medium placeholder-slate-400"
                        />
                        <button className="w-10 h-10 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center">
                            <Paperclip size={20} />
                        </button>
                    </div>
                    <button 
                        onClick={handleSend}
                        disabled={!newMessage.trim()}
                        className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${
                            newMessage.trim() 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/30 rotate-0' 
                                : 'bg-slate-100 text-slate-400 shadow-none -rotate-12'
                        }`}
                    >
                        <Send size={22} className="translate-x-[-2px]" />
                    </button>
                </div>
            </footer>
        </div>
    );
}

