import React, { useState, useEffect, useRef, useCallback } from "react";
import { Send, Bot, User, Sparkles, AlertCircle, ChevronLeft, Mic, Trash2, Volume2, VolumeX } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function getSpeechRecognition() {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const INITIAL_MESSAGE = {
    id: 1,
    text: "مرحباً بك! أنا مساعد STOMACH الذكي المتطور. كيف يمكنني مساعدتك طبياً اليوم؟ أنا هنا لتحليل أعراضك وتقديم استشارات أولية دقيقة.",
    sender: "bot",
    time: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })
};

export default function ChatBot() {
    const { user, medicalData, API_URL } = useAuth();
    const [messages, setMessages] = useState([INITIAL_MESSAGE]);
    const [inputText, setInputText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState("");
    const [speakReplies, setSpeakReplies] = useState(true);
    const scrollRef = useRef(null);
    const recognitionRef = useRef(null);
    const busyRef = useRef(false);

    const speechSupported = typeof window !== "undefined" && !!getSpeechRecognition() && (window.isSecureContext || window.location.hostname === "localhost");

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    useEffect(() => {
        return () => {
            try {
                recognitionRef.current?.stop?.();
            } catch { /* ignore */ }
            window.speechSynthesis?.cancel?.();
        };
    }, []);

    const speakText = useCallback((text) => {
        if (!speakReplies || !text?.trim() || typeof window === "undefined" || !window.speechSynthesis) return;
        window.speechSynthesis.cancel();
        const plain = text.replace(/\s+/g, " ").trim().slice(0, 4000);
        const u = new SpeechSynthesisUtterance(plain);
        u.lang = "ar-EG";
        u.rate = 0.95;
        window.speechSynthesis.speak(u);
    }, [speakReplies]);

    const stopListening = useCallback(() => {
        try {
            recognitionRef.current?.stop?.();
        } catch { /* ignore */ }
        setIsListening(false);
    }, []);

    const processMedicalQueryFallback = useCallback((text) => {
        const query = text.toLowerCase();
        const foundSymptom = medicalData?.symptoms?.find(s => query.includes(s.name.toLowerCase()));
        const foundCondition = medicalData?.conditions?.find(c => query.includes(c.name.toLowerCase()));

        if (foundCondition) {
            return `[نظام احتياطي] يبدو أنك تسأل عن "${foundCondition.name}". هذا المرض مرتبط بـ ${foundCondition.symptoms?.map(s => s.name).join(' و ')}. \n\n(ملاحظة: واجهنا مشكلة في الاتصال بالذكاء الاصطناعي المتقدم، أرد عليك حالياً من قاعدة بياناتنا المحلية).`;
        }
        if (foundSymptom) {
            return `[نظام احتياطي] تم رصد عرض "${foundSymptom.name}". أنصحك بمراجعة سجلاتك الطبية أو حجز موعد. \n\n(ملاحظة: الرد من قاعدة البيانات المحلية لتعذر الاتصال بالـ AI).`;
        }
        return "عذراً، أواجه مشكلة تقنية في الاتصال بمحرك الذكاء الاصطناعي العالمي حالياً. يمكنك سؤالي عن أعراض محددة مسجلة في النظام وسأحاول مساعدتك من قاعدة بياناتي المحلية.";
    }, [medicalData]);

    const callGeminiAPI = useCallback(async (userPrompt) => {
        const context = `
        You are STOMACH AI, a professional medical assistant for a gastroenterology portal in Egypt.
        User Name: ${user?.name || 'Guest'}
        Available Medical Data in our system:
        - Conditions: ${medicalData?.conditions?.map(c => c.name).join(', ')}
        - Symptoms: ${medicalData?.symptoms?.map(s => s.name).join(', ')}
        - Organs: ${medicalData?.organs?.map(o => o.name).join(', ')}

        Instructions:
        1. Speak in professional Arabic.
        2. Be helpful but cautious. Suggest doctors for severe symptoms.
        3. Reference our system's diseases.
        4. Always end with the medical disclaimer.
        `;

        try {
            const response = await fetch(`${API_URL}/chatbot.php`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    context,
                    prompt: userPrompt
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Chatbot API Error Detail:", JSON.stringify(errorData, null, 2));
                throw new Error(errorData.error?.message || "API Request Failed");
            }

            const data = await response.json();
            return data.reply;
        } catch (error) {
            console.error("Chatbot Connection Error:", error);
            // Fallback to Local Smart Logic if API fails
            return processMedicalQueryFallback(userPrompt);
        }
    }, [user, medicalData, API_URL, processMedicalQueryFallback]);

    const sendUserMessage = useCallback(async (rawText) => {
        const text = rawText.trim();
        if (!text || busyRef.current) return;

        busyRef.current = true;
        const userMsg = {
            id: Date.now(),
            text,
            sender: "user",
            time: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMsg]);
        setInputText("");
        setIsTyping(true);

        try {
            const aiResponse = await callGeminiAPI(text);
            const botMsg = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: "bot",
                time: new Date().toLocaleTimeString("ar-EG", { hour: '2-digit', minute: '2-digit' })
            };
            setMessages(prev => [...prev, botMsg]);
            speakText(aiResponse);
        } finally {
            setIsTyping(false);
            busyRef.current = false;
        }
    }, [callGeminiAPI, speakText]);

    const toggleListen = useCallback(() => {
        setSpeechError("");
        if (!speechSupported) {
            setSpeechError("المتصفح لا يدعم التحدث، أو الموقع يجب أن يفتح عبر HTTPS.");
            return;
        }
        if (isListening) {
            stopListening();
            return;
        }
        const Ctor = getSpeechRecognition();
        const rec = new Ctor();
        rec.lang = "ar-EG";
        rec.interimResults = false;
        rec.continuous = false;
        rec.maxAlternatives = 1;

        rec.onstart = () => setIsListening(true);
        rec.onend = () => setIsListening(false);
        rec.onerror = (ev) => {
            setIsListening(false);
            if (ev.error === "not-allowed" || ev.error === "service-not-allowed") {
                setSpeechError("اسمح باستخدام الميكروفون من إعدادات المتصفح.");
            } else if (ev.error !== "aborted" && ev.error !== "no-speech") {
                setSpeechError("تعذر التعرف على الصوت. حاول مرة أخرى.");
            }
        };
        rec.onresult = (ev) => {
            const transcript = ev.results[0]?.[0]?.transcript?.trim();
            stopListening();
            if (transcript) {
                setInputText(transcript);
                sendUserMessage(transcript);
            }
        };

        recognitionRef.current = rec;
        try {
            rec.start();
        } catch {
            setSpeechError("تعذر بدء الميكروفون.");
            setIsListening(false);
        }
    }, [speechSupported, isListening, stopListening, sendUserMessage]);

    const handleSend = (e) => {
        e.preventDefault();
        sendUserMessage(inputText);
    };

    const clearChat = () => {
        if (window.confirm("هل تود مسح سجل المحادثة؟")) {
            window.speechSynthesis?.cancel?.();
            stopListening();
            setMessages([INITIAL_MESSAGE]);
        }
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-2xl hover:scale-110 transition-transform z-[9999]"
                >
                    <Bot size={32} />
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[calc(100%-48px)] sm:w-[380px] h-[600px] max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col font-sans overflow-hidden z-[9999] border border-slate-100" dir="rtl">
                    {/* Chat Header */}
                    <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between shadow-sm z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                        <Bot size={28} />
                                    </div>
                                    <div className="absolute -bottom-1 -left-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-lg leading-none mb-1">STOMACH AI Assistant</h2>
                                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                                        <Sparkles size={10} /> مدعوم بـ Gemini AI
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => {
                                    window.speechSynthesis?.cancel?.();
                                    setSpeakReplies((v) => !v);
                                }}
                                className={`p-2 rounded-xl transition-all ${speakReplies ? "text-blue-600 bg-blue-50" : "text-slate-300 hover:bg-slate-50"}`}
                                title={speakReplies ? "إيقاف القراءة" : "تشغيل القراءة"}
                            >
                                {speakReplies ? <Volume2 size={18} /> : <VolumeX size={18} />}
                            </button>
                            <button
                                onClick={clearChat}
                                className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                                title="مسح المحادثة"
                            >
                                <Trash2 size={18} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors ml-2"
                                title="إغلاق الشات"
                            >
                                <ChevronLeft size={20} className="rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/* Disclaimer */}
                    <div className="mx-6 mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                        <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                        <p className="text-[10px] font-bold text-rose-700 leading-relaxed">
                            تنبيه: هذا المساعد يعمل بـ Gemini AI. المعلومات الطبية المقدمة استرشادية فقط وليست تشخيصاً نهائياً. في الحالات الطارئة، اتصل بالرقم 123 فوراً. يمكنك الضغط على أيقونة الميكروفون والتحدث بالعربية (يتطلب HTTPS والإذن بالميكروفون).
                        </p>
                    </div>

                    {speechError && (
                        <div className="mx-6 mt-3 p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] font-bold text-amber-800">
                            {speechError}
                        </div>
                    )}

                    {/* Messages Area */}
                    <div
                        ref={scrollRef}
                        className="flex-1 overflow-y-auto px-6 py-6 space-y-6 scrollbar-hide"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === 'bot' ? 'justify-start' : 'justify-end'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                            >
                                <div className={`max-w-[85%] flex gap-3 ${msg.sender === 'bot' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${msg.sender === 'bot' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-white'
                                        }`}>
                                        {msg.sender === 'bot' ? <Bot size={20} /> : <User size={20} />}
                                    </div>
                                    <div className="flex flex-col">
                                        <div className={`px-5 py-4 rounded-[28px] shadow-sm relative whitespace-pre-line ${msg.sender === 'bot'
                                                ? "bg-white text-slate-900 border border-slate-100 rounded-tr-none"
                                                : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tl-none"
                                            }`}>
                                            <p className="text-sm font-bold leading-relaxed">{msg.text}</p>
                                        </div>
                                        <span className={`text-[9px] font-black mt-2 text-slate-400 ${msg.sender === 'bot' ? 'text-right' : 'text-left'}`}>
                                            {msg.time}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex justify-start animate-in fade-in duration-300">
                                <div className="flex gap-3 items-center">
                                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
                                        <Bot size={20} />
                                    </div>
                                    <div className="bg-white border border-slate-100 px-4 py-3 rounded-[20px] flex items-center gap-3 shadow-sm">
                                        <p className="text-[10px] font-black text-slate-400 animate-pulse">جاري التفكير طبياً...</p>
                                        <div className="flex gap-1">
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-6 bg-white border-t border-slate-100">
                        <form
                            onSubmit={handleSend}
                            className="relative flex items-center gap-3"
                        >
                            <div className="relative flex-1 group">
                                <input
                                    type="text"
                                    placeholder="اكتب هنا أو اضغط الميكروفون وتحدث..."
                                    value={inputText}
                                    onChange={(e) => setInputText(e.target.value)}
                                    className="w-full pr-14 pl-6 py-4.5 bg-slate-50 border border-slate-100 rounded-[28px] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all text-sm font-bold shadow-sm"
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <button
                                        type="button"
                                        onClick={toggleListen}
                                        disabled={!speechSupported || isTyping}
                                        title={isListening ? "إيقاف الاستماع" : "تحدث مع المساعد"}
                                        className={`p-2.5 rounded-xl transition-colors disabled:opacity-40 ${isListening
                                                ? "text-white bg-rose-500 animate-pulse"
                                                : "text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                            }`}
                                    >
                                        <Mic size={20} />
                                    </button>
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={!inputText.trim() || isTyping}
                                className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
                            >
                                <Send size={24} className="rotate-180" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
