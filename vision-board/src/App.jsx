import React, { useState, useEffect, useRef, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, updateDoc } from 'firebase/firestore';

// Safely loading specific Firebase configuration
let fbConfig;
try {
    fbConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : {
        apiKey: "AIzaSyDL9UoEEP3S-iX4hqTOwxwsWy2zVunxBjY",
        authDomain: "ank-and-amy.firebaseapp.com",
        projectId: "ank-and-amy",
        storageBucket: "ank-and-amy.firebasestorage.app",
        messagingSenderId: "4040638043",
        appId: "1:4040638043:web:6a21055be91528a538497e"
    };
} catch (e) {
    fbConfig = {
        apiKey: "AIzaSyDL9UoEEP3S-iX4hqTOwxwsWy2zVunxBjY",
        authDomain: "ank-and-amy.firebaseapp.com",
        projectId: "ank-and-amy",
        storageBucket: "ank-and-amy.firebasestorage.app",
        messagingSenderId: "4040638043",
        appId: "1:4040638043:web:6a21055be91528a538497e"
    };
}

const app = initializeApp(fbConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'ank-and-amy-app';

const Icon = ({ name, size = 16, className = "", style = {} }) => {
    const icons = {
        sparkles: <><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" /><path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" /></>,
        moon: <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />,
        sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></>,
        check: <path d="M20 6 9 17l-5-5" />,
        plus: <path d="M5 12h14 M12 5v14" />,
        x: <path d="M18 6 6 18 M6 6l12 12" />,
        lock: <><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
        trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
        film: <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></>,
        undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" /></>,
        dining: <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />,
        cooking: <><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></>,
        indoors: <><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" /><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M4 18v2" /><path d="M20 18v2" /><path d="M12 4v9" /></>,
        outdoors: <><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" /><path d="M7 16v6" /><path d="M13 19v3" /><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-3 4.3" /></>,
        events: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>,
        travel: <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5 1.5L14.5 9 6.2 7.2c-.8-.2-1.6.2-2 .9L3 9.6l5.5 3.5L5 16.5l-3.2-.8-1.3 1.3 4.5 2 2 4.5 1.3-1.3-.8-3.2 3.4-3.5 3.5 5.5 1.5-1.2c.7-.4 1.1-1.2.9-2Z" />,
        deep_dives: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
        culture: <><path d="M12 3 2 7l10 4 10-4-10-4Z" /><path d="M6 11v5" /><path d="M10 11v5" /><path d="M14 11v5" /><path d="M18 11v5" /><path d="M4 16h16" /><path d="M4 21h16" /></>,
        star: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />,
        starFilled: <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none" />,
        search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
        chevronDown: <path d="m6 9 6 6 6-6" />,
    };

    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`lucide ${className}`} style={style}
        >
            {icons[name] || icons.sparkles}
        </svg>
    );
};

const START_DATE = '2026-08-03T22:00:00';

// First-run default only. After that, change the passcode any time by editing
// the "passcode" field on the artifacts/{appId}/public/data/config/access
// document in the Firebase console — no redeploy needed.
const DEFAULT_PASSCODE = 'CHANGE-ME';
const ACTIVITY_STORAGE_KEY = 'mb_last_active';
const INACTIVITY_LIMIT_MS = 2 * 60 * 1000; // re-lock after this long idle (currently 1 min)

const CATEGORIES = [
    { id: 'dining', label: 'DINING', sub: 'Tasting the world, one table at a time.', iconName: 'dining' },
    { id: 'cooking', label: 'COOKING', sub: 'Creating warmth in our shared kitchen.', iconName: 'cooking' },
    { id: 'indoors', label: 'INDOORS', sub: 'Our private orbit, safe and sound.', iconName: 'indoors' },
    { id: 'outdoors', label: 'OUTDOORS', sub: 'Chasing horizons beneath the open sky.', iconName: 'outdoors' },
    { id: 'events', label: 'EVENTS', sub: 'Making memories in the glow of the crowd.', iconName: 'events' },
    { id: 'travel', label: 'TRAVEL', sub: 'Discovering new worlds, side by side.', iconName: 'travel' },
    { id: 'deep_dives', label: 'DEEP DIVES', sub: 'Growing together, mind and soul.', iconName: 'deep_dives' },
    { id: 'culture', label: 'CULTURE', sub: 'Finding beauty in the universe around us.', iconName: 'culture' }
];

