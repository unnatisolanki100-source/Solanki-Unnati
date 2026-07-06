import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Target, 
  Sparkles, 
  Users, 
  Briefcase, 
  Plus, 
  Search, 
  Trash2, 
  Check, 
  TrendingUp, 
  DollarSign, 
  MapPin, 
  Instagram, 
  Film, 
  Camera, 
  ArrowRight, 
  ChevronRight, 
  X, 
  Send, 
  CheckCircle2, 
  Info, 
  Compass, 
  Layers, 
  AlertCircle 
} from 'lucide-react';
import { CrewMember, SocialCreator } from '../types';
import { playTransitionChime } from '../utils/audio';

interface AgencyDashboardProps {
  onBack: () => void;
  crewMembers: CrewMember[];
  socialCreators: SocialCreator[];
}

interface AgencyCampaign {
  id: string;
  name: string;
  clientBrand: string;
  description: string;
  targetBudget: number;
  assignedCreatorIds: string[];
  assignedCrewIds: string[];
  status: 'planning' | 'active' | 'completed';
}

const INITIAL_CAMPAIGNS: AgencyCampaign[] = [
  {
    id: 'camp-1',
    name: 'Zudio Monsoon Styling Reel Series',
    clientBrand: 'Zudio',
    description: 'A series of 5 aesthetic fast-paced fashion transition reels showcasing Zudio\'s premium rain-wear and umbrella styling hacks.',
    targetBudget: 45000,
    assignedCreatorIds: ['1', '4'], // Pre-assigned mock IDs
    assignedCrewIds: ['2', '4'], // Pre-assigned video editor & photographer
    status: 'planning'
  },
  {
    id: 'camp-2',
    name: 'OnePlus Nord India Tech Launch',
    clientBrand: 'OnePlus',
    description: 'Premium tech unboxing and desk setup transformations highlighting the ultra-smooth high refresh rate displays.',
    targetBudget: 95000,
    assignedCreatorIds: ['3'],
    assignedCrewIds: ['1', '3'],
    status: 'active'
  }
];

