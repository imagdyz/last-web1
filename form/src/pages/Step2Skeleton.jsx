import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import skeletonImg from "../assets/digestive_3d.png";

const SYMPTOMS_BY_ORGAN = {
    "المريء": ["حموضة", "ألم أعلى البطن", "ألم بالصدر", "صعوبة بلع", "حرقة مزمنة بالمريء", "فقدان وزن غير مبرر"],
    "المعدة": ["ألم في المعدة", "ألم شديد في المعدة", "غثيان أو قيء", "حموضة", "سوء هضم", "فقدان وزن غير مبرر"],
    "الأمعاء الدقيقة": ["إسهال متكرر", "فقدان وزن غير مبرر", "انتفاخ البطن", "كثرة الغازات", "ألم بطن", "نقص فيتامينات أو عناصر غذائية"],
    "القولون": ["ألم بطن", "تقلصات بالبطن", "إسهال دموي", "إسهال متكرر أو إمساك متكرر", "شعور بعدم اكتمال حركة الأمعاء", "نزيف من الشرج أو مع البراز", "فقدان وزن غير مبرر", "انتفاخ البطن", "كثرة الغازات"],
    "الشرج": ["نزيف من الشرج أو مع البراز", "ألم أثناء التبرز", "ألم شديد أعلى البطن", "إفرازات من الشرج"],
    "الكبد": ["تعب عام وإرهاق", "تورم البطن (استسقاء)", "اصفرار الجلد أو العينين", "ألم بطن", "فقدان وزن غير مبرر"],
    "البنكرياس": ["ألم شديد أعلى البطن", "ألم بالبطن بعد الأكل الدسم", "ألم مزمن بالبطن", "سوء هضم", "اصفرار الجلد أو العينين", "ألم بطن", "فقدان وزن غير مبرر", "نقص فيتامينات أو عناصر غذائية"]
};

const ORGANS = [
  { id: "esophagus", name: "المريء", description: "أنبوب عضلي يربط الحلق بالمعدة" },
  { id: "stomach", name: "المعدة", description: "تقوم بهضم الطعام ميكانيكياً وكيميائياً" },
  { id: "liver", name: "الكبد", description: "أكبر غدة في الجسم، يفرز العصارة الصفراوية" },
  { id: "pancreas", name: "البنكرياس", description: "يفرز إنزيمات هاضمة وهرمونات مثل الإنسولين" },
  { id: "small_intestine", name: "الأمعاء الدقيقة", description: "يتم فيها امتصاص معظم العناصر الغذائية" },
  { id: "colon", name: "القولون", description: "يمتص الماء ويشكل الفضلات (الأمعاء الغليظة)" },
  { id: "rectum", name: "الشرج", description: "الجزء الأخير لتخزين وطرح الفضلات" },
];

const OrganIcons = {
  esophagus: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M45,5 C45,5 45,30 42,45 C38,65 42,75 42,75 C42,75 58,75 58,75 C58,75 62,65 58,45 C55,30 55,5 55,5 Z" />
      <path d="M42,75 Q35,85 25,85 Q40,95 50,95 Q60,95 75,85 Q65,85 58,75 Z" opacity="0.3" />
      <path d="M48,10 L48,70" stroke="white" strokeWidth="2" strokeDasharray="4 4" opacity="0.4" fill="none" />
    </svg>
  ),
  stomach: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M60,10 C45,10 40,30 35,45 C30,60 15,65 15,75 C15,85 25,90 40,90 C60,90 85,75 85,45 C85,25 75,10 60,10 Z" />
      <path d="M60,20 C70,20 75,30 75,45 C75,65 55,80 40,80 C30,80 25,78 25,75 C25,70 35,65 45,55 C50,50 55,35 55,20 C55,20 60,20 60,20 Z" fill="#ffffff" opacity="0.2" />
    </svg>
  ),
  liver: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M15,45 C15,30 30,15 60,15 C85,15 95,25 90,50 C85,75 60,85 35,80 C15,75 15,60 15,45 Z" />
      <path d="M35,25 C45,25 50,35 50,35 C50,35 25,35 25,45 C25,40 25,25 35,25 Z" fill="#ffffff" opacity="0.3" />
      <path d="M60,15 L60,85" stroke="#ffffff" strokeWidth="1.5" opacity="0.2" />
    </svg>
  ),
  pancreas: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M25,50 C15,45 15,35 30,40 C45,45 60,40 75,35 C85,30 95,45 85,55 C70,70 55,60 40,55 C30,50 25,50 25,50 Z" />
      <circle cx="35" cy="45" r="4" fill="#ffffff" opacity="0.4" />
      <circle cx="50" cy="48" r="4" fill="#ffffff" opacity="0.4" />
      <circle cx="65" cy="45" r="4" fill="#ffffff" opacity="0.4" />
      <circle cx="75" cy="42" r="3" fill="#ffffff" opacity="0.4" />
    </svg>
  ),
  small_intestine: (props) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M30,30 Q50,20 70,30 Q90,40 70,50 Q50,60 30,50 Q10,40 30,30 Z M40,60 Q60,50 80,60 Q90,70 70,80 Q50,90 30,80" />
      <path d="M30,50 Q40,60 50,60 Q50,60 70,80 M70,50 Q60,60 40,60 Q40,60 30,80" />
    </svg>
  ),
  colon: (props) => (
    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M20,80 L20,40 C20,20 30,15 50,15 C70,15 80,20 80,40 L80,80" />
      <path d="M10,80 L30,80 M10,60 L30,60 M10,40 L30,40 M40,5 L40,25 M60,5 L60,25 M70,40 L90,40 M70,60 L90,60 M70,80 L90,80" strokeWidth="6" />
    </svg>
  ),
  rectum: (props) => (
    <svg viewBox="0 0 100 100" fill="currentColor" {...props}>
      <path d="M30,15 L70,15 C75,50 65,75 55,90 C50,95 45,90 40,85 C35,75 25,50 30,15 Z" />
      <path d="M30,15 L70,15 C70,15 65,30 50,30 C35,30 30,15 30,15 Z" fill="#ffffff" opacity="0.3" />
    </svg>
  ),
};

