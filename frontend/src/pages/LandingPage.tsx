import { motion, AnimatePresence } from 'framer-motion';
import {
    BookOpen,
    Star,
    ArrowRight,
    BarChart,
    Globe,
    PlayCircle,
    Check,
    Quote,
    Layers,
    ArrowUpRight,
    Menu,
    X,
    DollarSign,
    Users,
    Calendar,
    MousePointer2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Use the uploaded dashboard hero image
import dashboardHero from '../assets/dashboard_hero.png';

const LandingPage = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'CRM & Leads', href: '#crm' },
        { name: 'Finance', href: '#finance' },
        { name: 'Pricing', href: '#pricing' }
    ];

    return (
        <div className="relative min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-700 overflow-x-hidden">
            {/* Global Gradient Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-50/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-[100] transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
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

                    {/* Desktop Menu */}
                    <div className="hidden lg:flex items-center gap-8">
                        {navLinks.map((item) => (
                            <a
                                key={item.name}
                                href={item.href}
                                className="text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors tracking-tight"
                            >
                                {item.name}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-6">
                            <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
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

                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-all"
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Content */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="lg:hidden bg-white border-b border-slate-100 overflow-hidden"
                        >
                            <div className="px-6 py-8 space-y-6">
                                {navLinks.map((item) => (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block text-lg font-bold text-slate-600 hover:text-indigo-600 transition-all tracking-tight"
                                    >
                                        {item.name}
                                    </a>
                                ))}
                                <div className="pt-6 border-t border-slate-50 space-y-4">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-4 bg-slate-100 rounded-2xl font-black text-slate-600"
                                    >
                                        LOG IN
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100"
                                    >
                                        START FREE
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-40 md:pt-56 pb-20 px-6 overflow-visible">
                <div className="max-w-7xl mx-auto text-center relative">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="mb-10"
                    >
                        <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-slate-100 text-slate-800 text-[10px] font-black tracking-[0.2em] uppercase mb-8 border border-white shadow-sm shimmer">
                            <Layers className="w-3 h-3 text-indigo-500" />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">The #1 Platform for Modern Institutes</span>
                        </span>

                        <h1 className="text-5xl md:text-[7rem] lg:text-[8rem] font-black text-slate-900 tracking-tight leading-[1] md:leading-[0.9] mb-10">
                            The Operating System for <br />
                            <span className="relative inline-block text-indigo-600">
                                Education
                                <svg className="absolute -bottom-2 md:-bottom-4 left-0 w-full h-3 md:h-5 text-indigo-100 -z-10" viewBox="0 0 200 20" fill="none" preserveAspectRatio="none">
                                    <path d="M0 15C50 5 150 5 200 15" stroke="currentColor" strokeWidth="10" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 leading-relaxed font-medium px-4">
                            Seamlessly manage <span className="text-slate-900 font-bold">Leads</span>, simplify <span className="text-slate-900 font-bold">Fees</span>, and master <span className="text-slate-900 font-bold">Scheduling</span>. Everything you need to scale your coaching business, in one beautiful place.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 px-4">
                            <Link to="/register" className="w-full sm:w-auto bg-indigo-600 text-white px-12 py-5 rounded-[2.5rem] font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-700 transition-all shadow-[0_20px_40px_-15px_rgba(79,70,229,0.3)] active:scale-95 group">
                                Start Your Academy
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <a href="https://youtu.be/JF6ANMFEGFM" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-white text-slate-900 border-2 border-slate-100 px-12 py-5 rounded-[2.5rem] font-black text-lg hover:border-indigo-100 hover:bg-slate-50 transition-all flex items-center justify-center gap-3 shadow-sm">
                                <PlayCircle className="w-5 h-5 text-indigo-600" />
                                Watch Demo
                            </a>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="mt-20 relative max-w-[1100px] mx-auto pointer-events-none px-4"
                    >
                        {/* Dashboard Image */}
                        <div className="relative rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border-4 md:border-8 border-white bg-slate-900">
                            <img
                                src={dashboardHero}
                                alt="CoachVerse Dashboard"
                                className="w-full h-auto object-cover opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 via-transparent to-transparent"></div>

                            {/* Overlay UI Mockups (Floating) */}
                            <div className="absolute bottom-10 left-10 md:bottom-20 md:left-20 bg-white p-6 rounded-3xl shadow-2xl animate-bounce-slow hidden md:block max-w-xs text-left border border-slate-100">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">New Admission</p>
                                        <p className="text-xs text-slate-500">Just now</p>
                                    </div>
                                </div>
                                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-500 w-[70%]"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Social Proof */}
            <div className="py-24 bg-white/50 backdrop-blur-sm relative overflow-hidden border-y border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] mb-12">Powering over 2,000 institutes globally</p>
                    <div className="flex flex-wrap justify-center lg:justify-between items-center gap-x-16 gap-y-12 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-crosshair">
                        {['HARVARD.PREP', 'STANFORD.IO', 'TITAN.ACADEMY', 'FUTURE.SCHOOL', 'ELITE.COACH'].map(brand => (
                            <span key={brand} className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900">{brand}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <section id="features" className="py-40 relative px-6 bg-slate-50/50">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-32">
                        <div className="max-w-3xl">
                            <span className="text-indigo-600 font-extrabold uppercase tracking-[0.3em] text-xs mb-8 block">EVERYTHING YOU NEED</span>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1] md:leading-[0.9] mb-12">
                                Run your institute <br />
                                <span className="text-slate-300">on Autopilot.</span>
                            </h2>
                            <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-2xl">Replace 10+ disconnected tools with one powerful operating system designed for growth.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            { title: 'Smart CRM', desc: 'Capture leads from your website, track follow-ups, and convert more students.', icon: MousePointer2, theme: 'indigo' },
                            { title: 'Fee Management', desc: 'Automated invoices, payment tracking, and financial reports at your fingertips.', icon: DollarSign, theme: 'emerald' },
                            { title: 'Interactive Timetable', desc: 'Conflict-free scheduling for classes, teachers, and rooms.', icon: Calendar, theme: 'rose' },
                            { title: 'Student Portal', desc: 'Give students a premium experience with their own login and dashboard.', icon: Users, theme: 'blue' },
                            { title: 'Live Classes', desc: 'Seamless integration for hybrid learning and online sessions.', icon: Globe, theme: 'violet' },
                            { title: 'Performance Analytics', desc: 'Real-time insights into student progress and institute revenue.', icon: BarChart, theme: 'amber' },
                        ].map((f, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="group p-10 rounded-[2.5rem] bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-[0_20px_60px_-10px_rgba(79,70,229,0.15)] transition-all duration-500 relative overflow-hidden"
                            >
                                <div className={`w-14 h-14 rounded-2xl mb-8 flex items-center justify-center bg-${f.theme}-50 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                                    <f.icon className={`w-7 h-7 text-${f.theme}-600`} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight uppercase">{f.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed text-sm mb-8">{f.desc}</p>
                                <div className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                                    Explore <ArrowRight className="w-3 h-3" />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Dynamic Section: The Financial Hub */}
            <section id="finance" className="py-40 px-6 bg-slate-900 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center relative z-10">
                    <div>
                        <span className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs mb-8 block">FINANCIAL CLARITY</span>
                        <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-10">
                            Never miss a <br />
                            <span className="text-indigo-400">payment.</span>
                        </h2>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed mb-12">
                            Stop chasing parents for fees. CoachVerse automates invoicing, reminders, and receipts so you can focus on teaching.
                        </p>

                        <ul className="space-y-6 mb-12">
                            {['Automated Invoice Generation', 'One-click Payment Reminders', 'Revenue & Due Reports', 'Parent Payment Portal'].map((item, i) => (
                                <li key={i} className="flex items-center gap-4">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                                        <Check className="w-3 h-3 font-black" />
                                    </div>
                                    <span className="font-bold text-lg">{item}</span>
                                </li>
                            ))}
                        </ul>

                        <Link to="/register" className="inline-flex items-center gap-3 bg-emerald-500 text-slate-900 px-10 py-4 rounded-full font-black text-sm uppercase tracking-widest hover:bg-emerald-400 transition-colors">
                            Start Collecting Fees
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="relative">
                        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 p-8 rounded-[2.5rem] relative">
                            {/* Mockup of Fee Card */}
                            <div className="space-y-6">
                                <div className="flex items-center justify-between border-b border-slate-700 pb-6">
                                    <div>
                                        <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Total Revenue</p>
                                        <p className="text-4xl font-black text-white mt-1">$124,500</p>
                                    </div>
                                    <div className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-lg text-xs font-bold">+12% this month</div>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { name: 'Aarav Patel', amount: '$450', status: 'Paid', date: 'Today, 10:23 AM' },
                                        { name: 'Sarah Jenkins', amount: '$300', status: 'Pending', date: 'Yesterday' },
                                        { name: 'Mike Ross', amount: '$550', status: 'Paid', date: 'Oct 24, 2024' },
                                    ].map((txn, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-slate-800 rounded-2xl border border-slate-700 hover:border-indigo-500/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold">
                                                    {txn.name[0]}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm">{txn.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-wide">{txn.date}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-white">{txn.amount}</p>
                                                <p className={`text-[10px] font-bold uppercase ${txn.status === 'Paid' ? 'text-emerald-400' : 'text-amber-400'}`}>{txn.status}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-40 bg-white relative overflow-hidden px-6">
                <div className="max-w-7xl mx-auto text-center mb-24">
                    <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-8 px-4">Trusted by modern educators.</h2>
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star key={i} className="w-6 h-6 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {[
                        { name: 'Dr. Anand Kumar', role: 'Super 30 Academy', text: "The Lead Management feature changed how we admit students. No more lost inquiries." },
                        { name: 'Elena Rodriguez', role: 'Principal, Arts High', text: "Finally, a platform that handles Fees and Timetables together. It's beautiful and fast." },
                        { name: 'James Wilson', role: 'Coding Bootcamp', text: "The best investment for our academy. The student portal is world-class." }
                    ].map((t, i) => (
                        <div key={i} className="p-10 md:p-12 bg-slate-50 rounded-[3rem] border border-slate-100 relative group hover:bg-white hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500">
                            <Quote className="absolute top-8 right-8 w-10 h-10 text-indigo-100 group-hover:text-indigo-500 transition-colors" />
                            <p className="text-lg font-medium text-slate-700 leading-relaxed mb-10 italic px-2">"{t.text}"</p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-xl">
                                    {t.name[0]}
                                </div>
                                <div>
                                    <h4 className="font-black text-slate-900 uppercase text-xs tracking-widest">{t.name}</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Final */}
            <section className="pb-32 px-6">
                <div className="max-w-7xl mx-auto rounded-[3rem] md:rounded-[4rem] bg-indigo-600 p-10 md:p-32 text-center text-white relative overflow-hidden shadow-3xl shadow-indigo-600/30">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="relative z-10 max-w-4xl mx-auto">
                        <h2 className="text-5xl md:text-8xl font-black tracking-tighter leading-none mb-12">
                            Ready to <br />
                            <span className="text-indigo-200">Scale Up?</span>
                        </h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/register" className="w-full sm:w-auto bg-white text-indigo-700 px-12 py-5 rounded-3xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-indigo-900/20 active:scale-95">
                                Get Started for Free
                            </Link>
                        </div>
                        <p className="mt-10 text-indigo-100 font-bold opacity-60 text-xs tracking-[0.3em] uppercase">Join 5,000+ top educators today.</p>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-24 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-indigo-600 p-2 rounded-xl">
                                <BookOpen className="text-white w-5 h-5" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-slate-900">CoachVerse</span>
                        </div>
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">© 2026 COACHVERSE LTD.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