export default function AgencyDashboard({ onBack, crewMembers, socialCreators }: AgencyDashboardProps) {
  const [campaigns, setCampaigns] = useState<AgencyCampaign[]>(INITIAL_CAMPAIGNS);
  const [activeCampId, setActiveCampId] = useState<string>('camp-1');
  
  // Custom Campaign Creator Modal
  const [isAddCampOpen, setIsAddCampOpen] = useState(false);
  const [newCampName, setNewCampName] = useState('');
  const [newCampClient, setNewCampClient] = useState('');
  const [newCampDesc, setNewCampDesc] = useState('');
  const [newCampBudget, setNewCampBudget] = useState(50000);

  // Active Browser Tab inside Agency Dashboard ('creators' vs 'crew')
  const [browserTab, setBrowserTab] = useState<'creators' | 'crew'>('creators');

  // Browsing filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  // Campaign Pitch & Contract Modal
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [isContractApproved, setIsContractApproved] = useState(false);
  const [contractSuccess, setContractSuccess] = useState(false);

  // Quick select an active campaign
  const activeCampaign = useMemo(() => {
    return campaigns.find(c => c.id === activeCampId) || campaigns[0];
  }, [campaigns, activeCampId]);

  // Aggregate stats of active campaign
  const campaignStats = useMemo(() => {
    if (!activeCampaign) return { totalFollowers: 0, totalCrewCost: 0, spentPercentage: 0 };
    
    // Sum followers of assigned creators
    const creators = socialCreators.filter(c => activeCampaign.assignedCreatorIds.includes(c.id));
    const totalFollowers = creators.reduce((acc, curr) => acc + curr.followers, 0);

    // Sum day rates of assigned crew (assuming 3 days project timeline)
    const crew = crewMembers.filter(m => activeCampaign.assignedCrewIds.includes(m.id));
    const totalCrewCost = crew.reduce((acc, curr) => {
      const cleaned = curr.rate.replace(/[^0-9]/g, '');
      const rate = parseInt(cleaned, 10) || 5000;
      return acc + (rate * 3); // 3 days timeline
    }, 0);

    const spentPercentage = Math.min(100, Math.round((totalCrewCost / activeCampaign.targetBudget) * 100));

    return {
      totalFollowers,
      totalCrewCost,
      spentPercentage,
      assignedCreators: creators,
      assignedCrew: crew
    };
  }, [activeCampaign, socialCreators, crewMembers]);

  // General Agency Overview metrics (global across all campaigns)
  const agencyOverview = useMemo(() => {
    const totalActiveCount = campaigns.length;
    const totalBudget = campaigns.reduce((acc, curr) => acc + curr.targetBudget, 0);
    const totalTalentCount = campaigns.reduce((acc, curr) => {
      return acc + curr.assignedCreatorIds.length + curr.assignedCrewIds.length;
    }, 0);

    // Estimate global reach
    const allCreatorIds = Array.from(new Set(campaigns.flatMap(c => c.assignedCreatorIds)));
    const uniqueCreators = socialCreators.filter(c => allCreatorIds.includes(c.id));
    const totalReach = uniqueCreators.reduce((acc, curr) => acc + curr.followers, 0);

    return {
      totalActiveCount,
      totalBudget,
      totalTalentCount,
      totalReach
    };
  }, [campaigns, socialCreators]);

  // Filter lists inside browser section
  const filteredCreators = useMemo(() => {
    return socialCreators.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            c.instagramHandle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
      const matchesLocation = locationFilter === 'all' || c.location === locationFilter;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [socialCreators, searchQuery, categoryFilter, locationFilter]);

  const filteredCrew = useMemo(() => {
    return crewMembers.filter(m => {
      const matchesSearch = m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            m.role.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (categoryFilter !== 'all') {
        const roleLower = m.role.toLowerCase();
        if (categoryFilter === 'editing') {
          matchesCategory = roleLower.includes('editor') || roleLower.includes('colorist') || roleLower.includes('vfx') || roleLower.includes('animation');
        } else if (categoryFilter === 'cinematography') {
          matchesCategory = roleLower.includes('cinematographer') || roleLower.includes('drone') || roleLower.includes('videographer') || roleLower.includes('director') || roleLower.includes('camera');
        } else if (categoryFilter === 'design') {
          matchesCategory = roleLower.includes('designer') || roleLower.includes('graphic') || roleLower.includes('thumbnail') || roleLower.includes('illustrator');
        } else if (categoryFilter === 'writing') {
          matchesCategory = roleLower.includes('writer') || roleLower.includes('script') || roleLower.includes('concept') || roleLower.includes('story');
        }
      }

      const matchesLocation = locationFilter === 'all' || m.location === locationFilter;
      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [crewMembers, searchQuery, categoryFilter, locationFilter]);

  // Action handlers
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampName || !newCampClient) return;

    const newCamp: AgencyCampaign = {
      id: `camp-${Date.now()}`,
      name: newCampName,
      clientBrand: newCampClient,
      description: newCampDesc || 'No campaign brief details specified.',
      targetBudget: Number(newCampBudget) || 50000,
      assignedCreatorIds: [],
      assignedCrewIds: [],
      status: 'planning'
    };

    setCampaigns([newCamp, ...campaigns]);
    setActiveCampId(newCamp.id);
    setIsAddCampOpen(false);
    playTransitionChime();

    // Clear fields
    setNewCampName('');
    setNewCampClient('');
    setNewCampDesc('');
    setNewCampBudget(50000);
  };

  const handleToggleTalentInCampaign = (type: 'creator' | 'crew', id: string) => {
    setCampaigns(prev => prev.map(camp => {
      if (camp.id !== activeCampId) return camp;

      if (type === 'creator') {
        const exists = camp.assignedCreatorIds.includes(id);
        const newList = exists 
          ? camp.assignedCreatorIds.filter(cid => cid !== id)
          : [...camp.assignedCreatorIds, id];
        return { ...camp, assignedCreatorIds: newList };
      } else {
        const exists = camp.assignedCrewIds.includes(id);
        const newList = exists 
          ? camp.assignedCrewIds.filter(cid => cid !== id)
          : [...camp.assignedCrewIds, id];
        return { ...camp, assignedCrewIds: newList };
      }
    }));
    playTransitionChime();
  };

  const handleLaunchCampaignSubmit = () => {
    setContractSuccess(true);
    playTransitionChime();
    
    // Update status to Active
    setCampaigns(prev => prev.map(c => {
      if (c.id === activeCampId) {
        return { ...c, status: 'active' };
      }
      return c;
    }));

    setTimeout(() => {
      setContractSuccess(false);
      setShowPitchModal(false);
    }, 3000);
  };

  // Human friendly numbers
  const formatFollowers = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  // Helper to get Category Name
  const getCategoryLabel = (cat: string) => {
    const maps: Record<string, string> = {
      food: '🍳 Food & Culinary',
      fashion: '✨ Fashion & Style',
      tech: '💻 Tech & Gadgets',
      travel: '✈️ Travel & Explore',
      comedy: '🎭 Comedy & Skits',
      beauty: '💄 Beauty & Skincare',
      fitness: '💪 Fitness & Health',
      editing: '🎬 Video Editing',
      cinematography: '🎥 Cinematography',
      design: '🎨 Graphic Design',
      writing: '📝 Concept Writing'
    };
    return maps[cat] || cat;
  };

  // AI Campaign Synergy Advisor
  const synergyAdvice = useMemo(() => {
    const creators = campaignStats.assignedCreators;
    const crew = campaignStats.assignedCrew;
    
    if (creators.length === 0 && crew.length === 0) {
      return "Assign talent below to calculate campaign synergy analysis.";
    }

    if (creators.length > 0 && crew.length > 0) {
      const mainCreatorCat = creators[0].category;
      const editor = crew.find(m => m.role.toLowerCase().includes('editor'));
      const camera = crew.find(m => m.role.toLowerCase().includes('cinematographer') || m.role.toLowerCase().includes('video'));

      if (mainCreatorCat === 'fashion' && editor) {
        return `🔥 SENSATIONAL MATCH! Priya's quick-cut editing techniques will make your fashion transitions go viral on reels!`;
      }
      if (mainCreatorCat === 'tech' && camera) {
        return `⚡ TECH SYNERGY EXCELLENT! Aarav's RED Komodo commercial camera setup will highlight high-fidelity smartphone unboxings beautifully.`;
      }
      return `🎉 Strong Synergy: Your hired crew supports the campaign niche perfectly. Ready to roll!`;
    }

    if (creators.length > 0) {
      return `💡 Creator found! Now pair them with a Video Editor or Cinematographer in the "Find Crew" tab for premium delivery.`;
    }

    return `💡 Crew assigned! Add a social media Creator in the "Find Creators" tab to distribute the final content.`;
  }, [campaignStats]);

  return (
    <div id="agency-dashboard" className="max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-10 space-y-8 font-sans">
      
      {/* Top Welcome & Agency Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-zinc-900/60">
        <div>
          <div className="flex items-center space-x-2.5 text-xs font-display font-semibold uppercase tracking-widest text-violet-400 mb-1">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse"></span>
            <span>Agency Executive Workspace</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            Collably Agency Portal
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-1">
            Build campaigns, hire top local creators, and coordinate production crew in a unified agency workflow.
          </p>
        </div>

        <div className="flex items-center space-x-3 self-start md:self-auto">
          <button
            onClick={() => setIsAddCampOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl border border-violet-500 shadow-lg shadow-violet-600/15 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Create Campaign</span>
          </button>
          
          <button
            onClick={onBack}
            className="px-4 py-2.5 bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-bold rounded-xl border border-zinc-800 transition-all cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>

      {/* Global Agency Statistics (Stripe Style Premium Cards) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Metric 1 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-violet-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Managed Briefs</span>
            <Building2 className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-display font-black text-white">{agencyOverview.totalActiveCount}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Active Client Projects</p>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Collective Budget</span>
            <DollarSign className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-display font-black text-white">₹{agencyOverview.totalBudget.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Assigned Agency Capital</p>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-cyan-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Hired Talent Pool</span>
            <Users className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-display font-black text-white">{agencyOverview.totalTalentCount}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Creators & Crew Shortlisted</p>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 sm:p-5 rounded-2xl bg-zinc-950/40 border border-zinc-900 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold">Projected Reach</span>
            <TrendingUp className="w-3.5 h-3.5 text-zinc-600" />
          </div>
          <div>
            <p className="text-xl sm:text-2xl font-display font-black text-white">{formatFollowers(agencyOverview.totalReach)}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">Estimated Brand Impressions</p>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (4/12): Campaign Selector & Hired List */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Section: Campaign Selector Tabs */}
          <div className="p-5 rounded-2xl bg-zinc-950/45 backdrop-blur-md border border-zinc-900 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-400 font-bold flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-violet-400" />
                <span>Select Agency Campaign</span>
              </h2>
              <span className="text-[10px] px-2 py-0.5 bg-zinc-900 text-zinc-500 border border-zinc-800 rounded-full font-mono font-bold">
                {campaigns.length} Total
              </span>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {campaigns.map((camp) => {
                const isActive = camp.id === activeCampId;
                const totalTalent = camp.assignedCreatorIds.length + camp.assignedCrewIds.length;
                return (
                  <button
                    key={camp.id}
                    onClick={() => {
                      setActiveCampId(camp.id);
                      playTransitionChime();
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                      isActive 
                        ? 'bg-violet-600/10 border-violet-500/50 shadow-md shadow-violet-500/5'
                        : 'bg-zinc-900/20 border-zinc-900 hover:bg-zinc-900/40 hover:border-zinc-850'
                    }`}
                  >
                    <div className="min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-white truncate">{camp.name}</span>
                        <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded-full ${
                          camp.status === 'active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        }`}>
                          {camp.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 truncate mt-0.5">Brand: {camp.clientBrand} &mdash; Budget: ₹{camp.targetBudget.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="shrink-0 flex items-center space-x-1 text-xs text-zinc-400 bg-zinc-950/40 px-2 py-1 rounded-lg border border-zinc-900">
                      <Users className="w-3 h-3 text-zinc-500" />
                      <span className="font-mono font-bold text-[10px]">{totalTalent}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Selected Campaign Detailed Status Panel */}
          {activeCampaign && (
            <div className="p-5 rounded-2xl bg-zinc-950/45 backdrop-blur-md border border-zinc-900 space-y-5">
              
              {/* Brand Campaign Header info */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Active Brief</span>
                  <span className="text-xs font-display font-extrabold text-violet-400">{activeCampaign.clientBrand}</span>
                </div>
                <h3 className="text-lg font-display font-black text-white mt-1 leading-tight">{activeCampaign.name}</h3>
                <p className="text-xs text-zinc-400 font-sans mt-2 leading-relaxed italic border-l-2 border-violet-500/30 pl-3">
                  "{activeCampaign.description}"
                </p>
              </div>

              {/* Campaign Budget Analytics (spent percentage vs target) */}
              <div className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-900 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-500 font-medium">Budget allocation (3 Days Timeline)</span>
                  <span className="font-mono text-white font-bold">
                    ₹{campaignStats.totalCrewCost.toLocaleString('en-IN')} <span className="text-zinc-500">/ ₹{activeCampaign.targetBudget.toLocaleString('en-IN')}</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-850">
                  <div 
                    className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-500" 
                    style={{ width: `${campaignStats.spentPercentage}%` }}
                  />
                </div>

                <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                  <span>{campaignStats.spentPercentage}% Utilized</span>
                  <span>₹{(activeCampaign.targetBudget - campaignStats.totalCrewCost).toLocaleString('en-IN')} Left</span>
                </div>
              </div>

              {/* AI Campaign Synergy Advisor Panel */}
              <div className="p-4 rounded-xl border border-violet-500/10 bg-violet-500/5 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-bold text-violet-300">
                  <Sparkles className="w-4 h-4 text-violet-400 animate-pulse" />
                  <span>AI Campaign Advisor</span>
                </div>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed">
                  {synergyAdvice}
                </p>
              </div>

              {/* Lists of Hired Talent for this campaign */}
              <div className="space-y-4 pt-2">
                <h4 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Shortlisted Campaign Members</h4>
                
                {/* Creators */}
                <div className="space-y-2">
                  <div className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Creators ({campaignStats.assignedCreators.length})</div>
                  {campaignStats.assignedCreators.length === 0 ? (
                    <p className="text-[11px] text-zinc-600 italic font-sans pl-2">No creators added yet. Find some below.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {campaignStats.assignedCreators.map(creator => (
                        <div key={creator.id} className="flex items-center justify-between p-2 bg-zinc-900/30 rounded-xl border border-zinc-900/50">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <img src={creator.avatar} alt={creator.name} className="w-7 h-7 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{creator.name}</p>
                              <p className="text-[9px] font-mono text-zinc-500">@{creator.instagramHandle} &bull; {creator.followersStr} followers</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleTalentInCampaign('creator', creator.id)}
                            className="p-1 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Remove from campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Crew Members */}
                <div className="space-y-2">
                  <div className="text-[10px] font-sans font-bold text-zinc-400 uppercase tracking-wider">Production Crew ({campaignStats.assignedCrew.length})</div>
                  {campaignStats.assignedCrew.length === 0 ? (
                    <p className="text-[11px] text-zinc-600 italic font-sans pl-2">No crew assigned yet. Find some below.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {campaignStats.assignedCrew.map(member => (
                        <div key={member.id} className="flex items-center justify-between p-2 bg-zinc-900/30 rounded-xl border border-zinc-900/50">
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <img src={member.avatar} alt={member.name} className="w-7 h-7 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">{member.name}</p>
                              <p className="text-[9px] font-mono text-zinc-500">{member.role} &bull; {member.rate}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleTalentInCampaign('crew', member.id)}
                            className="p-1 hover:bg-red-500/10 text-zinc-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                            title="Remove from campaign"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action: Send pitch to client */}
              <button
                disabled={campaignStats.assignedCreators.length === 0 && campaignStats.assignedCrew.length === 0}
                onClick={() => {
                  setShowPitchModal(true);
                  playTransitionChime();
                }}
                className={`w-full p-3 font-display font-black text-xs text-center rounded-xl border flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  campaignStats.assignedCreators.length === 0 && campaignStats.assignedCrew.length === 0
                    ? 'bg-zinc-900 text-zinc-600 border-zinc-950 cursor-not-allowed'
                    : 'bg-white hover:bg-zinc-100 text-black border-white hover:scale-[1.01]'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>Compile & Review Agency Brief</span>
              </button>

            </div>
          )}

        </div>

        {/* Right Column (7/12): Unified Database Browser (Tabbed: Creators vs Crew) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="p-6 rounded-2xl bg-zinc-950/45 backdrop-blur-md border border-zinc-900 space-y-6">
            
            {/* Tab Swapping & Title */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-display font-bold tracking-wide text-white">Unified Talent Pool Browser</h3>
                <p className="text-xs text-zinc-500 font-sans mt-0.5">Filter talent pool and assign directly to the selected campaign brief.</p>
              </div>

              {/* Sliding Pill Tab switcher */}
              <div className="bg-zinc-900 p-1 rounded-xl flex items-center border border-zinc-850 self-start sm:self-auto">
                <button
                  onClick={() => {
                    setBrowserTab('creators');
                    setCategoryFilter('all');
                    playTransitionChime();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    browserTab === 'creators' 
                      ? 'bg-zinc-800 text-white border border-zinc-700/50 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  <span>Creators ({socialCreators.length})</span>
                </button>
                
                <button
                  onClick={() => {
                    setBrowserTab('crew');
                    setCategoryFilter('all');
                    playTransitionChime();
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    browserTab === 'crew' 
                      ? 'bg-zinc-800 text-white border border-zinc-700/50 shadow-sm' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>Production Crew ({crewMembers.length})</span>
                </button>
              </div>
            </div>

            {/* Browser Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 p-4 rounded-xl border border-zinc-900 bg-zinc-950/20">
              
              {/* Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-3.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={browserTab === 'creators' ? "Search @instagram..." : "Search skills, name..."}
                  className="w-full p-2.5 pl-8.5 bg-zinc-900/60 hover:bg-zinc-900/90 focus:bg-zinc-900 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                />
              </div>

              {/* Category Dropdown */}
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900/60 hover:bg-zinc-900/90 focus:bg-zinc-900 text-xs text-white border border-zinc-850 rounded-xl outline-none cursor-pointer transition-all font-sans"
                >
                  <option value="all">All Categories</option>
                  {browserTab === 'creators' ? (
                    <>
                      <option value="fashion">Fashion & Style</option>
                      <option value="food">Food & Culinary</option>
                      <option value="tech">Tech & Gadgets</option>
                      <option value="travel">Travel & Explore</option>
                      <option value="comedy">Comedy & Skits</option>
                      <option value="beauty">Beauty & Skincare</option>
                      <option value="fitness">Fitness & Health</option>
                    </>
                  ) : (
                    <>
                      <option value="cinematography">Cinematography</option>
                      <option value="editing">Video Editing</option>
                      <option value="design">Graphic Design</option>
                      <option value="writing">Concept Writing</option>
                    </>
                  )}
                </select>
              </div>

              {/* Location Dropdown */}
              <div>
                <select
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="w-full p-2.5 bg-zinc-900/60 hover:bg-zinc-900/90 focus:bg-zinc-900 text-xs text-white border border-zinc-850 rounded-xl outline-none cursor-pointer transition-all font-sans"
                >
                  <option value="all">All Cities</option>
                  <option value="Ahmedabad">Ahmedabad</option>
                  <option value="Surat">Surat</option>
                  <option value="Vadodara">Vadodara</option>
                  <option value="Rajkot">Rajkot</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

            </div>

            {/* Results Grid List */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {browserTab === 'creators' ? (
                filteredCreators.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-sans">
                    No creators matching your query.
                  </div>
                ) : (
                  filteredCreators.map((creator) => {
                    const isAssigned = activeCampaign?.assignedCreatorIds.includes(creator.id);
                    return (
                      <div 
                        key={creator.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isAssigned 
                            ? 'border-violet-500/30 bg-violet-500/5' 
                            : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <img src={creator.avatar} alt={creator.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-900" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-white">{creator.name}</span>
                              <span className="text-[10px] bg-zinc-900 border border-zinc-800/80 px-2 py-0.5 rounded-full text-zinc-400 font-mono">
                                {getCategoryLabel(creator.category)}
                              </span>
                            </div>
                            <p className="text-xs text-violet-400 font-bold mt-0.5">@{creator.instagramHandle}</p>
                            
                            <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-zinc-500">
                              <span className="flex items-center gap-1">📈 {creator.followersStr} Followers</span>
                              <span>&bull;</span>
                              <span>🔥 {creator.averageViews} avg views</span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                                {creator.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Assign switch button */}
                        <button
                          onClick={() => handleToggleTalentInCampaign('creator', creator.id)}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer self-start sm:self-auto ${
                            isAssigned
                              ? 'bg-violet-600 text-white shadow-md font-extrabold border border-violet-500'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/60'
                          }`}
                        >
                          {isAssigned ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              Assigned
                            </span>
                          ) : (
                            'Assign Creator'
                          )}
                        </button>
                      </div>
                    );
                  })
                )
              ) : (
                filteredCrew.length === 0 ? (
                  <div className="py-12 text-center text-zinc-500 text-xs font-sans">
                    No crew members matching your query.
                  </div>
                ) : (
                  filteredCrew.map((member) => {
                    const isAssigned = activeCampaign?.assignedCrewIds.includes(member.id);
                    return (
                      <div 
                        key={member.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                          isAssigned 
                            ? 'border-violet-500/30 bg-violet-500/5' 
                            : 'border-zinc-900 bg-zinc-950/20 hover:border-zinc-800'
                        }`}
                      >
                        <div className="flex items-start space-x-3.5 min-w-0">
                          <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-xl object-cover border border-zinc-900" referrerPolicy="no-referrer" />
                          <div className="min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-bold text-white">{member.name}</span>
                              <span className="text-[10px] bg-indigo-950/40 border border-indigo-900 text-indigo-300 px-2 py-0.5 rounded-full font-mono">
                                {member.role}
                              </span>
                            </div>
                            <p className="text-xs text-zinc-400 mt-1 line-clamp-1">{member.bio}</p>
                            
                            <div className="flex items-center space-x-3 mt-2 text-[10px] font-mono text-zinc-500">
                              <span className="text-white font-bold">{member.rate}</span>
                              <span>&bull;</span>
                              <span className={`px-1.5 py-0.5 rounded ${
                                member.availability === 'Available Now' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                              }`}>
                                {member.availability}
                              </span>
                              <span>&bull;</span>
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-2.5 h-2.5 text-zinc-600" />
                                {member.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Assign switch button */}
                        <button
                          onClick={() => handleToggleTalentInCampaign('crew', member.id)}
                          className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer self-start sm:self-auto ${
                            isAssigned
                              ? 'bg-violet-600 text-white shadow-md font-extrabold border border-violet-500'
                              : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/60'
                          }`}
                        >
                          {isAssigned ? (
                            <span className="flex items-center gap-1.5">
                              <Check className="w-3.5 h-3.5" />
                              Assigned
                            </span>
                          ) : (
                            'Assign Crew'
                          )}
                        </button>
                      </div>
                    );
                  })
                )
              )}
            </div>

          </div>

        </div>

      </div>

      {/* MODAL 1: Create Campaign Modal */}
      <AnimatePresence>
        {isAddCampOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-zinc-950 border border-zinc-900 rounded-3xl p-6 relative shadow-2xl overflow-hidden"
            >
              {/* background color flare */}
              <div className="absolute right-0 top-0 w-24 h-24 bg-violet-600/10 rounded-full blur-2xl" />

              <div className="flex items-center justify-between mb-5 pb-3 border-b border-zinc-900">
                <div className="flex items-center space-x-2">
                  <Briefcase className="w-4 h-4 text-violet-400" />
                  <span className="text-sm font-display font-bold text-white">Create New Brief / Campaign</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddCampOpen(false)}
                  className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Campaign Title</label>
                  <input
                    type="text"
                    required
                    value={newCampName}
                    onChange={(e) => setNewCampName(e.target.value)}
                    placeholder="e.g. Zara Summer Linen Video Series"
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Client Brand Name</label>
                  <input
                    type="text"
                    required
                    value={newCampClient}
                    onChange={(e) => setNewCampClient(e.target.value)}
                    placeholder="e.g. Zara India"
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Client Budget allocation (INR)</label>
                  <input
                    type="number"
                    min="1000"
                    max="1000000"
                    step="5000"
                    required
                    value={newCampBudget}
                    onChange={(e) => setNewCampBudget(Number(e.target.value))}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-wider mb-1">Campaign Goal / Deliverables Brief</label>
                  <textarea
                    rows={3}
                    value={newCampDesc}
                    onChange={(e) => setNewCampDesc(e.target.value)}
                    placeholder="State key campaign aesthetic goals, style, content deliverables, platform targets (Instagram reels etc.)."
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full p-3 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-lg shadow-violet-600/10 mt-2"
                >
                  Publish Project Brief
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: Agency Pitch Review / Client Contract Sign-Off Modal */}
      <AnimatePresence>
        {showPitchModal && activeCampaign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-2xl bg-zinc-950 border border-zinc-900 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden"
            >
              {/* background lighting accents */}
              <div className="absolute right-0 top-0 w-48 h-48 bg-violet-600/10 rounded-full blur-3xl" />
              <div className="absolute left-0 bottom-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl" />

              <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-900">
                <div className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-violet-400" />
                  <span className="text-sm sm:text-base font-display font-bold text-white">Agency Brief &amp; Pitch deck Proposal</span>
                </div>
                <button
                  onClick={() => setShowPitchModal(false)}
                  className="p-1 hover:bg-zinc-900 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {contractSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Check className="w-8 h-8 stroke-[3]" />
                  </div>
                  <h3 className="text-lg font-display font-black text-white">Campaign Pitch Approved!</h3>
                  <p className="text-xs text-zinc-450 max-w-md font-sans">
                    Client contract has been digitally validated. Creative briefs &amp; budget escrows have been automatically dispatched to the hired team members.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Proposal Summary info */}
                  <div className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/60 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-zinc-500 uppercase">Proposal Status: Planning Draft</span>
                      <span className="text-xs font-bold text-violet-400 font-display">{activeCampaign.clientBrand}</span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">{activeCampaign.name}</h4>
                      <p className="text-xs text-zinc-400 mt-1 font-sans">{activeCampaign.description}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-3 border-t border-zinc-900/60 font-mono text-center">
                      <div className="bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900">
                        <div className="text-[10px] text-zinc-500">Target Budget</div>
                        <div className="text-xs font-bold text-white mt-1">₹{activeCampaign.targetBudget.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900">
                        <div className="text-[10px] text-zinc-500">Shortlist Cost</div>
                        <div className="text-xs font-bold text-emerald-400 mt-1">₹{campaignStats.totalCrewCost.toLocaleString('en-IN')}</div>
                      </div>
                      <div className="bg-zinc-900/40 p-2.5 rounded-xl border border-zinc-900">
                        <div className="text-[10px] text-zinc-500">Projected Reach</div>
                        <div className="text-xs font-bold text-pink-400 mt-1">{formatFollowers(campaignStats.totalFollowers)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Included Talent detailed list */}
                  <div className="space-y-3">
                    <h5 className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Assigned Agency Brief Members</h5>
                    <div className="max-h-40 overflow-y-auto pr-1 space-y-2">
                      {campaignStats.assignedCreators.map(c => (
                        <div key={c.id} className="flex items-center justify-between p-2.5 bg-zinc-900/20 border border-zinc-900/80 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <img src={c.avatar} alt={c.name} className="w-6 h-6 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <span className="text-xs font-bold text-white">{c.name}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-violet-500/10 border border-violet-500/20 text-violet-300 rounded-full font-mono">Creator</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">{c.followersStr} Followers</span>
                        </div>
                      ))}
                      {campaignStats.assignedCrew.map(m => (
                        <div key={m.id} className="flex items-center justify-between p-2.5 bg-zinc-900/20 border border-zinc-900/80 rounded-xl">
                          <div className="flex items-center space-x-2">
                            <img src={m.avatar} alt={m.name} className="w-6 h-6 rounded-lg object-cover" referrerPolicy="no-referrer" />
                            <span className="text-xs font-bold text-white">{m.name}</span>
                            <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 rounded-full font-mono">Crew</span>
                          </div>
                          <span className="text-[11px] font-mono text-zinc-400">{m.rate}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Escrow Disclaimer and Terms */}
                  <div className="p-3 bg-zinc-900/40 border border-zinc-900 rounded-xl flex items-start space-x-3 text-[10px] text-zinc-500 leading-relaxed font-sans">
                    <Info className="w-4 h-4 text-zinc-600 shrink-0 mt-0.5" />
                    <div>
                      Hired production crew prices are auto-calculated for a mock 3-day shoot timeline. Hand-off files and revisions will be transferred automatically through Collably's high-tech media cloud escrow pipelines.
                    </div>
                  </div>

                  {/* Digital Signature field */}
                  <div className="flex items-center space-x-3 pt-3">
                    <button
                      onClick={() => setIsContractApproved(!isContractApproved)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all cursor-pointer ${
                        isContractApproved ? 'bg-violet-600 border-violet-500' : 'border-zinc-800 bg-zinc-900/40'
                      }`}
                    >
                      {isContractApproved && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                    </button>
                    <label 
                      onClick={() => setIsContractApproved(!isContractApproved)}
                      className="text-xs text-zinc-400 select-none cursor-pointer hover:text-zinc-300"
                    >
                      Sign off proposal &amp; approve funding escrows of <span className="text-white font-bold">₹{campaignStats.totalCrewCost.toLocaleString('en-IN')}</span>.
                    </label>
                  </div>

                  {/* Sign and launch */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setShowPitchModal(false)}
                      className="flex-1 p-3 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-xs font-bold text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                    >
                      Hold Draft
                    </button>
                    
                    <button
                      disabled={!isContractApproved}
                      onClick={handleLaunchCampaignSubmit}
                      className={`flex-1 p-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                        isContractApproved
                          ? 'bg-gradient-to-r from-violet-600 to-pink-600 border border-violet-500 hover:scale-[1.01] shadow-lg shadow-violet-600/10 text-white font-extrabold'
                          : 'bg-zinc-900 text-zinc-600 border-zinc-950 cursor-not-allowed'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Execute Contract &amp; Launch</span>
                    </button>
                  </div>

                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
