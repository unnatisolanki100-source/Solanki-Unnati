import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Sparkles, 
  Instagram, 
  Users, 
  BarChart3, 
  MapPin, 
  Eye, 
  Film, 
  SlidersHorizontal, 
  CheckCircle2, 
  ChevronRight, 
  ArrowLeft, 
  ArrowRight, 
  ArrowUpRight,
  X, 
  Award, 
  Calendar, 
  Briefcase, 
  TrendingUp, 
  Check,
  Heart,
  MessageSquare
} from 'lucide-react';
import { SOCIAL_CREATORS } from '../data';
import { SocialCreator } from '../types';
import { playTransitionChime } from '../utils/audio';

interface CreatorDashboardProps {
  onBack: () => void;
  socialCreators?: SocialCreator[];
}

const CATEGORY_DETAILS = [
  { id: 'food', name: 'Food & Culinary', icon: '🍳', color: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30', count: 0 },
  { id: 'fashion', name: 'Fashion & Style', icon: '✨', color: 'from-pink-500/20 to-purple-500/10 text-pink-400 border-pink-500/30', count: 0 },
  { id: 'tech', name: 'Tech & Gadgets', icon: '💻', color: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30', count: 0 },
  { id: 'travel', name: 'Travel & Explore', icon: '✈️', color: 'from-sky-500/20 to-blue-500/10 text-sky-400 border-sky-500/30', count: 0 },
  { id: 'comedy', name: 'Comedy & Skits', icon: '🎭', color: 'from-yellow-500/20 to-amber-500/10 text-yellow-400 border-yellow-500/30', count: 0 },
  { id: 'beauty', name: 'Beauty & Skincare', icon: '💄', color: 'from-rose-500/20 to-pink-500/10 text-rose-400 border-rose-500/30', count: 0 },
  { id: 'fitness', name: 'Fitness & Health', icon: '💪', color: 'from-red-500/20 to-rose-500/10 text-red-400 border-red-500/30', count: 0 },
];

const FOLLOWER_RANGES = [
  { id: 'all', name: 'All Ranges', min: 0, max: 100000000, label: 'Any scale' },
  { id: 'nano', name: 'Nano Creators', min: 10000, max: 50000, label: '10K - 50K followers' },
  { id: 'micro', name: 'Micro Creators', min: 50000, max: 100000, label: '50K - 100K followers' },
  { id: 'mid', name: 'Mid-Tier Creators', min: 100000, max: 500000, label: '100K - 500K followers' },
  { id: 'macro', name: 'Macro Creators', min: 500000, max: 1000000, label: '500K - 1M followers' },
  { id: 'mega', name: 'Mega Influencers', min: 1000000, max: 100000000, label: '1M+ followers' },
];

export default function CreatorDashboard({ onBack, socialCreators = SOCIAL_CREATORS }: CreatorDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRange, setSelectedRange] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  // Advanced Active Creator details modal
  const [activeCreator, setActiveCreator] = useState<SocialCreator | null>(null);
  const [isBookingMode, setIsBookingMode] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  // Campaign book form
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDeliverables, setCampaignDeliverables] = useState('1 Instagram Reel + 1 Story');
  const [campaignBudget, setCampaignBudget] = useState('₹15,000');
  const [campaignNotes, setCampaignNotes] = useState('');

  // Brand Matchmaker Wizard
  const [isWizardMode, setIsWizardMode] = useState(true);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardCategory, setWizardCategory] = useState<string>('');
  const [wizardRange, setWizardRange] = useState<string>('');
  const [wizardLocation, setWizardLocation] = useState<string>('all');

  // Dynamically count category matches
  const counts = useMemo(() => {
    const total = socialCreators.length;
    const catCounts: Record<string, number> = { all: total };
    socialCreators.forEach(c => {
      catCounts[c.category] = (catCounts[c.category] || 0) + 1;
    });
    return catCounts;
  }, [socialCreators]);

  // Filter creator list based on search, category, range and location
  const filteredCreators = useMemo(() => {
    return socialCreators.filter(c => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }

      // 2. Range Filter
      const rangeObj = FOLLOWER_RANGES.find(r => r.id === selectedRange);
      if (rangeObj) {
        if (c.followers < rangeObj.min || c.followers > rangeObj.max) {
          return false;
        }
      }

      // 3. Location Filter
      if (selectedLocation !== 'all' && c.location !== selectedLocation) {
        return false;
      }

      // 4. Search query Filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(query);
        const matchesHandle = c.instagramHandle.toLowerCase().includes(query);
        const matchesBio = c.bio.toLowerCase().includes(query);
        const matchesLocation = c.location.toLowerCase().includes(query);
        if (!matchesName && !matchesHandle && !matchesBio && !matchesLocation) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedRange, selectedLocation, searchQuery, socialCreators]);

  // Unique list of cities available
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    socialCreators.forEach(c => {
      if (c.location && c.location !== 'Remote') cities.add(c.location);
    });
    return Array.from(cities).sort();
  }, [socialCreators]);

  const handleStartMatchmaker = () => {
    playTransitionChime();
    setIsWizardMode(true);
    setWizardStep(1);
    setWizardCategory('');
    setWizardRange('');
    setWizardLocation('all');
  };

  const handleApplyWizard = () => {
    playTransitionChime();
    setSelectedCategory(wizardCategory || 'all');
    setSelectedRange(wizardRange || 'all');
    setSelectedLocation(wizardLocation || 'all');
    setIsWizardMode(false);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTransitionChime();
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingMode(false);
      setActiveCreator(null);
    }, 2500);
  };

  return (
    <div id="creator-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      {/* Dynamic Animated Smoke overlay for professional agency depth */}
      <div className="absolute inset-0 bg-radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.08), transparent 40%) pointer-events-none" />

      {/* Top Breadcrumb & Wizard Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button 
            id="back-to-home-btn"
            onClick={onBack} 
            className="flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors cursor-pointer mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Go Back to Selection</span>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-display font-extrabold tracking-tight text-white flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-violet-400" />
              Creator Discovery Engine
            </h1>
            <span className="text-[10px] font-mono bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded text-violet-400 uppercase tracking-widest">
              Brand Hub
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Search, filter, and instantly collaborate with {socialCreators.length}+ top-tier social content creators.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="matchmaker-btn"
            onClick={handleStartMatchmaker}
            className="px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-900/20 border border-violet-500/20 transition-all cursor-pointer flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Matchmaker</span>
          </button>

          {isWizardMode && (
            <button
              id="close-wizard-btn"
              onClick={() => {
                playTransitionChime();
                setIsWizardMode(false);
              }}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer border border-zinc-800"
            >
              Skip Wizard
            </button>
          )}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* MATCHMAKER WIZARD PANEL */}
        {isWizardMode ? (
          <motion.div
            key="matchmaker-wizard"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-10 bg-zinc-950/65 backdrop-blur-xl border border-violet-500/20 rounded-2xl p-6 sm:p-8 relative overflow-hidden shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
          >
            {/* Absolute background patterns */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/5 blur-3xl rounded-full pointer-events-none" />
            
            {/* Steps indicator */}
            <div className="flex items-center justify-between border-b border-zinc-900 pb-5 mb-6">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-violet-500/10 rounded text-violet-400">
                  <TrendingUp className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-300">Brand Creator Matchmaker</h2>
                  <p className="text-[10px] font-mono text-zinc-500">Step {wizardStep} of 3</p>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex items-center gap-1.5">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === wizardStep 
                        ? 'w-6 bg-violet-500' 
                        : step < wizardStep 
                          ? 'w-2 bg-violet-500/40' 
                          : 'w-2 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              {/* STEP 1: SELECT CATEGORY/VIBE */}
              {wizardStep === 1 && (
                <motion.div
                  key="step-category"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    What category of creator are you looking for?
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Pick the niche that matches your brand's style, audience, and campaign focus.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
                    {/* All Option */}
                    <button
                      id="wizard-cat-all"
                      onClick={() => {
                        playTransitionChime();
                        setWizardCategory('all');
                        setWizardStep(2);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all relative group cursor-pointer ${
                        wizardCategory === 'all'
                          ? 'bg-violet-600/10 border-violet-500 shadow-md'
                          : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700/80'
                      }`}
                    >
                      <span className="text-2xl mb-2.5 block">🌐</span>
                      <h4 className="text-xs font-bold text-white">All Niches</h4>
                      <p className="text-[10px] text-zinc-500 mt-1">{SOCIAL_CREATORS.length} Creators available</p>
                      {wizardCategory === 'all' && (
                        <CheckCircle2 className="w-4 h-4 text-violet-400 absolute top-3 right-3" />
                      )}
                    </button>

                    {CATEGORY_DETAILS.map((cat) => {
                      const isSelected = wizardCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          id={`wizard-cat-${cat.id}`}
                          onClick={() => {
                            playTransitionChime();
                            setWizardCategory(cat.id);
                            setWizardStep(2);
                          }}
                          className={`p-4 rounded-xl border text-left transition-all relative group cursor-pointer ${
                            isSelected
                              ? 'bg-violet-600/10 border-violet-500 shadow-md'
                              : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700/80'
                          }`}
                        >
                          <span className="text-2xl mb-2.5 block">{cat.icon}</span>
                          <h4 className="text-xs font-bold text-white">{cat.name}</h4>
                          <p className="text-[10px] text-zinc-500 mt-1">{(counts[cat.id] || 0)} Creators available</p>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-violet-400 absolute top-3 right-3" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* STEP 2: SELECT FOLLOWERS RANGE */}
              {wizardStep === 2 && (
                <motion.div
                  key="step-range"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    What range of followers do you need?
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Choose scale matching your strategy. Nano creators bring ultra-high engagement, Mega bring massive reach.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {FOLLOWER_RANGES.map((range) => {
                      const isSelected = wizardRange === range.id;
                      return (
                        <button
                          key={range.id}
                          id={`wizard-range-${range.id}`}
                          onClick={() => {
                            playTransitionChime();
                            setWizardRange(range.id);
                            setWizardStep(3);
                          }}
                          className={`p-5 rounded-xl border text-left transition-all relative group cursor-pointer ${
                            isSelected
                              ? 'bg-violet-600/10 border-violet-500 shadow-md'
                              : 'bg-zinc-900/40 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700/80'
                          }`}
                        >
                          <Users className={`w-6 h-6 mb-3 ${isSelected ? 'text-violet-400' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                          <h4 className="text-xs font-bold text-white">{range.name}</h4>
                          <p className="text-[10px] font-mono text-violet-400 mt-1">{range.label}</p>
                          {isSelected && (
                            <CheckCircle2 className="w-4 h-4 text-violet-400 absolute top-3 right-3" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-zinc-900">
                    <button
                      id="wizard-back-btn"
                      onClick={() => {
                        playTransitionChime();
                        setWizardStep(1);
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Vibe
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: CHOOSE TARGET LOCATION */}
              {wizardStep === 3 && (
                <motion.div
                  key="step-location"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    Where should the creator be located?
                  </h3>
                  <p className="text-xs text-zinc-400 mb-6">
                    Filter by city if you want to ship products locally or arrange in-person product integration shoots.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <button
                      id="wizard-loc-all"
                      onClick={() => setWizardLocation('all')}
                      className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all relative cursor-pointer ${
                        wizardLocation === 'all'
                          ? 'bg-violet-600/15 border-violet-500 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      Any City / Global
                    </button>

                    <button
                      id="wizard-loc-remote"
                      onClick={() => setWizardLocation('Remote')}
                      className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all relative cursor-pointer ${
                        wizardLocation === 'Remote'
                          ? 'bg-violet-600/15 border-violet-500 text-white'
                          : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      }`}
                    >
                      Pure Remote Creators
                    </button>

                    {availableCities.map((city) => (
                      <button
                        key={city}
                        id={`wizard-loc-${city}`}
                        onClick={() => setWizardLocation(city)}
                        className={`p-3.5 rounded-xl border text-center text-xs font-bold transition-all relative cursor-pointer ${
                          wizardLocation === city
                            ? 'bg-violet-600/15 border-violet-500 text-white'
                            : 'bg-zinc-900/40 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-8 pt-5 border-t border-zinc-900">
                    <button
                      id="wizard-back-btn"
                      onClick={() => {
                        playTransitionChime();
                        setWizardStep(2);
                      }}
                      className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl text-xs font-bold text-zinc-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back to Scale
                    </button>

                    <button
                      id="wizard-finish-btn"
                      onClick={handleApplyWizard}
                      className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 border border-violet-400/20 rounded-xl text-xs font-bold text-white shadow-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      <span>Show Matching Creators</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* FILTER CONTROLS & MAIN EXPLORER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* SIDEBAR FILTER PANEL */}
        <div className="lg:col-span-1 bg-zinc-950/45 backdrop-blur-md border border-zinc-900 rounded-2xl p-5 h-fit sticky top-24">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-900 mb-5">
            <h3 className="text-xs font-bold tracking-wider uppercase text-zinc-300 flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-violet-400" />
              Campaign Filters
            </h3>
            <button
              id="reset-filters-btn"
              onClick={() => {
                playTransitionChime();
                setSelectedCategory('all');
                setSelectedRange('all');
                setSelectedLocation('all');
                setSearchQuery('');
              }}
              className="text-[10px] font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer"
            >
              Reset All
            </button>
          </div>

          {/* Search box */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Keyword Search</label>
            <div className="relative">
              <input
                id="search-input"
                type="text"
                placeholder="Search by name, handle, bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-550 focus:outline-none focus:border-violet-500 transition-colors"
              />
              <Search className="w-3.5 h-3.5 text-zinc-550 absolute right-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Niche / Category</label>
            <div className="space-y-1.5">
              <button
                id="filter-cat-all"
                onClick={() => {
                  playTransitionChime();
                  setSelectedCategory('all');
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-violet-600/10 text-white border-l-2 border-violet-500 font-semibold'
                    : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                }`}
              >
                <span>🌐 All Niches</span>
                <span className="text-[10px] font-mono text-zinc-550">{(counts.all)}</span>
              </button>

              {CATEGORY_DETAILS.map(cat => (
                <button
                  key={cat.id}
                  id={`filter-cat-${cat.id}`}
                  onClick={() => {
                    playTransitionChime();
                    setSelectedCategory(cat.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-violet-600/10 text-white border-l-2 border-violet-500 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <span>{cat.icon} {cat.name}</span>
                  <span className="text-[10px] font-mono text-zinc-550">{(counts[cat.id] || 0)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Follower Range Filter */}
          <div className="mb-5">
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Follower Scale</label>
            <div className="space-y-1">
              {FOLLOWER_RANGES.map(range => (
                <button
                  key={range.id}
                  id={`filter-range-${range.id}`}
                  onClick={() => {
                    playTransitionChime();
                    setSelectedRange(range.id);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer block ${
                    selectedRange === range.id
                      ? 'bg-violet-600/10 text-white border-l-2 border-violet-500 font-semibold'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                  }`}
                >
                  <p className="text-xs">{range.name}</p>
                  <span className="text-[9px] font-mono text-zinc-500 block leading-tight">{range.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Location / City Filter */}
          <div>
            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-2">Base City</label>
            <select
              id="filter-location-select"
              value={selectedLocation}
              onChange={(e) => {
                playTransitionChime();
                setSelectedLocation(e.target.value);
              }}
              className="w-full bg-zinc-900/60 border border-zinc-800/85 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
            >
              <option value="all">Any City / Global</option>
              <option value="Remote">Pure Remote Only</option>
              {availableCities.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        {/* CREATORS EXPLORER GRID */}
        <div className="lg:col-span-3">
          
          {/* Dashboard Header Status */}
          <div className="flex items-center justify-between bg-zinc-900/20 border border-zinc-900/50 rounded-xl p-4 mb-6 text-zinc-400 text-xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Showing <strong>{filteredCreators.length}</strong> matches out of <strong>{socialCreators.length}</strong> total active creators</span>
            </div>
            
            <div className="hidden sm:flex items-center gap-3 font-mono text-[10px]">
              <span>Active Niche: <strong className="text-white uppercase">{selectedCategory}</strong></span>
              <span>•</span>
              <span>Scale: <strong className="text-white uppercase">{selectedRange}</strong></span>
            </div>
          </div>

          {filteredCreators.length === 0 ? (
            <div className="text-center py-20 bg-zinc-950/20 border border-zinc-900 rounded-2xl">
              <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No creators match your filters</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6">
                Try widening your category filters or switching follower ranges to discover more content creators.
              </p>
              <button
                id="clear-all-filters-empty-btn"
                onClick={() => {
                  playTransitionChime();
                  setSelectedCategory('all');
                  setSelectedRange('all');
                  setSelectedLocation('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-zinc-900 hover:bg-zinc-850 text-xs font-bold text-white border border-zinc-800 rounded-xl cursor-pointer transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredCreators.map((creator, idx) => {
                const categoryDetail = CATEGORY_DETAILS.find(cat => cat.id === creator.category);
                
                return (
                  <motion.div
                    key={creator.id}
                    id={`creator-card-${creator.id}`}
                    className="group bg-zinc-950/45 hover:bg-zinc-950/85 border border-zinc-900/80 hover:border-violet-500/30 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_40px_rgba(139,92,246,0.1)] relative"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(0.2, idx * 0.04), duration: 0.5 }}
                    whileHover={{ y: -3 }}
                  >
                    <div>
                      {/* Card Header Profile Banner */}
                      <div className="p-5 flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3.5">
                          {/* Avatar Circle with Instagram Ring visual */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full p-[1.5px] scale-105" />
                            <img 
                              src={creator.avatar} 
                              alt={creator.name} 
                              className="w-12 h-12 rounded-full object-cover relative bg-zinc-900"
                              referrerPolicy="no-referrer"
                            />
                            {/* Instagram Icon Badge */}
                            <span className="absolute -bottom-1 -right-1 bg-zinc-900 border border-zinc-800 p-1 rounded-full text-[10px] text-pink-400">
                              <Instagram className="w-2.5 h-2.5" />
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-white group-hover:text-violet-400 transition-colors leading-snug">
                                {creator.name}
                              </h3>
                              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" fill="currentColor" stroke="#000" strokeWidth={3} />
                            </div>
                            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
                              @{creator.instagramHandle}
                            </p>
                          </div>
                        </div>

                        {/* Niche Badge */}
                        {categoryDetail && (
                          <span className={`text-[9px] font-bold px-2 py-1 rounded bg-zinc-900 border ${categoryDetail.color}`}>
                            {categoryDetail.icon} {categoryDetail.name.split(' ')[0]}
                          </span>
                        )}
                      </div>

                      {/* Bio & Location info */}
                      <div className="px-5 pb-3">
                        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                          {creator.bio}
                        </p>
                        
                        <div className="flex items-center gap-1.5 mt-2.5 text-[10px] text-zinc-500 font-medium">
                          <MapPin className="w-3 h-3 text-zinc-600" />
                          <span>{creator.location === 'Remote' ? 'Available Globally' : `${creator.location}, India`}</span>
                        </div>
                      </div>

                      {/* Main Metrics (Grid) */}
                      <div className="grid grid-cols-3 gap-1 border-y border-zinc-900/60 bg-zinc-900/10 px-5 py-3">
                        <div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Followers</p>
                          <p className="text-sm font-bold text-white tracking-tight flex items-center gap-1 mt-0.5">
                            <Users className="w-3 h-3 text-violet-400" />
                            {creator.followersStr}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Avg Views</p>
                          <p className="text-sm font-bold text-white tracking-tight flex items-center gap-1 mt-0.5">
                            <Eye className="w-3 h-3 text-sky-400" />
                            {creator.averageViews}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">Engagement</p>
                          <p className="text-sm font-bold text-white tracking-tight flex items-center gap-1 mt-0.5">
                            <BarChart3 className="w-3 h-3 text-pink-400" />
                            {creator.engagementRate}
                          </p>
                        </div>
                      </div>

                      {/* Mini Feed Reels Grid */}
                      <div className="px-5 py-4">
                        <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                          <Film className="w-3 h-3" /> Recent High-Performing Reels
                        </p>
                        <div className="grid grid-cols-2 gap-2.5">
                          {creator.recentReels.map((reelUrl, idx) => (
                            <div 
                              key={idx} 
                              className="relative aspect-[9/16] rounded-lg overflow-hidden bg-zinc-900 border border-zinc-900 group/reel cursor-pointer"
                              title="Click to zoom reel"
                            >
                              <img 
                                src={reelUrl} 
                                alt="Recent Reel Thumbnail" 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover/reel:scale-110"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                              <span className="absolute bottom-1.5 left-1.5 bg-zinc-950/80 backdrop-blur text-[8px] font-mono px-1.5 py-0.5 rounded text-white border border-zinc-800">
                                ▶ {idx === 0 ? 'Viral' : 'Trending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Brand partnerships badges */}
                      {creator.brandCollaborations.length > 0 && (
                        <div className="px-5 pb-4 flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] font-mono text-zinc-500 uppercase">Trusted by:</span>
                          {creator.brandCollaborations.map((brand, bIdx) => (
                            <span key={bIdx} className="text-[9px] font-bold bg-violet-950/30 text-violet-300 border border-violet-900/50 px-2 py-0.5 rounded-full">
                              {brand}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Bottom Action bar */}
                    <div className="p-5 pt-0 border-t border-zinc-900/60 flex items-center gap-2.5 mt-auto">
                      <button
                        id={`view-profile-${creator.id}`}
                        onClick={() => {
                          playTransitionChime();
                          setActiveCreator(creator);
                          setIsBookingMode(false);
                        }}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-white border border-zinc-850 hover:border-zinc-700 transition-colors cursor-pointer"
                      >
                        Inspect Analytics
                      </button>

                      <button
                        id={`book-campaign-${creator.id}`}
                        onClick={() => {
                          playTransitionChime();
                          setActiveCreator(creator);
                          setIsBookingMode(true);
                        }}
                        className="py-2.5 px-4 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-950/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <span>Collaborate</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* DETAILED CREATOR ANALYTICS POPUP & CAMPAIGN BOOKING MODAL */}
      <AnimatePresence>
        {activeCreator && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              id="creator-modal-container"
              className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] relative max-h-[90vh] flex flex-col"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Modal close icon */}
              <button
                id="close-modal-icon"
                onClick={() => {
                  playTransitionChime();
                  setActiveCreator(null);
                }}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-zinc-900/80 border border-zinc-850 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="overflow-y-auto flex-1">
                {/* Header Banner Background */}
                <div className="h-28 bg-gradient-to-tr from-violet-900/40 via-purple-900/30 to-indigo-900/40 relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                </div>

                {/* Profile Detail Header */}
                <div className="px-6 sm:px-8 pb-5 relative -mt-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div className="flex items-end gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-tr from-pink-500 via-purple-500 to-yellow-500 rounded-full p-[2px]" />
                      <img 
                        src={activeCreator.avatar} 
                        alt={activeCreator.name} 
                        className="w-20 h-20 rounded-full object-cover relative bg-zinc-950 border-4 border-zinc-950"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="mb-1">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-xl font-bold text-white leading-tight">
                          {activeCreator.name}
                        </h2>
                        <CheckCircle2 className="w-4.5 h-4.5 text-blue-400" fill="currentColor" stroke="#000" strokeWidth={3} />
                      </div>
                      <p className="text-xs font-mono text-zinc-400 mt-0.5 flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5 text-pink-400" />
                        @{activeCreator.instagramHandle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-300 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      {activeCreator.location}
                    </span>
                  </div>
                </div>

                {/* Toggle Modal View: Booking Form vs Analytical Overview */}
                {isBookingMode ? (
                  <div className="px-6 sm:px-8 py-4">
                    <div className="flex items-center justify-between border-b border-zinc-900 pb-3 mb-5">
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-violet-400" />
                        Create Campaign Collaboration Proposal
                      </h3>
                      <button
                        id="view-analytics-toggle"
                        onClick={() => {
                          playTransitionChime();
                          setIsBookingMode(false);
                        }}
                        className="text-xs text-violet-400 hover:text-white font-semibold transition-colors cursor-pointer"
                      >
                        Inspect Analytics First
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {bookingSuccess ? (
                        <motion.div
                          key="proposal-success"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          className="bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-6 text-center my-6"
                        >
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-400 mx-auto mb-3.5">
                            <Check className="w-6 h-6" strokeWidth={3} />
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">Proposal Sent Successfully!</h4>
                          <p className="text-xs text-zinc-400">
                            We have pinged @{activeCreator.instagramHandle} on Collably and sent this brief proposal directly. Expect a response in your Collably Brand inbox shortly!
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleBookSubmit} className="space-y-4">
                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Brand / Project Name</label>
                            <input
                              id="proposal-title"
                              type="text"
                              required
                              placeholder="e.g. Zara Summer Launch 2026"
                              value={campaignTitle}
                              onChange={(e) => setCampaignTitle(e.target.value)}
                              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Deliverables Required</label>
                              <select
                                id="proposal-deliverables"
                                value={campaignDeliverables}
                                onChange={(e) => setCampaignDeliverables(e.target.value)}
                                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                              >
                                <option value="1 Instagram Reel">1 Instagram Reel</option>
                                <option value="1 Instagram Reel + 1 Story">1 Reel + 1 Story</option>
                                <option value="2 Instagram Reels + 2 Stories">2 Reels + 2 Stories</option>
                                <option value="Instagram Reel Integration (30s)">Reel Integration (30s)</option>
                                <option value="Dedicated Custom Brand Film">Dedicated Custom Brand Film</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Estimated Budget Offer (INR)</label>
                              <input
                                id="proposal-budget"
                                type="text"
                                required
                                placeholder="e.g. ₹20,000"
                                value={campaignBudget}
                                onChange={(e) => setCampaignBudget(e.target.value)}
                                className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-violet-500"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">Campaign Brief & Guidelines</label>
                            <textarea
                              id="proposal-notes"
                              rows={4}
                              placeholder="Write key requirements, aesthetic style, timeline, or links to references..."
                              value={campaignNotes}
                              onChange={(e) => setCampaignNotes(e.target.value)}
                              className="w-full bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-violet-500 font-sans"
                            />
                          </div>

                          <div className="pt-4 border-t border-zinc-900 flex items-center justify-end gap-3">
                            <button
                              id="proposal-cancel-btn"
                              type="button"
                              onClick={() => {
                                playTransitionChime();
                                setIsBookingMode(false);
                              }}
                              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-white transition-colors cursor-pointer border border-zinc-850"
                            >
                              Cancel
                            </button>

                            <button
                              id="proposal-submit-btn"
                              type="submit"
                              className="px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white border border-violet-500/20 rounded-xl shadow-lg shadow-violet-950/30 transition-all cursor-pointer flex items-center gap-1.5"
                            >
                              <span>Submit proposal</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="px-6 sm:px-8 py-4 space-y-6">
                    {/* Bio Detail Section */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">Creator Overview</h4>
                      <p className="text-xs text-zinc-300 leading-relaxed bg-zinc-900/30 p-4 rounded-xl border border-zinc-900/60">
                        {activeCreator.bio}
                      </p>
                    </div>

                    {/* Featured Recent Project */}
                    {activeCreator.recentProject && activeCreator.recentProject.title && (
                      <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-violet-400" />
                          <span>Featured Recent Project</span>
                        </h4>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-900/60 rounded-xl space-y-1">
                          <p className="text-sm font-semibold text-white">{activeCreator.recentProject.title}</p>
                          {activeCreator.recentProject.description && (
                            <p className="text-xs text-zinc-400 leading-relaxed">{activeCreator.recentProject.description}</p>
                          )}
                          {activeCreator.recentProject.link && (
                            <a 
                              href={activeCreator.recentProject.link.startsWith('http') ? activeCreator.recentProject.link : `https://${activeCreator.recentProject.link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 text-xs text-violet-400 hover:text-violet-350 font-bold mt-2 hover:underline"
                            >
                              <span>View Project Link</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Extended Engagement Analytics Cards */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Key Instagram Insights</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl text-center">
                          <Users className="w-5 h-5 text-violet-400 mx-auto mb-1.5" />
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Followers</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">{activeCreator.followersStr}</p>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl text-center">
                          <Eye className="w-5 h-5 text-sky-400 mx-auto mb-1.5" />
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Avg Views</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">{activeCreator.averageViews}</p>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl text-center">
                          <BarChart3 className="w-5 h-5 text-pink-400 mx-auto mb-1.5" />
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Engagement</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">{activeCreator.engagementRate}</p>
                        </div>

                        <div className="bg-zinc-900/30 border border-zinc-900/80 p-4 rounded-xl text-center">
                          <Award className="w-5 h-5 text-amber-400 mx-auto mb-1.5" />
                          <p className="text-[9px] font-mono text-zinc-500 uppercase">Collabs done</p>
                          <p className="text-sm font-extrabold text-white mt-0.5">{activeCreator.brandCollaborations.length + 3} Brands</p>
                        </div>
                      </div>
                    </div>

                    {/* Featured Most Viral Reel */}
                    {activeCreator.viralReel ? (
                      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-3.5 relative overflow-hidden">
                        {/* Elegant background glow */}
                        <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                            Most Viral Reel
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 font-bold bg-zinc-950/60 border border-zinc-850 px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔥 {activeCreator.viralReel.viewsStr}
                          </span>
                        </div>

                        <div className="flex gap-4">
                          {activeCreator.viralReel.thumbnailUrl && (
                            <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 relative group/viral-cover">
                              <img src={activeCreator.viralReel.thumbnailUrl} alt="Reel Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <Film className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          )}
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <p className="text-sm font-extrabold text-white leading-snug font-sans">{activeCreator.viralReel.title}</p>
                              <p className="text-xs text-zinc-450 mt-1 line-clamp-1 font-mono">Engagement Rate: ~12.4%</p>
                            </div>
                            {activeCreator.viralReel.link && (
                              <a 
                                href={activeCreator.viralReel.link.startsWith('http') ? activeCreator.viralReel.link : `https://${activeCreator.viralReel.link}`} 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 mt-2 self-start cursor-pointer group"
                              >
                                <span>Watch on Instagram</span>
                                <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Provide a fallback/default viral reel for existing mock creators to keep the app rich! */
                      <div className="p-5 rounded-2xl border border-pink-500/20 bg-pink-500/5 space-y-3.5 relative overflow-hidden">
                        <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />
                        
                        <div className="flex items-center justify-between">
                          <h4 className="text-[10px] font-bold text-pink-400 uppercase tracking-widest flex items-center gap-1.5 font-display">
                            <Sparkles className="w-3.5 h-3.5" />
                            Most Viral Reel
                          </h4>
                          <span className="text-[10px] font-mono text-zinc-400 font-bold bg-zinc-950/60 border border-zinc-850 px-2 py-0.5 rounded-full flex items-center gap-1">
                            🔥 {activeCreator.id === '1' ? '1.8M views' : activeCreator.id === '2' ? '920K views' : '650K views'}
                          </span>
                        </div>

                        <div className="flex gap-4">
                          <div className="w-16 h-24 rounded-lg overflow-hidden shrink-0 border border-zinc-800 bg-zinc-900 relative group/viral-cover">
                            <img src={activeCreator.recentReels[0]} alt="Reel Cover" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <Film className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <p className="text-sm font-extrabold text-white leading-snug font-sans">
                                {activeCreator.category === 'fashion' ? 'Viral Minimal Aesthetic Winter Lookbook ❄️' : 
                                 activeCreator.category === 'food' ? '5 Minute Midnight Mug Cake Hacks 🧁' : 
                                 activeCreator.category === 'travel' ? 'Hidden Cliff Side Cave in Gujarat You Must Visit ✈️' :
                                 activeCreator.category === 'tech' ? 'Setup Transformation: Aesthetic Desk Build 💻' :
                                 'Viral Aesthetic Secret Tips & Hacks ✨'}
                              </p>
                              <p className="text-xs text-zinc-450 mt-1 line-clamp-1 font-mono">Engagement Rate: ~10.2%</p>
                            </div>
                            <a 
                              href="https://instagram.com" 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors flex items-center gap-1 mt-2 self-start cursor-pointer group"
                            >
                              <span>Watch on Instagram</span>
                              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Feed Reels Grid expanded with mockup details */}
                    <div>
                      <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Portfolio Reels</h4>
                      <div className="grid grid-cols-2 gap-4">
                        {activeCreator.recentReels.map((url, idx) => (
                          <div key={idx} className="bg-zinc-900/20 border border-zinc-900 rounded-xl overflow-hidden group/modal-reel relative">
                            <div className="aspect-[16/9] bg-zinc-900 relative">
                              <img 
                                src={url} 
                                alt="Reel Thumbnail" 
                                className="w-full h-full object-cover group-hover/modal-reel:scale-105 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
                              <div className="absolute bottom-2 left-3 flex items-center gap-1.5 text-[10px] text-white font-bold bg-zinc-950/80 px-2 py-0.5 rounded-md border border-zinc-850">
                                <Film className="w-3.5 h-3.5 text-pink-400" />
                                <span>Recent Reel #{idx + 1}</span>
                              </div>
                            </div>
                            <div className="p-3 flex items-center justify-between text-[11px] font-medium text-zinc-400">
                              <span className="flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5 text-zinc-650" />
                                {idx === 0 ? '42K Likes' : '28K Likes'}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare className="w-3.5 h-3.5 text-zinc-650" />
                                {idx === 0 ? '1.5K Comments' : '980 Comments'}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Brand relationships history */}
                    {activeCreator.brandCollaborations.length > 0 && (
                      <div>
                        <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2.5">Active Brand Endorsements</h4>
                        <div className="flex flex-wrap gap-2">
                          {activeCreator.brandCollaborations.map((brand, bIdx) => (
                            <span key={bIdx} className="text-xs bg-zinc-900 text-white border border-zinc-800 px-3.5 py-1.5 rounded-xl font-bold flex items-center gap-2">
                              <Check className="w-3.5 h-3.5 text-violet-400" strokeWidth={3} />
                              {brand} Partnership
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Call to collaborate bar */}
                    <div className="pt-6 border-t border-zinc-900 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-mono text-zinc-500">Reach Out Instantly</p>
                        <p className="text-xs text-zinc-400 mt-0.5">Average reply time: <strong>under 2 hours</strong></p>
                      </div>

                      <button
                        id="modal-collaborate-btn"
                        onClick={() => {
                          playTransitionChime();
                          setIsBookingMode(true);
                        }}
                        className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-xs font-bold text-white border border-violet-500/20 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>Send Campaign Proposal</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
