import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, User, DollarSign, MapPin, Briefcase, Plus, Check, Star, 
  Send, Layers, HelpCircle, CheckCircle2, X, Sparkles, Film, Camera, 
  Palette, PenTool, Globe, Instagram, Compass, Flame, Image, LogOut, 
  RefreshCw, TrendingUp, Award
} from 'lucide-react';
import { CREATOR_PROJECTS } from '../data';
import { CreatorProject, CrewMember, SocialCreator } from '../types';

interface TalentDashboardProps {
  onBack: () => void;
  onAddCrewMember: (newCrew: CrewMember) => void;
  onAddSocialCreator: (newCreator: SocialCreator) => void;
}

const AVAILABLE_SKILLS = [
  'DaVinci Resolve', 'Premiere Pro', 'After Effects', 'RED Ranger 8K', 
  'FAA Part 107 (Drone)', 'Commercial Lighting', '3D Blender', 
  'Photoshop CC', 'Retention Editing', 'Audio Mastering', 'Storyboarding'
];

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', // Female creative
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', // Male creative
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', // Female creative 2
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', // Male creative 2
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80', // Mixed creative
];

const PRESET_PORTFOLIO_IMGS = [
  { url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=300&q=80', label: 'Cinematography' },
  { url: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=300&q=80', label: 'Post-Production' },
  { url: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=300&q=80', label: 'Aesthetic B-Roll' },
  { url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&q=80', label: '3D VFX Rendering' },
  { url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=300&q=80', label: 'Scriptwriting Desk' },
  { url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=300&q=80', label: 'Commercial Lighting' }
];

const PRESET_REELS_IMGS = [
  'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=300&q=80'
];

const BRAND_OPTIONS = [
  'Myntra', 'Zara', 'OnePlus', 'Unacademy', 'Boat', 'H&M', 'Mamaearth', 'AJIO', 'Sony India',
  'Zudio', 'Snitch', 'Bewakoof', 'The Souled Store', 'Minimalist', 'Beardo', 'Chai Tapri Co',
  'Surat Saree Bazaar', 'The Local Bakehouse', 'Boba Tea Bar', 'Ahmedabad Crafts'
];

const BRAND_BRIEFS = [
  {
    id: 'b1',
    brandName: 'Sony India',
    brandLogo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=150&q=80',
    campaignTitle: 'Sony Alpha Reel Campaign',
    description: 'Looking for tech/travel creators to showcase cinematic capabilities of the Sony Alpha series. 1 Reel + 2 Stories required.',
    budget: '₹45,000 flat',
    duration: '2 Weeks',
    niche: 'tech'
  },
  {
    id: 'b2',
    brandName: 'Zara India',
    brandLogo: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=150&q=80',
    campaignTitle: 'Summer Outfits Lookbook',
    description: 'Looking for premium fashion creators to style the new summer linen collection. Must have high aesthetic production value.',
    budget: '₹60,000 flat',
    duration: '10 Days',
    niche: 'fashion'
  },
  {
    id: 'b3',
    brandName: 'Paper Boat',
    brandLogo: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=150&q=80',
    campaignTitle: 'Childhood Memories Campaign',
    description: 'Seeking food and travel creators to share relatable, nostalgic stories around Indian summer tastes. Highly narrative content.',
    budget: '₹35,000 flat',
    duration: '3 Weeks',
    niche: 'food'
  }
];

export default function TalentDashboard({ onBack, onAddCrewMember, onAddSocialCreator }: TalentDashboardProps) {
  // Navigation & Registration Mode
  const [regMode, setRegMode] = useState<'select' | 'crew_form' | 'creator_form'>('select');
  const [isRegistered, setIsRegistered] = useState(false);
  const [registeredRole, setRegisteredRole] = useState<'crew' | 'creator' | null>(null);

  // Crew Profile Fields
  const [crewName, setCrewName] = useState('');
  const [crewRole, setCrewRole] = useState('Video Editor');
  const [crewCity, setCrewCity] = useState('Mumbai');
  const [crewRate, setCrewRate] = useState(8500);
  const [crewBio, setCrewBio] = useState('Senior Video Editor focused on high-retention storytelling and creative pacing.');
  const [crewSelectedSkills, setCrewSelectedSkills] = useState<string[]>(['Premiere Pro', 'DaVinci Resolve', 'Color Grading']);
  const [crewAvatar, setCrewAvatar] = useState(PRESET_AVATARS[0]);
  const [crewPortfolioImgs, setCrewPortfolioImgs] = useState<string[]>([PRESET_PORTFOLIO_IMGS[0].url, PRESET_PORTFOLIO_IMGS[1].url]);

  // Creator Profile Fields
  const [creatorName, setCreatorName] = useState('');
  const [creatorHandle, setCreatorHandle] = useState('');
  const [creatorCategory, setCreatorCategory] = useState<'food' | 'fashion' | 'tech' | 'travel' | 'comedy' | 'beauty' | 'fitness'>('tech');
  const [creatorCity, setCreatorCity] = useState('Mumbai');
  const [creatorFollowers, setCreatorFollowers] = useState(75000);
  const [creatorAvgViews, setCreatorAvgViews] = useState(35000);
  const [creatorEngagement, setCreatorEngagement] = useState('5.2%');
  const [creatorBio, setCreatorBio] = useState('Reviewer and aesthetic video creator making things simple and engaging.');
  const [creatorAvatar, setCreatorAvatar] = useState(PRESET_AVATARS[1]);
  const [creatorReelsImgs, setCreatorReelsImgs] = useState<string[]>([PRESET_REELS_IMGS[0], PRESET_REELS_IMGS[1]]);
  const [creatorSelectedBrands, setCreatorSelectedBrands] = useState<string[]>(['OnePlus', 'Sony India']);

  // Custom brand name input
  const [customBrandName, setCustomBrandName] = useState('');

  // Viral Reel Fields (Creator)
  const [creatorViralTitle, setCreatorViralTitle] = useState('');
  const [creatorViralViews, setCreatorViralViews] = useState('');
  const [creatorViralLink, setCreatorViralLink] = useState('');
  const [creatorViralThumb, setCreatorViralThumb] = useState('');

  // Recent Project Fields (Crew)
  const [crewProjTitle, setCrewProjTitle] = useState('');
  const [crewProjLink, setCrewProjLink] = useState('');
  const [crewProjDesc, setCrewProjDesc] = useState('');

  // Recent Project Fields (Creator)
  const [creatorProjTitle, setCreatorProjTitle] = useState('');
  const [creatorProjLink, setCreatorProjLink] = useState('');
  const [creatorProjDesc, setCreatorProjDesc] = useState('');

  // Pitches / Proposals
  const [activeJobProposal, setActiveJobProposal] = useState<CreatorProject | null>(null);
  const [activeBrandBrief, setActiveBrandBrief] = useState<any | null>(null);
  const [proposalRate, setProposalRate] = useState('');
  const [proposalPitch, setProposalPitch] = useState('');
  const [submittedProposalJobId, setSubmittedProposalJobId] = useState<string | null>(null);

  // Load initial registration state from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem('talent_registered_profile');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setIsRegistered(true);
        setRegisteredRole(parsed.roleType);
        if (parsed.roleType === 'crew') {
          setCrewName(parsed.name);
          setCrewRole(parsed.role);
          setCrewCity(parsed.location);
          setCrewRate(parseInt(parsed.rate.replace(/\D/g, '')) || 8500);
          setCrewBio(parsed.bio);
          setCrewSelectedSkills(parsed.skills);
          setCrewAvatar(parsed.avatar);
          setCrewPortfolioImgs(parsed.portfolio);
          if (parsed.recentProject) {
            setCrewProjTitle(parsed.recentProject.title || '');
            setCrewProjLink(parsed.recentProject.link || '');
            setCrewProjDesc(parsed.recentProject.description || '');
          }
        } else {
          setCreatorName(parsed.name);
          setCreatorHandle(`@${parsed.instagramHandle}`);
          setCreatorCategory(parsed.category);
          setCreatorCity(parsed.location);
          setCreatorFollowers(parsed.followers);
          setCreatorAvgViews(parsed.avgViews || Math.floor(parsed.followers * 0.4));
          setCreatorEngagement(parsed.engagementRate);
          setCreatorBio(parsed.bio);
          setCreatorAvatar(parsed.avatar);
          setCreatorReelsImgs(parsed.recentReels);
          setCreatorSelectedBrands(parsed.brandCollaborations);
          if (parsed.recentProject) {
            setCreatorProjTitle(parsed.recentProject.title || '');
            setCreatorProjLink(parsed.recentProject.link || '');
            setCreatorProjDesc(parsed.recentProject.description || '');
          }
          if (parsed.viralReel) {
            setCreatorViralTitle(parsed.viralReel.title || '');
            setCreatorViralViews(parsed.viralReel.viewsStr || '');
            setCreatorViralLink(parsed.viralReel.link || '');
            setCreatorViralThumb(parsed.viralReel.thumbnailUrl || '');
          }
        }
      } catch (e) {
        console.error("Failed to load profile from cache", e);
      }
    }
  }, []);

  // Handle Crew Registration Submit
  const registerCrewProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const newCrew: CrewMember = {
      id: `user_crew_${Date.now()}`,
      name: crewName || 'Anonymous Crew',
      role: crewRole,
      avatar: crewAvatar,
      location: crewCity,
      rating: 5.0,
      completedProjects: 0,
      rate: `₹${Number(crewRate).toLocaleString('en-IN')}/day`,
      availability: 'Available Now' as const,
      skills: crewSelectedSkills,
      bio: crewBio,
      portfolio: crewPortfolioImgs,
      recentProject: crewProjTitle ? {
        title: crewProjTitle,
        link: crewProjLink,
        description: crewProjDesc
      } : undefined
    };

    onAddCrewMember(newCrew);
    
    // Save to local storage
    localStorage.setItem('talent_registered_profile', JSON.stringify({
      roleType: 'crew',
      ...newCrew
    }));

    setRegisteredRole('crew');
    setIsRegistered(true);
  };

  // Handle Creator Registration Submit
  const registerCreatorProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = creatorHandle.replace('@', '').trim();
    const newCreator: SocialCreator = {
      id: `user_creator_${Date.now()}`,
      name: creatorName || 'Anonymous Creator',
      instagramHandle: cleanHandle || 'creator_handle',
      category: creatorCategory,
      avatar: creatorAvatar,
      followers: Number(creatorFollowers),
      followersStr: Number(creatorFollowers) >= 1000000 
        ? `${(Number(creatorFollowers)/1000000).toFixed(1)}M` 
        : `${(Number(creatorFollowers)/1000).toFixed(0)}K`,
      engagementRate: creatorEngagement,
      location: creatorCity,
      recentReels: creatorReelsImgs,
      bio: creatorBio,
      averageViews: Number(creatorAvgViews) >= 1000000 
        ? `${(Number(creatorAvgViews)/1000000).toFixed(1)}M` 
        : `${(Number(creatorAvgViews)/1000).toFixed(0)}K`,
      brandCollaborations: creatorSelectedBrands,
      recentProject: creatorProjTitle ? {
        title: creatorProjTitle,
        link: creatorProjLink,
        description: creatorProjDesc
      } : undefined,
      viralReel: creatorViralTitle ? {
        title: creatorViralTitle,
        viewsStr: creatorViralViews || '500K views',
        link: creatorViralLink,
        thumbnailUrl: creatorViralThumb || PRESET_REELS_IMGS[0]
      } : undefined
    };

    onAddSocialCreator(newCreator);

    // Save to local storage
    localStorage.setItem('talent_registered_profile', JSON.stringify({
      roleType: 'creator',
      ...newCreator,
      avgViews: creatorAvgViews,
      viralReel: creatorViralTitle ? {
        title: creatorViralTitle,
        viewsStr: creatorViralViews || '500K views',
        link: creatorViralLink,
        thumbnailUrl: creatorViralThumb || PRESET_REELS_IMGS[0]
      } : undefined
    }));

    setRegisteredRole('creator');
    setIsRegistered(true);
  };

  // Reset profile / Register again
  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your profile? This will remove it from search lists.")) {
      localStorage.removeItem('talent_registered_profile');
      setIsRegistered(false);
      setRegisteredRole(null);
      setRegMode('select');
    }
  };

  // Helper selectors
  const toggleCrewSkill = (skill: string) => {
    if (crewSelectedSkills.includes(skill)) {
      setCrewSelectedSkills(crewSelectedSkills.filter(s => s !== skill));
    } else {
      if (crewSelectedSkills.length < 5) {
        setCrewSelectedSkills([...crewSelectedSkills, skill]);
      }
    }
  };

  const toggleCrewPortfolioImg = (url: string) => {
    if (crewPortfolioImgs.includes(url)) {
      setCrewPortfolioImgs(crewPortfolioImgs.filter(u => u !== url));
    } else {
      setCrewPortfolioImgs([...crewPortfolioImgs, url]);
    }
  };

  const toggleCreatorReelsImg = (url: string) => {
    if (creatorReelsImgs.includes(url)) {
      setCreatorReelsImgs(creatorReelsImgs.filter(u => u !== url));
    } else {
      setCreatorReelsImgs([...creatorReelsImgs, url]);
    }
  };

  const toggleCreatorBrand = (brand: string) => {
    if (creatorSelectedBrands.includes(brand)) {
      setCreatorSelectedBrands(creatorSelectedBrands.filter(b => b !== brand));
    } else {
      setCreatorSelectedBrands([...creatorSelectedBrands, brand]);
    }
  };

  // Pitch handler (for either jobs or brand campaigns)
  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeJobProposal || activeBrandBrief) {
      setSubmittedProposalJobId(activeJobProposal?.id || activeBrandBrief?.id);
      setActiveJobProposal(null);
      setActiveBrandBrief(null);
      setProposalRate('');
      setProposalPitch('');

      // Clear notice after 5s
      setTimeout(() => {
        setSubmittedProposalJobId(null);
      }, 5000);
    }
  };

  // Filter matching briefs for Content Creator
  const matchingBrandBriefs = useMemo(() => {
    if (registeredRole === 'creator') {
      return BRAND_BRIEFS.filter(b => b.niche === creatorCategory);
    }
    return BRAND_BRIEFS;
  }, [registeredRole, creatorCategory]);

  return (
    <div className="w-full bg-transparent min-h-screen relative text-white overflow-hidden pb-16">
      
      {/* Dynamic Ambient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none opacity-20">
        <div className="absolute left-0 top-0 bottom-0 w-[55%] mix-blend-screen">
          <img 
            src="https://images.unsplash.com/photo-1579165466541-74e2b49699a4?auto=format&fit=crop&w=1200&q=80" 
            alt="Cinematic production camera" 
            className="w-full h-full object-cover filter blur-[4px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>
        <div className="absolute right-0 top-0 bottom-0 w-[55%] mix-blend-screen">
          <img 
            src="https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80" 
            alt="Creative post production suite" 
            className="w-full h-full object-cover filter blur-[4px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-[#0A0A0A]/40 to-[#0A0A0A]" />
        </div>
      </div>

      {/* Top Breadcrumb Sticky Navigation Bar */}
      <div className="relative z-10 border-b border-zinc-900/60 py-4 px-6 sticky top-0 bg-[#0A0A0A]/50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            id="role-back-btn"
            onClick={onBack}
            className="flex items-center space-x-2 text-sm text-zinc-500 hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Role Selection</span>
          </button>
          
          <div className="flex items-center space-x-2.5 text-[11px] font-display font-semibold uppercase tracking-wider text-zinc-300 bg-zinc-900/50 px-3.5 py-1.5 rounded-full border border-zinc-800">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
            <span>Talent Network Mode</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* Dynamic Success notifications */}
        <AnimatePresence>
          {submittedProposalJobId && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8 p-4 bg-zinc-900/90 border border-zinc-800 text-white rounded-2xl flex items-center justify-between shadow-2xl backdrop-blur-md"
            >
              <div className="flex items-center space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span className="text-sm font-medium">
                  Proposal successfully dispatched! Your profile details are pinned with the pitch.
                </span>
              </div>
              <button 
                id="dismiss-proposal-notif"
                onClick={() => setSubmittedProposalJobId(null)}
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CASE A: USER HAS ALREADY REGISTERED */}
        {isRegistered ? (
          <div>
            {/* Header banner */}
            <div className="bg-gradient-to-r from-zinc-950/80 via-zinc-900/40 to-transparent p-6 sm:p-8 rounded-3xl border border-zinc-900 mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-xs text-emerald-400 font-semibold uppercase tracking-wider">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span>Your Profile is Live</span>
                </div>
                <h1 className="text-3xl font-display font-extrabold tracking-tight text-white">
                  Welcome back, {registeredRole === 'crew' ? crewName : creatorName}
                </h1>
                <p className="text-xs text-zinc-400 max-w-lg leading-relaxed">
                  You are registered as a <strong className="text-white capitalize">{registeredRole === 'crew' ? 'Crew Member' : 'Content Creator'}</strong>.
                  Your card is now searchable by other users inside the {registeredRole === 'crew' ? '"Hire Crew"' : '"Find Creators"'} directories!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  id="reset-profile-btn"
                  onClick={handleResetProfile}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-zinc-900 border border-zinc-850 hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Update Profile</span>
                </button>
              </div>
            </div>

            {/* Split Dashboard layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* LEFT COLUMN: MATCHING OPPORTUNITIES / WORK (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                
                {registeredRole === 'crew' ? (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-zinc-400" />
                        <span>Live Creator Projects Matching Your Role</span>
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Content creators are actively searching for experts with your skills. Pitch your quote directly.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {CREATOR_PROJECTS.filter(proj => 
                        proj.requiredRole.toLowerCase().includes(crewRole.toLowerCase().substring(0, 5)) ||
                        crewSelectedSkills.some(skill => proj.description.toLowerCase().includes(skill.toLowerCase()))
                      ).concat(CREATOR_PROJECTS.filter(proj => 
                        !(proj.requiredRole.toLowerCase().includes(crewRole.toLowerCase().substring(0, 5)) ||
                        crewSelectedSkills.some(skill => proj.description.toLowerCase().includes(skill.toLowerCase())))
                      )).map((project) => (
                        <div
                          key={project.id}
                          className="p-5 rounded-2xl border border-zinc-900 bg-zinc-950/30 hover:bg-zinc-950/60 hover:border-zinc-800/80 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={project.creatorAvatar}
                                  alt={project.creatorName}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover border border-zinc-850"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-white">{project.creatorName}</h4>
                                  <p className="text-[10px] text-zinc-500 font-mono">{project.subscriberCount}</p>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 bg-zinc-900 text-zinc-300 text-[10px] font-mono font-semibold uppercase tracking-wider rounded border border-zinc-800">
                                {project.requiredRole}
                              </span>
                            </div>

                            <h4 className="text-sm font-display font-bold text-white mb-1.5">{project.title}</h4>
                            <p className="text-zinc-400 text-xs font-normal leading-relaxed mb-4">
                              {project.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 text-xs">
                            <div className="flex items-center space-x-4 text-zinc-400">
                              <span className="font-semibold text-white">{project.budget}</span>
                              <span>&bull;</span>
                              <span>{project.duration}</span>
                            </div>

                            <button
                              id={`pitch-btn-${project.id}`}
                              onClick={() => {
                                setActiveJobProposal(project);
                                setProposalRate(project.budget);
                              }}
                              className="text-xs font-semibold text-white hover:underline cursor-pointer flex items-center space-x-1"
                            >
                              <span>Pitch Quote</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <h3 className="text-lg font-display font-bold text-white flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-violet-400" />
                        <span>Available Premium Brand Collaboration Briefs</span>
                      </h3>
                      <p className="text-xs text-zinc-500">
                        Sponsorship opportunities tailored for creators in the <strong className="text-white uppercase">{creatorCategory}</strong> niche.
                      </p>
                    </div>

                    <div className="space-y-4">
                      {matchingBrandBriefs.map((brief) => (
                        <div
                          key={brief.id}
                          className="p-5 rounded-2xl border border-violet-900/20 bg-gradient-to-b from-violet-950/5 to-zinc-950/40 hover:from-violet-950/10 hover:border-violet-500/20 transition-all duration-300 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={brief.brandLogo}
                                  alt={brief.brandName}
                                  referrerPolicy="no-referrer"
                                  className="w-8 h-8 rounded-full object-cover border border-zinc-850 bg-zinc-900"
                                />
                                <div>
                                  <h4 className="text-xs font-bold text-white">{brief.brandName}</h4>
                                  <p className="text-[10px] text-zinc-500 font-mono">Brand Sponsor</p>
                                </div>
                              </div>

                              <span className="px-2 py-0.5 bg-violet-500/10 text-violet-400 text-[10px] font-mono font-semibold uppercase tracking-wider rounded border border-violet-500/20">
                                {brief.niche} Niche
                              </span>
                            </div>

                            <h4 className="text-sm font-display font-bold text-white mb-1.5">{brief.campaignTitle}</h4>
                            <p className="text-zinc-450 text-xs font-normal leading-relaxed mb-4">
                              {brief.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3 text-xs">
                            <div className="flex items-center space-x-4 text-zinc-400">
                              <span className="font-semibold text-white">{brief.budget} Budget</span>
                              <span>&bull;</span>
                              <span>{brief.duration} timeline</span>
                            </div>

                            <button
                              id={`pitch-brief-btn-${brief.id}`}
                              onClick={() => {
                                setActiveBrandBrief(brief);
                                setProposalRate(brief.budget);
                              }}
                              className="text-xs font-bold text-violet-400 hover:text-violet-300 cursor-pointer flex items-center space-x-1"
                            >
                              <span>Apply for Sponsor</span>
                              <span>&rarr;</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* RIGHT COLUMN: REAL-TIME SEARCH RESULT CARD PREVIEW (5 cols) */}
              <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                <span className="block text-xs font-mono uppercase tracking-wider text-zinc-500">
                  Live Public Network Preview
                </span>

                {registeredRole === 'crew' ? (
                  /* Live Crew Card */
                  <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-800/10 to-transparent rounded-bl-full pointer-events-none" />
                    
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={crewAvatar} 
                            alt={crewName} 
                            className="w-14 h-14 rounded-full object-cover border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-white">
                              {crewName || 'Aesthetic Pro'}
                            </h3>
                            <p className="text-xs text-zinc-450 font-medium">{crewRole}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                          Active Now
                        </span>
                      </div>

                      {/* Day rate badge */}
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-mono font-bold border border-zinc-800 mb-4">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        <span>₹{Number(crewRate).toLocaleString('en-IN')}/day Day Rate</span>
                      </div>

                      {/* Bio */}
                      <p className="text-zinc-400 text-xs font-normal leading-relaxed mb-4 italic">
                        "{crewBio || 'Ready to produce stunning visual edits...'}"
                      </p>

                      {/* Featured Recent Project */}
                      {crewProjTitle && (
                        <div className="mb-4 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                          <h5 className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 mb-1">
                            Recent Project
                          </h5>
                          <p className="text-white text-xs font-bold leading-tight">{crewProjTitle}</p>
                          {crewProjDesc && (
                            <p className="text-zinc-400 text-[10px] mt-0.5">{crewProjDesc}</p>
                          )}
                          {crewProjLink && (
                            <a 
                              href={crewProjLink.startsWith('http') ? crewProjLink : `https://${crewProjLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-indigo-400 hover:underline inline-flex items-center space-x-1 font-semibold mt-1"
                            >
                              <span>View Project Link</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Skills */}
                      <div className="mb-5">
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Primary Focus Skills
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {crewSelectedSkills.map((skill, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 bg-zinc-900 text-zinc-300 text-[10px] font-medium rounded border border-zinc-800"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Portfolio selection preview */}
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Portfolio Workspace Gallery
                        </h5>
                        <div className="grid grid-cols-4 gap-2">
                          {crewPortfolioImgs.slice(0, 4).map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Portfolio"
                              referrerPolicy="no-referrer"
                              className="w-full h-10 rounded object-cover border border-zinc-900"
                            />
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-900/80 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{crewCity} (Base)</span>
                      </div>

                      <div className="flex items-center space-x-1 text-white font-semibold">
                        <Award className="w-3.5 h-3.5 text-yellow-500" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Live Creator Card */
                  <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={creatorAvatar} 
                            alt={creatorName} 
                            className="w-14 h-14 rounded-full object-cover border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-white">
                              {creatorName || 'Aesthetic Pro'}
                            </h3>
                            <p className="text-xs text-violet-400 font-bold font-mono">@{creatorHandle.replace('@', '')}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider">
                          {creatorCategory}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Followers</p>
                          <p className="text-sm font-display font-black text-white">
                            {creatorFollowers >= 1000000 
                              ? `${(creatorFollowers/1000000).toFixed(1)}M` 
                              : `${(creatorFollowers/1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Avg Views</p>
                          <p className="text-sm font-display font-black text-white">
                            {creatorAvgViews >= 1000000 
                              ? `${(creatorAvgViews/1000000).toFixed(1)}M` 
                              : `${(creatorAvgViews/1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Engagement</p>
                          <p className="text-sm font-display font-black text-white">{creatorEngagement}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-zinc-400 text-xs font-normal leading-relaxed mb-4 italic">
                        "{creatorBio || 'Content creator sharing lifestyle content...'}"
                      </p>

                      {/* Featured Recent Project */}
                      {creatorProjTitle && (
                        <div className="mb-4 p-3 bg-violet-500/5 rounded-xl border border-violet-500/10">
                          <h5 className="text-[9px] font-mono uppercase tracking-wider text-violet-400 mb-1">
                            Recent Project / Campaign
                          </h5>
                          <p className="text-white text-xs font-bold leading-tight">{creatorProjTitle}</p>
                          {creatorProjDesc && (
                            <p className="text-zinc-450 text-[10px] mt-0.5">{creatorProjDesc}</p>
                          )}
                          {creatorProjLink && (
                            <a 
                              href={creatorProjLink.startsWith('http') ? creatorProjLink : `https://${creatorProjLink}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-violet-400 hover:underline inline-flex items-center space-x-1 font-semibold mt-1"
                            >
                              <span>View Project Link</span>
                            </a>
                          )}
                        </div>
                      )}

                      {/* Most Viral Reel Featured */}
                      {creatorViralTitle && (
                        <div className="mb-4 p-3 bg-pink-500/5 rounded-xl border border-pink-500/10">
                          <h5 className="text-[9px] font-mono uppercase tracking-wider text-pink-400 mb-1 flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5 animate-pulse" />
                            Most Viral Reel
                          </h5>
                          <div className="flex gap-2">
                            {creatorViralThumb && (
                              <img src={creatorViralThumb} className="w-8 h-12 rounded object-cover" referrerPolicy="no-referrer" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-bold leading-tight truncate">{creatorViralTitle}</p>
                              <p className="text-zinc-450 text-[10px] mt-0.5">{creatorViralViews || '600K views'}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Brand Collaborations */}
                      {creatorSelectedBrands.length > 0 && (
                        <div className="mb-5">
                          <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                            Recent Brand Partners
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {creatorSelectedBrands.map((brand, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-violet-950/10 text-violet-300 border border-violet-950/30 text-[10px] font-medium rounded"
                              >
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recent Reels preview */}
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Recent Instagram Reels Feed
                        </h5>
                        <div className="grid grid-cols-4 gap-2">
                          {creatorReelsImgs.slice(0, 4).map((url, i) => (
                            <img
                              key={i}
                              src={url}
                              alt="Reel Feed"
                              referrerPolicy="no-referrer"
                              className="w-full h-12 rounded object-cover border border-zinc-900 shadow"
                            />
                          ))}
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-900/80 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{creatorCity} (India)</span>
                      </div>

                      <div className="flex items-center space-x-1 text-white font-semibold">
                        <Instagram className="w-3.5 h-3.5 text-violet-400" />
                        <span>Verified Influencer</span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-[10px] text-zinc-500 text-center font-sans">
                  *Your profile changes reflect dynamically in other workspace directories.
                </p>
              </div>

            </div>
          </div>
        ) : (
          /* CASE B: ONBOARDING FLOW (STEP-BY-STEP REGISTER) */
          <div className="max-w-4xl mx-auto">
            
            {/* STEP 0: SELECTION SCREEN */}
            {regMode === 'select' && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="inline-flex items-center space-x-2 bg-zinc-900/80 px-4 py-1.5 rounded-full border border-zinc-800 mb-6">
                  <Sparkles className="w-4 h-4 text-violet-400" />
                  <span className="text-xs font-mono uppercase tracking-wider text-zinc-300">Talent Showcase Portal</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-extrabold tracking-tight text-white mb-4">
                  Which Path Best Fits Your Craft?
                </h1>
                
                <p className="text-zinc-400 text-xs sm:text-sm max-w-lg mx-auto mb-12 font-medium leading-relaxed">
                  Join our elite, hand-curated network of creatives. Showcase your portfolio or social metrics and get matches instantly.
                </p>

                {/* Two Large Choice Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
                  
                  {/* Option 1: Crew Member */}
                  <div
                    onClick={() => setRegMode('crew_form')}
                    className="group bg-zinc-950/40 hover:bg-zinc-950/80 border border-zinc-900 hover:border-zinc-750 p-8 rounded-3xl transition-all duration-300 text-left cursor-pointer relative overflow-hidden shadow-xl hover:shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />
                    
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 flex items-center justify-center text-white mb-6 border border-zinc-800 transition-transform group-hover:scale-105">
                      <Film className="w-6 h-6 text-zinc-300" />
                    </div>

                    <div className="mb-3">
                      <h3 className="text-xl font-display font-bold text-white tracking-tight">Production Crew</h3>
                      <p className="text-xs font-mono text-zinc-500 font-normal mt-1">Editor, DP, Script, Designer</p>
                    </div>
                    
                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                      Showcase your day rate, software skills, drone operator licenses, and video portfolios to get hired by elite content creators.
                    </p>

                    <div className="mt-8 text-xs font-bold text-white flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span>Enter Crew Studio</span>
                      <span>&rarr;</span>
                    </div>
                  </div>

                  {/* Option 2: Content Creator */}
                  <div
                    onClick={() => setRegMode('creator_form')}
                    className="group bg-zinc-950/40 hover:bg-zinc-950/80 border border-zinc-900 hover:border-violet-900/30 p-8 rounded-3xl transition-all duration-300 text-left cursor-pointer relative overflow-hidden shadow-xl hover:shadow-2xl"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full pointer-events-none transition-all group-hover:scale-110" />

                    <div className="w-12 h-12 rounded-2xl bg-violet-950/10 flex items-center justify-center text-violet-400 mb-6 border border-violet-500/20 transition-transform group-hover:scale-105">
                      <Instagram className="w-6 h-6" />
                    </div>

                    <div className="mb-3">
                      <h3 className="text-xl font-display font-bold text-white tracking-tight">Social Creator</h3>
                      <p className="text-xs font-mono text-violet-400 font-normal mt-1">Influencer, Content Architect, YouTuber</p>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed font-medium">
                      Showcase your Instagram handle, niche category, verified followers metrics, and engagement rates to unlock brand sponsorship briefs.
                    </p>

                    <div className="mt-8 text-xs font-bold text-violet-400 flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                      <span>Launch Creator Hub</span>
                      <span>&rarr;</span>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* STEP 1: CREW PROFILE FORM */}
            {regMode === 'crew_form' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Back button */}
                <div className="lg:col-span-12 flex items-center justify-between">
                  <button 
                    onClick={() => setRegMode('select')}
                    className="flex items-center space-x-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to selection path</span>
                  </button>
                  <span className="text-xs font-mono text-zinc-500">Crew Member Registration</span>
                </div>

                {/* Main form (7 cols) */}
                <form onSubmit={registerCrewProfile} className="lg:col-span-7 space-y-6">
                  
                  {/* Basic Identifiers */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white flex items-center gap-2">
                      <User className="w-4 h-4 text-indigo-400" />
                      <span>About Your Craft</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Full Name</label>
                        <input
                          type="text"
                          required
                          value={crewName}
                          onChange={(e) => setCrewName(e.target.value)}
                          placeholder="e.g. Kabir Vyas"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Primary Specialized Role</label>
                        <select
                          value={crewRole}
                          onChange={(e) => setCrewRole(e.target.value)}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="Video Editor">Video Editor</option>
                          <option value="Cinematographer">Cinematographer</option>
                          <option value="Thumbnail & Graphic Designer">Thumbnail & Graphic Designer</option>
                          <option value="Script & Concept Writer">Script & Concept Writer</option>
                          <option value="Drone Operator">Drone Operator</option>
                          <option value="Sound Designer & Engineer">Sound Designer</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Base Location</label>
                        <select
                          value={crewCity}
                          onChange={(e) => setCrewCity(e.target.value)}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Surat">Surat</option>
                          <option value="Vadodara">Vadodara</option>
                          <option value="Rajkot">Rajkot</option>
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Remote">Remote Only</option>
                        </select>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1.5">
                          <label className="text-xs font-sans font-medium text-zinc-400">Day Rate (INR)</label>
                          <span className="text-xs font-bold text-white px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20 font-sans">
                            ₹{Number(crewRate).toLocaleString('en-IN')}/day
                          </span>
                        </div>
                        <input
                          type="range"
                          min="500"
                          max="40000"
                          step="500"
                          value={crewRate}
                          onChange={(e) => setCrewRate(Number(e.target.value))}
                          className="w-full accent-indigo-500 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer mt-1"
                        />
                        <div className="flex justify-between gap-1 mt-2">
                          {[
                            { value: 500, label: 'Micro' },
                            { value: 1000, label: 'Budget' },
                            { value: 5000, label: 'Starter' },
                            { value: 12000, label: 'Pro' },
                            { value: 25000, label: 'Expert' }
                          ].map((preset) => {
                            const isSelected = crewRate === preset.value;
                            return (
                              <button
                                key={preset.value}
                                type="button"
                                onClick={() => setCrewRate(preset.value)}
                                className={`flex-1 py-1 px-0.5 rounded-lg border text-center transition-all cursor-pointer font-sans ${
                                  isSelected
                                    ? 'bg-white text-black border-white shadow-md font-bold'
                                    : 'bg-zinc-900/40 text-zinc-400 border-zinc-850 hover:bg-zinc-800 hover:text-white text-[9px]'
                                }`}
                              >
                                <span className="text-[9px] block font-semibold">
                                  {preset.value >= 1000 ? `₹${preset.value / 1000}K` : `₹${preset.value}`}
                                </span>
                                <span className="block opacity-60 text-[7px] font-medium leading-none">{preset.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Avatar customizer */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white">Choose Profile Avatar</h3>
                    <div className="flex items-center gap-4">
                      <img 
                        src={crewAvatar} 
                        alt="Preview Avatar" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-white/20"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCrewAvatar(url)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                              crewAvatar === url ? 'border-white scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="preset avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Biography text area */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <label className="block text-sm font-display font-semibold tracking-wide text-white">Profile Biography</label>
                    <textarea
                      required
                      value={crewBio}
                      onChange={(e) => setCrewBio(e.target.value.slice(0, 160))}
                      placeholder="Write a clear, professional description of your gear, specialization and experience..."
                      rows={3}
                      className="w-full p-4 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all resize-none font-sans font-medium"
                    />
                    <div className="text-right text-[10px] text-zinc-500 font-mono">
                      {crewBio.length}/160 characters
                    </div>
                  </div>

                  {/* Skills tags selection */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-display font-semibold tracking-wide text-white">Select Production Skills</h3>
                      <span className="text-xs font-sans font-medium text-zinc-400">{crewSelectedSkills.length}/5 selected</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {AVAILABLE_SKILLS.map((skill) => {
                        const isSelected = crewSelectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            type="button"
                            onClick={() => toggleCrewSkill(skill)}
                            className={`px-3 py-2 text-xs font-semibold rounded-xl border flex items-center space-x-1.5 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-white text-black border-white shadow-md font-sans'
                                : 'bg-zinc-900/40 text-zinc-400 border-zinc-850 hover:border-zinc-750 hover:text-white font-sans'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            <span>{skill}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Portfolio presets selection */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white">Select Portfolio Pieces (Visual Assets)</h3>
                    <p className="text-xs text-zinc-500 font-sans">Pick beautiful mock project visual thumbnails to showcase in your live preview card.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PRESET_PORTFOLIO_IMGS.map((piece, idx) => {
                        const isSelected = crewPortfolioImgs.includes(piece.url);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCrewPortfolioImg(piece.url)}
                            className={`relative rounded-xl overflow-hidden aspect-video border cursor-pointer group transition-all ${
                              isSelected ? 'border-white scale-[1.02] ring-1 ring-white/20' : 'border-zinc-850 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={piece.url} alt={piece.label} className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2">
                              <span className="text-[9px] font-bold text-white tracking-wide font-sans">{piece.label}</span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-white text-black rounded-full p-0.5">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Featured Recent Project */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-semibold tracking-wide text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-indigo-400" />
                        <span>Add Your Recent Project</span>
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 font-sans">
                        Highlight your finest work to prove your practical capability.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Project Title</label>
                        <input
                          type="text"
                          value={crewProjTitle}
                          onChange={(e) => setCrewProjTitle(e.target.value)}
                          placeholder="e.g. Myntra Summer Ad Film"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Project Link (Optional)</label>
                          <input
                            type="text"
                            value={crewProjLink}
                            onChange={(e) => setCrewProjLink(e.target.value)}
                            placeholder="e.g. youtube.com/watch?v=..."
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all font-sans font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Your Contribution / Role</label>
                          <input
                            type="text"
                            value={crewProjDesc}
                            onChange={(e) => setCrewProjDesc(e.target.value)}
                            placeholder="e.g. Lead Colorist & Editor"
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-2xl font-sans text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer border border-white shadow-xl"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    <span>Publish Profile & Join Crew Directory</span>
                  </button>

                </form>

                {/* Preview column (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                  <span className="block text-xs font-mono uppercase tracking-wider text-zinc-500">Your Live Preview Card</span>
                  
                  <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-zinc-800/10 to-transparent rounded-bl-full pointer-events-none" />
                    
                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={crewAvatar} 
                            alt="avatar preview" 
                            className="w-14 h-14 rounded-full object-cover border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-white">
                              {crewName || 'Aesthetic Pro'}
                            </h3>
                            <p className="text-xs text-zinc-450 font-medium">{crewRole}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-wider">
                          Active Now
                        </span>
                      </div>

                      {/* Day rate badge */}
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-zinc-900 text-white rounded-lg text-xs font-mono font-bold border border-zinc-800 mb-4">
                        <DollarSign className="w-3.5 h-3.5 text-zinc-400" />
                        <span>₹{Number(crewRate).toLocaleString('en-IN')}/day Day Rate</span>
                      </div>

                      {/* Bio */}
                      <p className="text-zinc-400 text-xs font-normal leading-relaxed mb-4 italic">
                        "{crewBio || 'Ready to produce stunning visual edits...'}"
                      </p>

                      {/* Featured Recent Project */}
                      {crewProjTitle && (
                        <div className="mb-4 p-3 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                          <h5 className="text-[9px] font-mono uppercase tracking-wider text-indigo-400 mb-1">
                            Recent Project
                          </h5>
                          <p className="text-white text-xs font-bold leading-tight">{crewProjTitle}</p>
                          {crewProjDesc && (
                            <p className="text-zinc-400 text-[10px] mt-0.5">{crewProjDesc}</p>
                          )}
                        </div>
                      )}

                      {/* Skills */}
                      <div className="mb-5">
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Primary Focus Skills
                        </h5>
                        <div className="flex flex-wrap gap-1.5">
                          {crewSelectedSkills.length === 0 ? (
                            <span className="text-xs text-zinc-500 italic">No skills selected</span>
                          ) : (
                            crewSelectedSkills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-zinc-900 text-zinc-300 text-[10px] font-medium rounded border border-zinc-800"
                              >
                                {skill}
                              </span>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Portfolio preview */}
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Portfolio Gallery ({crewPortfolioImgs.length})
                        </h5>
                        <div className="grid grid-cols-4 gap-2">
                          {crewPortfolioImgs.length === 0 ? (
                            <span className="text-xs text-zinc-500 italic col-span-4">No portfolio images chosen</span>
                          ) : (
                            crewPortfolioImgs.slice(0, 4).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt="Portfolio Preview"
                                referrerPolicy="no-referrer"
                                className="w-full h-10 rounded object-cover border border-zinc-900"
                              />
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-900/80 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{crewCity}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-white font-semibold">
                        <Award className="w-3.5 h-3.5 text-yellow-500" />
                        <span>5.0 Rating</span>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* STEP 1: CREATOR PROFILE FORM */}
            {regMode === 'creator_form' && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-8"
              >
                {/* Back button */}
                <div className="lg:col-span-12 flex items-center justify-between">
                  <button 
                    onClick={() => setRegMode('select')}
                    className="flex items-center space-x-2 text-xs font-mono text-zinc-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to selection path</span>
                  </button>
                  <span className="text-xs font-mono text-violet-400">Content Creator Registration</span>
                </div>

                {/* Main form (7 cols) */}
                <form onSubmit={registerCreatorProfile} className="lg:col-span-7 space-y-6">
                     {/* Basic Identifiers */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-violet-400" />
                      <span>Social Platform Context</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Profile Handle / Name</label>
                        <input
                          type="text"
                          required
                          value={creatorName}
                          onChange={(e) => setCreatorName(e.target.value)}
                          placeholder="e.g. Pooja Hegde"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Instagram @Handle</label>
                        <input
                          type="text"
                          required
                          value={creatorHandle}
                          onChange={(e) => setCreatorHandle(e.target.value.startsWith('@') ? e.target.value : `@${e.target.value}`)}
                          placeholder="e.g. @pooja_style"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Primary Niche Category</label>
                        <select
                          value={creatorCategory}
                          onChange={(e) => setCreatorCategory(e.target.value as any)}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all cursor-pointer capitalize font-sans"
                        >
                          <option value="food">Food & Culinary</option>
                          <option value="fashion">Fashion & Lifestyle</option>
                          <option value="tech">Tech & Gadgets</option>
                          <option value="travel">Travel & Explore</option>
                          <option value="comedy">Comedy & Skits</option>
                          <option value="beauty">Beauty & Skincare</option>
                          <option value="fitness">Fitness & Athletics</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Base City / Operations</label>
                        <select
                          value={creatorCity}
                          onChange={(e) => setCreatorCity(e.target.value)}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all cursor-pointer font-sans"
                        >
                          <option value="Mumbai">Mumbai</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Ahmedabad">Ahmedabad</option>
                          <option value="Surat">Surat</option>
                          <option value="Vadodara">Vadodara</option>
                          <option value="Bangalore">Bangalore</option>
                          <option value="Remote">Remote</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Reach / Followers & Engagement */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white">Platform Reach Metrics</h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1">Followers Count</label>
                        <input
                          type="number"
                          required
                          min="1000"
                          max="10000000"
                          value={creatorFollowers}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setCreatorFollowers(val);
                            setCreatorAvgViews(Math.floor(val * 0.45));
                          }}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1">Avg Views per Reel</label>
                        <input
                          type="number"
                          required
                          min="500"
                          max="10000000"
                          value={creatorAvgViews}
                          onChange={(e) => setCreatorAvgViews(Number(e.target.value))}
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1">Engagement Rate (%)</label>
                        <input
                          type="text"
                          required
                          value={creatorEngagement}
                          onChange={(e) => setCreatorEngagement(e.target.value)}
                          placeholder="e.g. 5.2%"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Profile Avatar Selection */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white">Choose Profile Avatar</h3>
                    <div className="flex items-center gap-4">
                      <img 
                        src={creatorAvatar} 
                        alt="Preview Avatar" 
                        className="w-16 h-16 rounded-full object-cover border-2 border-violet-500/30"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-wrap gap-2">
                        {PRESET_AVATARS.map((url, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setCreatorAvatar(url)}
                            className={`w-10 h-10 rounded-full overflow-hidden border-2 cursor-pointer transition-all ${
                              creatorAvatar === url ? 'border-violet-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="preset avatar" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Creator Bio description */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <label className="block text-sm font-display font-semibold tracking-wide text-white">Creator Bio Description</label>
                    <textarea
                      required
                      value={creatorBio}
                      onChange={(e) => setCreatorBio(e.target.value.slice(0, 160))}
                      placeholder="e.g. Fashion stylist sharing daily OOTD aesthetic shorts. Looking to collaborate with innovative brands and cinematic video editors..."
                      rows={3}
                      className="w-full p-4 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all resize-none font-sans font-medium"
                    />
                    <div className="text-right text-[10px] text-zinc-500 font-mono">
                      {creatorBio.length}/160 characters
                    </div>
                  </div>

                  {/* Brand partners selection */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-semibold tracking-wide text-white">Past Brand Collaborations</h3>
                      <p className="text-xs text-zinc-500 font-sans mt-0.5">Pick brands you've collaborated with (both big brands & small local businesses) to display in your active portfolio.</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 border border-zinc-900/60 rounded-xl bg-zinc-950/20">
                      {BRAND_OPTIONS.map((brand) => {
                        const isSelected = creatorSelectedBrands.includes(brand);
                        return (
                          <button
                            key={brand}
                            type="button"
                            onClick={() => toggleCreatorBrand(brand)}
                            className={`px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center space-x-1.5 transition-all duration-200 cursor-pointer ${
                              isSelected
                                ? 'bg-violet-600 border-violet-500 text-white shadow-lg font-sans'
                                : 'bg-zinc-900/40 text-zinc-400 border-zinc-850 hover:border-zinc-750 hover:text-white font-sans'
                            }`}
                          >
                            <span>{brand}</span>
                          </button>
                        );
                      })}
                      
                      {/* Render other custom added brands as toggled buttons */}
                      {creatorSelectedBrands.filter(b => !BRAND_OPTIONS.includes(b)).map((brand) => (
                        <button
                          key={brand}
                          type="button"
                          onClick={() => toggleCreatorBrand(brand)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-xl border flex items-center space-x-1.5 transition-all duration-200 cursor-pointer bg-violet-600 border-violet-500 text-white shadow-lg font-sans"
                        >
                          <span>{brand}</span>
                        </button>
                      ))}
                    </div>

                    {/* Custom Brand Addition (For very small local brands) */}
                    <div className="pt-2">
                      <label className="block text-[11px] font-mono uppercase text-zinc-500 mb-1.5">Can't find a brand? Add any small/local brand directly:</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={customBrandName}
                          onChange={(e) => setCustomBrandName(e.target.value)}
                          placeholder="e.g. Surat Local Saree Boutique"
                          className="flex-1 p-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const trimmed = customBrandName.trim();
                            if (trimmed) {
                              if (!creatorSelectedBrands.includes(trimmed)) {
                                setCreatorSelectedBrands([...creatorSelectedBrands, trimmed]);
                              }
                              setCustomBrandName('');
                            }
                          }}
                          className="px-4 bg-violet-600/20 hover:bg-violet-600/40 border border-violet-500/30 hover:border-violet-500/50 text-xs font-bold text-violet-300 rounded-xl transition-all cursor-pointer"
                        >
                          Add Brand
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Recent reels selection */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <h3 className="text-sm font-display font-semibold tracking-wide text-white">Aesthetic Video Reel Thumbnails</h3>
                    <p className="text-xs text-zinc-500 font-sans">Select visually outstanding aesthetic stills to construct your mock feed grid.</p>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {PRESET_REELS_IMGS.map((url, idx) => {
                        const isSelected = creatorReelsImgs.includes(url);
                        return (
                          <div
                            key={idx}
                            onClick={() => toggleCreatorReelsImg(url)}
                            className={`relative rounded-xl overflow-hidden aspect-[9/12] border cursor-pointer group transition-all ${
                              isSelected ? 'border-violet-500 scale-[1.02] ring-1 ring-violet-500/20' : 'border-zinc-850 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img src={url} alt="Reel preview" className="w-full h-full object-cover transition-transform group-hover:scale-105" referrerPolicy="no-referrer" />
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-violet-600 text-white rounded-full p-0.5 shadow-md">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Most Viral Reel Section */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-semibold tracking-wide text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-pink-400" />
                        <span>Most Viral Reel Feature</span>
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 font-sans">
                        Provide mock details or upload a real Instagram reel link that performed exceptionally well.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Viral Reel Title / Hook</label>
                        <input
                          type="text"
                          value={creatorViralTitle}
                          onChange={(e) => setCreatorViralTitle(e.target.value)}
                          placeholder="e.g. 5 Simple Ways To Style Aesthetic Kurtas"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Viral View Count (e.g. 2.4M views)</label>
                          <input
                            type="text"
                            value={creatorViralViews}
                            onChange={(e) => setCreatorViralViews(e.target.value)}
                            placeholder="e.g. 1.2M views"
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Reel Link / Instagram URL</label>
                          <input
                            type="text"
                            value={creatorViralLink}
                            onChange={(e) => setCreatorViralLink(e.target.value)}
                            placeholder="e.g. instagram.com/reel/C..."
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans font-mono"
                          />
                        </div>
                      </div>

                      {/* Select Cover Thumbnail or paste custom URL */}
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Reel Cover Thumbnail</label>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={creatorViralThumb}
                              onChange={(e) => setCreatorViralThumb(e.target.value)}
                              placeholder="Paste any Unsplash or Instagram image cover URL..."
                              className="flex-1 p-2.5 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-xs text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                            />
                            {creatorViralThumb && (
                              <img 
                                src={creatorViralThumb} 
                                alt="Cover preview" 
                                className="w-10 h-14 rounded object-cover border border-zinc-800"
                                referrerPolicy="no-referrer"
                              />
                            )}
                          </div>
                          
                          {/* Choose from preset option thumbnails */}
                          <div>
                            <p className="text-[10px] text-zinc-500 mb-1.5 font-mono uppercase">Or select a quick premium preset cover:</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                              {PRESET_REELS_IMGS.map((url, idx) => (
                                <button
                                  key={idx}
                                  type="button"
                                  onClick={() => setCreatorViralThumb(url)}
                                  className={`relative w-12 h-16 rounded overflow-hidden border shrink-0 transition-all ${
                                    creatorViralThumb === url ? 'border-pink-500 scale-[1.05]' : 'border-zinc-850 hover:border-zinc-700'
                                  }`}
                                >
                                  <img src={url} alt="Preset cover option" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Featured Recent Project */}
                  <div className="p-6 rounded-2xl border border-zinc-900 bg-zinc-950/40 space-y-4">
                    <div>
                      <h3 className="text-sm font-display font-semibold tracking-wide text-white flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-violet-400" />
                        <span>Add Your Recent Project</span>
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 font-sans">
                        Highlight your finest work to prove your practical capability.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Project Title / Campaign</label>
                        <input
                          type="text"
                          value={creatorProjTitle}
                          onChange={(e) => setCreatorProjTitle(e.target.value)}
                          placeholder="e.g. Nykaa Winter Wear Launch"
                          className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Project Link (Optional)</label>
                          <input
                            type="text"
                            value={creatorProjLink}
                            onChange={(e) => setCreatorProjLink(e.target.value)}
                            placeholder="e.g. instagram.com/p/..."
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-sans font-medium text-zinc-400 mb-1.5">Niche / Goal Achieved</label>
                          <input
                            type="text"
                            value={creatorProjDesc}
                            onChange={(e) => setCreatorProjDesc(e.target.value)}
                            placeholder="e.g. 50K+ Engagement, Viral Reach"
                            className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white border border-zinc-850 focus:border-zinc-750 rounded-xl outline-none transition-all font-sans"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white py-3.5 rounded-2xl font-sans text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer border border-violet-500/20 shadow-xl"
                  >
                    <Sparkles className="w-4 h-4 text-white" />
                    <span>Publish Profile & Join Creator Directory</span>
                  </button>

                </form>

                {/* Preview column (5 cols) */}
                <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
                  <span className="block text-xs font-mono uppercase tracking-wider text-zinc-500">Your Live Preview Card</span>
                  
                  <div className="p-6 rounded-3xl border border-zinc-900 bg-zinc-950/70 backdrop-blur-md relative overflow-hidden flex flex-col justify-between min-h-[380px]">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full pointer-events-none" />

                    <div>
                      {/* Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center space-x-4">
                          <img 
                            src={creatorAvatar} 
                            alt="avatar preview" 
                            className="w-14 h-14 rounded-full object-cover border border-zinc-800"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h3 className="font-display font-extrabold text-lg text-white">
                              {creatorName || 'Pooja Hegde'}
                            </h3>
                            <p className="text-xs text-violet-400 font-bold font-mono">@{creatorHandle.replace('@', '') || 'pooja_style'}</p>
                          </div>
                        </div>

                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-500/10 text-violet-400 border border-violet-500/20 uppercase tracking-wider capitalize">
                          {creatorCategory}
                        </span>
                      </div>

                      {/* Stats Grid */}
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Followers</p>
                          <p className="text-sm font-display font-black text-white">
                            {creatorFollowers >= 1000000 
                              ? `${(creatorFollowers/1000000).toFixed(1)}M` 
                              : `${(creatorFollowers/1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Avg Views</p>
                          <p className="text-sm font-display font-black text-white">
                            {creatorAvgViews >= 1000000 
                              ? `${(creatorAvgViews/1000000).toFixed(1)}M` 
                              : `${(creatorAvgViews/1000).toFixed(0)}K`}
                          </p>
                        </div>
                        <div className="bg-zinc-900/60 p-2.5 rounded-xl border border-zinc-850 text-center">
                          <p className="text-[10px] font-mono text-zinc-500 uppercase">Engagement</p>
                          <p className="text-sm font-display font-black text-white">{creatorEngagement}</p>
                        </div>
                      </div>

                      {/* Bio */}
                      <p className="text-zinc-400 text-xs font-normal leading-relaxed mb-4 italic">
                        "{creatorBio || 'Write an engaging social biography to showcase...'}"
                      </p>

                      {/* Featured Recent Project */}
                      {creatorProjTitle && (
                        <div className="mb-4 p-3 bg-violet-500/5 rounded-xl border border-violet-500/10">
                          <h5 className="text-[9px] font-mono uppercase tracking-wider text-violet-400 mb-1">
                            Recent Project / Campaign
                          </h5>
                          <p className="text-white text-xs font-bold leading-tight">{creatorProjTitle}</p>
                          {creatorProjDesc && (
                            <p className="text-zinc-400 text-[10px] mt-0.5">{creatorProjDesc}</p>
                          )}
                        </div>
                      )}

                      {/* Brand Collaborations */}
                      {creatorSelectedBrands.length > 0 && (
                        <div className="mb-5">
                          <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                            Recent Brand Partners
                          </h5>
                          <div className="flex flex-wrap gap-1.5">
                            {creatorSelectedBrands.map((brand, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 bg-violet-950/10 text-violet-300 border border-violet-950/30 text-[10px] font-medium rounded"
                              >
                                {brand}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Feed preview */}
                      <div>
                        <h5 className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 mb-2">
                          Recent Instagram Reels Feed ({creatorReelsImgs.length})
                        </h5>
                        <div className="grid grid-cols-4 gap-2">
                          {creatorReelsImgs.length === 0 ? (
                            <span className="text-xs text-zinc-500 italic col-span-4">No visuals selected</span>
                          ) : (
                            creatorReelsImgs.slice(0, 4).map((url, i) => (
                              <img
                                key={i}
                                src={url}
                                alt="Instagram Feed"
                                referrerPolicy="no-referrer"
                                className="w-full h-12 rounded object-cover border border-zinc-900"
                              />
                            ))
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Footer */}
                    <div className="border-t border-zinc-900/80 pt-4 mt-6 flex items-center justify-between text-xs text-zinc-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>{creatorCity}</span>
                      </div>

                      <div className="flex items-center space-x-1 text-white font-semibold">
                        <Instagram className="w-3.5 h-3.5 text-violet-400" />
                        <span>Verified Influencer</span>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

          </div>
        )}

      </div>

      {/* MODAL WINDOWS FOR SUBMITTING COLLAB PITCHES */}
      <AnimatePresence>
        {activeJobProposal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveJobProposal(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#0A0A0A] p-6 rounded-2xl shadow-2xl z-50 border border-zinc-900 text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-extrabold text-lg text-white">
                  Pitch Your Crew Quote
                </h3>
                <button
                  id="close-collab-modal"
                  onClick={() => setActiveJobProposal(null)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950/60 p-3 rounded-xl mb-5 text-xs text-zinc-450 border border-zinc-900 flex items-center space-x-3">
                <img
                  src={activeJobProposal.creatorAvatar}
                  alt={activeJobProposal.creatorName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                />
                <div>
                  <p className="font-bold text-white">{activeJobProposal.creatorName}</p>
                  <p className="font-medium text-zinc-400">{activeJobProposal.title}</p>
                </div>
              </div>

              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Your Bid / Quote (e.g., ₹8,500 day rate)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹8,500 flat rate or ₹7,500/day"
                    value={proposalRate}
                    onChange={(e) => setProposalRate(e.target.value)}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Pitch Proposal / Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Explain why you are the perfect fit. Mention your specialized gear, editing software experience, or links to outstanding YouTube videos..."
                    value={proposalPitch}
                    onChange={(e) => setProposalPitch(e.target.value)}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all resize-none text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white text-black hover:bg-zinc-200 py-3 rounded-xl font-sans text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer border border-white"
                >
                  <span>Submit Pitch Proposal</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}

        {activeBrandBrief && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveBrandBrief(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-40 cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="fixed inset-x-6 bottom-6 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-md bg-[#0A0A0A] p-6 rounded-2xl shadow-2xl z-50 border border-zinc-900 text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-extrabold text-lg text-white">
                  Apply for Brand Sponsorship
                </h3>
                <button
                  id="close-collab-modal"
                  onClick={() => setActiveBrandBrief(null)}
                  className="w-8 h-8 rounded-full hover:bg-zinc-900 flex items-center justify-center text-zinc-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-zinc-950/60 p-3 rounded-xl mb-5 text-xs text-zinc-450 border border-zinc-900 flex items-center space-x-3">
                <img
                  src={activeBrandBrief.brandLogo}
                  alt={activeBrandBrief.brandName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                />
                <div>
                  <p className="font-bold text-white">{activeBrandBrief.brandName}</p>
                  <p className="font-medium text-zinc-400">{activeBrandBrief.campaignTitle}</p>
                </div>
              </div>

              <form onSubmit={handleSendProposal} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Your Collaboration Ask (Campaign Budget)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹50,000 flat rate"
                    value={proposalRate}
                    onChange={(e) => setProposalRate(e.target.value)}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-500 mb-2">
                    Pitch Proposal / Message
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe how you will integrate this campaign naturally into your feed. Mention your demographic fit, aesthetic ideas, and active link clicks..."
                    value={proposalPitch}
                    onChange={(e) => setProposalPitch(e.target.value)}
                    className="w-full p-3 bg-zinc-900/40 hover:bg-zinc-900/60 focus:bg-zinc-900/80 text-sm text-white placeholder-zinc-650 border border-zinc-850 focus:border-zinc-700 rounded-xl outline-none transition-all resize-none text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-violet-600 hover:bg-violet-500 text-white py-3 rounded-xl font-sans text-sm font-bold tracking-wide flex items-center justify-center space-x-2 transition-all cursor-pointer border border-violet-500/20"
                >
                  <span>Submit Sponsorship Application</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