const ORGAN_POSITIONS = {
  esophagus: {
    btn: "top-[2%] right-[2%]",
    line: { x1: "88%", y1: "5%", x2: "50%", y2: "8%" },
  },
  liver: {
    btn: "top-[22%] right-[2%]",
    line: { x1: "88%", y1: "25%", x2: "64%", y2: "27%" },
  },
  colon: {
    btn: "top-[48%] right-[2%]",
    line: { x1: "88%", y1: "51%", x2: "62%", y2: "53%" },
  },
  rectum: {
    btn: "top-[78%] right-[2%]",
    line: { x1: "88%", y1: "81%", x2: "50%", y2: "85%" },
  },
  stomach: {
    btn: "top-[20%] left-[2%]",
    line: { x1: "12%", y1: "24%", x2: "36%", y2: "30%" },
  },
  pancreas: {
    btn: "top-[43%] left-[2%]",
    line: { x1: "12%", y1: "47%", x2: "41%", y2: "44%" },
  },
  small_intestine: {
    btn: "top-[66%] left-[2%]",
    line: { x1: "12%", y1: "70%", x2: "45%", y2: "60%" },
  },
};

const ORGAN_IMAGE_SRC = {
  stomach: "/icons8-stomach-100.png",
  liver: "/icons8-liver-64.png",
  colon: "/icons8-colon-100.png",
  pancreas: "/icons8-pancreas-64.png",
  esophagus: "/icons8-anatomy-48.png",
  rectum: "/rectum_icon.png",
};

function getOrganImage(organId) {
  return ORGAN_IMAGE_SRC[organId] || `/${organId}.png`;
}