const SpotlightCard = ({ children, className = "", spotlightColor = "rgba(255,255,255,0.08)" }) => {
    const divRef = useRef(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [opacity, setOpacity] = useState(0);

    const handleMouseMove = (e) => {
        if (!divRef.current) return;
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setOpacity(1)}
            onMouseLeave={() => setOpacity(0)}
            className={`relative overflow-hidden ${className}`}
        >
            <div
                className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 ease-in-out"
                style={{
                    opacity,
                    background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 40%)`,
                }}
            />
            {children}
        </div>
    );
};

const DotSeparator = () => (
    <div className="w-1.5 h-1.5 bg-neutral-700/80 rotate-45 mx-2 shadow-[0_0_8px_rgba(255,255,255,0.1)]" style={{ clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }} />
);

const TimeTogether = ({ startDate }) => {
    const [time, setTime] = useState({ days: '0', hours: '00', minutes: '00', seconds: '00' });
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            if (diff < 0) { setIsStarted(false); return; }

            setIsStarted(true);
            setTime({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)).toString(),
                hours: Math.floor((diff / (1000 * 60 * 60)) % 24).toString().padStart(2, '0'),
                minutes: Math.floor((diff / 1000 / 60) % 60).toString().padStart(2, '0'),
                seconds: Math.floor((diff / 1000) % 60).toString().padStart(2, '0')
            });
        };

        calculateTime();
        const timer = setInterval(calculateTime, 1000);
        return () => clearInterval(timer);
    }, [startDate]);

    if (!isStarted) return null;

    return (
        <SpotlightCard spotlightColor="rgba(204, 255, 0, 0.15)" className="inline-flex items-center rounded-full border border-[#ccff00]/10 bg-neutral-950/60 shadow-2xl backdrop-blur-xl mb-10 w-fit p-1">
            <div className="flex items-center gap-2 px-4 py-2 bg-[#ccff00]/10 rounded-full">
                <Icon name="sparkles" size={14} className="text-[#ccff00]" />
                <span className="text-[11px] font-bold tracking-[0.2em] text-[#ccff00] uppercase">TOGETHER FOR</span>
            </div>
            <div className="flex items-center px-5 text-neutral-300 font-serif tracking-tight tabular-nums">
                <span className="font-bold text-white text-lg">{time.days}</span><span className="text-neutral-500 text-sm ml-1.5 font-sans">d</span>
                <DotSeparator />
                <span className="font-bold text-white text-lg">{time.hours}</span><span className="text-neutral-500 text-sm ml-1.5 font-sans">h</span>
                <DotSeparator />
                <span className="font-bold text-white text-lg">{time.minutes}</span><span className="text-neutral-500 text-sm ml-1.5 font-sans">m</span>
                <DotSeparator />
                <span className="font-bold text-[#ccff00] text-lg drop-shadow-[0_0_8px_rgba(204,255,0,0.5)]">{time.seconds}</span><span className="text-[#ccff00]/50 text-sm ml-1.5 font-sans">s</span>
            </div>
        </SpotlightCard>
    );
};

const Input = ({ className, ...props }) => (
    <input
        className={`flex h-10 w-full rounded-lg border border-neutral-800 bg-neutral-950/50 px-3 py-2 text-sm text-neutral-200 ring-offset-neutral-950 placeholder:text-neutral-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700 transition-all ${className}`}
        {...props}
    />
);

const Button = ({ className, variant = "default", size = "default", ...props }) => {
    const baseStyle = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-neutral-950 transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-700 disabled:pointer-events-none disabled:opacity-50";
    const variants = {
        default: "bg-white text-neutral-950 hover:bg-neutral-200 shadow-lg",
        outline: "border border-neutral-800 bg-neutral-950/50 hover:bg-neutral-800 hover:text-white backdrop-blur-sm",
        ghost: "hover:bg-neutral-800/50 hover:text-white",
        icon: "p-0 rounded-lg"
    };
    const sizes = { default: "h-10 px-4 py-2", sm: "h-8 px-3 text-xs", icon: "h-8 w-8" };
    return <button className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`} {...props} />;
};

const PersonalBoard = ({ title, subtitle, iconName, items, onAdd, onComplete, onDelete, onEdit, themeColor, glowColor, inputPlaceholder, className = "" }) => {
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) { onAdd(inputValue.trim()); setInputValue(''); }
    };

    return (
        <SpotlightCard spotlightColor={glowColor} className={`flex flex-col h-full bg-neutral-950/80 border border-neutral-800/60 rounded-3xl p-6 md:p-8 shadow-2xl backdrop-blur-md group ${className}`}>
            <div className="relative z-10 flex flex-col h-full">
                <div className="mb-8">
                    <div className="flex items-center gap-2 mb-3 opacity-80">
                        <div className="p-1.5 rounded-md bg-neutral-900 border border-neutral-800/50">
                            <Icon name={iconName} size={14} style={{ color: themeColor }} className="animate-pulse" />
                        </div>
                        <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">{subtitle}</span>
                    </div>
                    <h2 className="text-3xl font-serif text-white tracking-tight">{title}</h2>
                </div>

                <form onSubmit={handleSubmit} className="relative mb-6 group/form">
                    <Input
                        value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder={inputPlaceholder}
                        className="pr-12 bg-neutral-900/50 border-neutral-800/80 group-hover/form:border-neutral-700 focus-visible:border-transparent"
                    />
                    <button
                        type="submit" disabled={!inputValue.trim()}
                        style={{ backgroundColor: inputValue.trim() ? themeColor : undefined }}
                        className="absolute right-1 top-1 bottom-1 w-8 rounded-md flex items-center justify-center text-neutral-950 disabled:bg-neutral-800 disabled:text-neutral-600 transition-all hover:scale-105 active:scale-95"
                    >
                        <Icon name="plus" size={16} />
                    </button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar min-h-[250px]">
                    {items.map(item => (
                        <div key={item.id} className="group/item flex items-start gap-3 p-3.5 bg-neutral-900/40 hover:bg-neutral-800/50 border border-transparent hover:border-neutral-700/50 rounded-xl transition-all duration-300 relative card-enter">
                            <button
                                onClick={() => onComplete(item)}
                                className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-neutral-600 hover:border-transparent flex items-center justify-center transition-all relative overflow-hidden bg-neutral-950"
                            >
                                <div className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity" style={{ backgroundColor: themeColor }} />
                                <Icon name="check" size={12} className="opacity-0 group-hover/item:opacity-100 relative z-10 text-neutral-950" />
                            </button>

                            {editingId === item.id ? (
                                <input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => { if (editValue.trim() !== item.text) onEdit(item.id, editValue.trim()); setEditingId(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { if (editValue.trim() !== item.text) onEdit(item.id, editValue.trim()); setEditingId(null); } }} className="flex-1 bg-transparent border-b border-neutral-500 text-sm text-neutral-200 outline-none pb-0.5 focus:border-white transition-colors" />
                            ) : (
                                <span onClick={() => { setEditingId(item.id); setEditValue(item.text); }} className="text-sm text-neutral-300 leading-relaxed pt-0.5 flex-1 cursor-text hover:text-white transition-colors transform group-hover/item:translate-x-1 duration-300" title="Click to edit">
                                    {item.text}
                                </span>
                            )}

                            <button onClick={() => onDelete(item.id)} className="opacity-0 group-hover/item:opacity-100 p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all">
                                <Icon name="trash" size={14} />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-xs text-neutral-600 text-center mt-12 py-10 border border-dashed border-neutral-800/50 rounded-2xl">
                            Quiet orbit. No pending memories.
                        </div>
                    )}
                </div>
            </div>
        </SpotlightCard>
    );
};

