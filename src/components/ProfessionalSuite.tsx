import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  FileText, 
  HelpCircle, 
  Wifi, 
  WifiOff, 
  X, 
  CheckCircle, 
  Send, 
  ChevronDown, 
  Sparkles, 
  Info,
  Cookie
} from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function ProfessionalSuite() {
  // State for Cookie Consent
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  
  // State for Modals
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'faq' | null>(null);
  
  // State for Support / Feedback Form
  const [feedbackEmail, setFeedbackEmail] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackCategory, setFeedbackCategory] = useState('bug');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for Network Status
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showNetworkToast, setShowNetworkToast] = useState(false);

  // FAQ Accordion states
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Toast State
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Add toast function
  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Check Cookie Acceptance on Mount
  useEffect(() => {
    const consent = localStorage.getItem('collably-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => {
        setShowCookieBanner(true);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Handle Online/Offline Status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowNetworkToast(true);
      addToast('Connected to network. Live sync active.', 'success');
      setTimeout(() => setShowNetworkToast(false), 5000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowNetworkToast(true);
      addToast('Working Offline. Some media may be cached.', 'info');
      setTimeout(() => setShowNetworkToast(false), 5000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleAcceptCookies = (all: boolean) => {
    localStorage.setItem('collably-cookie-consent', all ? 'accepted-all' : 'accepted-essential');
    setShowCookieBanner(false);
    addToast(all ? 'All preferences saved successfully!' : 'Essential security cookies active.', 'success');
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackEmail || !feedbackMessage) {
      addToast('Please fill out all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    // Simulate API database write
    setTimeout(() => {
      setIsSubmitting(false);
      setFeedbackSubmitted(true);
      addToast('Your feedback has been logged securely.', 'success');
      
      // Reset form after a small delay
      setTimeout(() => {
        setFeedbackEmail('');
        setFeedbackMessage('');
        setFeedbackSubmitted(false);
        setActiveModal(null);
      }, 2500);
    }, 1500);
  };

  const faqData = [
    {
      q: "How does Collably match Crew & Creators?",
      a: "Collably uses a secure matching framework based on skill sets, technical gear compatibility, direct physical region checks, and historical production rates. This ensures creators get the exact talent needed without unnecessary negotiation loops."
    },
    {
      q: "Is there a platform fee for hiring?",
      a: "We charge a minor flat administrative processing rate of 3.5% on verified transactions. This is used entirely to support active escrow verification, contract signatures, and security checks."
    },
    {
      q: "How are intellectual property (IP) rights managed?",
      a: "Every agreement processed through the Collably Dashboard automatically generates a legally compliant smart template. By default, full commercial distribution rights transfer to the hiring entity upon successful payout verification."
    },
    {
      q: "Can I use the application fully offline?",
      a: "Yes! Collably includes automated local databases. All search indexes, profile details, drafts, and submissions are stored directly on your device. Changes will synchronize automatically the instant your network connection returns."
    }
  ];

  return (
    <>
      {/* 1. System Toasts Container */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-2 max-w-sm pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="pointer-events-auto flex items-center gap-3 bg-zinc-900/95 backdrop-blur-md border border-zinc-800/80 p-4 rounded-xl shadow-2xl shadow-black/60 text-xs text-white"
            >
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-sky-400 shrink-0" />}
              {toast.type === 'error' && <X className="w-4 h-4 text-rose-400 shrink-0" />}
              <span>{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 2. Network Status Indicator (Top Floating Pill) */}
      <AnimatePresence>
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-rose-950/90 border border-rose-800 text-rose-200 px-4 py-2 rounded-full text-xs font-semibold shadow-xl backdrop-blur-md"
          >
            <WifiOff className="w-4 h-4 animate-pulse text-rose-400" />
            <span>Offline Mode Active &bull; Secure Local Sandbox</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Floating Support & FAQ Help Button */}
      <div className="fixed bottom-6 right-6 z-45 flex items-center gap-2">
        {/* Connection status dot */}
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800 px-3 py-1.5 rounded-full text-[10px] text-zinc-400 select-none backdrop-blur">
          <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-rose-500 animate-pulse'}`} />
          <span className="font-semibold">{isOnline ? 'Cloud Sync Active' : 'Offline'}</span>
        </div>

        <button
          onClick={() => setActiveModal('faq')}
          className="bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700/80 p-3 rounded-full text-white cursor-pointer shadow-lg transition-all duration-300 flex items-center gap-2 group hover:scale-105 active:scale-95"
          title="Help & Support Desk"
        >
          <HelpCircle className="w-4 h-4 text-zinc-300 group-hover:text-amber-400 transition-colors" />
          <span className="text-xs font-semibold pr-1 hidden sm:inline">Help &amp; FAQs</span>
        </button>
      </div>

      {/* 4. Professional Compliance Cookie Consent Banner */}
      <AnimatePresence>
        {showCookieBanner && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200, delay: 0.5 }}
            className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md bg-zinc-950/95 backdrop-blur-md border border-zinc-850 p-5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-40"
          >
            <div className="flex gap-3 items-start">
              <div className="bg-amber-500/10 border border-amber-500/20 p-2 rounded-xl text-amber-400 shrink-0">
                <Cookie className="w-5 h-5" />
              </div>
              <div className="space-y-2">
                <h4 className="text-sm font-semibold tracking-wide text-white">Privacy Preferences</h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  We use cookies and encrypted local state to optimize your agency matching, secure portfolio uploads, and maintain persistent role settings safely.
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] text-zinc-500">
                  <button 
                    onClick={() => setActiveModal('privacy')} 
                    className="hover:text-white underline transition-colors"
                  >
                    Privacy Policy
                  </button>
                  <span>&bull;</span>
                  <button 
                    onClick={() => setActiveModal('terms')} 
                    className="hover:text-white underline transition-colors"
                  >
                    Platform Agreement
                  </button>
                </div>
                <div className="flex items-center gap-2 pt-3">
                  <button
                    onClick={() => handleAcceptCookies(true)}
                    className="flex-1 bg-zinc-800 hover:bg-white hover:text-black border border-zinc-700/60 hover:border-transparent text-white py-2 rounded-xl text-xs font-semibold transition-all duration-300 cursor-pointer"
                  >
                    Accept All
                  </button>
                  <button
                    onClick={() => handleAcceptCookies(false)}
                    className="text-zinc-400 hover:text-white px-3 py-2 rounded-xl text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    Strictly Essential
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. Clean Professional Modals Controller (FAQ, Privacy, Terms) */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-850 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-900/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeModal === 'faq' && <HelpCircle className="w-5 h-5 text-amber-400" />}
                  {activeModal === 'privacy' && <Shield className="w-5 h-5 text-emerald-400" />}
                  {activeModal === 'terms' && <FileText className="w-5 h-5 text-sky-400" />}
                  
                  <span className="font-semibold text-sm tracking-wide text-white uppercase font-sans">
                    {activeModal === 'faq' && 'Help & FAQ Desk'}
                    {activeModal === 'privacy' && 'Privacy & Compliance Standard'}
                    {activeModal === 'terms' && 'Platform Terms of Service'}
                  </span>
                </div>

                <button
                  onClick={() => setActiveModal(null)}
                  className="p-1.5 bg-zinc-900/60 border border-zinc-800 rounded-lg text-zinc-400 hover:text-white cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm text-zinc-300 leading-relaxed max-h-[60vh]">
                {activeModal === 'faq' && (
                  <div className="space-y-5">
                    {/* Interactive FAQs Accordion */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                        Frequently Asked Questions
                      </h4>
                      {faqData.map((item, idx) => (
                        <div 
                          key={idx}
                          className="border border-zinc-900 rounded-xl overflow-hidden transition-all duration-300"
                        >
                          <button
                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                            className="w-full flex items-center justify-between p-4 bg-zinc-900/30 hover:bg-zinc-900/60 text-left text-xs font-medium text-white transition-colors"
                          >
                            <span>{item.q}</span>
                            <ChevronDown className={`w-4 h-4 text-zinc-550 transition-transform duration-300 ${openFaq === idx ? 'rotate-180' : ''}`} />
                          </button>
                          
                          <AnimatePresence initial={false}>
                            {openFaq === idx && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <p className="p-4 bg-zinc-900/10 text-zinc-400 text-xs border-t border-zinc-900/60 leading-relaxed">
                                  {item.a}
                                </p>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>

                    {/* Contact/Feedback Form block */}
                    <div className="border-t border-zinc-900 pt-6">
                      <h4 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5 mb-3">
                        <Send className="w-3.5 h-3.5 text-sky-400" />
                        Submit a Ticket / Support Request
                      </h4>
                      
                      {feedbackSubmitted ? (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="p-5 bg-emerald-950/20 border border-emerald-900 rounded-2xl flex flex-col items-center text-center space-y-2"
                        >
                          <CheckCircle className="w-8 h-8 text-emerald-400 animate-bounce" />
                          <h5 className="text-xs font-bold text-white uppercase tracking-wider">Ticket Logged</h5>
                          <p className="text-[11px] text-zinc-400 max-w-sm">
                            We have queued your support message. A designated platform manager will follow up via your email within 2 hours.
                          </p>
                        </motion.div>
                      ) : (
                        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-1">
                              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                                Email Address <span className="text-rose-500">*</span>
                              </label>
                              <input
                                type="email"
                                required
                                value={feedbackEmail}
                                onChange={(e) => setFeedbackEmail(e.target.value)}
                                className="w-full p-3 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 text-xs text-white rounded-xl outline-none transition-all"
                                placeholder="name@domain.com"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                                Ticket Category
                              </label>
                              <select
                                value={feedbackCategory}
                                onChange={(e) => setFeedbackCategory(e.target.value)}
                                className="w-full p-3 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 text-xs text-white rounded-xl outline-none transition-all cursor-pointer"
                              >
                                <option value="bug">Technical Issue / Bug</option>
                                <option value="billing">Hiring &amp; Escrow Payments</option>
                                <option value="partnership">Agency Partnerships</option>
                                <option value="feedback">Product Improvement Idea</option>
                              </select>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-wider">
                              Describe your inquiry <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={feedbackMessage}
                              onChange={(e) => setFeedbackMessage(e.target.value)}
                              className="w-full p-3 bg-zinc-900 border border-zinc-850 focus:border-zinc-700 text-xs text-white rounded-xl outline-none transition-all resize-none leading-relaxed"
                              placeholder="Write your issue details here..."
                            />
                          </div>

                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-zinc-800 hover:bg-white hover:text-black border border-zinc-700 hover:border-transparent py-3 text-xs font-bold text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-55"
                          >
                            {isSubmitting ? (
                              <span className="w-4 h-4 border-2 border-zinc-400 border-t-white rounded-full animate-spin" />
                            ) : (
                              <>
                                <Send className="w-3.5 h-3.5" />
                                <span>Dispatch Safe Ticket</span>
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                )}

                {activeModal === 'privacy' && (
                  <div className="space-y-4 text-xs leading-relaxed text-zinc-400">
                    <p className="text-white font-medium text-xs">Last Updated: July 2026</p>
                    <p>
                      At Collably, we prioritize the secure sandboxing of user portfolios, active rates, and agency interactions. This Privacy Standard details how the application maintains compliance across secure decentralized local indexes.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">1. Data Sovereignty</h5>
                    <p>
                      All content, profiles, social statistics, and drafts of campaigns you enter in this interface are stored with high durability using advanced secure Client-Side Sandboxes (localStorage and indexed storage). We do not transmit clear-text API data without specific encrypted authorization headers.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">2. Social Integration Safeguards</h5>
                    <p>
                      Creator analytics (such as follower counts, engagement stats, and OOTD video views) are synchronized via official aggregated APIs. No private Instagram/YouTube account tokens are read or persisted at any time.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">3. Security Auditing</h5>
                    <p>
                      Our user-to-user marketplace escrow pipelines are audited on a bi-weekly cycle to shield against arbitrary malicious actions or balance manipulation attempts. All escrow actions are stored under cryptographic seals.
                    </p>
                  </div>
                )}

                {activeModal === 'terms' && (
                  <div className="space-y-4 text-xs leading-relaxed text-zinc-400">
                    <p className="text-white font-medium text-xs">Effective: July 2026</p>
                    <p>
                      By utilizing the Collably Creator Matching Suite, you agree to comply with the terms of our decentralised talent-exchange.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">1. Creator Standard</h5>
                    <p>
                      All talent registers (whether displaying cinematography, social styling, styling rates, or video editing credentials) must provide authentic portfolio artifacts and references. False representations are subject to immediate platform suspension.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">2. Escrow &amp; Releases</h5>
                    <p>
                      Agency briefs and hiring agreements require full capital reservation inside the platform escrows prior to the launch of creator deliverables. Payouts are safely dispatched within 24 hours of successful submission review.
                    </p>
                    <h5 className="font-semibold text-white uppercase text-[10px] tracking-widest mt-4">3. Limitation of Liability</h5>
                    <p>
                      Collably serves strictly as a zero-negotiation discovery portal. All final contracts are governed directly between the respective hiring entity and the freelance talent.
                    </p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 bg-zinc-900/40 border-t border-zinc-900/80 flex justify-end">
                <button
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-xs text-white border border-zinc-800 hover:border-zinc-700 rounded-xl transition-all cursor-pointer font-semibold"
                >
                  Close Document
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