function Step2Skeleton() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedSymptoms = location.state?.symptoms || [];
  
  const [hoveredOrgan, setHoveredOrgan] = useState(null);
  const [imgError, setImgError] = useState({});

  const getOrganPercentage = (organName) => {
      if (!selectedSymptoms || selectedSymptoms.length === 0) return 0;
      const organSymptoms = SYMPTOMS_BY_ORGAN[organName];
      if (!organSymptoms) return 0;
      const matchCount = organSymptoms.filter(s => selectedSymptoms.includes(s)).length;
      if (matchCount === 0) return 0;
      return Math.round((matchCount / organSymptoms.length) * 100);
  };

  const ORGANS_WITH_STATS = ORGANS.map(o => ({
      ...o,
      percentage: getOrganPercentage(o.name)
  }));

  const handleContinue = () => {
    navigate("/step3", { state: { symptoms: selectedSymptoms } });
  };

  return (
    <div className="min-h-screen bg-[#f8fafe] flex flex-col font-sans" dir="rtl">
      <header className="bg-blue-500 text-white py-4 px-4 flex items-center justify-between sticky top-0 z-10 w-full shadow-md">
        <h1 className="text-xl font-bold mx-auto">خريطة الجهاز الهضمي</h1>
        <button
          onClick={() => navigate(-1)}
          className="absolute right-4 text-white hover:text-blue-100 transition"
        >
          <ArrowRight size={24} />
        </button>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto flex flex-col items-center justify-start p-6 relative pb-24 overflow-hidden">
        
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-blue-100 w-full mb-8 text-center flex gap-3 items-center justify-center">
            <Info className="text-blue-500 shrink-0" size={20} />
            <p className="text-gray-700 font-medium text-sm">
                نسبة احتمال وجود مرض في كل جهاز بناءً على الأعراض
            </p>
        </div>

        <div className="relative w-full max-w-[400px] h-[480px] mx-auto mb-6">
          
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
            {ORGANS_WITH_STATS.map(organ => {
                if (organ.percentage === 0) return null;
                const pos = ORGAN_POSITIONS[organ.id];
                const isHovered = hoveredOrgan?.id === organ.id;
                return (
                  <g key={`line-${organ.id}`} className={`transition-all duration-300 ${isHovered ? "opacity-100 drop-shadow-[0_0_8px_rgba(37,99,235,0.8)]" : "opacity-60"}`}>
                    <line 
                        x1={pos.line.x1} y1={pos.line.y1} x2={pos.line.x2} y2={pos.line.y2}
                        stroke={isHovered ? "#2563eb" : "#64748b"}
                        strokeWidth={isHovered ? "3" : "1.5"}
                        strokeDasharray={isHovered ? "none" : "4 4"}
                    />
                    <circle 
                        cx={pos.line.x2} cy={pos.line.y2} r={isHovered ? "5" : "3"}
                        fill={isHovered ? "#2563eb" : "#64748b"}
                        className="transition-all duration-300"
                    />
                    <circle 
                        cx={pos.line.x1} cy={pos.line.y1} r={isHovered ? "3" : "2"}
                        fill={isHovered ? "#2563eb" : "#64748b"}
                        className="transition-all duration-300"
                    />
                  </g>
                );
            })}
          </svg>

          <div 
            className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[180px] perspective-1000 z-0"
          >
             <div 
               className="w-full h-full relative transition-transform duration-500 ease-out transform-style-preserve-3d flex items-center justify-center rounded-[40px] shadow-inner bg-blue-900/40 border border-white/20 overflow-hidden"
               style={{ 
                 transform: hoveredOrgan ? "rotateX(2deg) rotateY(-2deg) scale(1.02)" : "rotateX(0deg) rotateY(0deg) scale(1)",
                 transformStyle: "preserve-3d"
               }}
             >
                <img 
                    src={skeletonImg} 
                    alt="Digestive System 3D" 
                    className={`w-full h-full object-cover scale-110 mix-blend-screen transition-all duration-500 ease-in-out ${hoveredOrgan ? "opacity-30 blur-[1px]" : "opacity-90 blur-0"}`} 
                />
                <div className="absolute inset-x-8 inset-y-12 bg-blue-500/20 blur-[80px] -z-10 rounded-full"></div>
                
                <div className="absolute inset-0 z-10 pointer-events-none">
                    <div className={`absolute top-[5%] left-1/2 -translate-x-[50%] w-12 h-20 text-pink-500 drop-shadow-[0_0_12px_rgba(236,72,153,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "esophagus" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["esophagus"] ? <img src={getOrganImage("esophagus")} className="w-full h-full object-contain" /> : <OrganIcons.esophagus className="w-full h-full" />}
                    </div>
                    <div className={`absolute top-[25%] right-[15%] w-24 h-16 text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "liver" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["liver"] ? <img src={getOrganImage("liver")} className="w-full h-full object-contain" /> : <OrganIcons.liver className="w-full h-full" />}
                    </div>
                    <div className={`absolute top-[28%] left-[10%] w-20 h-20 text-red-500 drop-shadow-[0_0_12px_rgba(239,68,68,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "stomach" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["stomach"] ? <img src={getOrganImage("stomach")} className="w-full h-full object-contain" /> : <OrganIcons.stomach className="w-full h-full" />}
                    </div>
                    <div className={`absolute top-[42%] left-[25%] w-16 h-12 text-yellow-500 drop-shadow-[0_0_12px_rgba(234,179,8,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "pancreas" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["pancreas"] ? <img src={getOrganImage("pancreas")} className="w-full h-full object-contain" /> : <OrganIcons.pancreas className="w-full h-full" />}
                    </div>
                    <div className={`absolute top-[48%] left-1/2 -translate-x-[50%] w-32 h-32 text-green-500 drop-shadow-[0_0_12px_rgba(34,197,94,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "colon" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["colon"] ? <img src={getOrganImage("colon")} className="w-full h-full object-contain" /> : <OrganIcons.colon className="w-full h-full" />}
                    </div>
                    <div className={`absolute top-[55%] left-1/2 -translate-x-[50%] w-24 h-20 text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "small_intestine" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["small_intestine"] ? <img src={getOrganImage("small_intestine")} className="w-full h-full object-contain" /> : <OrganIcons.small_intestine className="w-full h-full" />}
                    </div>
                    <div className={`absolute bottom-[10%] left-1/2 -translate-x-[50%] w-10 h-12 text-purple-500 drop-shadow-[0_0_12px_rgba(168,85,247,0.6)] transition-all duration-300 ${hoveredOrgan?.id === "rectum" ? "opacity-100 scale-110" : "opacity-0"}`}>
                        {!imgError["rectum"] ? <img src={getOrganImage("rectum")} className="w-full h-full object-contain mix-blend-multiply" /> : <OrganIcons.rectum className="w-full h-full" />}
                    </div>
                </div>

             </div>
          </div>
          
          <div className="absolute inset-0 z-20 pointer-events-none">
             {ORGANS_WITH_STATS.map(organ => {
                 if (organ.percentage === 0) return null;
                 const pos = ORGAN_POSITIONS[organ.id];
                 const isHovered = hoveredOrgan?.id === organ.id;
                 const OrganIcon = OrganIcons[organ.id];
                 const hasError = imgError[organ.id];
                 return (
                     <button 
                       key={`btn-${organ.id}`}
                       onClick={() => setHoveredOrgan(organ)}
                       onMouseEnter={() => setHoveredOrgan(organ)}
                       className={`absolute pointer-events-auto flex flex-col items-center justify-center transition-all duration-300
                       ${isHovered ? "scale-110 z-30" : "scale-100 opacity-90 hover:scale-105 z-10"}
                       ${pos.btn}`}
                     >
                        <div className={`relative flex items-center justify-center w-14 h-14 mb-1 transition-all duration-300
                            ${isHovered ? "text-blue-600 drop-shadow-[0_0_12px_rgba(37,99,235,0.7)]" : "text-[#475569] drop-shadow-md hover:text-blue-500"}`}
                        >
                            {(!hasError) ? (
                                <img 
                                   src={getOrganImage(organ.id)} 
                                   alt={organ.name} 
                                   className={`w-full h-full object-contain drop-shadow-sm ${organ.id === 'rectum' ? 'mix-blend-multiply' : ''}`} 
                                   onError={() => setImgError(prev => ({...prev, [organ.id]: true}))} 
                                />
                            ) : (
                                OrganIcon && <OrganIcon className="w-full h-full drop-shadow-sm" />
                            )}
                        </div>
                        <div className={`flex flex-col items-center justify-center backdrop-blur-md rounded-lg px-2 py-0.5 transition-all outline outline-1 outline-white/60 duration-300 shadow-xs
                            ${isHovered ? "bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] border-none font-bold" : "bg-white/90 text-blue-900 border border-blue-100 font-bold"}`}
                        >
                            <span className="text-[11px] whitespace-nowrap">{organ.name}</span>
                            <span className="text-[10px] mt-0.5 opacity-90">{organ.percentage}% تأثر</span>
                        </div>
                     </button>
                 );
             })}
          </div>

        </div>

        <div className={`mt-8 w-full transition-all duration-300 ${hoveredOrgan ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {hoveredOrgan && (
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 text-center transform transition-transform hover:scale-105">
              <h3 className="text-2xl font-bold text-blue-800 mb-2">{hoveredOrgan.name}</h3>
              <p className="text-gray-600 text-sm mb-3 leading-relaxed">{hoveredOrgan.description}</p>
              <div className="bg-blue-50 text-blue-800 font-bold p-3 rounded-xl border border-blue-100">
                نسبة التأثر بالأعراض: {hoveredOrgan.percentage}%
              </div>
            </div>
          )}
        </div>

      </main>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#f8fafe] via-[#f8fafe] to-transparent w-full z-40">
          <div className="max-w-md mx-auto flex gap-3">
              <button
                  onClick={() => navigate(-1)}
                  className="flex-1 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-600 bg-white hover:bg-slate-50 transition-all shadow-sm"
              >
                  رجوع
              </button>
              <button
                  onClick={handleContinue}
                  className="flex-[2] py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:opacity-90"
              >
                  المتابعة إلى الحالات المرضية
                  <ArrowRight size={20} className="transform rotate-180" />
              </button>
          </div>
      </div>
    </div>
  );
}

export default Step2Skeleton;
