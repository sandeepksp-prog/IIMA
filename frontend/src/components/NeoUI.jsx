import {
    LayoutDashboard, FileText, Users, BarChart3, MessageCircle, Settings,
    Search, Bell, ChevronDown, BookOpen, Brain, Target, Zap, Clock,
    Check, X, ChevronRight, Lightbulb
} from 'lucide-react';

/**
 * Sidebar - White with subtle shadow
 */
export function Sidebar({ activeTab = 'dashboard', onTabChange }) {
    const navItems = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'reports', icon: FileText, label: 'Reports' },
        { id: 'screening', icon: Target, label: 'Practice' },
        { id: 'members', icon: Users, label: 'Patterns' },
        { id: 'statistics', icon: BarChart3, label: 'Statistics' },
        { id: 'chat', icon: MessageCircle, label: 'Live Chat' },
        { id: 'settings', icon: Settings, label: 'Settings' },
    ];

    return (
        <aside className="layout-sidebar flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-bold text-lg text-slate-800">CAT Engine</span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onTabChange?.(item.id)}
                        className={`nav-item w-full relative ${activeTab === item.id ? 'active' : ''}`}
                    >
                        <item.icon className="w-5 h-5" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>
    );
}

/**
 * TopBar - Search, notifications, profile
 */
export function TopBar() {
    return (
        <div className="flex items-center justify-between mb-8">
            <div className="search-box w-80">
                <Search className="w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search..." className="search-input" />
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span>Information system class</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
                <button className="p-2 rounded-xl hover:bg-slate-100">
                    <Bell className="w-5 h-5 text-slate-500" />
                </button>
                <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold">
                        JD
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">John Doe</p>
                        <p className="text-xs text-slate-400">Teacher</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * HeroCard - Purple gradient like reference
 */
export function HeroCard({ title, description, stats }) {
    return (
        <div className="card-hero">
            <div className="flex items-start gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{title}</h2>
                    <p className="text-white/80 text-sm mb-6">{description}</p>
                    <div className="flex gap-4">
                        {stats.map((stat, i) => (
                            <div key={i} className="stat-box">
                                <div className="stat-value">{stat.value}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

/**
 * StatsCard - White card with colored accent
 */
export function StatsCard({ icon: Icon, value, label, color = 'primary', trend }) {
    const colorClasses = {
        primary: 'text-primary bg-primary/10',
        success: 'text-success bg-success/10',
        warning: 'text-warning bg-warning/10',
        danger: 'text-danger bg-danger/10',
    };

    return (
        <div className="card flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${colorClasses[color]}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <div className="text-2xl font-bold text-slate-800">{value}</div>
                <div className="text-sm text-slate-500">{label}</div>
            </div>
            {trend && (
                <div className={`ml-auto text-sm font-medium ${trend > 0 ? 'text-success' : 'text-danger'}`}>
                    {trend > 0 ? '+' : ''}{trend}%
                </div>
            )}
        </div>
    );
}

/**
 * MemberList - Right sidebar members
 */
export function MemberList({ members }) {
    return (
        <div className="space-y-2">
            {members.map((member, i) => (
                <div key={i} className="member-item">
                    <div className="member-avatar">{member.initials}</div>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-slate-700">{member.name}</p>
                        <p className="text-xs text-slate-400">{member.score}</p>
                    </div>
                </div>
            ))}
        </div>
    );
}

/**
 * ProgressBar
 */
export function ProgressBar({ value, color = 'primary', label }) {
    const colors = {
        primary: 'bg-primary',
        success: 'bg-success',
        warning: 'bg-warning',
        danger: 'bg-danger',
        blue: 'bg-blue-500',
        purple: 'bg-purple-500',
    };

    return (
        <div className="flex items-center gap-3">
            {label && <span className="text-xs text-slate-500 w-24">{label}</span>}
            <div className="progress-bar flex-1">
                <div className={`progress-fill ${colors[color]}`} style={{ width: `${value}%` }} />
            </div>
            <span className="text-xs font-medium text-slate-600 w-10">{value}%</span>
        </div>
    );
}

/**
 * SubjectScore - Score with progress bars
 */
export function SubjectScore({ subjects }) {
    return (
        <div className="space-y-3">
            {subjects.map((s, i) => (
                <div key={i} className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${s.color}`} />
                    <span className="text-sm text-slate-600 w-28">{s.name}</span>
                    <div className="progress-bar flex-1">
                        <div className={`progress-fill ${s.color}`} style={{ width: `${s.score}%` }} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{s.score}</span>
                </div>
            ))}
        </div>
    );
}

/**
 * OptionCard
 */
export function OptionCard({ optionKey, value, selected, correct, incorrect, onClick, disabled }) {
    let stateClass = '';
    if (correct) stateClass = 'correct';
    else if (incorrect) stateClass = 'incorrect';
    else if (selected) stateClass = 'selected';

    return (
        <div
            onClick={() => !disabled && onClick?.(optionKey)}
            className={`option-card ${stateClass} ${disabled ? 'cursor-default' : ''}`}
        >
            <span className="option-key">{optionKey}</span>
            <span className="flex-1 text-slate-700">{value}</span>
            {correct && <Check className="w-5 h-5 text-success" />}
            {incorrect && <X className="w-5 h-5 text-danger" />}
        </div>
    );
}

/**
 * Badge
 */
export function Badge({ children, variant = 'primary' }) {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        danger: 'badge-danger',
    };
    return <span className={`badge ${variants[variant]}`}>{children}</span>;
}

/**
 * Button
 */
export function Button({ children, variant = 'primary', className = '', ...props }) {
    return (
        <button className={`btn btn-${variant} ${className}`} {...props}>
            {children}
        </button>
    );
}
