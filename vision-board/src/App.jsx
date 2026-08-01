import React, { useState } from 'react';

// Inlining SVGs so this file works flawlessly without needing to install lucide-react
const Icon = ({ name, size = 16, className = "", style = {} }) => {
    const icons = {
        sparkles: <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />,
        moon: <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />,
        sun: <><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></>,
        check: <polyline points="20 6 9 17 4 12" />,
        plus: <><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></>,
        x: <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>,
        archive: <><polyline points="21 8 21 21 3 21 3 8" /><rect x="1" y="3" width="22" height="5" /><line x1="10" y1="12" x2="14" y2="12" /></>,
        lock: <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
        arrowRight: <><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></>,
        dining: <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />,
        cooking: <><path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z" /><line x1="6" y1="17" x2="18" y2="17" /></>,
        indoors: <><path d="M20 9V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v3" /><path d="M2 11v5a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M4 18v2" /><path d="M20 18v2" /><path d="M12 4v9" /></>,
        outdoors: <><path d="M10 10v.2A3 3 0 0 1 8.9 16v0H5v0h0a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z" /><path d="M7 16v6" /><path d="M13 19v3" /><path d="M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L14 3l-3 4.3" /></>,
        events: <><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2" /><path d="M13 17v2" /><path d="M13 11v2" /></>,
        travel: <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21.5 4c0 0-2-.5-3.5 1.5L14.5 9 6.2 7.2c-.8-.2-1.6.2-2 .9L3 9.6l5.5 3.5L5 16.5l-3.2-.8-1.3 1.3 4.5 2 2 4.5 1.3-1.3-.8-3.2 3.4-3.5 3.5 5.5 1.5-1.2c.7-.4 1.1-1.2.9-2Z" />,
        deep_dives: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></>,
        culture: <><path d="M12 3 2 7l10 4 10-4-10-4Z" /><path d="M6 11v5" /><path d="M10 11v5" /><path d="M14 11v5" /><path d="M18 11v5" /><path d="M4 16h16" /><path d="M4 21h16" /></>
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

const PersonalBoard = ({ title, subtitle, iconName, items, onAdd, onComplete, themeColor = LIME, inputPlaceholder, className = "" }) => {
    const [inputValue, setInputValue] = useState('');

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
                    placeholder={inputPlaceholder || `Add a small thing to ${title}...`}
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
                    <div key={item.id} className="group flex items-start gap-4 p-3 hover:bg-neutral-800/40 rounded-xl transition-colors">
                        <button
                            onClick={() => onComplete(item)}
                            className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border border-neutral-600 flex items-center justify-center transition-colors relative overflow-hidden"
                        >
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `${themeColor}20`, borderColor: themeColor, borderWidth: '1px', borderRadius: '999px' }} />
                            <Icon name="check" size={12} className="opacity-0 group-hover:opacity-100 relative z-10" style={{ color: themeColor }} />
                        </button>
                        <span className="text-sm text-neutral-300 leading-snug pt-0.5">{item.text}</span>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-sm text-neutral-600 italic text-center mt-10">No active dreams yet.</div>
                )}
            </div>

            <div className="mt-4 pt-4 border-t border-neutral-800/50 flex justify-center">
                <span className="text-[10px] tracking-widest text-neutral-500 uppercase">{items.length} Live Intentions</span>
            </div>
        </div>
    );
};

