import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SplashScreen from './components/SplashScreen';
import ContinueScreen from './components/ContinueScreen';
import HireDashboard from './components/HireDashboard';
import CreatorDashboard from './components/CreatorDashboard';
import TalentDashboard from './components/TalentDashboard';
import AgencyDashboard from './components/AgencyDashboard';
import DynamicSmokeBackground from './components/DynamicSmokeBackground';
import ProfessionalSuite from './components/ProfessionalSuite';
import { ScreenState, Role, CrewMember, SocialCreator } from './types';
import { CREW_MEMBERS, SOCIAL_CREATORS } from './data';

export default function App() {
  const [screenState, setScreenState] = useState<ScreenState>('splash');
  const [userRole, setUserRole] = useState<Role | null>(null);
  const [crewMembers, setCrewMembers] = useState<CrewMember[]>(CREW_MEMBERS);
  const [socialCreators, setSocialCreators] = useState<SocialCreator[]>(SOCIAL_CREATORS);

  const handleRoleSelection = (role: Role) => {
    setUserRole(role);
    setScreenState('dashboard');
  };

  const handleBackToSelection = () => {
    setScreenState('continue');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans antialiased selection:bg-white selection:text-black relative overflow-hidden">
      {/* Global premium subtle drift background smoke (patla sa dhua at 60% opacity) */}
      <DynamicSmokeBackground />

      <AnimatePresence mode="wait">
        {screenState === 'splash' && (
          <SplashScreen key="splash" onComplete={() => setScreenState('continue')} />
        )}

        {screenState === 'continue' && (
          <ContinueScreen key="continue" onRoleSelected={handleRoleSelection} />
        )}

        {screenState === 'dashboard' && userRole && (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, scale: 0.99 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.99 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col min-h-screen"
          >
            {/* Global Modern Navigation Header Bar */}
            <header className="border-b border-zinc-900/60 py-4 px-6 bg-[#0A0A0A]/40 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between">
              {/* Logo / Brand */}
              <div 
                className="flex items-center cursor-pointer group"
                onClick={() => setScreenState('continue')}
                title="Return to Welcome Screen"
              >
                <span className="text-sm font-display font-bold tracking-[0.25em] text-white">COLLABLY</span>
              </div>

              {/* Seamless Role Switcher (Apple / Stripe style) */}
              <div className="bg-zinc-900/60 p-1 rounded-full flex items-center space-x-1 border border-zinc-800/60 overflow-x-auto max-w-[280px] sm:max-w-none">
                <button
                  id="switcher-btn-hire"
                  onClick={() => setUserRole('hire')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    userRole === 'hire'
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Hire Crew
                </button>
                <button
                  id="switcher-btn-creator"
                  onClick={() => setUserRole('creator')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    userRole === 'creator'
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Find Creators
                </button>
                <button
                  id="switcher-btn-talent"
                  onClick={() => setUserRole('talent')}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap ${
                    userRole === 'talent'
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/50'
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  Showcase Talent
                </button>
              </div>

              {/* Tagline / Subtitle */}
              <div className="text-xs font-mono text-zinc-500 hidden sm:block">
                Create Together.
              </div>
            </header>

            {/* Render Selected View */}
            <main className="flex-1">
              {userRole === 'hire' && (
                <HireDashboard onBack={handleBackToSelection} crewMembers={crewMembers} />
              )}
              {userRole === 'creator' && (
                <CreatorDashboard onBack={handleBackToSelection} socialCreators={socialCreators} />
              )}
              {userRole === 'agency' && (
                <AgencyDashboard 
                  onBack={handleBackToSelection} 
                  crewMembers={crewMembers} 
                  socialCreators={socialCreators} 
                />
              )}
              {userRole === 'talent' && (
                <TalentDashboard 
                  onBack={handleBackToSelection} 
                  onAddCrewMember={(newCrew) => setCrewMembers(prev => [newCrew, ...prev])}
                  onAddSocialCreator={(newCreator) => setSocialCreators(prev => [newCreator, ...prev])}
                />
              )}
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Required Professional suite containing connection tracking, cookie consent, help & support FAQs desk, privacy policies & toasts */}
      <ProfessionalSuite />
    </div>
  );
}
