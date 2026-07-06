import { CrewMember, TalentCategory, CreatorProject, SocialCreator } from './types';

export const CATEGORIES: TalentCategory[] = [
  {
    id: 'editing',
    name: 'Video Editors',
    count: 38,
    icon: 'Film',
    popularSkills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Color Grading'],
  },
  {
    id: 'cinematography',
    name: 'Cinematographers',
    count: 32,
    icon: 'Camera',
    popularSkills: ['RED Komodo / FX6', 'Drone Pilot', 'Commercial Lighting', 'Aura Sync'],
  },
  {
    id: 'design',
    name: 'Thumbnail & Graphic Designers',
    count: 24,
    icon: 'Palette',
    popularSkills: ['Photoshop', '3D Blender', 'CTR Optimization', 'Illustrator'],
  },
  {
    id: 'writing',
    name: 'Script & Concept Writers',
    count: 18,
    icon: 'PenTool',
    popularSkills: ['Storyboarding', 'YouTube Hook Design', 'Reels Concepts', 'Copywriting'],
  },
];

// Hand-curated Instagram style elite crew members (25 top profiles)
const HAND_CURATED_CREW: CrewMember[] = [
  {
    id: '1',
    name: 'Aarav Patel',
    role: 'Cinematographer & Drone Operator',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 4.9,
    completedProjects: 128,
    rate: '₹12,000/day',
    availability: 'Available Now',
    skills: ['RED Komodo', 'Drone Pilot', 'Commercial Lighting', 'Cinematography'],
    bio: 'Cinematographer with 6+ years of experience shooting high-end commercial projects, music videos, and travel reels in Gujarat. Certified drone operator. Instagram: @aarav_films',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '2',
    name: 'Priya Shah',
    role: 'Senior Video Editor & Colorist',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Surat',
    rating: 5.0,
    completedProjects: 96,
    rate: '₹8,500/day',
    availability: 'Available Now',
    skills: ['DaVinci Resolve', 'Premiere Pro', 'Color Grading', 'Audio Mixing'],
    bio: 'Specializing in cinematic vlogs, narrative-style reels editing, and commercial Instagram ads. Highly detailed work with rich color profiles. Instagram: @priyashah_edits',
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '3',
    name: 'Rohan Mehta',
    role: 'Videographer & Cinematographer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    location: 'Vadodara',
    rating: 4.8,
    completedProjects: 74,
    rate: '₹9,500/day',
    availability: 'Available Now',
    skills: ['Sony FX6', 'Documentary', 'Music Video', 'Directing'],
    bio: 'Professional videographer and director specialized in corporate films, music videos, and cinematic reels. Expert in studio lighting. Instagram: @rohan_visuals',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '4',
    name: 'Anjali Desai',
    role: 'Creative Photographer & Camera Op',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'Rajkot',
    rating: 4.9,
    completedProjects: 88,
    rate: '₹6,500/day',
    availability: 'Next Week',
    skills: ['Portrait', 'Fashion', 'Lifestyle', 'Studio Lighting'],
    bio: 'Fashion and lifestyle photographer based in Rajkot. Creating stunning visual assets for models, agencies, and regional premium brands. Instagram: @anjali_clicks',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '5',
    name: 'Kabir Vyas',
    role: 'Reels Scriptwriter & Concept Writer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    location: 'Remote',
    rating: 4.9,
    completedProjects: 63,
    rate: '₹4,500/day',
    availability: 'Available Now',
    skills: ['Narrative Hooking', 'Retention Optimization', 'Reels Concepts', 'Deep Research'],
    bio: 'Ex-narrative designer writing highly-engaging educational and viral video scripts. Proven record of scripting reels with 1M+ views. Instagram: @kabir_scribbles',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '6',
    name: 'Hardik Solanki',
    role: 'Lead Cinematographer & Director',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    location: 'Gandhinagar',
    rating: 4.7,
    completedProjects: 52,
    rate: '₹18,000/day',
    availability: 'Available Now',
    skills: ['Sony FX9', 'Gimbal Operator', 'Ad Film Shoots', 'Color Profile setup'],
    bio: 'Professional ad-filmmaker and commercial cinematographer based in Gandhinagar. Specialized in state agency campaigns and brand launch promos. Instagram: @hardik_solanki_films',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '7',
    name: 'Neha Joshi',
    role: 'Thumbnail & Graphic Designer',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 4.9,
    completedProjects: 147,
    rate: '₹2,500/day',
    availability: 'Available Now',
    skills: ['Photoshop', 'Blender 3D', 'High CTR Thumbnails', 'Social Media Branding'],
    bio: 'Helping top creators scale their CTR on YouTube and Instagram with rich 3D style thumbnail cards and creative branding kits. Instagram: @neha_design_studio',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '8',
    name: 'Devam Gandhi',
    role: 'Cinematographer & Lighting Director',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
    location: 'Vadodara',
    rating: 4.9,
    completedProjects: 41,
    rate: '₹14,000/day',
    availability: 'Available Now',
    skills: ['Arri Alexa', 'Commercial Lighting', 'Reels Director', 'Color Match'],
    bio: 'Premium commercial shoot specialist based in Vadodara. Beautiful compositions with exceptional lighting setups. Instagram: @devam_films',
    portfolio: [
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '9',
    name: 'Mansi Trivedi',
    role: 'Graphic & 3D Thumbnail Designer',
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
    location: 'Surat',
    rating: 4.8,
    completedProjects: 112,
    rate: '₹3,000/day',
    availability: 'Available Now',
    skills: ['Blender 3D', 'Digital Art', 'Photoshop Painting', 'CTR Optimization'],
    bio: 'Specialized thumbnail artist creating viral designs for vloggers, gaming channels, and finance creators in Surat. Instagram: @mansi_graphics',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '10',
    name: 'Harshil Mehta',
    role: 'Creative Scriptwriter & Storyboarder',
    avatar: 'https://images.unsplash.com/photo-1489980508314-941910ded1f4?auto=format&fit=crop&w=300&q=80',
    location: 'Rajkot',
    rating: 4.9,
    completedProjects: 55,
    rate: '₹4,000/day',
    availability: 'Available Now',
    skills: ['Storyboarding', 'YouTube SEO', 'Viral Hook Writing', 'Copywriting'],
    bio: 'Passionate concept writer based in Rajkot helping business leaders script narrative threads, mini-documentaries, and snappy reels. Instagram: @harshil_scribes',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '11',
    name: 'Riya Rathod',
    role: 'Creative Video Editor & Motion Artist',
    avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80',
    location: 'Gandhinagar',
    rating: 4.8,
    completedProjects: 79,
    rate: '₹6,800/day',
    availability: 'Next Week',
    skills: ['After Effects', 'Premiere Pro', 'Kinetic Typography', 'Sound Design'],
    bio: 'Bringing static footage to life with custom 2D animations, snappy kinetic typography, and highly synchronized audio effects. Instagram: @riya_renders',
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '12',
    name: 'Yash Patel',
    role: 'Drone & Action Cinematographer',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    location: 'Surat',
    rating: 4.9,
    completedProjects: 64,
    rate: '₹11,500/day',
    availability: 'Available Now',
    skills: ['FPV Drone Pilot', 'GoPro Action Tech', 'Gimbal Rigging', 'Automotive Filming'],
    bio: 'High-energy cinematic footage specialist in Surat. Experienced FPV drone racer, perfect for capturing premium automotive and sports reels. Instagram: @yash_fpv',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '13',
    name: 'Kruti Choksi',
    role: 'Graphic Designer & Thumbnail Specialist',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 4.7,
    completedProjects: 103,
    rate: '₹3,500/day',
    availability: 'Available Now',
    skills: ['Photoshop CS', 'Figma', 'Illustrator Art', 'Aesthetic Eye'],
    bio: 'Dedicated thumbnail designer specializing in lifestyle, educational, and business niches in Ahmedabad. Boosting CTR. Instagram: @kruti_pixels',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '14',
    name: 'Parth Shah',
    role: 'YouTube Scriptwriter & Storyboard Designer',
    avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&w=300&q=80',
    location: 'Vadodara',
    rating: 4.9,
    completedProjects: 82,
    rate: '₹4,800/day',
    availability: 'Next Week',
    skills: ['Storyboard Design', 'Infographics Concept', 'Dialogue Writing', 'Research Analyst'],
    bio: 'Ex-marketing specialist in Vadodara writing thoroughly researched, beautifully structured educational and documentary-style video scripts. Instagram: @parth_scripts',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '15',
    name: 'Shreya Vyas',
    role: 'Video Editor & Cinematic Colorist',
    avatar: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=300&q=80',
    location: 'Rajkot',
    rating: 4.9,
    completedProjects: 72,
    rate: '₹9,200/day',
    availability: 'Available Now',
    skills: ['Color Grading DaVinci', 'HDR Workflow', 'Premiere Pro', 'LUT Creation'],
    bio: 'Providing high-end cinematic looks and color corrections for short-form ad reels, weddings, and short films. Instagram: @shreya_colorist',
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '16',
    name: 'Meet Panchal',
    role: 'Cinematographer & Camera Specialist',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 5.0,
    completedProjects: 110,
    rate: '₹24,000/day',
    availability: 'Available Now',
    skills: ['Sony Venice', 'Anamorphic Lenses', 'Gaffer Technics', 'Feature Film Setup'],
    bio: 'Award-winning cinematographer and director of photography based in Ahmedabad. Best choice for premium brand identity films and music videos. Instagram: @meetpanchal_dp',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '17',
    name: 'Dhruvi Patel',
    role: 'UI/UX & Brand Identity Designer',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Gandhinagar',
    rating: 4.8,
    completedProjects: 65,
    rate: '₹11,000/day',
    availability: 'Next Week',
    skills: ['Figma', 'Illustrator CS', 'Mockup Design', 'Vector Assets'],
    bio: 'Crafting premium digital experiences, social media channel packages, and creative brand profiles in Gandhinagar. Instagram: @dhruvi_brand_co',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '18',
    name: 'Jaymin Raval',
    role: 'Video Editor & VFX Animator',
    avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&w=300&q=80',
    location: 'Remote',
    rating: 4.9,
    completedProjects: 154,
    rate: '₹13,500/day',
    availability: 'Available Now',
    skills: ['After Effects VFX', '3D Tracking', 'Soundscapes', 'Premiere Pro'],
    bio: 'Top-tier motion designer and editor working remotely. Creating hyper-engaging edits with dynamic sound effects and gorgeous visual effects. Instagram: @jaymin_vfx',
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '19',
    name: 'Nirav Modi',
    role: 'Reels & Viral Copywriter & Scriptwriter',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 4.8,
    completedProjects: 93,
    rate: '₹4,200/day',
    availability: 'Available Now',
    skills: ['Insta-Reel Strategy', 'Catchy Hooks', 'Copywriting', 'SEO Optimization'],
    bio: 'Professional content strategist and scriptwriter based in Ahmedabad. Specialized in fast-paced viral reels scripting with deep user psychological triggers. Instagram: @nirav_writes',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '20',
    name: 'Isha Dave',
    role: 'Commercial Photographer & Camera Operator',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80',
    location: 'Vadodara',
    rating: 4.9,
    completedProjects: 78,
    rate: '₹14,500/day',
    availability: 'Next Week',
    skills: ['Sony Alpha R5', 'Studio Lighting', 'Brand Photography', 'Reel Shoots'],
    bio: 'Commercial and promotional content photographer based in Vadodara. Highly recommended for premium boutique and restaurant social media imagery. Instagram: @isha_dave_clicks',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '21',
    name: 'Karan Malhotra',
    role: 'VFX Lead & Cine Editor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 4.9,
    completedProjects: 115,
    rate: '₹12,500/day',
    availability: 'Available Now',
    skills: ['Nuke', 'After Effects VFX', '3D Blender', 'Cinematic Edits'],
    bio: 'Bringing Hollywood-grade visual effects and hyper-engaging cuts to Indian reels and commercial ad campaigns. Instagram: @karan_vfx',
    portfolio: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '22',
    name: 'Meera Rajput',
    role: 'Fashion Videographer & Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    location: 'Surat',
    rating: 4.8,
    completedProjects: 83,
    rate: '₹13,000/day',
    availability: 'Available Now',
    skills: ['Arri Alexa Mini', 'Fashion Lighting', 'Reels Aesthetics', 'Creative Directing'],
    bio: 'Crafting stunning visual layouts and luxury fashion reels for premium brands across Gujarat. Specializing in lifestyle trends. Instagram: @meera_visuals',
    portfolio: [
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '23',
    name: 'Chirag Gajjar',
    role: 'Creative 3D Thumbnail Designer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    location: 'Ahmedabad',
    rating: 5.0,
    completedProjects: 210,
    rate: '₹3,200/day',
    availability: 'Available Now',
    skills: ['Blender 3D', 'Photoshop Painting', 'CTR Optimization', 'Typography'],
    bio: 'Legendary thumbnail designer for major Indian tech and finance creators. Specializing in high click-through rates and gorgeous 3D art. Instagram: @chirag_3d',
    portfolio: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '24',
    name: 'Ananya Iyer',
    role: 'Premium Copywriter & Scriptwriter',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    location: 'Remote',
    rating: 4.9,
    completedProjects: 92,
    rate: '₹4,900/day',
    availability: 'Available Now',
    skills: ['Retention Optimization', 'Educational Hooks', 'Research Analysis', 'Copywriting'],
    bio: 'Scriptwriting partner for startup founders and popular finance influencers. Turning technical topics into viral, snackable reels. Instagram: @ananya_scripts',
    portfolio: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
    ],
  },
  {
    id: '25',
    name: 'Siddharth Vaghela',
    role: 'Lead Gaffer & Camera Operator',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    location: 'Gandhinagar',
    rating: 4.8,
    completedProjects: 66,
    rate: '₹10,500/day',
    availability: 'Available Now',
    skills: ['Sony FX6', 'Studio Lighting', 'Arri Skypanels', 'Gimbal Rigging'],
    bio: 'Professional lighting technician and camera operator based in Gandhinagar. Known for bringing atmospheric depth to commercials and short films. Instagram: @sid_vaghela_lighting',
    portfolio: [
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
      'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
    ],
  }
];

// Lists of names, locations, and assets to programmatically generate 90 more high quality unique crew profiles
const FIRST_NAMES = [
  'Aman', 'Bhavya', 'Chirag', 'Darshan', 'Ekta', 'Falguni', 'Gaurav', 'Hitesh', 'Ishita', 'Jignesh',
  'Kunal', 'Lopa', 'Mahesh', 'Nisha', 'Ojas', 'Pratik', 'Riddhi', 'Sanjay', 'Tushar', 'Umesh',
  'Vimal', 'Wasim', 'Yatin', 'Zubin', 'Aashka', 'Bhumika', 'Chitrang', 'Darshana', 'Hardik', 'Janki',
  'Keyur', 'Maitri', 'Nirav', 'Parth', 'Raj', 'Shruti', 'Tanvi', 'Uday', 'Varun', 'Yash',
  'Aditya', 'Bhavin', 'Deepal', 'Gautam', 'Karan', 'Meera', 'Nitin', 'Pranav', 'Rohan', 'Sneha'
];

const LAST_NAMES = [
  'Patel', 'Shah', 'Mehta', 'Desai', 'Vyas', 'Solanki', 'Joshi', 'Gandhi', 'Trivedi', 'Rathod',
  'Choksi', 'Panchal', 'Raval', 'Dave', 'Sharma', 'Gajjar', 'Vaghela', 'Jadeja', 'Chauhan', 'Parmar',
  'Soni', 'Pandya', 'Thakar', 'Acharya', 'Sanghvi', 'Doshi', 'Kapadia', 'Sanghani', 'Dabhi', 'Maniar'
];

const GUJARAT_CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'];

const AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80'
];

