import { motion, useScroll } from 'framer-motion';
import {
    BookOpen,
    Star,
    ArrowRight,
    Smartphone,
    Layout,
    BarChart,
    Shield,
    Globe,
    PlayCircle,
    Check,
    Quote,
    Layers,
    ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRef } from 'react';

const LandingPage = () => {
    const sectionRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });
    console.log(scrollYProgress); // Keep it or use it for something simple to resolve lint if needed, or just remove.


    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
            {/* Global Gradient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-xl z-[100] border-b border-slate-100/50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <motion.div
                            whileHover={{ rotate: 10, scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="bg-indigo-600 p-2.5 rounded-[1.2rem] shadow-xl shadow-indigo-100 cursor-pointer"
                        >
                            <BookOpen className="text-white w-6 h-6" />
                        </motion.div>
                        <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 via-violet-700 to-indigo-700 tracking-tighter">
                            CoachVerse
                        </span>
                    </div>

                    <div className="hidden lg:flex items-center gap-8">
                        {['Features', 'Integrations', 'Pricing', 'Resources'].map((item) => (
                            <a
                                key={item}
                                href={`#${item.toLowerCase()}`}
                                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors tracking-tight"
                            >
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-6">
                        <Link to="/login" className="hidden sm:block text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
                            Log In
                        </Link>
                        <Link
                            to="/register"
                            className="group relative bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-sm font-black overflow-hidden shadow-2xl shadow-slate-200 transition-all hover:scale-105 active:scale-95"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                START FREE
                                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </span>
                            <div className="absolute inset-0 bg-indigo-600 translate-y-[101%] group-hover:translate-y-0 transition-transform duration-300"></div>
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-56 pb-20 px-6 overflow-visible">
                <div className="max-w-7xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-10"
                    >
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-white shadow-sm">
                            <Layers className="w-3 h-3" />
                            PLATFORM VERSION 2.0 IS LIVE
                        </span>

                        <h1 className="text-7xl md:text-[8rem] font-black text-slate-900 tracking-tight leading-[0.85] mb-10">
                            Empower your <br />
                            <span className="relative inline-block text-indigo-600">
                                Academy
                                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-indigo-100 -z-10" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                                    <path d="M0 15C50 5 150 5 200 15" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto mb-16 leading-relaxed font-medium">
                            Scale your coaching business with intelligence. Manage students,
                            courses, and growth in one stunning, AI-powered hub.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] active:scale-95 group">
                                Create Workspace
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <button className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-12 py-5 rounded-[2.5rem] font-black text-lg hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                                <PlayCircle className="w-5 h-5 text-indigo-600" />
                                Product Tour
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-20 relative max-w-[1100px] mx-auto pointer-events-none"
                    >
                        {/* Dashboard Image */}
                        <div className="relative rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-8 border-white bg-slate-900">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200"
                                alt="CoachVerse Dashboard"
                                className="w-full object-cover opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent"></div>
                        </div>

                        {/* Floating elements for depth */}
                        <motion.div
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -top-12 -right-8 p-8 bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl border border-white/50 hidden lg:block"
                        >
                            <div className="flex flex-col items-center gap-4">
                                <div className="p-4 bg-emerald-50 rounded-2xl">
                                    <BarChart className="text-emerald-500 w-8 h-8" />
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-black text-slate-900">+82%</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Growth</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            animate={{ y: [0, 20, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            className="absolute -bottom-8 -left-8 p-8 bg-black text-white rounded-[2.5rem] shadow-2xl border border-slate-800 hidden lg:block"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex -space-x-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 flex items-center justify-center text-[10px]">
                                            U{i}
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="text-xs font-black tracking-widest uppercase">Live Mentors</p>
                                    <div className="flex items-center gap-1.5 text-emerald-400">
                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
                                        <span className="text-[10px] font-bold">1.2k Online</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof */}
            <div className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Industry leading institutes trust CoachVerse</p>
                    <div className="flex flex-wrap justify-between items-center gap-x-16 gap-y-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                        {['TECHNIQUE', 'LEARN.AI', 'MODERN.ED', 'SYNERGY', 'VELOCITY'].map(brand => (
                            <span key={brand} className="text-3xl font-black tracking-tighter text-slate-900">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-40 relative px-6" ref={sectionRef}>
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-32">
                        <div className="max-w-3xl">
                            <span className="text-indigo-600 font-extrabold uppercase tracking-[0.3em] text-xs mb-8 block">PLATFORM ECOSYSTEM</span>
                            <h2 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tight leading-[0.85] mb-12">
                                Engineered for <br />
                                <span className="text-slate-300">Infinite Scaling.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium">A unified operating system for your entire educational enterprise.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[
                            { title: 'Unified Dashboards', desc: 'Custom portals tailored for students, parents, teachers, and admins.', icon: Layout, theme: 'indigo' },
                            { title: 'Predictive Analytics', desc: 'Identify struggling students before they fail with AI signals.', icon: BarChart, theme: 'rose' },
                            { title: 'Smart Scheduling', desc: 'Automated batch management and conflict-free timetables.', icon: Smartphone, theme: 'emerald' },
                            { title: 'End-to-End Encryption', desc: 'Military-grade security for student data and communications.', icon: Shield, theme: 'amber' },
                            { title: 'Global Infrastructure', desc: 'Ultra-low latency content delivery for students worldwide.', icon: Globe, theme: 'blue' },
                            { title: 'Brand Identity', desc: 'Fully white-labeled portal that looks like your own app.', icon: Smartphone, theme: 'violet' },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-12 rounded-[3.5rem] bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-[0_40px_80px_-20px_rgba(79,70,229,0.1)] transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 rounded-3xl mb-10 flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 bg-slate-50`}>
                                    <f.icon className="w-7 h-7 text-slate-800" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-6 tracking-tight uppercase">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
                                <div className="mt-8 flex items-center gap-2 text-indigo-600 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                    Learn More <ArrowRight className="w-4 h-4" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-40 bg-slate-50 relative overflow-hidden px-6">
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8">Loved by modern creators.</h2>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-6 h-6 fill-indigo-600 text-indigo-600" />
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {[
                        { name: 'Alex Harrington', role: 'Founder, TechAcademy', text: "The most robust LMS we've ever used. The student dashboard is worlds ahead of Moodle or Canvas in terms of UX." },
                        { name: 'Dr. Sarah Chen', role: 'Dean, Creative Arts Inst.', text: "CoachVerse reduced our admin overhead by 60%. The automated batch tracking is a lifesaver for our staff." },
                        { name: 'Marcus Russo', role: 'Head Coach, FitCode', text: "Stunning interface. My students actually enjoy logging in to track their progress. Highly recommended for scaling." }
                    ].map((t, i) => (
                        <div key={i} className="p-12 bg-white rounded-[3rem] border border-slate-200/50 shadow-sm relative group">
                            <Quote className="absolute top-8 right-8 w-12 h-12 text-slate-50 group-hover:text-indigo-50 transition-colors" />
                            <p className="text-lg font-medium text-slate-700 leading-relaxed mb-10 italic">"{t.text}"</p>
                            <div>
                                <h4 className="font-black text-slate-900 uppercase text-sm tracking-widest">{t.name}</h4>
                                <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-40 px-6">
                <div className="max-w-7xl mx-auto text-center mb-20">
                    <span className="text-xs font-black text-indigo-600 tracking-[0.4em] uppercase block mb-4">Pricing Plans</span>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter">Simple, transparent pricing.</h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {[
                        { name: 'Starter', price: '$0', features: ['Up to 10 Students', 'Basic Analytics', 'Standard Support', '5GB Storage'] },
                        { name: 'Professional', price: '$49', features: ['Up to 100 Students', 'AI Performance Alerts', 'Priority Support', '50GB Storage'], highlight: true },
                        { name: 'Enterprise', price: '$199', features: ['Unlimited Students', 'Full White Labeling', 'Dedicated Account Manager', 'Unlimited Storage'] },
                    ].map((plan, i) => (
                        <div key={i} className={`p-12 rounded-[3.5rem] border ${plan.highlight ? 'bg-slate-950 text-white border-slate-900 shadow-3xl shadow-indigo-100 scale-105' : 'bg-white text-slate-900 border-slate-100'} transition-all hover:scale-[1.07] duration-500`}>
                            <h3 className="text-xl font-black uppercase tracking-widest mb-4">{plan.name}</h3>
                            <div className="flex items-baseline gap-2 mb-10">
                                <span className="text-6xl font-black tracking-tighter">{plan.price}</span>
                                <span className={`text-sm font-bold ${plan.highlight ? 'text-indigo-300' : 'text-slate-400'}`}>/Mo</span>
                            </div>
                            <ul className="space-y-6 mb-12 font-medium">
                                {plan.features.map(f => (
                                    <li key={f} className="flex items-center gap-3 text-sm">
                                        <div className={`w-5 h-5 rounded-full ${plan.highlight ? 'bg-indigo-500 text-slate-950' : 'bg-indigo-50 text-indigo-600'} flex items-center justify-center`}>
                                            <Check className="w-3 h-3 font-bold" />
                                        </div>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <Link to="/register" className={`block text-center py-5 rounded-2xl font-black text-sm tracking-[0.2em] transition-all uppercase ${plan.highlight ? 'bg-indigo-600 hover:bg-indigo-700 shadow-xl' : 'bg-slate-950 text-white hover:bg-black'}`}>
                                Get Started
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto rounded-[4rem] bg-indigo-600 p-12 md:p-32 text-center text-white relative overflow-hidden shadow-3xl shadow-indigo-200">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-indigo-900"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12">
                            Stop managing. <br />
                            <span className="text-indigo-200">Start coaching.</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto bg-white text-indigo-700 px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                                Try Free For 14 Days
                            </Link>
                            <Link to="/login" className="w-full sm:w-auto bg-indigo-500 text-white border border-indigo-400 px-12 py-5 rounded-3xl font-black text-lg hover:bg-indigo-400 transition-all active:scale-95">
                                Browse Portals
                            </Link>
                        </div>
                        <p className="mt-10 text-indigo-100 font-bold opacity-60 text-xs tracking-[0.3em] uppercase">No credit card required. Cancel anytime.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-6 gap-20 mb-20">
                        <div className="col-span-2">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="bg-indigo-600 p-2 rounded-xl">
                                    <BookOpen className="text-white w-5 h-5" />
                                </div>
                                <span className="text-2xl font-black tracking-tighter">CoachVerse</span>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-xs uppercase text-[10px] tracking-widest">
                                The world's most advanced hub for digital academics and elite private coaches.
                            </p>
                        </div>

                        {[
                            { title: 'Product', links: ['Features', 'LMS', 'Dashboard', 'Security'] },
                            { title: 'Company', links: ['About', 'Careers', 'Contact', 'Blog'] },
                            { title: 'Support', links: ['Documentation', 'API', 'System Status', 'Help Center'] },
                            { title: 'Legal', links: ['Privacy', 'Terms', 'OAuth', 'Cookies'] }
                        ].map(col => (
                            <div key={col.title}>
                                <h4 className="font-black uppercase text-[10px] tracking-[0.3em] text-slate-900 mb-8">{col.title}</h4>
                                <ul className="space-y-4">
                                    {col.links.map(link => (
                                        <li key={link}>
                                            <a href="#" className="text-sm font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-tight">{link}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <div className="pt-10 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-8">
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">© 2026 COACHVERSE LTD.</p>
                        </div>
                        <div className="flex gap-6 grayscale opacity-30">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-6 h-6 bg-slate-400 rounded-lg"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
