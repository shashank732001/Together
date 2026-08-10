import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc, onSnapshot, collection, addDoc, updateDoc } from 'firebase/firestore';

// Safely loading your specific Firebase configuration
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
        sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />,
        moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
        sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
        check: <polyline points="20 6 9 17 4 12" />,
        plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
        x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
        arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
        trash: <><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></>,
        film: <><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18" /><line x1="7" y1="2" x2="7" y2="22" /><line x1="17" y1="2" x2="17" y2="22" /><line x1="2" y1="12" x2="22" y2="12" /><line x1="2" y1="7" x2="7" y2="7" /><line x1="2" y1="17" x2="7" y2="17" /><line x1="17" y1="17" x2="22" y2="17" /><line x1="17" y1="7" x2="22" y2="7" /></>,
        undo: <><path d="M3 7v6h6" /><path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" /></>,
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
        search: <><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></>,
        chevronDown: <polyline points="6 9 12 15 18 9" />
    };

    return (
        <svg
            width={size} height={size} viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className={className} style={style}
        >
            {icons[name] || icons.sparkles}
        </svg>
    );
};

const LIME = "#ccff00";

// --- CONFIGURATION ---
// To change the date to when you first met, just edit this string! 
// Format: 'YYYY-MM-DDTHH:mm:ss' (Year-Month-Day T Hours:Minutes:Seconds)
const START_DATE = '2026-08-03T22:00:00';

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