const PORTFOLIO_IMAGES = [
  'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1500485035595-cbe6f645feb1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1626544827763-d516dce335e2?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80'
];

const ROLES_BY_CATEGORY = {
  editing: [
    { role: 'Senior Video Editor', skills: ['Premiere Pro', 'DaVinci Resolve', 'After Effects', 'Color Grading'], bio: 'Highly talented video editor specialized in long form documentaries and cinematic YouTube edits. Focused on retention. Instagram: @[HANDLE]' },
    { role: 'Reels Video Editor & Sound Designer', skills: ['Premiere Pro', 'After Effects', 'Sound Design', 'Kinetic Typography'], bio: 'Specialist in 60-second viral Reels and TikTok edits. Bringing clean pacing, sound effects, and animations. Instagram: @[HANDLE]' },
    { role: 'VFX & Motion Graphics Editor', skills: ['After Effects VFX', 'Cinema 4D', '3D Tracking', 'Motion Design'], bio: 'VFX wizard delivering incredible premium animations, CGI overlays, and cinematic cuts for digital campaigns. Instagram: @[HANDLE]' },
    { role: 'Colorist & DaVinci Specialist', skills: ['DaVinci Resolve', 'Color Grading', 'LUT Design', 'HDR Workflow'], bio: 'Cinematic colorist giving high production value grades to commercials, music videos, and fashion films. Instagram: @[HANDLE]' },
  ],
  cinematography: [
    { role: 'Cinematographer & Camera Specialist', skills: ['Sony FX6', 'Commercial Lighting', 'Aura Sync', 'Gimbal Operator'], bio: 'Professional cinematographer with access to top-tier cinema rigs. Perfect for premium commercial ads and cinematic reels. Instagram: @[HANDLE]' },
    { role: 'Drone Operator & FPV Pilot', skills: ['Drone Pilot', 'FPV Drone Racer', 'Action Camera Tech', 'GoPro Pro'], bio: 'Licensed drone operator delivering jaw-dropping aerial video clips, real-estate tours, and high-speed car chases. Instagram: @[HANDLE]' },
    { role: 'Lead Videographer & Director of Photography', skills: ['RED Komodo', 'Anamorphic Lenses', 'Commercial Lighting', 'Creative Directing'], bio: 'DP specialized in brand promo reels, corporate movies, and luxury lifestyle footage. Complete studio lighting setup. Instagram: @[HANDLE]' },
    { role: 'Cinematographer & Wedding Videographer', skills: ['Sony Alpha R5', 'Gimbal Operator', 'Portrait Lighting', 'Color Profiles'], bio: 'Capturing unforgettable cinematic wedding moments and commercial fashion shoots with aesthetic lens profiles. Instagram: @[HANDLE]' },
  ],
  design: [
    { role: '3D Thumbnail Designer & Artist', skills: ['Photoshop', 'Blender 3D', '3D Modeling', 'CTR Optimization'], bio: 'Creating hyper-realistic 3D Blender rendered thumbnails that boost click-through rates by up to 15%. Instagram: @[HANDLE]' },
    { role: 'YouTube Graphic Artist & Designer', skills: ['Photoshop CS', 'Illustrator', 'CTR Optimization', 'Typography'], bio: 'Elite YouTube and Instagram thumbnail designer. Expert in lighting manipulation and high-impact custom typography. Instagram: @[HANDLE]' },
    { role: 'Social Media Brand Identity Designer', skills: ['Figma', 'Illustrator', 'Social Media Branding', 'Vector Assets'], bio: 'Crafting premium brand kits, channel graphics, logos, and custom templates for content creators. Instagram: @[HANDLE]' },
  ],
  writing: [
    { role: 'Reels Scriptwriter & Storyboarder', skills: ['Reels Concepts', 'Retention Optimization', 'Storyboarding', 'Viral Hook Design'], bio: 'Scriptwriter writing high-retention concepts for Instagram reels. Helping influencers grow from zero to 100k+ followers. Instagram: @[HANDLE]' },
    { role: 'YouTube Storyteller & Scriptwriter', skills: ['Storyboarding', 'YouTube Hook Design', 'Deep Research', 'Dialogue Writing'], bio: 'Research-driven scriptwriter turning complex financial, historical, or scientific topics into captivating video scripts. Instagram: @[HANDLE]' },
    { role: 'Creative Concept & Ad Copywriter', skills: ['Copywriting', 'Ad Campaign Concepts', 'Retention Optimization', 'Storyboarding'], bio: 'Specialized ad script and concept writer helping brands scale social media conversion rates with psychological triggers. Instagram: @[HANDLE]' },
  ]
};

