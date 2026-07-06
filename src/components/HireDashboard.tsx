import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, MapPin, Star, DollarSign, Calendar, SlidersHorizontal, 
  ArrowUpRight, X, ArrowLeft, CheckCircle2, Film, Camera, Palette, 
  PenTool, Check, ArrowRight, ShieldCheck, Sparkles, Clock, Send, 
  Briefcase, User, Info, Layers
} from 'lucide-react';
import { CREW_MEMBERS, CATEGORIES } from '../data';
import { CrewMember } from '../types';

const DIRECTORY_CATEGORIES = [
  { id: 'all', name: 'All Talent', count: '20 Creators', icon: Layers },
  { id: 'cinematography', name: 'Cinematography', count: '8 Creators', icon: Camera },
  { id: 'editing', name: 'Video Editors', count: '4 Creators', icon: Film },
  { id: 'design', name: 'Designers', count: '4 Creators', icon: Palette },
  { id: 'writing', name: 'Writers', count: '4 Creators', icon: PenTool },
];

interface HireDashboardProps {
  onBack: () => void;
  crewMembers?: CrewMember[];
}

export default function HireDashboard({ onBack, crewMembers = CREW_MEMBERS }: HireDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeCrew, setActiveCrew] = useState<CrewMember | null>(null);
  const [isConnected, setIsConnected] = useState<string | null>(null);

  // New Filter & Sort States for Results Page
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [budgetFilter, setBudgetFilter] = useState<string>('any');
  const [sortBy, setSortBy] = useState<string>('recommended');

  // Matchmaker Wizard State
  const [isWizardCompleted, setIsWizardCompleted] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardRole, setWizardRole] = useState<string>('all');
  const [wizardLocation, setWizardLocation] = useState<string>('');
  const [wizardBudget, setWizardBudget] = useState<string>('any');

  // Instant Booking Confirmation Modal State
  const [bookingTarget, setBookingTarget] = useState<CrewMember | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projectNotes, setProjectNotes] = useState('');

  // Auto-reset Remote location filter if Category is changed to cinematography
  React.useEffect(() => {
    if (categoryFilter === 'cinematography' && locationFilter === 'Remote') {
      setLocationFilter('all');
    }
  }, [categoryFilter, locationFilter]);

  React.useEffect(() => {
    if (wizardRole === 'cinematography' && wizardLocation === 'Remote') {
      setWizardLocation('');
    }
  }, [wizardRole, wizardLocation]);

  // Dynamically calculate category counts based on real crewMembers array
  const categoryCounts = useMemo(() => {
    const counts = {
      all: crewMembers.length,
      cinematography: 0,
      editing: 0,
      design: 0,
      writing: 0
    };
    crewMembers.forEach((member) => {
      const mr = member.role.toLowerCase();
      // Cinematography matches
      if (mr.includes('cinematographer') || mr.includes('drone') || mr.includes('videographer') || mr.includes('director') || mr.includes('photographer') || mr.includes('camera') || mr.includes('gaffer')) {
        counts.cinematography++;
      }
      // Editing matches
      if (mr.includes('editor') || mr.includes('colorist') || mr.includes('vfx') || mr.includes('animator') || mr.includes('animation')) {
        counts.editing++;
      }
      // Design matches
      if (mr.includes('designer') || mr.includes('design') || mr.includes('graphic') || mr.includes('thumbnail') || mr.includes('illustrator')) {
        counts.design++;
      }
      // Writing matches
      if (mr.includes('writer') || mr.includes('script') || mr.includes('concept') || mr.includes('story')) {
        counts.writing++;
      }
    });
    return counts;
  }, [crewMembers]);

  // Helper to extract numerical day rate for comparisons
  const getNumericRate = (rateStr: string) => {
    const cleaned = rateStr.replace(/,/g, '');
    const match = cleaned.match(/\d+/);
    if (!match) return 0;
    const num = parseInt(match[0], 10);
    // Convert hourly or unit rates to an estimated daily weight for matching
    if (rateStr.toLowerCase().includes('/hr')) {
      return num * 8; // Daily estimate
    }
    if (rateStr.toLowerCase().includes('/thumbnail')) {
      return num * 2; // Two thumbnails per day scale weight
    }
    return num;
  };

  // Filter and match logic
  const filteredCrew = useMemo(() => {
    return crewMembers.filter((member) => {
      // 1. Role / Category Filter
      let matchesRole = true;
      const roleToFilter = isWizardCompleted ? categoryFilter : selectedCategory;
      if (roleToFilter !== 'all') {
        const r = roleToFilter.toLowerCase();
        const mr = member.role.toLowerCase();
        
        if (r === 'editing' || r === 'video editors' || r === 'video editor') {
          if (!mr.includes('editor') && !mr.includes('colorist') && !mr.includes('vfx') && !mr.includes('animator') && !mr.includes('animation')) matchesRole = false;
        } else if (r === 'cinematography' || r === 'cinematographers' || r === 'cinematographer') {
          if (!mr.includes('cinematographer') && !mr.includes('drone') && !mr.includes('videographer') && !mr.includes('director') && !mr.includes('photographer') && !mr.includes('camera') && !mr.includes('gaffer')) matchesRole = false;
        } else if (r === 'videographers' || r === 'videographer') {
          if (!mr.includes('videographer') && !mr.includes('cinematographer')) matchesRole = false;
        } else if (r === 'photographers' || r === 'photographer') {
          if (!mr.includes('photographer') && !mr.includes('camera')) matchesRole = false;
        } else if (r === 'writers' || r === 'writing' || r === 'writer') {
          if (!mr.includes('writer') && !mr.includes('script') && !mr.includes('concept') && !mr.includes('story')) matchesRole = false;
        } else if (r === 'colorists' || r === 'colorist') {
          if (!mr.includes('colorist') && !mr.includes('editor')) matchesRole = false;
        } else if (r === 'designers' || r === 'design' || r === 'designer') {
          if (!mr.includes('designer') && !mr.includes('design') && !mr.includes('graphic') && !mr.includes('thumbnail') && !mr.includes('illustrator')) matchesRole = false;
        }
      }

      // 2. Location Filter (From dropdown on results page or from wizard)
      let matchesLocation = true;
      const activeLoc = isWizardCompleted ? locationFilter : wizardLocation;
      if (activeLoc && activeLoc !== 'all') {
        const query = activeLoc.toLowerCase().trim();
        const memberLoc = member.location.toLowerCase();
        if (!memberLoc.includes(query)) matchesLocation = false;
      }

      // 3. Availability Filter
      let matchesAvailability = true;
      if (isWizardCompleted && availabilityFilter !== 'all') {
        if (member.availability !== availabilityFilter) matchesAvailability = false;
      }

      // 4. Budget Filter (From wizard or dynamic filter)
      let matchesBudget = true;
      const activeBudget = isWizardCompleted ? budgetFilter : wizardBudget;
      if (activeBudget && activeBudget !== 'any') {
        const rate = getNumericRate(member.rate);
        if (activeBudget === 'under_1000' && rate > 1000) matchesBudget = false;
        if (activeBudget === 'under_3000' && rate > 3000) matchesBudget = false;
        if (activeBudget === 'under_5000' && rate > 5000) matchesBudget = false;
        if (activeBudget === 'under_15000' && rate > 15000) matchesBudget = false;
        if (activeBudget === 'under_30000' && rate > 30000) matchesBudget = false;
      }

      // 5. Search Bar Query (searches across name, role, location, skills, bio)
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const nameMatch = member.name.toLowerCase().includes(query);
        const roleMatch = member.role.toLowerCase().includes(query);
        const locMatch = member.location.toLowerCase().includes(query);
        const bioMatch = member.bio.toLowerCase().includes(query);
        const skillsMatch = member.skills.some(s => s.toLowerCase().includes(query));
        
        matchesSearch = nameMatch || roleMatch || locMatch || skillsMatch || bioMatch;
      }

      return matchesRole && matchesLocation && matchesAvailability && matchesBudget && matchesSearch;
    }).sort((a, b) => {
      if (isWizardCompleted) {
        if (sortBy === 'highest_rated') {
          return b.rating - a.rating;
        }
        if (sortBy === 'jobs_completed') {
          return b.completedProjects - a.completedProjects;
        }
        if (sortBy === 'rate_low_to_high') {
          return getNumericRate(a.rate) - getNumericRate(b.rate);
        }
        if (sortBy === 'rate_high_to_low') {
          return getNumericRate(b.rate) - getNumericRate(a.rate);
        }
      }
      // Recommended / Default sorting: Available Now first, then by rating
      if (a.availability === 'Available Now' && b.availability !== 'Available Now') return -1;
      if (a.availability !== 'Available Now' && b.availability === 'Available Now') return 1;
      return b.rating - a.rating;
    });
  }, [
    searchQuery, selectedCategory, isWizardCompleted, 
    categoryFilter, locationFilter, availabilityFilter, budgetFilter, sortBy,
    wizardLocation, wizardBudget, crewMembers
  ]);

  const handleBookNow = (member: CrewMember) => {
    setBookingTarget(member);
    setProjectTitle('');
    setProjectDate('');
    setProjectNotes('');
  };

  const submitInstantBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTarget) return;

    setBookingSuccess(bookingTarget.name);
    setBookingTarget(null);

    setTimeout(() => {
      setBookingSuccess(null);
    }, 6000);
  };

  const handleConnect = (memberName: string) => {
    setIsConnected(memberName);
    setTimeout(() => {
      setIsConnected(null);
    }, 4000);
  };

  return (
    <div className="w-full bg-transparent min-h-screen relative text-white overflow-hidden">
      {/* Cinematic Blurred Environment Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-30">
        {/* Left Side: Cinema Camera Setup (Fades out to the right) */}
        <div className="absolute left-0 top-0 bottom-0 w-[55%] opacity-80 mix-blend-screen">
          <img 
            src="https://images.unsplash.com/photo-1579165466541-74e2b49699a4?auto=format&fit=crop&w=1200&q=80" 
            alt="Cinematic production camera" 
            className="w-full h-full object-cover filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>

        {/* Right Side: Creative Editing Studio (Fades out to the left) */}
        <div className="absolute right-0 top-0 bottom-0 w-[55%] opacity-80 mix-blend-screen">
          <img 
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80" 
            alt="Creative post production suite" 
            className="w-full h-full object-cover filter blur-[2px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A]/30 via-transparent to-[#0A0A0A]" />
      </div>

      {/* Top Utility Header */}
      <div className="relative z-10 border-b border-zinc-900/60 py-4 px-6 sticky top-0 bg-[#0A0A0A]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Role Selection</span>
          </button>
          
          <div className="flex items-center space-x-2 text-[10px] font-mono text-zinc-400 bg-zinc-900/50 px-3 py-1 rounded-full border border-zinc-800/80">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            <span>Discovering live talent</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
        {/* Intro Hero Section */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight mb-3">
            {isWizardCompleted ? "Instant Booking Matches" : "Your Production Team Is Just Minutes Away."}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-2xl font-medium leading-relaxed">
            {isWizardCompleted 
              ? "We found the following verified available professionals matching your specific requirements perfectly." 
              : "Skip the endless searching. Connect with verified creative professionals ready to bring your vision to life."}
          </p>
        </div>

        {/* Dynamic Matchmaking Interactive Wizard vs Talent Directory Grid */}
        <AnimatePresence mode="wait">
          {!isWizardCompleted ? (
            <motion.div
              key="matchmaker-wizard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="max-w-xl mx-auto bg-zinc-950/80 border border-zinc-900/90 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.5)] backdrop-blur-xl relative overflow-hidden"
            >
              {/* Top ambient color edge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-cyan-500 via-pink-500 to-yellow-500 opacity-60" />

              {/* Progress Stepper indicators */}
              <div className="flex items-center justify-between mb-8">
                <span className="text-xs font-mono font-bold text-zinc-500 tracking-wider uppercase">
                  Instant Matchmaking
                </span>
                <button
                  onClick={() => {
                    setWizardRole('all');
                    setCategoryFilter('all');
                    setLocationFilter('all');
                    setAvailabilityFilter('all');
                    setBudgetFilter('any');
                    setSortBy('recommended');
                    setIsWizardCompleted(true);
                  }}
                  className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <span>Skip & View All</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Step 1: Creative Professional Category */}
              {wizardStep === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                      What are you looking for?
                    </h2>
                    <p className="text-zinc-450 text-xs sm:text-sm mt-1">
                      Choose the role you need to support your production.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-3 pt-2">
                    <button
                      onClick={() => { setWizardRole('cinematography'); setWizardStep(2); }}
                      className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
                          <Camera className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Cinematographer / Videographer</p>
                          <p className="text-[11px] text-zinc-500">RED/Arri shoot, lighting setup, commercial vlogs</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => { setWizardRole('editing'); setWizardStep(2); }}
                      className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 group-hover:scale-105 transition-transform">
                          <Film className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Video Editor & Colorist</p>
                          <p className="text-[11px] text-zinc-500">DaVinci Resolve, narrative flow, audio mixing</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => { setWizardRole('design'); setWizardStep(2); }}
                      className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:scale-105 transition-transform">
                          <Palette className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Thumbnail & Graphic Designer</p>
                          <p className="text-[11px] text-zinc-500">3D Blender renders, CTR-boost graphics, layout</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => { setWizardRole('writing'); setWizardStep(2); }}
                      className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 group-hover:scale-105 transition-transform">
                          <PenTool className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Script & Concept Writer</p>
                          <p className="text-[11px] text-zinc-500">Retention hooks, detailed research, YouTube story</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </button>

                    <button
                      onClick={() => {
                        setWizardRole('all');
                        setCategoryFilter('all');
                        setLocationFilter('all');
                        setAvailabilityFilter('all');
                        setBudgetFilter('any');
                        setSortBy('recommended');
                        setIsWizardCompleted(true);
                      }}
                      className="p-4 rounded-xl border border-zinc-850 bg-zinc-900/30 hover:bg-zinc-900/70 hover:border-zinc-700 transition-all flex items-center justify-between text-left group cursor-pointer"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 group-hover:scale-105 transition-transform">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">Show All Talent</p>
                          <p className="text-[11px] text-zinc-500">Browse all creative professionals in the database</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:text-white transition-colors" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Location Entry */}
              {wizardStep === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                      Where do you want to create your new reel?
                    </h2>
                    <p className="text-zinc-450 text-xs sm:text-sm mt-1">
                      Type a city in Gujarat or choose one of our active local hubs below.
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input
                        type="text"
                        placeholder={
                          wizardRole === 'cinematography'
                            ? "e.g. Ahmedabad, Surat, Vadodara..."
                            : "e.g. Ahmedabad, Remote, Surat..."
                        }
                        value={wizardLocation}
                        onChange={(e) => setWizardLocation(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-600 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                        autoFocus
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {(wizardRole === 'cinematography'
                        ? ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar']
                        : ['Remote', 'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot']
                      ).map((loc) => (
                        <button
                          key={loc}
                          onClick={() => setWizardLocation(loc)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                            wizardLocation === loc 
                              ? 'bg-white text-black border-white shadow-md' 
                              : 'bg-zinc-900/50 text-zinc-450 border-zinc-850 hover:text-white hover:border-zinc-750'
                          }`}
                        >
                          {loc}
                        </button>
                      ))}
                      <button
                        onClick={() => setWizardLocation('')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                          wizardLocation === '' 
                            ? 'bg-white text-black border-white shadow-md' 
                            : 'bg-zinc-900/50 text-zinc-450 border-zinc-850 hover:text-white hover:border-zinc-750'
                        }`}
                      >
                        Any Location
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-6 border-t border-zinc-900">
                    <button
                      onClick={() => setWizardStep(1)}
                      className="flex-1 py-3 text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setWizardStep(3)}
                      className="flex-1 py-3 text-xs font-bold bg-white text-black hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5"
                    >
                      <span>Next: Set Budget</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Budget Range Selection */}
              {wizardStep === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
                      What is your budget tier?
                    </h2>
                    <p className="text-zinc-450 text-xs sm:text-sm mt-1">
                      Choose a budget target to unlock local booking rates.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-2.5 pt-2">
                    <button
                      onClick={() => setWizardBudget('under_1000')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'under_1000' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Nano Budget</p>
                        <p className="text-[11px] text-zinc-500">Up to ₹1,000 (perfect for quick scripts / basic thumbnail revisions)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'under_1000' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'under_1000' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardBudget('under_3000')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'under_3000' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Mini Budget</p>
                        <p className="text-[11px] text-zinc-500">Up to ₹3,000 (great for standard graphic assets & reels editing)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'under_3000' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'under_3000' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardBudget('under_5000')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'under_5000' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Micro Budget</p>
                        <p className="text-[11px] text-zinc-500">Up to ₹5,000 (great for script writing / premium layout designs)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'under_5000' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'under_5000' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardBudget('under_15000')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'under_15000' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Indie Production</p>
                        <p className="text-[11px] text-zinc-500">Up to ₹15,000 (ideal for custom scripts, video editors & standard videographers)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'under_15000' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'under_15000' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardBudget('under_30000')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'under_30000' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">Premium Scale</p>
                        <p className="text-[11px] text-zinc-500">Up to ₹30,000 (best for high-end cinematic rigs and heavy FX editing)</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'under_30000' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'under_30000' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      onClick={() => setWizardBudget('any')}
                      className={`p-4 rounded-xl border transition-all text-left flex items-center justify-between group cursor-pointer ${
                        wizardBudget === 'any' 
                          ? 'border-white bg-zinc-900/60' 
                          : 'border-zinc-850 bg-zinc-900/20 hover:bg-zinc-900/50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-bold text-white">No Limit / Any Budget</p>
                        <p className="text-[11px] text-zinc-500">Show all verified professional options and daily rates</p>
                      </div>
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                        wizardBudget === 'any' ? 'bg-white border-white' : 'border-zinc-700'
                      }`}>
                        {wizardBudget === 'any' && <Check className="w-2.5 h-2.5 text-black stroke-[3]" />}
                      </div>
                    </button>
                  </div>

                  <div className="flex items-center space-x-3 pt-6 border-t border-zinc-900">
                    <button
                      onClick={() => setWizardStep(2)}
                      className="flex-1 py-3 text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-zinc-400 rounded-xl transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => {
                        setCategoryFilter(wizardRole);
                        setLocationFilter(wizardLocation || 'all');
                        setBudgetFilter(wizardBudget || 'any');
                        setSortBy('recommended');
                        setIsWizardCompleted(true);
                      }}
                      className="flex-1 py-3 text-xs font-bold bg-white text-black hover:bg-zinc-200 rounded-xl transition-colors cursor-pointer flex items-center justify-center space-x-1.5 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                    >
                      <span>Find & Book Instantly</span>
                      <Sparkles className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500/25" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="talent-results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              {/* Premium highlights banner */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-zinc-950/20 rounded-2xl border border-zinc-900/50 mb-2">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-cyan-500/10 rounded-xl text-cyan-400 border border-cyan-500/10 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Instant Match</h4>
                    <p className="text-[9px] text-zinc-500 font-medium">Connect in under 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-500/10 rounded-xl text-green-400 border border-green-500/10 shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Verified Pros</h4>
                    <p className="text-[9px] text-zinc-500 font-medium">Pre-screened portfolio & gear</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-yellow-500/10 rounded-xl text-yellow-400 border border-yellow-500/10 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Location Based</h4>
                    <p className="text-[9px] text-zinc-500 font-medium">Local hubs or global remote</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400 border border-purple-500/10 shrink-0">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">Budget Shield</h4>
                    <p className="text-[9px] text-zinc-500 font-medium">Safe Escrow & direct rates</p>
                  </div>
                </div>
              </div>

              {/* Horizontal scroll of Categories */}
              <div className="w-full overflow-x-auto no-scrollbar py-1">
                <div className="flex items-center space-x-3 min-w-max pb-1">
                  {DIRECTORY_CATEGORIES.map((cat) => {
                    const IconComp = cat.icon;
                    const isActive = categoryFilter === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setCategoryFilter(cat.id)}
                        className={`px-5 py-3 rounded-2xl flex items-center space-x-3 border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-white text-black border-white shadow-[0_10px_25px_rgba(255,255,255,0.12)] scale-[1.01]'
                            : 'bg-zinc-950/45 text-zinc-400 border-zinc-900/80 hover:text-white hover:border-zinc-800'
                        }`}
                      >
                        <div className={`p-1.5 rounded-lg ${isActive ? 'bg-black/5 text-black' : 'bg-zinc-900 text-zinc-400'}`}>
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className={`text-xs font-bold ${isActive ? 'text-black' : 'text-white'}`}>
                            {cat.name}
                          </p>
                          <p className={`text-[9px] font-medium ${isActive ? 'text-zinc-650' : 'text-zinc-500'}`}>
                            {categoryCounts[cat.id as keyof typeof categoryCounts] || 0} Creators
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search and Dynamic Filter Bar */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center bg-zinc-950/35 p-3 rounded-2xl border border-zinc-900/80">
                {/* Search query input */}
                <div className="relative md:col-span-5">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                  <input
                    type="text"
                    placeholder="Search crew members, roles, skills, or bios..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white placeholder-zinc-550 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                  />
                </div>

                {/* Location Filter Dropdown */}
                <div className="relative md:col-span-2">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  <select
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">All Locations</option>
                    {categoryFilter !== 'cinematography' && <option value="Remote">Remote</option>}
                    <option value="Ahmedabad">Ahmedabad</option>
                    <option value="Surat">Surat</option>
                    <option value="Vadodara">Vadodara</option>
                    <option value="Rajkot">Rajkot</option>
                    <option value="Gandhinagar">Gandhinagar</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">▼</div>
                </div>

                {/* Availability Filter Dropdown */}
                <div className="relative md:col-span-2">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  <select
                    value={availabilityFilter}
                    onChange={(e) => setAvailabilityFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="all">Availability</option>
                    <option value="Available Now">Available Now</option>
                    <option value="Next Week">Next Week</option>
                    <option value="In 2 Weeks">In 2 Weeks</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">▼</div>
                </div>

                {/* Sort Dropdown */}
                <div className="relative md:col-span-2">
                  <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full pl-9 pr-8 py-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="highest_rated">Highest Rated</option>
                    <option value="jobs_completed">Jobs Completed</option>
                    <option value="rate_low_to_high">Rate (Low to High)</option>
                    <option value="rate_high_to_low">Rate (High to Low)</option>
                  </select>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500 text-[10px]">▼</div>
                </div>

                {/* Reset filters / wizard trigger button */}
                <button
                  onClick={() => {
                    setIsWizardCompleted(false);
                    setWizardStep(1);
                  }}
                  title="Relaunch Matchmaker Wizard"
                  className="md:col-span-1 p-2.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-850 hover:border-zinc-750 transition-all rounded-xl flex items-center justify-center cursor-pointer"
                >
                  <SlidersHorizontal className="w-4 h-4 text-yellow-500" />
                </button>
              </div>

              {/* Connections Notification Banner */}
              <AnimatePresence>
                {isConnected && (
                  <motion.div
                     initial={{ opacity: 0, y: -10, scale: 0.98 }}
                     animate={{ opacity: 1, y: 0, scale: 1 }}
                     exit={{ opacity: 0, y: -10, scale: 0.98 }}
                     className="p-4 bg-zinc-900/90 border border-zinc-850/80 text-white rounded-xl flex items-center justify-between shadow-xl"
                   >
                     <div className="flex items-center space-x-3">
                       <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                       <span className="text-sm font-medium">
                         Instant booking request sent to <strong className="text-white">{isConnected}</strong>. They will confirm details via secure chat shortly.
                       </span>
                     </div>
                     <button 
                       onClick={() => setIsConnected(null)}
                       className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
                     >
                       <X className="w-4 h-4" />
                     </button>
                   </motion.div>
                )}
              </AnimatePresence>

              {/* Success Notification Banner for Modal Direct booking */}
              <AnimatePresence>
                {bookingSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="p-4 bg-zinc-900 border border-green-500/30 text-white rounded-2xl flex items-center justify-between shadow-2xl relative overflow-hidden"
                  >
                    {/* Glowing green decorative left border */}
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                    <div className="flex items-center space-x-3 pl-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Booking Locked Instantly!</h4>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Direct booking confirmed with <strong className="text-white">{bookingSuccess}</strong>. Secure calendar invite and contract sent to your email.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setBookingSuccess(null)}
                      className="text-zinc-500 hover:text-white transition-colors cursor-pointer p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Section Header */}
              <div className="flex items-center justify-between pt-2">
                <h3 className="text-lg font-display font-extrabold text-white flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500/25 animate-pulse" />
                  <span>Recommended For You</span>
                </h3>
                <span className="text-xs font-semibold text-zinc-500">
                  {filteredCrew.length} matches found
                </span>
              </div>

              {/* Matching Grid List */}
              {filteredCrew.length === 0 ? (
                <div className="border border-dashed border-zinc-800 rounded-3xl py-16 text-center">
                  <Info className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
                  <p className="text-zinc-450 text-sm mb-4">No matching crew found for your selection.</p>
                  <button 
                    onClick={() => {
                      setCategoryFilter('all');
                      setLocationFilter('all');
                      setAvailabilityFilter('all');
                      setBudgetFilter('any');
                      setSortBy('recommended');
                      setSearchQuery('');
                    }}
                    className="px-4 py-2 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-colors cursor-pointer"
                  >
                    Reset Filter Criteria
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence mode="popLayout">
                    {filteredCrew.map((member) => (
                      <motion.div
                        key={member.id}
                        layoutId={`member-card-${member.id}`}
                        className="group rounded-3xl border border-zinc-900/80 bg-zinc-950/45 backdrop-blur-md hover:bg-zinc-950/75 hover:border-zinc-800/80 transition-all duration-300 flex flex-col justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden"
                      >
                        {/* Interactive Click to View details */}
                        <div 
                          className="cursor-pointer"
                          onClick={() => setActiveCrew(member)}
                        >
                          {/* Top Portfolio Cover Image */}
                          <div className="relative h-44 w-full overflow-hidden bg-zinc-900">
                            <img
                              src={member.portfolio[0] || "https://images.unsplash.com/photo-1579165466541-74e2b49699a4?auto=format&fit=crop&w=600&q=80"}
                              alt={`${member.name} work`}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                            {/* Premium overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
                            
                            {/* Availability badge floating at top-left */}
                            <span className={`absolute top-4 left-4 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold tracking-wider uppercase border backdrop-blur-md z-10 ${
                              member.availability === 'Available Now'
                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                : member.availability === 'Next Week'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-zinc-800/50 text-zinc-400 border-zinc-800/80'
                            }`}>
                              {member.availability === 'Available Now' ? 'Available Today' : member.availability}
                            </span>
                          </div>

                          {/* Profile details below cover */}
                          <div className="p-6 pt-3 space-y-4">
                            {/* Avatar & Name/Role */}
                            <div className="flex items-start space-x-4">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                referrerPolicy="no-referrer"
                                className="w-12 h-12 rounded-full object-cover border border-zinc-800/80 bg-zinc-900 -mt-8 relative z-10 shadow-lg"
                              />
                              <div className="flex-1">
                                <h4 className="font-display font-bold text-base text-white group-hover:text-zinc-200 flex items-center space-x-1.5 transition-colors">
                                  <span>{member.name}</span>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-500/10 shrink-0" />
                                </h4>
                                <p className="text-xs text-zinc-400 font-medium mt-0.5">{member.role}</p>
                              </div>
                            </div>

                            {/* Location & Rating / Rate line */}
                            <div className="flex items-center justify-between text-xs border-y border-zinc-900/40 py-2.5">
                              <div className="flex items-center space-x-4">
                                {/* Location */}
                                <div className="flex items-center space-x-1 text-zinc-400 font-medium">
                                  <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" strokeWidth={2} />
                                  <span>{member.location}</span>
                                </div>
                                
                                {/* Rating with Star */}
                                <div className="flex items-center space-x-1 text-white font-semibold">
                                  <Star className="w-3.5 h-3.5 fill-yellow-500/20 text-yellow-500 shrink-0" />
                                  <span>{member.rating.toFixed(1)}</span>
                                  <span className="text-zinc-500 font-normal">({member.completedProjects})</span>
                                </div>
                              </div>
                              
                              {/* Price Rate */}
                              <div className="text-right">
                                <p className="text-sm font-display font-extrabold text-white">{member.rate}</p>
                              </div>
                            </div>

                            {/* Skills Tag Pills */}
                            <div className="flex flex-wrap gap-1.5">
                              {member.skills.slice(0, 3).map((skill, idx) => (
                                <span 
                                  key={idx} 
                                  className="px-2 py-1 bg-zinc-900/60 text-zinc-400 text-[10px] font-medium rounded border border-zinc-850"
                                >
                                  {skill}
                                </span>
                              ))}
                              {member.skills.length > 3 && (
                                <span className="px-2 py-1 bg-zinc-900/60 text-zinc-500 text-[10px] font-semibold rounded border border-zinc-850">
                                  +{member.skills.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Card CTA Booking Action footer */}
                        <div className="px-6 pb-6 pt-0">
                          <button
                            onClick={() => handleBookNow(member)}
                            className="w-full py-2.5 bg-zinc-900 hover:bg-white text-zinc-300 hover:text-black text-xs font-semibold rounded-xl tracking-wide transition-all duration-300 cursor-pointer flex items-center justify-center space-x-1 border border-zinc-850 hover:border-white shadow-sm"
                          >
                            <span>Instant Book Crew</span>
                            <Calendar className="w-3.5 h-3.5 ml-1" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Portfolio / Profile Drawer */}
      <AnimatePresence>
        {activeCrew && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveCrew(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40"
            />

            {/* Sidebar drawer panel */}
            <motion.div
              id="talent-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-lg bg-[#0A0A0A] border-l border-zinc-900 shadow-2xl z-50 overflow-y-auto flex flex-col justify-between text-white"
            >
              {/* Drawer Header */}
              <div className="p-6 border-b border-zinc-900 sticky top-0 bg-[#0A0A0A]/95 backdrop-blur-md flex items-center justify-between z-10">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                  Professional Profile
                </span>
                <button
                  onClick={() => setActiveCrew(null)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-8 flex-1">
                {/* Hero section */}
                <div className="flex items-start space-x-6 mb-8">
                  <img
                    src={activeCrew.avatar}
                    alt={activeCrew.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 rounded-full object-cover border border-zinc-800 shadow-lg bg-zinc-900"
                  />
                  <div>
                    <h2 className="text-2xl font-display font-extrabold text-white">
                      {activeCrew.name}
                    </h2>
                    <p className="text-sm font-medium text-zinc-400 mt-1">{activeCrew.role}</p>
                    <div className="flex items-center space-x-4 mt-3">
                      <div className="flex items-center space-x-1 text-xs text-zinc-400 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                        <span>{activeCrew.location}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-white font-semibold">
                        <Star className="w-3.5 h-3.5 fill-yellow-500/20 text-yellow-500" />
                        <span>{activeCrew.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key stats row */}
                <div className="grid grid-cols-3 gap-4 p-4 bg-zinc-950/50 rounded-2xl mb-8 border border-zinc-900 text-center">
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Day Rate</p>
                    <p className="text-base font-display font-extrabold text-white mt-1">
                      {activeCrew.rate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Availability</p>
                    <p className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block mt-1 ${
                      activeCrew.availability === 'Available Now'
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {activeCrew.availability}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-zinc-500 uppercase">Completed</p>
                    <p className="text-base font-display font-extrabold text-white mt-1">
                      {activeCrew.completedProjects} Jobs
                    </p>
                  </div>
                </div>

                {/* Biography */}
                <div className="mb-8">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">About</h4>
                  <p className="text-zinc-300 text-sm leading-relaxed font-normal">
                    {activeCrew.bio}
                  </p>
                </div>

                {/* Featured Recent Project */}
                {activeCrew.recentProject && activeCrew.recentProject.title && (
                  <div className="mb-8 p-4 rounded-xl border border-zinc-900 bg-zinc-950/50">
                    <h4 className="text-xs font-mono uppercase tracking-wider text-indigo-400 mb-2 flex items-center gap-1.5 font-semibold">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Featured Recent Project</span>
                    </h4>
                    <p className="text-white text-sm font-semibold">{activeCrew.recentProject.title}</p>
                    {activeCrew.recentProject.description && (
                      <p className="text-zinc-400 text-xs mt-1 leading-relaxed">{activeCrew.recentProject.description}</p>
                    )}
                    {activeCrew.recentProject.link && (
                      <a 
                        href={activeCrew.recentProject.link.startsWith('http') ? activeCrew.recentProject.link : `https://${activeCrew.recentProject.link}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs text-indigo-400 hover:text-indigo-350 font-bold mt-2 hover:underline"
                      >
                        <span>View Project Link</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Full list of Skills */}
                <div className="mb-8">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">Expertise</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeCrew.skills.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-zinc-900/60 text-zinc-300 text-xs font-semibold rounded-lg border border-zinc-800/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Portfolio Gallery Showcase */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-500 mb-3">Portfolio Work</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {activeCrew.portfolio.map((imgUrl, idx) => (
                      <div 
                        key={idx} 
                        className="relative rounded-xl overflow-hidden aspect-video border border-zinc-900 group cursor-zoom-in bg-zinc-950"
                      >
                        <img
                          src={imgUrl}
                          alt="Portfolio project"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Drawer Footer Connect CTA changed to Book Now */}
              <div className="p-6 border-t border-zinc-900 bg-[#0A0A0A] sticky bottom-0">
                <button
                  id="btn-drawer-connect"
                  onClick={() => {
                    handleBookNow(activeCrew);
                    setActiveCrew(null);
                  }}
                  className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl font-sans text-sm font-semibold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer active:scale-98"
                >
                  <span>Book {activeCrew.name.split(' ')[0]} Instantly</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Direct Booking Modal Form */}
      <AnimatePresence>
        {bookingTarget && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setBookingTarget(null)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#0A0A0A] border border-zinc-900 p-6 rounded-2xl shadow-2xl z-[60] text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-extrabold text-lg text-white">
                  Instant Booking Form
                </h3>
                <button
                  onClick={() => setBookingTarget(null)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-900 mb-5 text-xs text-zinc-400 flex items-center space-x-3">
                <img
                  src={bookingTarget.avatar}
                  alt={bookingTarget.name}
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-full object-cover border border-zinc-800"
                />
                <div>
                  <p className="font-bold text-white">{bookingTarget.name}</p>
                  <p className="text-[11px] text-zinc-500">{bookingTarget.role} • <span className="text-white font-semibold">{bookingTarget.rate}</span></p>
                </div>
              </div>

              <form onSubmit={submitInstantBooking} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Project / Channel Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Creator Podcast Series or Travel Vlog"
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                      Target Production Date
                    </label>
                    <input
                      type="date"
                      required
                      value={projectDate}
                      onChange={(e) => setProjectDate(e.target.value)}
                      className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-1.5">
                    Brief Notes & Specific Equipment/Style required
                  </label>
                  <textarea
                    placeholder="Provide details about your project, timeline, style, or specific tools needed..."
                    value={projectNotes}
                    onChange={(e) => setProjectNotes(e.target.value)}
                    rows={3}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all resize-none text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-sans text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Confirm Secure Booking</span>
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