const TimeTogether = ({ startDate }) => {
    const [time, setTime] = useState({ days: '0', hours: '00', minutes: '00', seconds: '00' });
    const [isStarted, setIsStarted] = useState(false);

    useEffect(() => {
        const calculateTime = () => {
            const start = new Date(startDate).getTime();
            const now = new Date().getTime();
            const diff = now - start;

            if (diff < 0) {
                setIsStarted(false);
                return;
            }

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

    if (!isStarted) {
        return (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm text-neutral-300 text-xs font-mono mb-8 w-fit">
                <Icon name="sparkles" size={12} className="text-[#ccff00]" />
                <span>Just beginning...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3 mb-10 w-fit">
            <div className="flex items-center gap-2 ml-1">
                <Icon name="sparkles" size={14} className="text-[#ccff00]" />
                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-400 uppercase">Orbiting together for</span>
            </div>

            <div className="flex items-center gap-3 sm:gap-5 bg-neutral-900/40 border border-neutral-800/80 rounded-2xl py-3 px-4 sm:px-6 backdrop-blur-md shadow-xl transition-all hover:bg-neutral-900/60 hover:border-neutral-700">
                <div className="flex flex-col items-center min-w-[40px] sm:min-w-[50px]">
                    <span className="text-2xl sm:text-3xl font-serif text-white tabular-nums tracking-tight">{time.days}</span>
                    <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase mt-1">Days</span>
                </div>
                <div className="w-px h-8 bg-neutral-800"></div>

                <div className="flex flex-col items-center min-w-[32px] sm:min-w-[40px]">
                    <span className="text-2xl sm:text-3xl font-serif text-white tabular-nums tracking-tight">{time.hours}</span>
                    <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase mt-1">Hrs</span>
                </div>
                <div className="w-px h-8 bg-neutral-800"></div>

                <div className="flex flex-col items-center min-w-[32px] sm:min-w-[40px]">
                    <span className="text-2xl sm:text-3xl font-serif text-white tabular-nums tracking-tight">{time.minutes}</span>
                    <span className="text-[9px] tracking-[0.2em] text-neutral-500 uppercase mt-1">Min</span>
                </div>
                <div className="w-px h-8 bg-neutral-800"></div>

                <div className="flex flex-col items-center min-w-[32px] sm:min-w-[40px]">
                    <span className="text-2xl sm:text-3xl font-serif text-[#ccff00] tabular-nums tracking-tight">{time.seconds}</span>
                    <span className="text-[9px] tracking-[0.2em] text-[#ccff00]/60 uppercase mt-1">Sec</span>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ subtitle, title, iconName, rightContent, accent = LIME }) => (
    <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                {iconName && <Icon name={iconName} size={14} style={{ color: accent }} />}
                {subtitle && <span className="text-[10px] tracking-widest font-semibold text-neutral-400 uppercase">{subtitle}</span>}
            </div>
            {rightContent}
        </div>
        <h2 className="text-2xl font-serif text-neutral-100">{title}</h2>
    </div>
);

const PersonalBoard = ({ title, subtitle, iconName, items, onAdd, onComplete, onDelete, onEdit, themeColor = LIME, inputPlaceholder, className = "" }) => {
    const [inputValue, setInputValue] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div
            className={`flex flex-col h-full bg-[#161816]/80 backdrop-blur-xl border rounded-3xl p-6 transition-all duration-500 hover:-translate-y-1 ${className}`}
            style={{ borderColor: `${themeColor}40`, boxShadow: `0 10px 40px -20px ${themeColor}50` }}
        >
            <SectionHeader subtitle={subtitle} title={title} iconName={iconName} accent={themeColor} />

            <form onSubmit={handleSubmit} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={inputPlaceholder}
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-4 pr-12 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-white/20 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    style={{ backgroundColor: inputValue.trim() ? themeColor : undefined }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-black rounded-lg flex items-center justify-center disabled:bg-neutral-800 disabled:opacity-30 hover:scale-105 transition-transform"
                >
                    <Icon name="plus" size={18} />
                </button>
            </form>

            <div className="flex-1 overflow-y-auto space-y-1 pr-2 custom-scrollbar min-h-[200px]">
                {items.map(item => (
                    <div key={item.id} className="group flex items-start gap-4 p-3 hover:bg-neutral-800/40 rounded-xl transition-colors relative">
                        <button
                            onClick={() => onComplete(item)}
                            className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-neutral-600 flex items-center justify-center transition-colors relative overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${themeColor}20`, borderColor: themeColor, borderWidth: '1px', borderRadius: '999px' }} />
                            <Icon name="check" size={12} className="opacity-0 group-hover:opacity-100 relative z-10" style={{ color: themeColor }} />
                        </button>

                        {editingId === item.id ? (
                            <input
                                autoFocus
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => {
                                    if (editValue.trim() !== item.text) onEdit(item.id, editValue.trim());
                                    setEditingId(null);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        if (editValue.trim() !== item.text) onEdit(item.id, editValue.trim());
                                        setEditingId(null);
                                    }
                                }}
                                className="flex-1 bg-transparent border-b border-neutral-500 text-sm text-neutral-200 outline-none pb-0.5"
                            />
                        ) : (
                            <span
                                onClick={() => {
                                    setEditingId(item.id);
                                    setEditValue(item.text);
                                }}
                                className="text-sm text-neutral-300 leading-snug pt-0.5 flex-1 cursor-text"
                                title="Click to edit"
                            >
                                {item.text}
                            </span>
                        )}

                        <button
                            onClick={() => onDelete(item.id)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 transition-colors absolute right-2 top-2"
                            title="Delete"
                        >
                            <Icon name="trash" size={14} />
                        </button>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-sm text-neutral-600 italic text-center mt-10">No active dreams yet.</div>
                )}
            </div>
        </div>
    );
};

const CategorySlot = ({ category, item, onAdd, onComplete, onEdit, onDelete }) => {
    const [isEditingNew, setIsEditingNew] = useState(false);
    const [newInputValue, setNewInputValue] = useState('');

    const [isEditingExisting, setIsEditingExisting] = useState(false);
    const [existingInputValue, setExistingInputValue] = useState('');

    const handleAddNew = (e) => {
        e.preventDefault();
        if (newInputValue.trim()) {
            onAdd(category.id, newInputValue.trim());
            setNewInputValue('');
            setIsEditingNew(false);
        }
    };

    const handleEditExisting = (e) => {
        e.preventDefault();
        if (existingInputValue.trim() && existingInputValue.trim() !== item.text) {
            onEdit(category.id, existingInputValue.trim());
        }
        setIsEditingExisting(false);
    };

    if (item) {
        return (
            <div className="relative group bg-neutral-900/40 border border-[#ccff00]/20 rounded-xl p-5 flex flex-col justify-between transition-all hover:bg-neutral-900/60 hover:border-[#ccff00]/40 h-full min-h-[140px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Icon name={category.iconName} size={14} className="text-[#ccff00]" />
                        <span className="text-[10px] tracking-widest font-bold text-neutral-300">{category.label}</span>
                    </div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#ccff00] shadow-[0_0_8px_#ccff00]" />
                </div>

                {isEditingExisting ? (
                    <form onSubmit={handleEditExisting} className="mt-auto mb-4">
                        <input
                            autoFocus
                            type="text"
                            value={existingInputValue}
                            onChange={(e) => setExistingInputValue(e.target.value)}
                            onBlur={handleEditExisting}
                            className="w-full bg-neutral-950 border border-neutral-700 rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none focus:border-[#ccff00]/50"
                        />
                    </form>
                ) : (
                    <p
                        onClick={() => {
                            setExistingInputValue(item.text);
                            setIsEditingExisting(true);
                        }}
                        className="text-sm text-neutral-100 font-medium leading-relaxed cursor-text"
                        title="Click to edit"
                    >
                        {item.text}
                    </p>
                )}

                <button
                    onClick={() => onComplete(category.id, item)}
                    className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-[#ccff00] hover:text-[#ccff00] transition-all transform translate-y-2 group-hover:translate-y-0"
                    title="Complete"
                >
                    <Icon name="check" size={14} />
                </button>

                <button
                    onClick={() => onDelete(category.id)}
                    className="absolute top-4 right-4 w-6 h-6 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 text-neutral-500 hover:bg-neutral-800 hover:text-red-400 transition-colors"
                    title="Delete"
                >
                    <Icon name="trash" size={14} />
                </button>
            </div>
        );
    }

    return (
        <div className="bg-transparent border border-dashed border-neutral-800 rounded-xl p-5 flex flex-col justify-between transition-all hover:border-neutral-600 h-full min-h-[140px]">
            <div className="flex items-center gap-2 mb-2">
                <Icon name={category.iconName} size={14} className="text-neutral-600" />
                <span className="text-[10px] tracking-widest font-bold text-neutral-600">{category.label}</span>
            </div>

            {isEditingNew ? (
                <form onSubmit={handleAddNew} className="mt-auto">
                    <input
                        autoFocus
                        type="text"
                        value={newInputValue}
                        onChange={(e) => setNewInputValue(e.target.value)}
                        onBlur={() => !newInputValue && setIsEditingNew(false)}
                        placeholder="Type intention..."
                        className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 px-3 text-sm text-neutral-200 focus:outline-none focus:border-[#ccff00]/50"
                    />
                </form>
            ) : (
                <div className="mt-auto">
                    <p className="text-xs text-neutral-400 mb-1">Add a new item...</p>
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] text-neutral-600 font-serif italic">{category.sub}</p>
                        <button
                            onClick={() => setIsEditingNew(true)}
                            className="w-6 h-6 rounded-md bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#ccff00] transition-colors"
                        >
                            <Icon name="plus" size={14} />
                        </button>
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

    useEffect(() => {
        setComment(movie.comment || '');
    }, [movie.comment]);

    const handleSaveComment = (e) => {
        if (e) e.preventDefault();
        if (comment.trim() !== (movie.comment || '')) {
            onUpdate(movie.id, { comment: comment.trim() });
        }
        setIsEditingComment(false);
    };

    return (
        <div className={`flex flex-col gap-1 p-3 rounded-xl transition-colors relative group ${movie.watched ? 'bg-neutral-900/30' : 'hover:bg-neutral-800/40'}`}>
            <div className="flex items-start gap-4 relative">
                <button
                    onClick={() => onToggle(movie)}
                    className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors relative overflow-hidden ${movie.watched ? 'border-[#a5b4fc]' : 'border-neutral-600'}`}
                >
                    <div className={`absolute inset-0 transition-opacity ${movie.watched ? 'opacity-100 bg-[#a5b4fc]' : 'opacity-0 group-hover:opacity-100 bg-[#a5b4fc]/20'}`} />
                    <Icon name="check" size={12} className={`relative z-10 transition-opacity ${movie.watched ? 'text-black opacity-100' : 'text-[#a5b4fc] opacity-0 group-hover:opacity-100'}`} />
                </button>

                {editingId === movie.id ? (
                    <input
                        autoFocus
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={() => {
                            if (editValue.trim() !== movie.title) onEdit(movie.id, editValue.trim());
                            setEditingId(null);
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                if (editValue.trim() !== movie.title) onEdit(movie.id, editValue.trim());
                                setEditingId(null);
                            }
                        }}
                        className="flex-1 bg-transparent border-b border-[#a5b4fc]/50 text-sm text-neutral-200 outline-none pb-0.5"
                    />
                ) : (
                    <span
                        onClick={() => {
                            setEditingId(movie.id);
                            setEditValue(movie.title);
                        }}
                        className={`text-sm leading-snug pt-0.5 flex-1 cursor-text transition-all ${movie.watched ? 'text-neutral-500 line-through' : 'text-neutral-300'}`}
                        title="Click to edit"
                    >
                        {movie.title}
                    </span>
                )}

                <button
                    onClick={() => onDelete(movie.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-neutral-500 hover:text-red-400 transition-colors absolute right-2 top-0"
                    title="Delete"
                >
                    <Icon name="trash" size={14} />
                </button>
            </div>

            {movie.watched && (
                <div className="pl-9 pr-8 mt-1 mb-1">
                    <div className="flex flex-col gap-1.5 bg-neutral-900/50 rounded-lg p-3 border border-neutral-800/80 transition-colors hover:border-[#a5b4fc]/20">
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => {
                                const isFilled = (hoverRating || movie.rating || 0) >= star;
                                return (
                                    <button
                                        key={star}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => onUpdate(movie.id, { rating: star })}
                                        className={`transition-colors ${isFilled ? 'text-yellow-400' : 'text-neutral-700 hover:text-[#a5b4fc]/50'}`}
                                    >
                                        <Icon name={isFilled ? "starFilled" : "star"} size={14} />
                                    </button>
                                );
                            })}
                        </div>

                        {isEditingComment ? (
                            <form onSubmit={handleSaveComment} className="mt-1">
                                <input
                                    autoFocus
                                    type="text"
                                    value={comment}
                                    onChange={e => setComment(e.target.value)}
                                    onBlur={handleSaveComment}
                                    placeholder="What did you think of it?"
                                    className="w-full bg-transparent border-b border-[#a5b4fc]/50 text-xs text-[#a5b4fc]/90 outline-none pb-1 font-serif italic"
                                />
                            </form>
                        ) : (
                            <p
                                onClick={() => setIsEditingComment(true)}
                                className={`text-xs mt-1 cursor-text transition-colors font-serif italic ${movie.comment ? 'text-[#a5b4fc]/80 hover:text-[#a5b4fc]' : 'text-neutral-600 hover:text-[#a5b4fc]/60'}`}
                            >
                                {movie.comment || "Add a review or note..."}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const MoviesVault = ({ movies, onAdd, onToggle, onDelete, onEdit, onUpdate }) => {
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
        }
    };

    return (
        <div className="bg-[#111111]/80 backdrop-blur-xl border border-[#a5b4fc]/20 rounded-3xl p-8 mb-20 shadow-[0_10px_40px_-20px_#a5b4fc20]">
            <SectionHeader title="Movies Vault" subtitle="SHARED WATCHLIST" iconName="film" accent="#a5b4fc" />

            <form onSubmit={handleSubmit} className="relative mb-6">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Add a movie or show..."
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-xl py-3 pl-4 pr-12 text-sm text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-[#a5b4fc]/40 transition-colors"
                />
                <button
                    type="submit"
                    disabled={!inputValue.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 text-black bg-[#a5b4fc] rounded-lg flex items-center justify-center disabled:bg-neutral-800 disabled:opacity-30 hover:scale-105 transition-transform"
                >
                    <Icon name="plus" size={18} />
                </button>
            </form>

            <div className="flex flex-col gap-1 max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                {movies.map(movie => (
                    <MovieItem
                        key={movie.id}
                        movie={movie}
                        onToggle={onToggle}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        onUpdate={onUpdate}
                    />
                ))}
                {movies.length === 0 && (
                    <div className="text-sm text-neutral-600 italic text-center mt-6 mb-6">No movies or shows added yet.</div>
                )}
            </div>
        </div>
    );
};

const ArchivedItem = ({ item, onRestore, onUpdate }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [comment, setComment] = useState(item.comment || '');

    const handleSaveComment = (e) => {
        if (e) e.preventDefault();
        if (comment.trim() !== (item.comment || '')) {
            onUpdate(item.id, { comment: comment.trim() });
        }
        setIsEditing(false);
    };

    return (
        <div className="flex flex-col gap-2 pb-5 border-b border-neutral-800/50 last:border-0 group relative">
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 w-4 h-4 rounded-full border border-[#88aaff]/50 flex items-center justify-center flex-shrink-0">
                        <Icon name="check" size={10} className="text-[#88aaff]" />
                    </div>
                    <span className="text-sm text-neutral-200">{item.text}</span>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => onRestore(item)}
                        title="Restore to board"
                        className="opacity-0 group-hover:opacity-100 text-neutral-500 hover:text-white transition-colors"
                    >
                        <Icon name="undo" size={14} />
                    </button>
                    <span className="text-[10px] font-mono text-neutral-600 flex-shrink-0 pt-1">{item.date}</span>
                </div>
            </div>

            <div className="pl-7 pr-4">
                <div className="flex flex-col gap-1.5 bg-neutral-900/30 rounded-lg p-3 border border-neutral-800/50 transition-colors hover:border-neutral-700/50">
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(star => {
                            const isFilled = (hoverRating || item.rating || 0) >= star;
                            return (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => onUpdate(item.id, { rating: star })}
                                    className={`transition-colors ${isFilled ? 'text-yellow-400' : 'text-neutral-700 hover:text-yellow-200'}`}
                                >
                                    <Icon name={isFilled ? "starFilled" : "star"} size={14} />
                                </button>
                            );
                        })}
                    </div>

                    {isEditing ? (
                        <form onSubmit={handleSaveComment} className="mt-1">
                            <input
                                autoFocus
                                type="text"
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                onBlur={handleSaveComment}
                                placeholder="Write a memory..."
                                className="w-full bg-transparent border-b border-neutral-500 text-xs text-neutral-300 outline-none pb-1 font-serif italic"
                            />
                        </form>
                    ) : (
                        <p
                            onClick={() => setIsEditing(true)}
                            className={`text-xs mt-1 cursor-text transition-colors font-serif italic ${item.comment ? 'text-neutral-400 hover:text-neutral-300' : 'text-neutral-700 hover:text-neutral-500'}`}
                        >
                            {item.comment || "Add a memory or note..."}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default function VisionBoard() {
    const [user, setUser] = useState(null);
    const [ankItems, setAnkItems] = useState([]);
    const [amyItems, setAmyItems] = useState([]);
    const [sharedItems, setSharedItems] = useState({});
    const [movies, setMovies] = useState([]);
    const [archivedItems, setArchivedItems] = useState([]);
    const [ideaVault, setIdeaVault] = useState([]);
    const [isVaultOpen, setIsVaultOpen] = useState(false);
    const [archiveSearch, setArchiveSearch] = useState('');
    const [archiveRating, setArchiveRating] = useState(0);
    const [archiveMonth, setArchiveMonth] = useState('all');

    // Helper for strictly scoped artifact paths
    const getColRef = (colName) => collection(db, 'artifacts', appId, 'public', 'data', colName);

    // 1. Authenticate Once
    useEffect(() => {
        const initAuth = async () => {
            try {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(auth, __initial_auth_token);
                } else {
                    await signInAnonymously(auth);
                }
            } catch (error) {
                console.error("Firebase Auth Error:", error);
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, setUser);
        return () => unsubscribe();
    }, []);

    // 2. Fetch Data when Authenticated
    useEffect(() => {
        if (!user) return;

        const unsubAnk = onSnapshot(getColRef('ankItems'), (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => a.createdAt - b.createdAt); // Sort in memory (Rule 2)
            setAnkItems(items);
        }, console.error);

        const unsubAmy = onSnapshot(getColRef('amyItems'), (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => a.createdAt - b.createdAt);
            setAmyItems(items);
        }, console.error);

        const unsubMovies = onSnapshot(getColRef('movies'), (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            // Sort unwatched to the top, then sort by newest added
            items.sort((a, b) => {
                if (a.watched === b.watched) return (b.createdAt || 0) - (a.createdAt || 0);
                return a.watched ? 1 : -1;
            });
            setMovies(items);
        }, console.error);

        const unsubShared = onSnapshot(getColRef('sharedItems'), (snap) => {
            const items = {};
            snap.docs.forEach(doc => {
                items[doc.id] = { id: doc.id, ...doc.data() };
            });
            setSharedItems(items);
        }, console.error);

        const unsubArchive = onSnapshot(getColRef('archivedItems'), (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => b.createdAt - a.createdAt); // Newest first
            setArchivedItems(items);
        }, console.error);

        const unsubVault = onSnapshot(getColRef('ideaVault'), (snap) => {
            const items = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            items.sort((a, b) => a.createdAt - b.createdAt);
            setIdeaVault(items);
        }, console.error);

        return () => {
            unsubAnk();
            unsubAmy();
            unsubMovies();
            unsubShared();
            unsubArchive();
            unsubVault();
        };
    }, [user]);

    const handleAddPersonal = async (board, text) => {
        if (!user) return;
        const colName = board === 'ank' ? 'ankItems' : 'amyItems';
        await addDoc(getColRef(colName), {
            text,
            date: new Date().toISOString(),
            createdAt: Date.now()
        });
    };

    const handleCompletePersonal = async (board, item) => {
        if (!user) return;
        const colName = board === 'ank' ? 'ankItems' : 'amyItems';

        // Remove from personal board
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, item.id));

        // Add to archive
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const categoryName = board === 'ank' ? "Ank's Orbit" : "Amy's Orbit";
        await addDoc(getColRef('archivedItems'), {
            text: item.text,
            category: categoryName,
            date: dateStr,
            source: board,
            createdAt: Date.now()
        });
    };

    const handleDeletePersonal = async (board, itemId) => {
        if (!user) return;
        const colName = board === 'ank' ? 'ankItems' : 'amyItems';
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, itemId));
    };

    const handleEditPersonal = async (board, itemId, newText) => {
        if (!user) return;
        const colName = board === 'ank' ? 'ankItems' : 'amyItems';
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', colName, itemId), { text: newText });
    };

    const handleDeleteShared = async (categoryId) => {
        if (!user) return;
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId));
    };

    const handleEditShared = async (categoryId, newText) => {
        if (!user) return;
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId), { text: newText });
    };

    const handleAddShared = async (categoryId, text) => {
        if (!user) return;
        await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId), {
            text,
            date: new Date().toISOString(),
            createdAt: Date.now()
        });
    };

    const handleCompleteShared = async (categoryId, item) => {
        if (!user) return;

        // Remove from shared board
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId));

        // Add to archive
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const category = CATEGORIES.find(c => c.id === categoryId);
        await addDoc(getColRef('archivedItems'), {
            text: item.text,
            category: category ? category.label : 'SHARED',
            date: dateStr,
            source: 'shared',
            createdAt: Date.now()
        });
    };

    const handleAddMovie = async (title) => {
        if (!user) return;
        await addDoc(getColRef('movies'), {
            title,
            watched: false,
            createdAt: Date.now()
        });
    };

    const handleToggleMovie = async (item) => {
        if (!user) return;
        const updates = { watched: !item.watched };
        if (item.watched) {
            // Wiping out the review and rating when un-watching
            updates.rating = null;
            updates.comment = '';
        }
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', item.id), updates);
    };

    const handleDeleteMovie = async (id) => {
        if (!user) return;
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id));
    };

    const handleEditMovie = async (id, newTitle) => {
        if (!user) return;
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id), { title: newTitle });
    };

    const handleUpdateMovie = async (id, updates) => {
        if (!user) return;
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'movies', id), updates);
    };

    const handleVaultAdd = async (text) => {
        if (!user) return;
        await addDoc(getColRef('ideaVault'), {
            text,
            createdAt: Date.now()
        });
    };

    const handleAddFromVault = async (item, destination, categoryId = null) => {
        if (!user) return;

        if (destination === 'ank' || destination === 'amy') {
            const colName = destination === 'ank' ? 'ankItems' : 'amyItems';
            await addDoc(getColRef(colName), {
                text: item.text,
                date: new Date().toISOString(),
                createdAt: Date.now()
            });
        } else if (destination === 'shared' && categoryId) {
            await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', categoryId), {
                text: item.text,
                date: new Date().toISOString(),
                createdAt: Date.now()
            });
        }

        // Remove from vault
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'ideaVault', item.id));
    };

    const handleRestore = async (item) => {
        if (!user) return;

        if (item.source === 'ank' || item.source === 'amy') {
            const colName = item.source === 'ank' ? 'ankItems' : 'amyItems';
            await addDoc(getColRef(colName), {
                text: item.text,
                date: new Date().toISOString(),
                createdAt: item.createdAt || Date.now()
            });
        } else if (item.source === 'shared') {
            const category = CATEGORIES.find(c => c.label === item.category);
            if (category) {
                if (sharedItems[category.id]) {
                    // If the slot is currently occupied, stash the restored item in the Idea Vault
                    await addDoc(getColRef('ideaVault'), { text: item.text, createdAt: Date.now() });
                } else {
                    // If the slot is open, drop it right back in
                    await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'sharedItems', category.id), {
                        text: item.text,
                        date: new Date().toISOString(),
                        createdAt: item.createdAt || Date.now()
                    });
                }
            }
        }

        // Remove from the Archive Hall of Fame
        await deleteDoc(doc(db, 'artifacts', appId, 'public', 'data', 'archivedItems', item.id));
    };

    const handleUpdateArchiveItem = async (id, updates) => {
        if (!user) return;
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'archivedItems', id), updates);
    };

    // Helper to extract the month and year for filtering
    const getMonthYear = (timestamp) => {
        if (!timestamp) return 'Unknown Date';
        const d = new Date(timestamp);
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    // Generate unique months from the archived items for the dropdown
    const availableMonths = [...new Set(archivedItems.map(item => getMonthYear(item.createdAt)))];

    // Apply filters
    const filteredArchive = archivedItems.filter(item => {
        const searchMatch = !archiveSearch ||
            item.text.toLowerCase().includes(archiveSearch.toLowerCase()) ||
            (item.comment && item.comment.toLowerCase().includes(archiveSearch.toLowerCase()));

        const ratingMatch = archiveRating === 0 ||
            (archiveRating === -1 && !item.rating) ||
            (archiveRating > 0 && item.rating === archiveRating);

        const monthMatch = archiveMonth === 'all' || getMonthYear(item.createdAt) === archiveMonth;

        return searchMatch && ratingMatch && monthMatch;
    });

    const groupedArchive = filteredArchive.reduce((acc, item) => {
        if (!acc[item.category]) acc[item.category] = [];
        acc[item.category].push(item);
        return acc;
    }, {});

    return (
        <div className="min-h-screen w-full bg-[#0a0a0a] text-neutral-200 text-left overflow-x-hidden relative" style={{ fontFamily: "'Outfit', sans-serif" }}>

            {/* Dynamic Font Injection */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,600;1,400;1,600&display=swap');
        .font-serif { font-family: 'Playfair Display', serif !important; }
        .font-sans { font-family: 'Outfit', sans-serif !important; }
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
      `}</style>

            {/* Thematic Eclipse Background */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
                <img
                    src="https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=2000&auto=format&fit=crop"
                    alt="Solar Eclipse"
                    className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 backdrop-blur-[24px] bg-[#0a0a0a]/50" />
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#fbbf24]/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#a5b4fc]/10 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/95" />
            </div>

            {/* Top Navigation - Cleaned Up */}
            <nav className="border-b border-white/5 bg-[#0a0a0a]/40 backdrop-blur-2xl sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-md border border-[#ccff00]/30 flex items-center justify-center bg-[#ccff00]/10">
                            <Icon name="sparkles" size={16} className="text-[#ccff00]" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-bold tracking-[0.2em] text-neutral-200">TOGETHER</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsVaultOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-900/60 border border-neutral-800 rounded-lg hover:border-neutral-600 transition-colors text-sm font-medium backdrop-blur-md"
                        >
                            <Icon name="sparkles" size={14} className="text-[#ccff00]" />
                            Idea Vault
                            {ideaVault.length > 0 && <span className="bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded text-[10px] ml-1">{ideaVault.length}</span>}
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] w-full mx-auto px-6 py-12 relative z-10">

                {/* Hero Section */}
                <div className="flex flex-col mb-16 max-w-4xl">
                    <TimeTogether startDate={START_DATE} />
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-[1.1] mb-6">
                        Two people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a5b4fc] via-[#f4f4f5] to-[#fbbf24]">one unfolding<br />universe.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-300 font-serif italic max-w-2xl leading-relaxed border-l-2 border-[#ccff00]/40 pl-6">
                        The sun dreams of tomorrow. The moon remembers yesterday.<br />Together, we build today.
                    </p>
                </div>

                {/* 3-Column Board Layout - Mobile Optimized Ordering */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px] gap-6 items-stretch mb-20">

                    {/* Left Column: Ank's Orbit */}
                    <PersonalBoard
                        className="order-2 lg:order-1"
                        title="Ank's Orbit"
                        subtitle="ILLUMINATED BY HER LIGHT"
                        inputPlaceholder="What can Amy help you achieve?"
                        iconName="moon"
                        themeColor="#a5b4fc"
                        items={ankItems}
                        onAdd={(text) => handleAddPersonal('ank', text)}
                        onComplete={(item) => handleCompletePersonal('ank', item)}
                        onDelete={(itemId) => handleDeletePersonal('ank', itemId)}
                        onEdit={(itemId, newText) => handleEditPersonal('ank', itemId, newText)}
                    />

                    {/* Center Column: Shared Universe - Forced to order-1 on Mobile */}
                    <div className="order-1 lg:order-2 bg-[#161816]/80 backdrop-blur-xl border border-[#ccff00]/20 rounded-3xl p-8 shadow-[0_10px_40px_-20px_#ccff0050] flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1">
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        <div className="relative z-10 h-full flex flex-col">
                            <SectionHeader
                                title={<>Where our<br />orbits meet.</>}
                                subtitle="THE CENTER OF GRAVITY"
                                iconName="sparkles"
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 mt-4">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                                    // Center Graphic
                                    if (index === 4) {
                                        return (
                                            <div key="center" className="bg-neutral-950/50 border border-[#ccff00]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden hidden lg:flex">
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ccff00]/5 via-transparent to-transparent opacity-50" />
                                                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 mb-3 z-10">OUR UNIVERSE</span>
                                                <h3 className="text-2xl font-serif text-[#ccff00] italic leading-tight mb-4 z-10">
                                                    Together,<br />we build<br />today.
                                                </h3>
                                                <span className="text-[10px] tracking-widest text-[#ccff00]/70 uppercase z-10">Right here, right now</span>
                                            </div>
                                        );
                                    }

                                    const categoryIndex = index > 4 ? index - 1 : index;
                                    const category = CATEGORIES[categoryIndex];
                                    const item = sharedItems[category.id];

                                    return (
                                        <CategorySlot
                                            key={category.id}
                                            category={category}
                                            item={item}
                                            onAdd={handleAddShared}
                                            onComplete={handleCompleteShared}
                                            onDelete={handleDeleteShared}
                                            onEdit={handleEditShared}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Amy's Ascent */}
                    <PersonalBoard
                        className="order-3 lg:order-3"
                        title="Amy's Orbit"
                        subtitle="ANCHORED BY HIS GRAVITY"
                        inputPlaceholder="What can Ank help you achieve?"
                        iconName="sun"
                        themeColor="#fbbf24"
                        items={amyItems}
                        onAdd={(text) => handleAddPersonal('amy', text)}
                        onComplete={(item) => handleCompletePersonal('amy', item)}
                        onDelete={(itemId) => handleDeletePersonal('amy', itemId)}
                        onEdit={(itemId, newText) => handleEditPersonal('amy', itemId, newText)}
                    />
                </div>

                <MoviesVault
                    movies={movies}
                    onAdd={handleAddMovie}
                    onToggle={handleToggleMovie}
                    onDelete={handleDeleteMovie}
                    onEdit={handleEditMovie}
                    onUpdate={handleUpdateMovie}
                />

                {/* The Archive / Hall of Fame */}
                <div className="bg-[#111]/80 border border-neutral-800 rounded-3xl p-10 relative overflow-hidden shadow-2xl">
                    <div className="absolute right-0 top-0 w-96 h-96 bg-[#ccff00]/5 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />

                    <div className="flex items-end justify-between mb-12 border-b border-neutral-800 pb-8 relative z-10">
                        <div>
                            <h2 className="text-5xl font-serif text-white tracking-tight">
                                <span className="italic text-neutral-400">The things that</span> happened.
                            </h2>
                        </div>

                        <div className="px-6 py-3 rounded-full border border-neutral-700 bg-neutral-900/50 backdrop-blur flex items-center gap-2">
                            <Icon name="check" size={14} className="text-[#88aaff]" />
                            <span className="text-xs font-medium text-neutral-300">{archivedItems.length} preserved</span>
                        </div>
                    </div>

                    {/* Archive Filter Bar */}
                    {archivedItems.length > 0 && (
                        <div className="flex flex-col md:flex-row gap-4 mb-10 relative z-10">
                            <div className="relative flex-1">
                                <Icon name="search" size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input
                                    type="text"
                                    placeholder="Search memories, titles, or notes..."
                                    value={archiveSearch}
                                    onChange={(e) => setArchiveSearch(e.target.value)}
                                    className="w-full bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-11 pr-4 text-sm text-neutral-200 focus:outline-none focus:border-[#88aaff]/50 transition-colors"
                                />
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                                <div className="relative flex-1 sm:flex-none">
                                    <select
                                        value={archiveRating}
                                        onChange={(e) => setArchiveRating(Number(e.target.value))}
                                        className="w-full sm:w-auto bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-4 pr-10 text-sm text-neutral-200 focus:outline-none focus:border-[#88aaff]/50 appearance-none cursor-pointer transition-colors"
                                    >
                                        <option value={0}>All Ratings</option>
                                        <option value={5}>5 Stars</option>
                                        <option value={4}>4 Stars</option>
                                        <option value={3}>3 Stars</option>
                                        <option value={2}>2 Stars</option>
                                        <option value={1}>1 Star</option>
                                        <option value={-1}>Unrated</option>
                                    </select>
                                    <Icon name="chevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                </div>

                                <div className="relative flex-1 sm:flex-none">
                                    <select
                                        value={archiveMonth}
                                        onChange={(e) => setArchiveMonth(e.target.value)}
                                        className="w-full sm:w-auto bg-neutral-900/50 border border-neutral-800 rounded-xl py-3 pl-4 pr-10 text-sm text-neutral-200 focus:outline-none focus:border-[#88aaff]/50 appearance-none cursor-pointer transition-colors"
                                    >
                                        <option value="all">All Time</option>
                                        {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                                    </select>
                                    <Icon name="chevronDown" size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative z-10">
                        {Object.keys(groupedArchive).length === 0 ? (
                            <div className="col-span-full text-center py-12 text-neutral-600">
                                {archivedItems.length === 0
                                    ? "The archive is waiting for your first completed intention."
                                    : "No memories found matching your search filters."}
                            </div>
                        ) : (
                            Object.entries(groupedArchive).map(([categoryName, items]) => (
                                <div key={categoryName}>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-[1px] w-4 bg-neutral-700" />
                                        <h4 className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">{categoryName}</h4>
                                    </div>
                                    <div className="space-y-4">
                                        {items.map(item => (
                                            <ArchivedItem
                                                key={item.id}
                                                item={item}
                                                onRestore={handleRestore}
                                                onUpdate={handleUpdateArchiveItem}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>

            {/* Idea Vault Sidebar (Overlay) */}
            {isVaultOpen && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsVaultOpen(false)} />
                    <div className="w-full max-w-[400px] h-full bg-[#111] border-l border-neutral-800 relative flex flex-col shadow-2xl transition-transform">
                        <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-serif text-white">Idea Vault</h3>
                                <p className="text-xs text-neutral-500">Unassigned intentions</p>
                            </div>
                            <button onClick={() => setIsVaultOpen(false)} className="p-2 hover:bg-neutral-800 rounded-full text-neutral-400 transition-colors">
                                <Icon name="x" size={20} />
                            </button>
                        </div>

                        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    const val = e.target.elements.idea.value.trim();
                                    if (val) {
                                        handleVaultAdd(val);
                                        e.target.reset();
                                    }
                                }}
                                className="mb-8 relative"
                            >
                                <input
                                    name="idea"
                                    type="text"
                                    placeholder="Drop a new idea here..."
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded-xl py-3 pl-4 pr-12 text-sm text-neutral-200 focus:outline-none focus:border-[#ccff00]/50"
                                />
                                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-neutral-400 hover:text-[#ccff00]">
                                    <Icon name="plus" size={18} />
                                </button>
                            </form>

                            <div className="space-y-4">
                                {ideaVault.map(item => (
                                    <div key={item.id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 group">
                                        <p className="text-sm text-neutral-200 mb-4">{item.text}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <button
                                                onClick={() => handleAddFromVault(item, 'ank')}
                                                className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 flex items-center gap-1 transition-colors"
                                            >
                                                <Icon name="moon" size={10} /> To Ank
                                            </button>
                                            <button
                                                onClick={() => handleAddFromVault(item, 'amy')}
                                                className="text-[10px] px-2 py-1 bg-neutral-800 hover:bg-neutral-700 rounded text-neutral-300 flex items-center gap-1 transition-colors"
                                            >
                                                <Icon name="sun" size={10} /> To Amy
                                            </button>
                                            <div className="relative group/dropdown">
                                                <button className="text-[10px] px-2 py-1 bg-[#ccff00]/10 hover:bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/20 rounded flex items-center gap-1 transition-colors">
                                                    <Icon name="sparkles" size={10} /> To Shared <Icon name="arrowRight" size={10} />
                                                </button>
                                                <div className="absolute top-full right-0 mt-1 w-48 bg-neutral-900 border border-neutral-700 rounded-lg shadow-xl opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all z-20 py-1">
                                                    {CATEGORIES.map(cat => {
                                                        const isFull = !!sharedItems[cat.id];
                                                        return (
                                                            <button
                                                                key={cat.id}
                                                                disabled={isFull}
                                                                onClick={() => handleAddFromVault(item, 'shared', cat.id)}
                                                                className="w-full text-left px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent flex items-center justify-between"
                                                            >
                                                                {cat.label}
                                                                {isFull && <Icon name="lock" size={10} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {ideaVault.length === 0 && (
                                    <div className="text-center text-neutral-600 text-sm py-10">Vault is empty.</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}