// Procedurally generate exactly 90 more unique items to reach a total of 115 crew members!
const GENERATED_CREW: CrewMember[] = [];
let idCounter = 26;

// Seeded pseudorandom generator to keep results deterministic
let seed = 12345;
function random() {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function getRandomElement<T>(arr: T[]): T {
  const index = Math.floor(random() * arr.length);
  return arr[index];
}

const CATEGORY_KEYS = ['editing', 'cinematography', 'design', 'writing'] as const;

for (let i = 0; i < 90; i++) {
  const catKey = CATEGORY_KEYS[i % CATEGORY_KEYS.length];
  const firstName = getRandomElement(FIRST_NAMES);
  const lastName = getRandomElement(LAST_NAMES);
  const fullName = `${firstName} ${lastName}`;
  
  // Ensure we don't have exact duplicate names in the database
  const nameExists = HAND_CURATED_CREW.some(c => c.name === fullName) || GENERATED_CREW.some(c => c.name === fullName);
  const uniqueName = nameExists ? `${fullName} ${String.fromCharCode(65 + (i % 26))}` : fullName;

  const roleObj = getRandomElement(ROLES_BY_CATEGORY[catKey]);
  const avatar = AVATARS[i % AVATARS.length];
  
  // Cinematography is never remote, others can be Remote or a Gujarat City
  const location = (catKey === 'cinematography') 
    ? getRandomElement(GUJARAT_CITIES) 
    : (random() > 0.45 ? 'Remote' : getRandomElement(GUJARAT_CITIES));

  const rating = parseFloat((4.5 + random() * 0.5).toFixed(1));
  const completedProjects = Math.floor(30 + random() * 150);
  
  // Generate realistic rate ranges in INR (no dollars)
  let rate = '';
  if (catKey === 'editing') {
    // 4,000 to 12,000 per day
    const baseVal = Math.floor(4000 + random() * 8000);
    const rounded = Math.round(baseVal / 500) * 500;
    rate = `₹${rounded.toLocaleString('en-IN')}/day`;
  } else if (catKey === 'cinematography') {
    // 8,000 to 25,000 per day
    const baseVal = Math.floor(8000 + random() * 17000);
    const rounded = Math.round(baseVal / 1000) * 1000;
    rate = `₹${rounded.toLocaleString('en-IN')}/day`;
  } else if (catKey === 'design') {
    // 500 to 4,500 per day
    const baseVal = Math.floor(500 + random() * 4000);
    const rounded = Math.round(baseVal / 250) * 250;
    rate = `₹${rounded.toLocaleString('en-IN')}/day`;
  } else {
    // 1,000 to 7,500 per day
    const baseVal = Math.floor(1000 + random() * 6500);
    const rounded = Math.round(baseVal / 500) * 500;
    rate = `₹${rounded.toLocaleString('en-IN')}/day`;
  }

  const availabilities = ['Available Now', 'Next Week', 'In 2 Weeks'] as const;
  const availability = availabilities[Math.floor(random() * availabilities.length)];

  // Create customized handle and bio
  const handle = `${firstName.toLowerCase()}_${lastName.toLowerCase()}_${Math.floor(random() * 99)}`;
  const bio = roleObj.bio.replace('[HANDLE]', handle);

  // Take 2 randomized portfolio images
  const portfolio = [
    PORTFOLIO_IMAGES[(i) % PORTFOLIO_IMAGES.length],
    PORTFOLIO_IMAGES[(i + 3) % PORTFOLIO_IMAGES.length]
  ];

  GENERATED_CREW.push({
    id: String(idCounter++),
    name: uniqueName,
    role: roleObj.role,
    avatar,
    location,
    rating,
    completedProjects,
    rate,
    availability,
    skills: roleObj.skills,
    bio,
    portfolio
  });
}

export const CREW_MEMBERS: CrewMember[] = [
  ...HAND_CURATED_CREW,
  ...GENERATED_CREW
];

export const CREATOR_PROJECTS: CreatorProject[] = [
  {
    id: 'p1',
    creatorName: 'The Tech Sandbox',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    subscriberCount: '1.4M subscribers',
    title: 'Cinematic Camera Review Shoot',
    description: 'Looking for a DP with access to a RED Raptor or Sony Venice to shoot cinematic camera test footage in industrial locations. Sound design and grading will be handled in-house.',
    budget: '₹20,000 / day',
    duration: '2 Days Shoot',
    requiredRole: 'Cinematographer',
    location: 'Ahmedabad',
  },
  {
    id: 'p2',
    creatorName: 'Aura Travel Docs',
    creatorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    subscriberCount: '450K subscribers',
    title: '15-Minute Patagonia Travel Documentary',
    description: 'Seeking a seasoned documentary video editor to piece together 3TB of cinematic travel footage. Must be experienced in sound design, non-linear storytelling, and slow cinematic pacing.',
    budget: '₹45,000 flat',
    duration: '3 Weeks Delivery',
    requiredRole: 'Video Editor',
    location: 'Remote',
  },
  {
    id: 'p3',
    creatorName: 'Level Up Finance',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    subscriberCount: '2.1M subscribers',
    title: 'Series of 10 Finance Thumbnails',
    description: 'We need high-impact 3D style thumbnails that maintain a serious but clickable aesthetic. Experience in Blender/C4D is a must to create custom finance objects (gold, safe boxes, charts).',
    budget: '₹3,000 / thumbnail',
    duration: 'Ongoing Weekly',
    requiredRole: 'Thumbnail Designer',
    location: 'Remote',
  },
];

// Curated top influencers representing food, fashion, tech, travel, comedy, beauty, fitness
const CURATED_INFLUENCERS: SocialCreator[] = [
  {
    id: 'c1',
    name: 'Kabir Food Tales',
    instagramHandle: 'kabir_foodtales',
    category: 'food',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    followers: 1250000,
    followersStr: '1.2M',
    engagementRate: '5.8%',
    location: 'Ahmedabad',
    recentReels: [
      'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Finding the hidden culinary gems of India. Street food critic, restaurant explorer, and recipe creator. Instagram: @kabir_foodtales',
    averageViews: '450K',
    brandCollaborations: ['Zomato', 'Swiggy', 'Amul']
  },
  {
    id: 'c2',
    name: 'Riya Malhotra',
    instagramHandle: 'riya_malhotra_style',
    category: 'fashion',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    followers: 650000,
    followersStr: '650K',
    engagementRate: '4.2%',
    location: 'Mumbai',
    recentReels: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Your virtual fashion bestie. Everyday style guides, aesthetic transition lookbooks, and fashion hacks. Instagram: @riya_malhotra_style',
    averageViews: '280K',
    brandCollaborations: ['Zara', 'H&M', 'Myntra']
  },
  {
    id: 'c3',
    name: 'Tech Burner Clone',
    instagramHandle: 'tech_bulletin',
    category: 'tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    followers: 2400000,
    followersStr: '2.4M',
    engagementRate: '6.5%',
    location: 'Delhi',
    recentReels: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Coolest gadgets, funny tech reviews, and daily tech life hacks. Keeping tech simple and hilarious! Instagram: @tech_bulletin',
    averageViews: '920K',
    brandCollaborations: ['Samsung', 'OnePlus', 'Intel']
  },
  {
    id: 'c4',
    name: 'Aanya Wanders',
    instagramHandle: 'aanya_wanders',
    category: 'travel',
    avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=300&q=80',
    followers: 480000,
    followersStr: '480K',
    engagementRate: '7.1%',
    location: 'Remote',
    recentReels: [
      'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Exploring the world on a budget. Backpacking itineraries, travel hacks, and offbeat scenic destinations. Instagram: @aanya_wanders',
    averageViews: '180K',
    brandCollaborations: ['MakeMyTrip', 'Airbnb', 'Skybags']
  },
  {
    id: 'c5',
    name: 'Suhail Skits',
    instagramHandle: 'suhail_skits',
    category: 'comedy',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    followers: 1850000,
    followersStr: '1.8M',
    engagementRate: '8.2%',
    location: 'Surat',
    recentReels: [
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1516257984-b1b4d707412e?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Relatable family comedy, school memories, and hilarious regional skits. New videos weekly! Instagram: @suhail_skits',
    averageViews: '750K',
    brandCollaborations: ['Bingo', 'Netflix India', 'Acko']
  },
  {
    id: 'c6',
    name: 'Dhruvi Glow',
    instagramHandle: 'dhruvi_glow',
    category: 'beauty',
    avatar: 'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=300&q=80',
    followers: 220000,
    followersStr: '220K',
    engagementRate: '4.9%',
    location: 'Gandhinagar',
    recentReels: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Honest skincare reviews, easy daily makeup routines, and self-care tips. Glow from within. Instagram: @dhruvi_glow',
    averageViews: '95K',
    brandCollaborations: ['Nykaa', 'Mamaearth', 'Loreal']
  },
  {
    id: 'c7',
    name: 'Fit Coach Vicky',
    instagramHandle: 'fit_vicky_official',
    category: 'fitness',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
    followers: 890000,
    followersStr: '890K',
    engagementRate: '6.0%',
    location: 'Vadodara',
    recentReels: [
      'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80',
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=500&q=80'
    ],
    bio: 'Helping you build a stronger mind and body. Clean diet plans, calisthenics tutorials, and weight loss motivation. Instagram: @fit_vicky_official',
    averageViews: '350K',
    brandCollaborations: ['MyProtein', 'MuscleBlaze', 'Cult.fit']
  }
];

const GEN_CREATOR_FIRST = [
  'Aman', 'Bhavya', 'Chirag', 'Darshan', 'Ekta', 'Falguni', 'Gaurav', 'Hitesh', 'Ishita', 'Jignesh',
  'Kunal', 'Lopa', 'Mahesh', 'Nisha', 'Ojas', 'Pratik', 'Riddhi', 'Sanjay', 'Tushar', 'Umesh',
  'Vimal', 'Wasim', 'Yatin', 'Zubin', 'Aashka', 'Bhumika', 'Chitrang', 'Darshana', 'Hardik', 'Janki',
  'Keyur', 'Maitri', 'Nirav', 'Parth', 'Raj', 'Shruti', 'Tanvi', 'Uday', 'Varun', 'Yash',
  'Aditya', 'Bhavin', 'Deepal', 'Gautam', 'Karan', 'Meera', 'Nitin', 'Pranav', 'Rohan', 'Sneha',
  'Dev', 'Ipsa', 'Kavya', 'Krisha', 'Manan', 'Nehal', 'Ritu', 'Saloni', 'Tapan', 'Vidhi'
];

const GEN_CREATOR_LAST = [
  'Patel', 'Shah', 'Mehta', 'Desai', 'Vyas', 'Solanki', 'Joshi', 'Gandhi', 'Trivedi', 'Rathod',
  'Choksi', 'Panchal', 'Raval', 'Dave', 'Sharma', 'Gajjar', 'Vaghela', 'Jadeja', 'Chauhan', 'Parmar',
  'Soni', 'Pandya', 'Thakar', 'Acharya', 'Sanghvi', 'Doshi', 'Kapadia', 'Sanghani', 'Dabhi', 'Maniar'
];

const GEN_CREATOR_CITIES = ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Remote'];

const GEN_CREATOR_AVATARS = [
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1534751516642-a131fed10495?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=300&q=80',
  'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=300&q=80'
];

const GEN_CREATOR_REELS = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1546054454-aa26e2b734c7?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=500&q=80',
  'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=500&q=80'
];

const TEMPLATE_BIOS = {
  food: [
    'Cooking up daily storms in the kitchen. Traditional recipes and gourmet fusion dishes! Instagram: @[HANDLE]',
    'Street food lover on a mission. Tasting and reviewing the spiciest and most unique street recipes. Instagram: @[HANDLE]',
    'Your guide to premium cafes, bakeries, and high-end restaurant menus. Pure food recommendations. Instagram: @[HANDLE]'
  ],
  fashion: [
    'Aesthetic lookbooks, thrifty styling challenges, and affordable seasonal outfit matching tips! Instagram: @[HANDLE]',
    'Bold street fashion and high-concept cinematic transition reels. Helping you upgrade your styling. Instagram: @[HANDLE]',
    'Minimalist wardrobe styling, accessory pairing guides, and eye-friendly colors. Instagram: @[HANDLE]'
  ],
  tech: [
    'Making tech fun, simple, and snackable. Daily phone unboxings, hidden software tips, and funny reviews. Instagram: @[HANDLE]',
    'AI tool master. Curating and demonstrating the best websites, apps, and extensions to 10x your productivity. Instagram: @[HANDLE]',
    'Future tech and luxury hardware unboxings. Keeping you updated with futuristic gadgets. Instagram: @[HANDLE]'
  ],
  travel: [
    'Backpacking through offbeat villages, historic sites, and scenic mountain trails. Budget-travel guides. Instagram: @[HANDLE]',
    'Luxury travel blogger, boutique resort reviews, and beautiful aesthetic reels from paradise. Instagram: @[HANDLE]',
    'Slowing down to explore local cultures, foods, and storytelling. Travel companion in your feed. Instagram: @[HANDLE]'
  ],
  comedy: [
    'Silly skits, funny parodies of daily life, and highly relatable comedic commentary. Instagram: @[HANDLE]',
    'Reels actor and script writer. Transforming average situations into side-splitting skits. Instagram: @[HANDLE]',
    'Roasting viral trends, sibling struggles, and daily life with a heavy dose of humour. Instagram: @[HANDLE]'
  ],
  beauty: [
    'Glam makeovers, step-by-step wingliner tutorials, and skincare advice for a flawless skin routine. Instagram: @[HANDLE]',
    'No-makeup makeup guides, organic cosmetics reviews, and healthy hair-care secrets. Instagram: @[HANDLE]',
    'Expressive makeup art, colorful festival face paints, and skin wellness habits. Instagram: @[HANDLE]'
  ],
  fitness: [
    'Fat-loss workouts, simple protein recipes, and pure discipline motivation. Gym lover. Instagram: @[HANDLE]',
    'Certified yoga instructor and stretching coach. Helping you build flexibility, posture, and flow. Instagram: @[HANDLE]',
    'Calisthenics specialist. Teaching you how to master pullups, handstands, and bodyweight strength. Instagram: @[HANDLE]'
  ]
};

const BRAND_TEMPLATES = {
  food: ['Zomato', 'Swiggy', 'Amul', 'Maggi', 'Paperboat', 'CocaCola', 'PizzaHut', 'McDonalds'],
  fashion: ['Zara', 'H&M', 'Myntra', 'Ajio', 'Puma', 'Adidas', 'Nike', 'Westside'],
  tech: ['Samsung', 'OnePlus', 'Intel', 'Hp', 'Asus', 'Boat', 'Sony', 'Realme'],
  travel: ['MakeMyTrip', 'Airbnb', 'Skybags', 'Goibibo', 'Yatra', 'Hostelworld', 'TripAdvisor'],
  comedy: ['Bingo', 'Netflix India', 'Acko', 'Amazon Prime', 'Paytm', 'Cred', 'Lenskart', 'Swiggy'],
  beauty: ['Nykaa', 'Mamaearth', 'Loreal', 'Maybelline', 'Plum', 'FacesCanada', 'SugarCosmetics'],
  fitness: ['MyProtein', 'MuscleBlaze', 'Cult.fit', 'Fast&Up', 'Puma', 'Asics', 'Decathlon']
};

const CATEGORIES_LIST = ['food', 'fashion', 'tech', 'travel', 'comedy', 'beauty', 'fitness'] as const;

const GENERATED_INFLUENCERS: SocialCreator[] = [];
let creatorSeed = 54321;

function creatorRandom() {
  const x = Math.sin(creatorSeed++) * 10000;
  return x - Math.floor(x);
}

function getCreatorRandomElement<T>(arr: T[]): T {
  const index = Math.floor(creatorRandom() * arr.length);
  return arr[index];
}

for (let i = 0; i < 100; i++) {
  const category = CATEGORIES_LIST[i % CATEGORIES_LIST.length];
  const firstName = getCreatorRandomElement(GEN_CREATOR_FIRST);
  const lastName = getCreatorRandomElement(GEN_CREATOR_LAST);
  const fullName = `${firstName} ${lastName}`;
  const handle = `${firstName.toLowerCase()}_${category}_${Math.floor(10 + creatorRandom() * 89)}`;

  const roll = creatorRandom();
  let followers = 0;
  let followersStr = '';
  
  if (roll < 0.3) {
    followers = Math.floor(11000 + creatorRandom() * 38000); // 11k-49k
    followersStr = `${parseFloat((followers / 1000).toFixed(1))}K`;
  } else if (roll < 0.6) {
    followers = Math.floor(51000 + creatorRandom() * 48000); // 51k-99k
    followersStr = `${parseFloat((followers / 1000).toFixed(1))}K`;
  } else if (roll < 0.85) {
    followers = Math.floor(101000 + creatorRandom() * 390000); // 101k-491k
    followersStr = `${parseFloat((followers / 1000).toFixed(1))}K`;
  } else if (roll < 0.95) {
    followers = Math.floor(501000 + creatorRandom() * 490000); // 501k-991k
    followersStr = `${parseFloat((followers / 1000).toFixed(1))}K`;
  } else {
    followers = Math.floor(1010000 + creatorRandom() * 2500000); // 1M-3.5M
    const mil = followers / 1000000;
    followersStr = `${mil.toFixed(1)}M`;
  }

  const engagementVal = (3.0 + creatorRandom() * 6.5).toFixed(1);
  const engagementRate = `${engagementVal}%`;
  
  const location = getCreatorRandomElement(GEN_CREATOR_CITIES);
  const avatar = GEN_CREATOR_AVATARS[i % GEN_CREATOR_AVATARS.length];
  
  const bioTemplates = TEMPLATE_BIOS[category];
  const templateBio = getCreatorRandomElement(bioTemplates);
  const bio = templateBio.replace('[HANDLE]', handle);

  const averageViewsVal = Math.floor(followers * (0.15 + creatorRandom() * 0.35));
  let averageViews = '';
  if (averageViewsVal >= 1000000) {
    averageViews = `${(averageViewsVal / 1000000).toFixed(1)}M`;
  } else {
    averageViews = `${Math.floor(averageViewsVal / 1000)}K`;
  }

  const brands = BRAND_TEMPLATES[category];
  const b1 = brands[i % brands.length];
  const b2 = brands[(i + 3) % brands.length];
  const brandCollaborations = b1 === b2 ? [b1] : [b1, b2];

  const recentReels = [
    GEN_CREATOR_REELS[i % GEN_CREATOR_REELS.length],
    GEN_CREATOR_REELS[(i + 4) % GEN_CREATOR_REELS.length]
  ];

  GENERATED_INFLUENCERS.push({
    id: `g_c_${i}`,
    name: fullName,
    instagramHandle: handle,
    category,
    avatar,
    followers,
    followersStr,
    engagementRate,
    location,
    recentReels,
    bio,
    averageViews,
    brandCollaborations
  });
}

export const SOCIAL_CREATORS: SocialCreator[] = [
  ...CURATED_INFLUENCERS,
  ...GENERATED_INFLUENCERS
];