const CategorySlot = ({ category, item, onAdd, onComplete, onEdit, onDelete }) => {
    const [isEditingNew, setIsEditingNew] = useState(false);
    const [newInputValue, setNewInputValue] = useState('');
    const [isEditingExisting, setIsEditingExisting] = useState(false);
    const [existingInputValue, setExistingInputValue] = useState('');

    const handleAddNew = (e) => {
        e.preventDefault();
        if (newInputValue.trim()) { onAdd(category.id, newInputValue.trim()); setNewInputValue(''); setIsEditingNew(false); }
    };

    const handleEditExisting = (e) => {
        e.preventDefault();
        if (existingInputValue.trim() && existingInputValue.trim() !== item.text) onEdit(category.id, existingInputValue.trim());
        setIsEditingExisting(false);
    };

    if (item) {
        return (
            <SpotlightCard spotlightColor="rgba(192, 132, 252, 0.15)" className="relative group bg-neutral-900/60 border border-purple-500/20 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-purple-500/40 min-h-[140px] card-enter">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Icon name={category.iconName} size={14} className="text-purple-400" />
                        <span className="text-[10px] tracking-widest font-bold text-neutral-300 uppercase">{category.label}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_10px_rgba(204,255,0,0.8)] animate-pulse" />
                </div>

                {isEditingExisting ? (
                    <form onSubmit={handleEditExisting} className="mt-auto mb-2 relative z-20">
                        <Input autoFocus value={existingInputValue} onChange={(e) => setExistingInputValue(e.target.value)} onBlur={handleEditExisting} className="h-8 text-xs bg-neutral-950 border-neutral-700/80 focus-visible:ring-purple-500 w-full" />
                    </form>
                ) : (
                    <>
                        <p onClick={() => { setExistingInputValue(item.text); setIsEditingExisting(true); }} className="text-sm text-white font-medium leading-relaxed cursor-text relative z-10 hover:text-purple-200 transition-colors" title="Click to edit">
                            {item.text}
                        </p>
                        <div className="absolute bottom-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-neutral-400 hover:text-red-400 hover:bg-red-400/10 bg-neutral-900/80 backdrop-blur-md" onClick={() => onDelete(category.id)}>
                                <Icon name="trash" size={14} />
                            </Button>
                            <Button variant="outline" size="icon" className="h-7 w-7 border-[#ccff00]/30 text-[#ccff00] hover:bg-[#ccff00] hover:text-neutral-950 bg-neutral-900/80 backdrop-blur-md" onClick={() => onComplete(category.id, item)}>
                                <Icon name="check" size={14} />
                            </Button>
                        </div>
                    </>
                )}
            </SpotlightCard>
        );
    }

    return (
        <div className="bg-neutral-950/30 border border-dashed border-neutral-800 rounded-2xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 hover:bg-neutral-900/50 min-h-[140px]">
            <div className="flex items-center gap-2 mb-2">
                <Icon name={category.iconName} size={14} className="text-neutral-600" />
                <span className="text-[10px] tracking-widest font-bold text-neutral-600 uppercase">{category.label}</span>
            </div>

            {isEditingNew ? (
                <form onSubmit={handleAddNew} className="mt-auto relative z-20">
                    <Input autoFocus value={newInputValue} onChange={(e) => setNewInputValue(e.target.value)} onBlur={() => !newInputValue && setIsEditingNew(false)} placeholder="Draft a memory..." className="h-8 text-xs bg-neutral-900/80 focus-visible:ring-neutral-600" />
                </form>
            ) : (
                <div className="mt-auto group cursor-pointer relative z-10" onClick={() => setIsEditingNew(true)}>
                    <p className="text-[11px] text-neutral-500 mb-2 group-hover:text-neutral-300 transition-colors">Add to orbit...</p>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-neutral-600 font-serif italic max-w-[80%] leading-snug">{category.sub}</p>
                        <div className="w-6 h-6 rounded-full bg-neutral-900/80 group-hover:bg-neutral-800 flex items-center justify-center text-neutral-500 group-hover:text-purple-400 transition-colors">
                            <Icon name="plus" size={12} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const MovieItem = ({ movie, onToggle, onDelete, onEdit, onUpdate }) => {
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [isEditingComment, setIsEditingComment] = useState(false);
    const [comment, setComment] = useState(movie.comment || '');
    const [toggleConfirm, setToggleConfirm] = useState(false);

    useEffect(() => setComment(movie.comment || ''), [movie.comment]);

    const handleSaveComment = (e) => {
        if (e) e.preventDefault();
        if (comment.trim() !== (movie.comment || '')) onUpdate(movie.id, { comment: comment.trim() });
        setIsEditingComment(false);
    };

    const handleToggleClick = () => {
        if (movie.watched && ((movie.rating && movie.rating > 0) || (movie.comment && movie.comment.trim() !== ''))) {
            if (toggleConfirm) {
                onToggle(movie);
            } else {
                setToggleConfirm(true);
                setTimeout(() => setToggleConfirm(false), 3000);
            }
        } else {
            onToggle(movie);
        }
    };

    return (
        <div className={`flex flex-col gap-1.5 p-3.5 rounded-xl border transition-all duration-300 group card-enter ${movie.watched ? 'bg-neutral-900/20 border-neutral-800/40' : 'bg-neutral-900/60 border-neutral-800 hover:border-indigo-500/30 hover:shadow-[0_0_15px_rgba(99,102,241,0.05)]'}`}>
            <div className="flex items-center gap-3 relative">
                <button onClick={handleToggleClick} className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-all ${movie.watched ? (toggleConfirm ? 'bg-red-500 border-red-500 text-white' : 'bg-indigo-400 border-indigo-400 text-neutral-950 shadow-[0_0_10px_rgba(129,140,248,0.3)]') : 'border-neutral-600 text-transparent hover:border-indigo-400 hover:text-indigo-400/50'}`}>
                    <Icon name="check" size={12} className="currentColor" />
                </button>
                {toggleConfirm && movie.watched && (
                    <span className="absolute -top-6 left-0 text-[10px] font-bold text-red-400 bg-neutral-900 px-2 py-1 rounded shadow-lg border border-red-500/20 whitespace-nowrap z-20 animate-in fade-in slide-in-from-bottom-2">WIPE & RESTORE?</span>
                )}

                {editingId === movie.id ? (
                    <input autoFocus type="text" value={editValue} onChange={(e) => setEditValue(e.target.value)} onBlur={() => { if (editValue.trim() !== movie.title) onEdit(movie.id, editValue.trim()); setEditingId(null); }} onKeyDown={(e) => { if (e.key === 'Enter') { if (editValue.trim() !== movie.title) onEdit(movie.id, editValue.trim()); setEditingId(null); } }} className="flex-1 bg-transparent border-b border-indigo-400 text-sm text-white outline-none pb-0.5" />
                ) : (
                    <span onClick={() => { setEditingId(movie.id); setEditValue(movie.title); }} className={`text-sm leading-tight flex-1 cursor-text transition-all ${movie.watched ? 'text-neutral-600 line-through' : 'text-neutral-200 hover:text-white'}`} title="Click to edit">
                        {movie.title}
                    </span>
                )}

                <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-red-400 hover:bg-red-400/10" onClick={() => onDelete(movie.id)}>
                    <Icon name="trash" size={14} />
                </Button>
            </div>

            {movie.watched && (
                <div className="pl-8 pr-8 mt-1 mb-1 animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-2 bg-neutral-950/40 rounded-lg p-3 border border-neutral-800/50">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => {
                                const isFilled = (hoverRating || movie.rating || 0) >= star;
                                return (
                                    <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => onUpdate(movie.id, { rating: star })} className={`transition-transform hover:scale-110 ${isFilled ? 'text-[#ccff00] drop-shadow-[0_0_4px_rgba(204,255,0,0.4)]' : 'text-neutral-700'}`}>
                                        <Icon name={isFilled ? "starFilled" : "star"} size={14} />
                                    </button>
                                );
                            })}
                        </div>
                        {isEditingComment ? (
                            <form onSubmit={handleSaveComment} className="mt-1">
                                <input autoFocus type="text" value={comment} onChange={e => setComment(e.target.value)} onBlur={handleSaveComment} placeholder="What did you think?" className="w-full bg-transparent border-b border-indigo-400/50 text-xs text-indigo-300 outline-none pb-1 font-serif italic" />
                            </form>
                        ) : (
                            <p onClick={() => setIsEditingComment(true)} className={`text-xs mt-0.5 cursor-text transition-colors font-serif italic ${movie.comment ? 'text-indigo-300 hover:text-indigo-200' : 'text-neutral-600 hover:text-neutral-400'}`}>
                                {movie.comment || "Add a review..."}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const ArchivedItem = ({ item, onRestore, onUpdate }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(item.comment || '');
    const [restoreConfirm, setRestoreConfirm] = useState(false);

    const handleSaveComment = (e) => {
        if (e) e.preventDefault();
        if (comment.trim() !== (item.comment || '')) onUpdate(item.id, { comment: comment.trim() });
        setIsEditing(false);
    };

    const handleRestoreClick = () => {
        if ((item.rating && item.rating > 0) || (item.comment && item.comment.trim() !== '')) {
            if (restoreConfirm) {
                onRestore(item);
            } else {
                setRestoreConfirm(true);
                setTimeout(() => setRestoreConfirm(false), 3000);
            }
        } else {
            onRestore(item);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-neutral-900/30 hover:bg-neutral-900/60 border border-neutral-800/50 hover:border-neutral-700/60 rounded-2xl transition-all duration-300 group card-enter">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 w-5 h-5 rounded-full bg-neutral-800/50 border border-neutral-700 flex items-center justify-center flex-shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.05)]">
                        <Icon name="check" size={10} className="text-neutral-400" />
                    </div>
                    <span className="text-sm font-medium text-neutral-300 leading-snug group-hover:text-white transition-colors">{item.text}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`h-7 opacity-0 group-hover:opacity-100 transition-all bg-neutral-950/50 flex items-center gap-1 px-2 ${restoreConfirm ? 'text-red-400 hover:bg-red-400/20' : 'text-neutral-500 hover:text-white hover:bg-white/10'}`}
                        onClick={handleRestoreClick}
                        title="Restore to board"
                    >
                        <Icon name="undo" size={12} />
                        {restoreConfirm && <span className="text-[10px] font-bold uppercase tracking-wider">WIPE & RESTORE?</span>}
                    </Button>
                    <span className="text-[10px] font-mono font-medium text-neutral-500 bg-neutral-950/80 px-2.5 py-1 rounded-md border border-neutral-800/80 whitespace-nowrap tracking-tight">{item.date}</span>
                </div>
            </div>

            <div className="pl-8">
                <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map(star => {
                        const isFilled = (hoverRating || item.rating || 0) >= star;
                        return (
                            <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => onUpdate(item.id, { rating: star })} className={`transition-transform hover:scale-110 ${isFilled ? 'text-[#ccff00] drop-shadow-[0_0_4px_rgba(204,255,0,0.4)]' : 'text-neutral-800 hover:text-neutral-600'}`}>
                                <Icon name={isFilled ? "starFilled" : "star"} size={12} />
                            </button>
                        );
                    })}
                </div>
                {isEditing ? (
                    <form onSubmit={handleSaveComment}>
                        <input autoFocus type="text" value={comment} onChange={e => setComment(e.target.value)} onBlur={handleSaveComment} placeholder="Write a memory..." className="w-full bg-transparent border-b border-neutral-500 text-sm text-neutral-200 outline-none pb-1 font-serif italic focus:border-white" />
                    </form>
                ) : (
                    <p onClick={() => setIsEditing(true)} className={`text-sm cursor-text transition-colors font-serif italic ${item.comment ? 'text-neutral-400 hover:text-neutral-200' : 'text-neutral-600 hover:text-neutral-400'}`}>
                        {item.comment || "Add a memory or note..."}
                    </p>
                )}
            </div>
        </div>
    );
};

const METEOR_COUNT = 6;

// 180deg-360deg only, so meteors always fall down/sideways, never upward.
// 180/360 = purely horizontal, 270 = straight down, everything else diagonal.
const randomMeteor = () => ({
    top: (Math.random() * 80 - 10).toFixed(1),
    right: (Math.random() * 130 - 20).toFixed(1),
    angle: (180 + Math.random() * 180).toFixed(1),
    duration: (14 + Math.random() * 20).toFixed(1),
    delay: (Math.random() * 25).toFixed(1),
});

const CosmicBackground = () => {
    const meteors = useMemo(() => Array.from({ length: METEOR_COUNT }, randomMeteor), []);

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-[#02040a] via-[#060c17] to-[#0b172a] overflow-hidden">
            {/* Deep space aurora drift */}
            <div className="absolute -inset-[100%] bg-aurora opacity-50 mix-blend-screen" />

            {/* Base static stars to prevent empty sky */}
            <div className="bg-star-layer bg-layer-base opacity-40" />

            {/* 3 distinct star layers for depth and asynchronous twinkling */}
            <div className="bg-star-layer bg-layer-1" />
            <div className="bg-star-layer bg-layer-2" />
            <div className="bg-star-layer bg-layer-3" />

            {/* The Meteor Shower (Perseids) — random start point, angle and timing each load */}
            <div className="meteor-shower">
                {meteors.map((m, i) => (
                    <div
                        key={i}
                        className="meteor"
                        style={{
                            top: `${m.top}%`,
                            right: `${m.right}%`,
                            '--angle': `${m.angle}deg`,
                            animation: `meteor-fall ${m.duration}s infinite ${m.delay}s`,
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

const LockScreen = ({ passcode, onUnlock }) => {
    const [code, setCode] = useState('');
    const [error, setError] = useState(false);
    const loading = passcode === null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (loading) return;
        if (code.trim().toLowerCase() === String(passcode).trim().toLowerCase()) {
            onUnlock();
        } else {
            setError(true);
            setCode('');
            setTimeout(() => setError(false), 2000);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative z-10 px-6">
            <SpotlightCard spotlightColor="rgba(204, 255, 0, 0.1)" className="w-full max-w-sm bg-neutral-950/80 border border-neutral-800/80 rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                <div className="relative z-10 flex flex-col items-center text-center">
                    <div className="p-3 rounded-2xl bg-neutral-900 border border-neutral-800/50 mb-6">
                        <Icon name="lock" size={22} className="text-[#ccff00]" />
                    </div>
                    <h1 className="text-2xl font-serif text-white tracking-tight mb-2">A Private Universe</h1>
                    <p className="text-xs text-neutral-500 mb-8 leading-relaxed">Enter the code only we know.</p>

                    <form onSubmit={handleSubmit} className="w-full">
                        <Input
                            type="password"
                            autoFocus
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder={loading ? "Loading…" : "Enter code"}
                            disabled={loading}
                            className={`text-center tracking-[0.3em] bg-neutral-900/50 mb-4 ${error ? 'border-red-500/60' : 'border-neutral-800/80'}`}
                        />
                        <Button type="submit" disabled={!code.trim() || loading} className="w-full">
                            Enter
                        </Button>
                        {error && <p className="text-[11px] text-red-400 mt-4">That's not it — try again.</p>}
                    </form>
                </div>
            </SpotlightCard>
        </div>
    );
};

export default function MemoryBook() {
    const [unlocked, setUnlocked] = useState(() => {
        try {
            const last = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY) || 0);
            return Date.now() - last < INACTIVITY_LIMIT_MS;
        } catch { return false; }
    });
    const [passcode, setPasscode] = useState(null);
    const [user, setUser] = useState(null);
    const [ankItems, setAnkItems] = useState([]);
    const [amyItems, setAmyItems] = useState([]);
    const [sharedItems, setSharedItems] = useState({});
    const [movies, setMovies] = useState([]);
    const [archivedItems, setArchivedItems] = useState([]);
    const [ideaVault, setIdeaVault] = useState([]);

    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [movieInput, setMovieInput] = useState('');

    const [archiveSearch, setArchiveSearch] = useState('');
    const [archiveRating, setArchiveRating] = useState(0);
    const [archiveMonth, setArchiveMonth] = useState('all');

    const getColRef = (colName) => collection(db, 'artifacts', appId, 'public', 'data', colName);

    useEffect(() => {
        const initAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) { console.error("Firebase Auth Error:", error); }
        };
        initAuth();
        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    const markActive = () => {
        try { localStorage.setItem(ACTIVITY_STORAGE_KEY, String(Date.now())); } catch { /* ignore storage errors */ }
    };

    const handleUnlock = () => {
        markActive();
        setUnlocked(true);
    };

    // Fetch the shared passcode from Firestore so it can be changed without a redeploy.
    useEffect(() => {
        if (!user) return;
        const configRef = doc(db, 'artifacts', appId, 'public', 'data', 'config', 'access');
        const unsub = onSnapshot(configRef, (snap) => {
            if (snap.exists()) {
                setPasscode(snap.data().passcode ?? '');
            } else {
                setDoc(configRef, { passcode: DEFAULT_PASSCODE }).catch(() => {});
            }
        });
        return () => unsub();
    }, [user]);

    // While unlocked, track activity and auto re-lock after INACTIVITY_LIMIT_MS of idle time.
    useEffect(() => {
        if (!unlocked) return;
        markActive();
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart'];
        events.forEach(ev => window.addEventListener(ev, markActive, { passive: true }));
        const interval = setInterval(() => {
            const last = Number(localStorage.getItem(ACTIVITY_STORAGE_KEY) || 0);
            if (Date.now() - last >= INACTIVITY_LIMIT_MS) setUnlocked(false);
        }, 15000);
        return () => {
            events.forEach(ev => window.removeEventListener(ev, markActive));
            clearInterval(interval);
        };
    }, [unlocked]);

    useEffect(() => {
        if (!user || !unlocked) return;
        const unsubAnk = onSnapshot(getColRef('ankItems'), snap => setAnkItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.createdAt - b.createdAt)));
        const unsubAmy = onSnapshot(getColRef('amyItems'), snap => setAmyItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.createdAt - b.createdAt)));
        const unsubMovies = onSnapshot(getColRef('movies'), snap => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => a.watched === b.watched ? (b.createdAt || 0) - (a.createdAt || 0) : a.watched ? 1 : -1);
            setMovies(items);
        });
        const unsubShared = onSnapshot(getColRef('sharedItems'), snap => {
            const items = {}; snap.docs.forEach(doc => { items[doc.id] = { id: doc.id, ...doc.data() }; });
            setSharedItems(items);
        });
        const unsubArchive = onSnapshot(getColRef('archivedItems'), snap => setArchivedItems(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => b.createdAt - a.createdAt)));
        const unsubVault = onSnapshot(getColRef('ideaVault'), snap => setIdeaVault(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a, b) => a.createdAt - b.createdAt)));
        return () => { unsubAnk(); unsubAmy(); unsubMovies(); unsubShared(); unsubArchive(); unsubVault(); };
    }, [user, unlocked]);

    const handleAddPersonal = async (board, text) => {
        if (!user) return;
        await addDoc(getColRef(board === 'ank' ? 'ankItems' : 'amyItems'), { text, date: new Date().toISOString(), createdAt: Date.now() });
    };

    const handleCompletePersonal = async (board, item) => {
        if (!user) return;
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', board === 'ank' ? 'ankItems' : 'amyItems', item.id));
        await addDoc(getColRef('archivedItems'), { text: item.text, category: board === 'ank' ? "Ank's Orbit" : "Amy's Orbit", date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(), source: board, createdAt: Date.now() });
    };

    const handleCompleteShared = async (categoryId, item) => {
        if (!user) return;
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId));
        const category = CATEGORIES.find(c => c.id === categoryId);
        await addDoc(getColRef('archivedItems'), { text: item.text, category: category ? category.label : 'SHARED', date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase(), source: 'shared', createdAt: Date.now() });
    };

    const handleRestore = async (item) => {
        if (!user) return;
        if (item.source === 'ank' || item.source === 'amy') {
            await addDoc(getColRef(item.source === 'ank' ? 'ankItems' : 'amyItems'), { text: item.text, date: new Date().toISOString(), createdAt: item.createdAt || Date.now() });
        } else if (item.source === 'shared') {
            const category = CATEGORIES.find(c => c.label === item.category);
            if (category) {
                if (sharedItems[category.id]) await addDoc(getColRef('ideaVault'), { text: item.text, createdAt: Date.now() });
                else await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', category.id), { text: item.text, date: new Date().toISOString(), createdAt: item.createdAt || Date.now() });
            }
        }
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'archivedItems', item.id));
    };

    const getMonthYear = (timestamp) => timestamp ? new Date(timestamp).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown Date';
    const availableMonths = [...new Set(archivedItems.map(item => getMonthYear(item.createdAt)))];
    const filteredArchive = archivedItems.filter(item => {
        const searchMatch = !archiveSearch || item.text.toLowerCase().includes(archiveSearch.toLowerCase()) || (item.comment && item.comment.toLowerCase().includes(archiveSearch.toLowerCase()));
        const ratingMatch = archiveRating === 0 || (archiveRating === -1 && !item.rating) || (archiveRating > 0 && item.rating === archiveRating);
        const monthMatch = archiveMonth === 'all' || getMonthYear(item.createdAt) === archiveMonth;
        return searchMatch && ratingMatch && monthMatch;
    });
    const groupedArchive = filteredArchive.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen w-full bg-neutral-950 text-neutral-200 text-left overflow-x-hidden relative selection:bg-purple-500/30 selection:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif !important; }
        .font-sans { font-family: 'Outfit', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #262626; border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #404040; }
        
        /* Aceternity Style Background Animations */
        @keyframes star-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Real atmospheric twinkling is erratic, not a smooth sine wave */
        @keyframes twinkle-1 {
          0%, 100% { opacity: 0.2; }
          22% { opacity: 0.7; }
          45% { opacity: 0.1; }
          68% { opacity: 0.8; }
          85% { opacity: 0.3; }
        }
        @keyframes twinkle-2 {
          0%, 100% { opacity: 0.1; }
          33% { opacity: 0.9; }
          66% { opacity: 0.2; }
        }
        @keyframes twinkle-3 {
          0%, 100% { opacity: 0.6; }
          40% { opacity: 0.1; }
          80% { opacity: 0.8; }
        }
        
        @keyframes meteor-fall {
          0% { opacity: 0; transform: rotate(var(--angle, -45deg)) translateX(0); }
          1% { opacity: 1; }
          9% { opacity: 0; transform: rotate(var(--angle, -45deg)) translateX(-1000px); }
          100% { opacity: 0; }
        }

        @keyframes drift {
          0% { transform: translateY(0px) translateX(0px) rotate(0deg); }
          50% { transform: translateY(-20px) translateX(10px) rotate(2deg); }
          100% { transform: translateY(0px) translateX(0px) rotate(0deg); }
        }
        @keyframes card-enter {
          from { opacity: 0; transform: translateY(10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .card-enter {
          animation: card-enter 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
        }

        .bg-aurora {
          background-image: 
            radial-gradient(ellipse at 80% 0%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 20% 100%, rgba(45, 212, 191, 0.1) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(251, 191, 36, 0.05) 0%, transparent 60%);
          filter: blur(40px);
          animation: drift 20s ease-in-out infinite;
        }

        .bg-star-layer {
          position: absolute;
          inset: -50%;
          background-repeat: repeat;
        }

        .bg-layer-base {
          background-image: 
            radial-gradient(1px 1px at 25% 25%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1px 1px at 75% 75%, rgba(255,255,255,0.4), transparent),
            radial-gradient(1.5px 1.5px at 50% 10%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1.5px 1.5px at 10% 90%, rgba(255,255,255,0.3), transparent);
          background-size: 200px 200px;
          animation: star-rotate 4000s linear infinite;
        }

        .bg-layer-1 {
          background-image: 
            radial-gradient(1px 1px at 10% 10%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 30% 40%, rgba(255,255,255,0.8), transparent),
            radial-gradient(1px 1px at 80% 70%, rgba(255,255,255,0.8), transparent);
          background-size: 150px 150px;
          animation: twinkle-1 23s infinite ease-in-out, star-rotate 3500s linear infinite;
        }
        
        .bg-layer-2 {
          background-image: 
            radial-gradient(1.5px 1.5px at 20% 80%, rgba(255,255,255,0.9), transparent),
            radial-gradient(1.5px 1.5px at 70% 30%, rgba(255,255,255,0.9), transparent);
          background-size: 250px 250px;
          animation: twinkle-2 31s infinite ease-in-out, star-rotate 3000s linear infinite;
        }
        
        .bg-layer-3 {
          background-image: 
            radial-gradient(2px 2px at 50% 50%, #fff, transparent),
            radial-gradient(2px 2px at 85% 15%, #fff, transparent);
          background-size: 400px 400px;
          animation: twinkle-3 37s infinite ease-in-out, star-rotate 2500s linear infinite;
        }

        .meteor-shower {
          position: absolute;
          inset: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .meteor {
          position: absolute;
          width: 180px;
          height: 1px;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.02) 30%, rgba(255, 255, 255, 0.8) 100%);
          transform-origin: right;
          opacity: 0;
          filter: blur(1px);
        }
        .meteor::after {
          content: '';
          position: absolute;
          right: 0;
          top: -0.5px;
          width: 2px;
          height: 2px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 50%;
          box-shadow: 0 0 4px 1px rgba(255, 255, 255, 0.4);
        }

      `}</style>

            {/* Dynamic Cosmic Background */}
            <CosmicBackground />

            {!unlocked ? (
                <LockScreen passcode={passcode} onUnlock={handleUnlock} />
            ) : (
            <>
            {/* Top Navigation */}
            <nav className="border-b border-white/5 bg-[#02040a]/40 backdrop-blur-2xl sticky top-0 z-40">
                <div className="max-w-[1400px] mx-auto px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center shadow-inner">
                            <Icon name="sparkles" size={14} className="text-white" />
                        </div>
                        <span className="text-[11px] font-bold tracking-[0.2em] text-neutral-300">{"ANK & AMY'S MEMORY BOOK"}</span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setIsVaultOpen(true)} className="gap-2 text-neutral-300 border-white/10 rounded-full px-4">
                        <Icon name="sparkles" size={12} className="text-purple-400" />
                        Dream Vault
                        {ideaVault.length > 0 && <span className="bg-white/10 text-white px-1.5 py-0.5 rounded text-[10px] leading-none ml-1">{ideaVault.length}</span>}
                    </Button>
                </div>
            </nav>

            <main className="max-w-[1400px] w-full mx-auto px-6 py-16 relative z-10 space-y-24">

                {/* Hero Section */}
                <section className="flex flex-col max-w-4xl card-enter">
                    <TimeTogether startDate={START_DATE} />
                    <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-white leading-[1.1] mb-8">
                        Two people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 animate-pulse">one unfolding universe.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-400 font-serif italic leading-relaxed border-l-[3px] border-purple-500/30 pl-6 py-1">
                        The sun dreams of tomorrow. The moon remembers yesterday.<br />Together, we build today.
                    </p>
                </section>

                {/* 3-Column Board Layout */}
                <section className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr_1fr] gap-6 lg:gap-8 items-stretch">

                    <PersonalBoard
                        className="order-2 lg:order-1"
                        title="Ank's Orbit" subtitle="GUIDED BY HER LIGHT" iconName="moon"
                        themeColor="#a5b4fc" glowColor="rgba(165, 180, 252, 0.12)"
                        inputPlaceholder="What's our next memory?"
                        items={ankItems}
                        onAdd={(text) => handleAddPersonal('ank', text)}
                        onComplete={(item) => handleCompletePersonal('ank', item)}
                        onDelete={(itemId) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ankItems', itemId))}
                        onEdit={(itemId, text) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ankItems', itemId), { text })}
                    />

                    <SpotlightCard spotlightColor="rgba(45, 212, 191, 0.1)" className="order-1 lg:order-2 bg-neutral-950/80 border border-neutral-800/80 rounded-3xl p-8 lg:p-10 flex flex-col relative shadow-2xl backdrop-blur-xl">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="mb-8 text-center">
                                <h2 className="text-3xl lg:text-4xl font-serif text-white tracking-tight">Where our orbits meet.</h2>
                                <span className="text-[10px] tracking-[0.2em] font-bold text-cyan-400/80 uppercase mt-3 block">THE CENTER OF GRAVITY</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                                {CATEGORIES.map((category) => (
                                    <CategorySlot
                                        key={category.id} category={category} item={sharedItems[category.id]}
                                        onAdd={(id, text) => setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', id), { text, date: new Date().toISOString(), createdAt: Date.now() })}
                                        onComplete={handleCompleteShared}
                                        onDelete={(id) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', id))}
                                        onEdit={(id, text) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', id), { text })}
                                    />
                                ))}
                            </div>
                        </div>
                    </SpotlightCard>

                    <PersonalBoard
                        className="order-3 lg:order-3"
                        title="Amy's Orbit" subtitle="ANCHORED BY HIS GRAVITY" iconName="sun"
                        themeColor="#fcd34d" glowColor="rgba(251, 191, 36, 0.1)"
                        inputPlaceholder="What's our next memory?"
                        items={amyItems}
                        onAdd={(text) => handleAddPersonal('amy', text)}
                        onComplete={(item) => handleCompletePersonal('amy', item)}
                        onDelete={(itemId) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'amyItems', itemId))}
                        onEdit={(itemId, text) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'amyItems', itemId), { text })}
                    />
                </section>

                {/* Movies Vault */}
                <SpotlightCard spotlightColor="rgba(99, 102, 241, 0.1)" className="bg-neutral-950/60 border border-neutral-800/80 rounded-3xl p-6 lg:p-10 backdrop-blur-md">
                    <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="p-1.5 rounded-md bg-indigo-500/10 border border-indigo-500/20">
                                    <Icon name="film" size={14} className="text-indigo-400" />
                                </div>
                                <span className="text-[10px] tracking-[0.2em] font-bold text-indigo-300 uppercase">SHARED WATCHLIST</span>
                            </div>
                            <h2 className="text-4xl font-serif text-white tracking-tight">Movies Vault</h2>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); if (movieInput.trim()) { addDoc(getColRef('movies'), { title: movieInput.trim(), watched: false, createdAt: Date.now() }); setMovieInput(''); } }} className="flex gap-2 w-full md:w-auto relative group">
                            <Input value={movieInput} onChange={(e) => setMovieInput(e.target.value)} placeholder="Add a movie..." className="md:w-[300px] bg-neutral-900/80 border-neutral-800 focus-visible:ring-indigo-500" />
                            <button type="submit" disabled={!movieInput.trim()} className="h-10 px-4 rounded-lg flex items-center justify-center bg-indigo-500 text-white hover:bg-indigo-400 disabled:opacity-50 disabled:pointer-events-none transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                <Icon name="plus" size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pb-4">
                        {movies.map(movie => (
                            <MovieItem
                                key={movie.id} movie={movie}
                                onToggle={(m) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', m.id), { watched: !m.watched, rating: m.watched ? null : m.rating, comment: m.watched ? '' : m.comment })}
                                onDelete={(id) => deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id))}
                                onEdit={(id, title) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id), { title })}
                                onUpdate={(id, updates) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id), updates)}
                            />
                        ))}
                        {movies.length === 0 && <div className="col-span-full text-sm text-neutral-500 italic text-center py-12 border border-dashed border-neutral-800/50 rounded-2xl">The cinematic universe is empty.</div>}
                    </div>
                </SpotlightCard>

                {/* Hall of Fame */}
                <section className="bg-transparent relative">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6 pb-6">
                        <div>
                            <h2 className="text-4xl lg:text-5xl font-serif text-white tracking-tight">
                                Our Constellations.
                            </h2>
                        </div>
                        <div className="px-5 py-2.5 rounded-full border border-white/10 bg-neutral-900/50 backdrop-blur-md flex items-center gap-2 shadow-xl">
                            <Icon name="star" size={14} className="text-[#ccff00]" />
                            <span className="text-xs font-bold tracking-wide text-neutral-200">{archivedItems.length} STARS</span>
                        </div>
                    </div>

                    {archivedItems.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-4 mb-12 p-5 bg-neutral-900/40 backdrop-blur-xl rounded-2xl border border-white/5 shadow-2xl">
                            <div className="relative flex-1">
                                <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <Input type="text" placeholder="Search memories..." value={archiveSearch} onChange={(e) => setArchiveSearch(e.target.value)} className="pl-11 bg-neutral-950/80 border-neutral-800/80 h-11" />
                            </div>
                            <div className="flex gap-4 w-full md:w-auto">
                                <div className="relative flex-1 md:w-[160px]">
                                    <select value={archiveRating} onChange={(e) => setArchiveRating(Number(e.target.value))} className="w-full h-11 px-4 bg-neutral-950/80 border border-neutral-800/80 rounded-lg text-sm text-neutral-200 appearance-none focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all cursor-pointer">
                                        <option value={0}>All Ratings</option><option value={5}>5 Stars</option><option value={4}>4 Stars</option><option value={3}>3 Stars</option><option value={2}>2 Stars</option><option value={1}>1 Star</option><option value={-1}>Unrated</option>
                                    </select>
                                    <Icon name="chevronDown" size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                </div>
                                <div className="relative flex-1 md:w-[180px]">
                                    <select value={archiveMonth} onChange={(e) => setArchiveMonth(e.target.value)} className="w-full h-11 px-4 bg-neutral-950/80 border border-neutral-800/80 rounded-lg text-sm text-neutral-200 appearance-none focus:outline-none focus:ring-1 focus:ring-neutral-700 transition-all cursor-pointer">
                                        <option value="all">All Time</option>
                                        {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <Icon name="chevronDown" size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
                        {Object.keys(groupedArchive).length === 0 ? (
                            <div className="col-span-full text-center py-20 text-neutral-500 border border-dashed border-neutral-800/50 rounded-3xl bg-neutral-900/20 backdrop-blur-sm">
                                {archivedItems.length === 0 ? "The sky is waiting for its first star." : "No memories found matching your search."}
                            </div>
                        ) : (
                            Object.entries(groupedArchive).map(([categoryName, items]) => (
                                <div key={categoryName} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
                                        <h4 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">{categoryName}</h4>
                                        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-neutral-700 to-transparent" />
                                    </div>
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <ArchivedItem
                                                key={item.id} item={item}
                                                onRestore={handleRestore}
                                                onUpdate={(id, updates) => updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'archivedItems', id), updates)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </main>

            {/* Idea Vault Modal */}
            {isVaultOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-sm transition-opacity" onClick={() => setIsVaultOpen(false)} />
                    <div className="w-full max-w-md h-full bg-neutral-950/95 border-l border-white/10 relative flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
                        <div className="p-8 border-b border-white/5 flex items-center justify-between bg-gradient-to-b from-purple-500/5 to-transparent">
                            <div>
                                <h3 className="text-2xl font-serif text-white mb-1">Dream Vault</h3>
                                <p className="text-xs tracking-wide text-purple-300/70 uppercase font-bold">Future Memories & Ideas</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setIsVaultOpen(false)} className="text-neutral-400 rounded-full hover:bg-white/10"><Icon name="x" size={20} /></Button>
                        </div>

                        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                            <form onSubmit={(e) => { e.preventDefault(); const val = e.target.elements.idea.value.trim(); if (val) { addDoc(getColRef('ideaVault'), { text: val, createdAt: Date.now() }); e.target.reset(); } }} className="mb-8 flex gap-3">
                                <Input name="idea" placeholder="Drop a new idea..." className="bg-neutral-900/50 border-neutral-800" />
                                <button type="submit" className="h-10 px-4 shrink-0 rounded-lg flex items-center justify-center bg-purple-500 text-white hover:bg-purple-400 transition-all shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                                    <Icon name="plus" size={16} />
                                </button>
                            </form>

                            <div className="space-y-4">
                                {ideaVault.map(item => (
                                    <SpotlightCard key={item.id} spotlightColor="rgba(255,255,255,0.05)" className="bg-neutral-900/40 border border-neutral-800/80 rounded-2xl p-5 group card-enter">
                                        <p className="text-sm text-neutral-200 mb-5 leading-relaxed">{item.text}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <Button variant="outline" size="sm" onClick={() => { addDoc(getColRef('ankItems'), { text: item.text, date: new Date().toISOString(), createdAt: Date.now() }); deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideaVault', item.id)); }} className="h-8 text-xs bg-neutral-950/50 gap-2 border-indigo-500/20 hover:border-indigo-500/50 hover:text-indigo-300 rounded-lg"><Icon name="moon" size={12} /> Ank</Button>
                                            <Button variant="outline" size="sm" onClick={() => { addDoc(getColRef('amyItems'), { text: item.text, date: new Date().toISOString(), createdAt: Date.now() }); deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideaVault', item.id)); }} className="h-8 text-xs bg-neutral-950/50 gap-2 border-amber-500/20 hover:border-amber-500/50 hover:text-amber-300 rounded-lg"><Icon name="sun" size={12} /> Amy</Button>
                                            <div className="relative group/dropdown">
                                                <Button variant="outline" size="sm" className="h-8 text-xs border-cyan-400/30 text-cyan-400 bg-cyan-400/5 gap-2 rounded-lg hover:bg-cyan-400/10"><Icon name="sparkles" size={12} /> Shared</Button>
                                                <div className="absolute top-full right-0 mt-2 w-48 bg-neutral-900/95 backdrop-blur-xl border border-neutral-700/50 rounded-xl shadow-2xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 p-1.5 transform origin-top-right scale-95 group-hover/dropdown:scale-100">
                                                    {CATEGORIES.map(cat => {
                                                        const isFull = !!sharedItems[cat.id];
                                                        return (
                                                            <button key={cat.id} disabled={isFull} onClick={() => { setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', cat.id), { text: item.text, date: new Date().toISOString(), createdAt: Date.now() }); deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideaVault', item.id)); }} className="w-full text-left px-3 py-2.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white rounded-lg disabled:opacity-30 flex justify-between items-center transition-colors">
                                                                {cat.label} {isFull && <Icon name="lock" size={12} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </SpotlightCard>
                                ))}
                                {ideaVault.length === 0 && <div className="text-center text-neutral-600 text-xs py-12 border border-dashed border-neutral-800/50 rounded-2xl bg-neutral-900/20">The vault is empty.</div>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            </>
            )}
        </div>
    );
}