const CategorySlot = ({ category, item, onAdd, onComplete }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onAdd(category.id, inputValue.trim());
            setInputValue('');
            setIsEditing(false);
        }
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
                <p className="text-sm text-neutral-100 font-medium leading-relaxed">{item.text}</p>

                <button
                    onClick={() => onComplete(category.id, item)}
                    className="absolute bottom-4 right-4 w-8 h-8 rounded-full border border-neutral-700 bg-neutral-950 flex items-center justify-center opacity-0 group-hover:opacity-100 hover:border-[#ccff00] hover:text-[#ccff00] transition-all transform translate-y-2 group-hover:translate-y-0"
                >
                    <Icon name="check" size={14} />
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

            {isEditing ? (
                <form onSubmit={handleSubmit} className="mt-auto">
                    <input
                        autoFocus
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onBlur={() => !inputValue && setIsEditing(false)}
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
                            onClick={() => setIsEditing(true)}
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

export default function VisionBoard() {
    // Application State
    const [ankItems, setAnkItems] = useState([
        { id: 'ank1', text: 'Find a tiny turntable for the kitchen', date: new Date().toISOString() },
        { id: 'ank2', text: 'Pick a trail for the first cool weekend', date: new Date().toISOString() }
    ]);
    const [amyItems, setAmyItems] = useState([
        { id: 'amy1', text: 'Choose the colour for the reading corner', date: new Date().toISOString() },
        { id: 'amy2', text: 'Find a museum night with a late opening', date: new Date().toISOString() }
    ]);
    const [sharedItems, setSharedItems] = useState({
        'dining': { id: 's1', text: 'Thai food on saturday', date: new Date().toISOString() },
        'cooking': { id: 's2', text: 'Bake the citrus olive-oil cake', date: new Date().toISOString() },
        'indoors': { id: 's3', text: 'Autumn double feature + the good blanket', date: new Date().toISOString() },
        'travel': { id: 's4', text: 'Two unhurried days in Montréal', date: new Date().toISOString() },
        'culture': { id: 's5', text: 'A Saturday gallery crawl', date: new Date().toISOString() }
    });

    const [archivedItems, setArchivedItems] = useState([
        { id: 'a1', text: 'Late supper at the tiny ramen bar', category: 'DINING', date: 'JUL 28', source: 'shared' },
        { id: 'a2', text: 'Swim before breakfast, once', category: 'OUTDOORS', date: 'JUL 28', source: 'shared' },
        { id: 'a3', text: 'Learn the lemon pasta properly', category: 'ANK\'S TIDES', date: 'AUG 1', source: 'ank' }
    ]);

    const [ideaVault, setIdeaVault] = useState([
        { id: 'v1', text: 'Buy tickets for the jazz festival' }
    ]);
    const [isVaultOpen, setIsVaultOpen] = useState(false);

    const sharedCount = Object.keys(sharedItems).length;

    const handleAddPersonal = (board, text) => {
        const newItem = { id: Date.now().toString(), text, date: new Date().toISOString() };
        if (board === 'ank') setAnkItems([...ankItems, newItem]);
        else setAmyItems([...amyItems, newItem]);
    };

    const handleCompletePersonal = (board, item) => {
        if (board === 'ank') setAnkItems(ankItems.filter(i => i.id !== item.id));
        else setAmyItems(amyItems.filter(i => i.id !== item.id));

        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        const categoryName = board === 'ank' ? "ANK'S TIDES" : "AMY'S DAWNS";
        setArchivedItems([{ ...item, category: categoryName, date: dateStr, source: board }, ...archivedItems]);
    };

    const handleAddShared = (categoryId, text) => {
        setSharedItems({
            ...sharedItems,
            [categoryId]: { id: Date.now().toString(), text, date: new Date().toISOString() }
        });
    };

    const handleCompleteShared = (categoryId, item) => {
        const newShared = { ...sharedItems };
        delete newShared[categoryId];
        setSharedItems(newShared);

        const categoryLabel = CATEGORIES.find(c => c.id === categoryId).label;
        const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
        setArchivedItems([{ ...item, category: categoryLabel, date: dateStr, source: 'shared' }, ...archivedItems]);
    };

    const handleAddFromVault = (vaultItem, targetBoard, categoryId = null) => {
        if (targetBoard === 'ank') handleAddPersonal('ank', vaultItem.text);
        else if (targetBoard === 'amy') handleAddPersonal('amy', vaultItem.text);
        else if (targetBoard === 'shared' && categoryId) handleAddShared(categoryId, vaultItem.text);

        setIdeaVault(ideaVault.filter(i => i.id !== vaultItem.id));
    };
    // Group Archive by Category
    const groupedArchive = archivedItems.reduce((acc, item) => {
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
      `}</style>

            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
                {/* 1. The Actual Image (Solar Eclipse - Sun & Moon overlapping) */}
                <img
                    src="https://images.unsplash.com/photo-1481819613568-3701cbc70156?q=80&w=2000&auto=format&fit=crop"
                    alt="Cosmic eclipse background"
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                />

                {/* 2. The "Blurry Thingy" on Top (Frosted glass overlay) */}
                <div className="absolute inset-0 backdrop-blur-[24px] bg-[#0a0a0a]/40" />

                {/* 3. Thematic Ambient Glows (Sun on right, Moon on left) */}
                <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#fbbf24]/15 rounded-full blur-[120px] mix-blend-screen" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] bg-[#a5b4fc]/15 rounded-full blur-[120px] mix-blend-screen" />

                {/* 4. Dark gradient overlay to ensure text contrast at the top and bottom */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/90 via-transparent to-[#0a0a0a]/90" />
            </div>

            {/* Top Navigation */}
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
                            <span className="bg-neutral-800 text-neutral-400 px-1.5 py-0.5 rounded text-[10px] ml-1">{ideaVault.length}</span>
                        </button>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] w-full mx-auto px-6 py-12 relative z-10">
                {/* Hero Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div>
                        <p className="text-[10px] tracking-[0.2em] font-semibold text-[#a5b4fc] mb-4 uppercase">Ank & Amy • The Sun and The Moon</p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif tracking-tight text-white leading-[1.1]">
                            Two people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#a5b4fc] via-[#f4f4f5] to-[#fbbf24]">one unfolding<br />universe.</span>
                        </h1>
                    </div>
                    <div className="max-w-xs text-sm text-neutral-400 leading-relaxed md:text-right pb-2 font-serif italic">
                        "The sun dreams of tomorrow. The moon remembers yesterday. Together, we build today."
                    </div>
                </div>

                {/* 3-Column Board Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] xl:grid-cols-[320px_1fr_320px] gap-6 items-stretch mb-20">

                    {/* Left Column: Ank's baord */}
                    <PersonalBoard
                        className="order-2 lg:order-1"
                        title="Ank's Space"
                        subtitle="GUIDED BY HER LIGHT"
                        inputPlaceholder="What can Amy help you achieve?"
                        iconName="moon"
                        themeColor="#a5b4fc"
                        items={ankItems}
                        onAdd={(text) => handleAddPersonal('ank', text)}
                        onComplete={(item) => handleCompletePersonal('ank', item)}
                    />

                    {/* Center Column: Shared Universe */}
                    <div className="order-1 lg:order-2 bg-[#161816]/80 backdrop-blur-xl border border-[#ccff00]/20 rounded-3xl p-8 shadow-[0_10px_40px_-20px_#ccff0050] flex flex-col relative overflow-hidden transition-all duration-500 hover:-translate-y-1">
                        {/* Subtle stars background */}
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>

                        <div className="relative z-10 h-full flex flex-col">
                            <SectionHeader
                                title={<>The chapters we write together.</>}
                                subtitle={<>THE SHARED HORIZON</> }
                                iconName="sparkles"
                                rightContent={
                                    <div className="text-right">
                                        <div className="text-[10px] tracking-widest text-neutral-500 uppercase mb-1">Shared Capacity</div>
                                        <div className="text-sm font-mono"><span className="text-[#ccff00]">{sharedCount}</span> / 8 held</div>
                                    </div>
                                }
                            />

                            {/* 3x3 Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 flex-1 mt-4">
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((index) => {
                                    // The Center Tile
                                    if (index === 4) {
                                        return (
                                            <div key="center" className="bg-neutral-950/50 border border-[#ccff00]/30 rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden hidden lg:flex">
                                                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#ccff00]/5 via-transparent to-transparent opacity-50" />
                                                <span className="text-[10px] tracking-[0.2em] font-bold text-neutral-500 mb-3 z-10">CURRENT ORBIT</span>
                                                <h3 className="text-2xl font-serif text-[#ccff00] italic leading-tight mb-4 z-10">
                                                    All the places<br />the next story<br />could begin.
                                                </h3>
                                                <span className="text-[10px] tracking-widest text-[#ccff00]/70 uppercase z-10">Two Paths / One Center</span>
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
                                        />
                                    );
                                })}
                            </div>

                            <div className="mt-6 flex items-center justify-between border-t border-neutral-800/50 pt-6">
                                <span className="text-[10px] tracking-widest text-neutral-600 uppercase">Only eight kinds of good thing</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Amy's board */}
                    <PersonalBoard
                        className="order-3 lg:order-3"
                        title="Amy's Space"
                        subtitle="ANCHORED BY HIS GRAVITY"
                        inputPlaceholder="What can Ank help you achieve?"
                        iconName="sun"
                        themeColor="#fbbf24"
                        items={amyItems}
                        onAdd={(text) => handleAddPersonal('amy', text)}
                        onComplete={(item) => handleCompletePersonal('amy', item)}
                    />
                </div>

                {/* Info Bar above Archive */}
                <div className="flex items-center justify-end mb-8 px-2">
                    <button
                        onClick={() => setIsVaultOpen(true)}
                        className="flex items-center gap-4 bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-2 hover:bg-neutral-800 transition-colors shadow-lg"
                    >
                        <div className="text-right hidden sm:block">
                            <div className="text-[9px] tracking-widest text-neutral-500 uppercase mb-0.5">Temporary Field</div>
                            <div className="text-sm font-medium">Open the Idea Vault</div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-[#ccff00]">
                            <Icon name="sparkles" size={14} />
                        </div>
                    </button>
                </div>

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

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 relative z-10">
                        {Object.keys(groupedArchive).length === 0 ? (
                            <div className="col-span-full text-center py-12 text-neutral-600">
                                The archive is waiting for your first completed intention.
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
                                            <div key={item.id} className="flex flex-col gap-1 pb-4 border-b border-neutral-800/50 last:border-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-1 w-4 h-4 rounded-full border border-[#88aaff]/50 flex items-center justify-center flex-shrink-0">
                                                            <Icon name="check" size={10} className="text-[#88aaff]" />
                                                        </div>
                                                        <span className="text-sm text-neutral-200">{item.text}</span>
                                                    </div>
                                                    <span className="text-[10px] font-mono text-neutral-600 flex-shrink-0 pt-1">{item.date}</span>
                                                </div>
                                            </div>
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
                                        setIdeaVault([...ideaVault, { id: Date.now().toString(), text: val }]);
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