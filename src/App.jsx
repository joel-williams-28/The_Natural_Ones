import React, { useState, useEffect } from 'react';

// Fantasy tabletop-inspired website for The Natural Ones Theatre Group
export default function TheNaturalOnesWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    setMenuOpen(false);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div style={styles.container}>
      {/* Parchment texture overlay */}
      <div style={styles.textureOverlay}></div>
      
      {/* Navigation */}
      <nav style={{
        ...styles.nav,
        backgroundColor: scrolled ? 'rgba(26, 15, 8, 0.95)' : 'transparent',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.4)' : 'none'
      }}>
        <div style={styles.navLogo} onClick={() => scrollToSection('home')}>
          {/* TO ADD LOGO: Place logo.png in public/images/ folder */}
          <Logo size={40} />
          <span style={styles.navLogoText}>The Natural Ones</span>
        </div>
        
        <button style={styles.menuToggle} onClick={() => setMenuOpen(!menuOpen)}>
          <span style={styles.menuBar}></span>
          <span style={styles.menuBar}></span>
          <span style={styles.menuBar}></span>
        </button>
        
        <ul style={{
          ...styles.navLinks,
          ...(menuOpen ? styles.navLinksOpen : {})
        }}>
          {['home', 'about', 'show', 'cast', 'support', 'contact'].map((item) => (
            <li key={item}>
              <button
                style={{
                  ...styles.navLink,
                  color: activeSection === item ? '#c9a227' : '#e8dcc4'
                }}
                onClick={() => scrollToSection(item)}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Hero Section */}
      <section id="home" style={styles.hero}>
        <div style={styles.heroContent}>
          <div style={styles.heroD20Container}>
            {/* TO ADD LOGO: Place logo.png in public/images/ folder */}
            <Logo size={180} />
          </div>
          <h1 style={styles.heroTitle}>The Natural Ones</h1>
          <p style={styles.heroSubtitle}>Amateur Theatre with a Critical Hit</p>
          <div style={styles.heroDivider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerDot}>✦</span>
            <span style={styles.dividerLine}></span>
          </div>
          <h2 style={styles.heroShowTitle}>Tabletop Role-Playing Game:</h2>
          <h2 style={styles.heroShowSubtitle}>The Musical!</h2>
          <p style={styles.heroTagline}>"A comedy musical where the dice decide the ending"</p>
          <div style={styles.heroButtons}>
            <button style={styles.primaryButton} onClick={() => scrollToSection('support')}>
              Support Our Kickstarter
            </button>
            <button style={styles.secondaryButton} onClick={() => scrollToSection('show')}>
              Learn More
            </button>
          </div>
        </div>
        <div style={styles.heroScroll}>
          <span style={styles.scrollText}>Scroll to adventure</span>
          <div style={styles.scrollArrow}>↓</div>
        </div>
      </section>

      {/* Hero to About Transition */}
      <div style={styles.heroToSectionFade}></div>

      {/* About Section */}
      <section id="about" style={styles.section}>
        <div style={styles.sectionInner}>
          <SectionHeader title="About Us" subtitle="Roll for Initiative" />
          <div style={styles.aboutGrid}>
            <div style={styles.aboutText}>
              <p style={styles.paragraph}>
                <span style={styles.dropCap}>W</span>elcome, adventurers! The Natural Ones is a Bristol-based 
                amateur theatre group united by our love of tabletop gaming and live performance. 
                Like rolling a natural one on a D20, we embrace the unexpected, the chaotic, and 
                the gloriously imperfect moments that make theatre magical.
              </p>
              <p style={styles.paragraph}>
                Founded by a fellowship of performers, musicians, and dungeon masters, we create 
                original productions that blend the storytelling traditions of theatre with the 
                improvisational spirit of tabletop role-playing games.
              </p>
              <p style={styles.paragraph}>
                Our debut production takes us on an epic quest to the Edinburgh Fringe Festival 2026, 
                and we need your help to get there!
              </p>
            </div>
            <div style={styles.aboutCard}>
              {/* TO ADD GROUP PHOTO: Place group-photo.jpg in public/images/ folder */}
              <GroupPhoto />
              <div style={styles.statBlock}>
                <h3 style={styles.statBlockTitle}>The Natural Ones</h3>
                <div style={styles.statBlockSubtitle}>Amateur Theatre Group</div>
                <div style={styles.statDivider}></div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Founded:</span>
                  <span style={styles.statValue}>Bristol, UK</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Class:</span>
                  <span style={styles.statValue}>Bards & Performers</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Alignment:</span>
                  <span style={styles.statValue}>Chaotic Good</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Mission:</span>
                  <span style={styles.statValue}>Edinburgh Fringe 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show Section */}
      <section id="show" style={styles.sectionAlt}>
        <div style={styles.sectionInner}>
          <SectionHeader title="The Show" subtitle="Our Quest Begins" />
          <div style={styles.showContent}>
            <div style={styles.showPoster}>
              {/* TO ADD POSTER: Place poster.jpg in public/images/ folder */}
              <ShowPoster />
            </div>
            <div style={styles.showDetails}>
              <p style={styles.paragraph}>
                <span style={styles.dropCap}>E</span>ver wondered what happens when the fate of a musical 
                lies in the roll of a dice? Join us for a comedy adventure where anything can happen, 
                and frequently does!
              </p>
              <p style={styles.paragraph}>
                Follow a party of adventurers as they navigate dungeons, dragons, and the chaos of 
                improvisational storytelling. With original songs, memorable characters, and an ending 
                that changes every night, this is theatrical entertainment with replayability!
              </p>
              
              <div style={styles.showInfo}>
                <div style={styles.infoCard}>
                  <span style={styles.infoIcon}>📍</span>
                  <div>
                    <strong style={styles.infoLabel}>Venue</strong>
                    <p style={styles.infoText}>Alma Tavern & Theatre</p>
                    <p style={styles.infoSmall}>18-20 Alma Vale Road, Clifton, Bristol, BS8 2HY</p>
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoIcon}>🗓️</span>
                  <div>
                    <strong style={styles.infoLabel}>Next Performance</strong>
                    <p style={styles.infoText}>Sunday 18th January 2026</p>
                    <p style={styles.infoSmall}>Doors: 17:30 | Runtime: Approx. 1 hour</p>
                  </div>
                </div>
                <div style={styles.infoCard}>
                  <span style={styles.infoIcon}>🎫</span>
                  <div>
                    <strong style={styles.infoLabel}>Tickets</strong>
                    <a href="https://tickettailor.com/events/almatheatrecompany" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       style={styles.ticketLink}>
                      Book Now →
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cast Section */}
      <section id="cast" style={styles.section}>
        <div style={styles.sectionInner}>
          <SectionHeader title="The Party" subtitle="Meet Your Adventurers" />
          <p style={styles.centeredText}>
            Our fellowship of talented performers bring the world of tabletop gaming to life.
          </p>
          <div style={styles.castGrid}>
            {/*
              TO ADD CAST PHOTOS:
              1. Add photos to public/images/cast/ folder
              2. Name them: member1.jpg, member2.jpg, etc.
              3. Update the 'photo' field below with the filename
            */}
            {[
              { name: 'The Bard', role: 'Musical Director', icon: '🎵', photo: 'member1.jpg' },
              { name: 'The Paladin', role: 'Lead Performer', icon: '⚔️', photo: 'member2.jpg' },
              { name: 'The Rogue', role: 'Ensemble', icon: '🗡️', photo: 'member3.jpg' },
              { name: 'The Wizard', role: 'Technical Director', icon: '✨', photo: 'member4.jpg' },
              { name: 'The Ranger', role: 'Stage Manager', icon: '🏹', photo: 'member5.jpg' },
              { name: 'The Cleric', role: 'Producer', icon: '🛡️', photo: 'member6.jpg' },
            ].map((member, index) => (
              <div key={index} style={styles.castCard}>
                <CastPhoto src={`/images/cast/${member.photo}`} fallbackIcon={member.icon} name={member.name} />
                <h3 style={styles.castName}>{member.name}</h3>
                <p style={styles.castRole}>{member.role}</p>
              </div>
            ))}
          </div>
          <p style={styles.castNote}>
            Full cast and creative team to be announced. Check back for updates!
          </p>
        </div>
      </section>

      {/* Support Section */}
      <section id="support" style={styles.sectionHighlight}>
        <div style={styles.sectionInner}>
          <SectionHeader title="Support Our Quest" subtitle="Help Us Reach Edinburgh" light />
          <div style={styles.supportContent}>
            <div style={styles.questScroll}>
              <div style={styles.scrollTop}></div>
              <div style={styles.scrollBody}>
                <h3 style={styles.questTitle}>⚔️ Quest: Edinburgh Fringe 2026 ⚔️</h3>
                <p style={styles.questText}>
                  The Natural Ones seek brave patrons to fund their journey to the legendary 
                  Edinburgh Fringe Festival. Gold (or its modern equivalent) is required for:
                </p>
                <ul style={styles.questList}>
                  <li>🏰 Venue hire at the Fringe</li>
                  <li>🗺️ Travel and accommodation</li>
                  <li>📜 Marketing and promotion</li>
                  <li>🎭 Costumes and props</li>
                  <li>🎵 Musical accompaniment</li>
                </ul>
                <div style={styles.questReward}>
                  <strong>Reward:</strong> The eternal gratitude of a band of theatrical adventurers, 
                  plus exclusive backer perks!
                </div>
              </div>
              <div style={styles.scrollBottom}></div>
            </div>
            
            <div style={styles.fundingProgress}>
              <h3 style={styles.fundingTitle}>Funding Progress</h3>
              <div style={styles.progressBar}>
                <div style={styles.progressFill}></div>
              </div>
              <div style={styles.progressStats}>
                <span>£260 raised</span>
                <span>Goal: £3,000</span>
              </div>
              <p style={styles.fundingDays}>37 days remaining</p>
              <a 
                href="https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.kickstarterButton}
              >
                Back Us on Kickstarter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.section}>
        <div style={styles.sectionInner}>
          <SectionHeader title="Contact" subtitle="Send a Message" />
          <div style={styles.contactContent}>
            <div style={styles.contactInfo}>
              <p style={styles.paragraph}>
                Want to join our party? Have questions about the show? Looking to collaborate? 
                Send us a message via carrier pigeon (or the more reliable methods below).
              </p>
              <div style={styles.socialLinks}>
                <a 
                  href="https://www.facebook.com/groups/naturalonesbristol"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.socialLink}
                >
                  <span style={styles.socialIcon}>📘</span>
                  <span>Facebook Group</span>
                </a>
                <a 
                  href="https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.socialLink}
                >
                  <span style={styles.socialIcon}>🎯</span>
                  <span>Kickstarter</span>
                </a>
              </div>
            </div>
            <form style={styles.contactForm} onSubmit={(e) => e.preventDefault()}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Your Name</label>
                <input type="text" style={styles.formInput} placeholder="Adventurer name..." />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Your Email</label>
                <input type="email" style={styles.formInput} placeholder="your@email.com" />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Message</label>
                <textarea style={styles.formTextarea} rows={5} placeholder="Your message..."></textarea>
              </div>
              <button type="submit" style={styles.submitButton}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <Logo size={50} />
            <span style={styles.footerLogoText}>The Natural Ones</span>
          </div>
          <p style={styles.footerTagline}>Amateur Theatre with a Critical Hit</p>
          <div style={styles.footerDivider}></div>
          <p style={styles.footerCopy}>
            © 2026 The Natural Ones. Bristol, UK. All rights reserved.
          </p>
          <p style={styles.footerNote}>
            "Tabletop Role-Playing Game: The Musical!" written by James A. Coleman, music by Richard Baker.
          </p>
        </div>
      </footer>
    </div>
  );
}

// D20 Icon Component
function D20Icon({ size = 60, animated = false }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      style={animated ? styles.d20Animated : {}}
    >
      <defs>
        <linearGradient id="d20Gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2d5016" />
          <stop offset="100%" stopColor="#1a3009" />
        </linearGradient>
      </defs>
      <polygon 
        points="50,5 95,30 95,70 50,95 5,70 5,30" 
        fill="url(#d20Gradient)" 
        stroke="#c9a227" 
        strokeWidth="2"
      />
      <polygon 
        points="50,5 95,30 50,50 5,30" 
        fill="#3d6b1e" 
        stroke="#c9a227" 
        strokeWidth="1"
        opacity="0.8"
      />
      <polygon 
        points="50,50 95,30 95,70 50,95" 
        fill="#2d5016" 
        stroke="#c9a227" 
        strokeWidth="1"
        opacity="0.9"
      />
      <polygon 
        points="50,50 5,30 5,70 50,95" 
        fill="#1a3009" 
        stroke="#c9a227" 
        strokeWidth="1"
      />
      <text 
        x="50" 
        y="58" 
        textAnchor="middle" 
        fill="#c9a227" 
        fontSize="24" 
        fontFamily="serif"
        fontWeight="bold"
      >
        1
      </text>
    </svg>
  );
}

// Group Photo Component - shows group-photo.jpg if available
function GroupPhoto() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return null; // Don't show anything if no photo
  }

  return (
    <img
      src="/images/group-photo.jpg"
      alt="The Natural Ones Theatre Group"
      style={styles.groupPhoto}
      onError={() => setHasError(true)}
    />
  );
}

// Show Poster Component - shows poster.jpg if available, falls back to text version
function ShowPoster() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div style={styles.posterFrame}>
        <div style={styles.posterInner}>
          <h3 style={styles.posterTitle}>Tabletop Role-Playing Game:</h3>
          <h3 style={styles.posterSubtitle}>The Musical!</h3>
          <div style={styles.posterDivider}></div>
          <p style={styles.posterCredits}>Written by James A. Coleman</p>
          <p style={styles.posterCredits}>Music by Richard Baker</p>
          <div style={styles.posterIcons}>
            <span style={styles.posterIcon}>🎲</span>
            <span style={styles.posterIcon}>🎭</span>
            <span style={styles.posterIcon}>🎵</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.posterFrame}>
      <img
        src="/images/poster.jpg"
        alt="Tabletop Role-Playing Game: The Musical!"
        style={styles.posterImage}
        onError={() => setHasError(true)}
      />
    </div>
  );
}

// Cast Photo Component - shows photo if available, falls back to icon
function CastPhoto({ src, fallbackIcon, name }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div style={styles.castIcon}>{fallbackIcon}</div>;
  }

  return (
    <img
      src={src}
      alt={name}
      style={styles.castPhoto}
      onError={() => setHasError(true)}
    />
  );
}

// Logo Component - shows logo.png if available, falls back to D20Icon
function Logo({ size = 40 }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <D20Icon size={size} />;
  }

  return (
    <img
      src="/images/logo.png"
      alt="The Natural Ones Logo"
      style={{ height: size, width: 'auto' }}
      onError={() => setHasError(true)}
    />
  );
}

// Section Header Component
function SectionHeader({ title, subtitle, light = false }) {
  return (
    <div style={styles.sectionHeader}>
      <span style={{...styles.headerSubtitle, color: light ? '#c9a227' : '#8b6914'}}>{subtitle}</span>
      <h2 style={{...styles.headerTitle, color: light ? '#e8dcc4' : '#2d1810'}}>{title}</h2>
      <div style={styles.headerDivider}>
        <span style={styles.headerLine}></span>
        <span style={{...styles.headerDot, color: light ? '#c9a227' : '#8b6914'}}>⚔</span>
        <span style={styles.headerLine}></span>
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    fontFamily: "'Crimson Text', 'Georgia', serif",
    backgroundColor: '#1a0f08',
    color: '#e8dcc4',
    minHeight: '100vh',
    position: 'relative',
    overflowX: 'hidden',
  },
  textureOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    opacity: 0.03,
    pointerEvents: 'none',
    zIndex: 1000,
  },
  
  // Navigation
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    zIndex: 100,
    transition: 'all 0.3s ease',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  navLogoText: {
    fontFamily: "'Cinzel', serif",
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#c9a227',
    letterSpacing: '2px',
  },
  navLinks: {
    display: 'flex',
    gap: '8px',
    listStyle: 'none',
    margin: 0,
    padding: 0,
  },
  navLinksOpen: {
    display: 'flex',
  },
  navLink: {
    background: 'none',
    border: 'none',
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '1px',
    cursor: 'pointer',
    padding: '8px 16px',
    transition: 'color 0.3s ease',
  },
  menuToggle: {
    display: 'none',
    flexDirection: 'column',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
  },
  menuBar: {
    width: '24px',
    height: '2px',
    backgroundColor: '#c9a227',
  },
  
  // Hero
  hero: {
    minHeight: '107vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 20px 100px 20px',
    background: `
      radial-gradient(ellipse at center, rgba(61, 107, 30, 0.15) 0%, transparent 70%),
      linear-gradient(180deg, #1a0f08 0%, #2d1810 50%, #1a0f08 100%)
    `,
    position: 'relative',
  },
  heroContent: {
    maxWidth: '800px',
  },
  heroD20Container: {
    marginBottom: '24px',
  },
  d20Animated: {
    animation: 'float 3s ease-in-out infinite',
  },
  heroTitle: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: 'clamp(40px, 8vw, 72px)',
    fontWeight: 'bold',
    color: '#c9a227',
    margin: '0 0 8px 0',
    textShadow: '0 4px 20px rgba(201, 162, 39, 0.3)',
    letterSpacing: '4px',
  },
  heroSubtitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: 'clamp(14px, 2vw, 18px)',
    color: '#a08060',
    letterSpacing: '6px',
    textTransform: 'uppercase',
    margin: '0 0 32px 0',
  },
  heroDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    margin: '32px 0',
  },
  dividerLine: {
    width: '100px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
  },
  dividerDot: {
    color: '#c9a227',
    fontSize: '16px',
  },
  heroShowTitle: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: 'clamp(20px, 4vw, 32px)',
    fontWeight: 'normal',
    color: '#e8dcc4',
    margin: '0 0 4px 0',
    letterSpacing: '2px',
  },
  heroShowSubtitle: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: 'clamp(28px, 5vw, 48px)',
    fontWeight: 'bold',
    color: '#3d6b1e',
    margin: '0 0 16px 0',
    textShadow: '2px 2px 0 #1a3009',
  },
  heroTagline: {
    fontStyle: 'italic',
    fontSize: '18px',
    color: '#a08060',
    margin: '0 0 40px 0',
  },
  heroButtons: {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  primaryButton: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '16px 32px',
    backgroundColor: '#3d6b1e',
    color: '#e8dcc4',
    border: '2px solid #c9a227',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  secondaryButton: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '16px 32px',
    backgroundColor: 'transparent',
    color: '#c9a227',
    border: '2px solid #c9a227',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  heroScroll: {
    position: 'absolute',
    bottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  scrollText: {
    fontSize: '12px',
    letterSpacing: '2px',
    color: '#a08060',
    textTransform: 'uppercase',
  },
  scrollArrow: {
    fontSize: '24px',
    color: '#c9a227',
    animation: 'bounce 2s infinite',
  },
  heroToSectionFade: {
    height: '150px',
    background: 'linear-gradient(180deg, #1a0f08 0%, #2d1810 30%, #f5ede0 100%)',
    marginTop: '-1px',
  },

  // Sections
  section: {
    padding: '100px 20px',
    background: 'linear-gradient(180deg, #f5ede0 0%, #e8dcc4 100%)',
    color: '#2d1810',
  },
  sectionAlt: {
    padding: '100px 20px',
    background: `
      url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"),
      linear-gradient(180deg, #e8dcc4 0%, #d4c4a8 100%)
    `,
    color: '#2d1810',
  },
  sectionHighlight: {
    padding: '100px 20px',
    background: `
      radial-gradient(ellipse at center, rgba(61, 107, 30, 0.2) 0%, transparent 60%),
      linear-gradient(180deg, #2d1810 0%, #1a0f08 100%)
    `,
    color: '#e8dcc4',
  },
  sectionInner: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  
  // Section Header
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '60px',
  },
  headerSubtitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '4px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '8px',
  },
  headerTitle: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: 'clamp(32px, 5vw, 48px)',
    fontWeight: 'bold',
    margin: '0 0 16px 0',
  },
  headerDivider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
  },
  headerLine: {
    width: '60px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
  },
  headerDot: {
    fontSize: '20px',
  },
  
  // About Section
  aboutGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '60px',
    alignItems: 'start',
  },
  aboutText: {
    lineHeight: 1.8,
  },
  paragraph: {
    fontSize: '18px',
    marginBottom: '24px',
    lineHeight: 1.8,
  },
  dropCap: {
    float: 'left',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '64px',
    lineHeight: '48px',
    paddingTop: '8px',
    paddingRight: '12px',
    color: '#3d6b1e',
  },
  aboutCard: {
    position: 'sticky',
    top: '100px',
  },
  groupPhoto: {
    width: '100%',
    height: 'auto',
    marginBottom: '24px',
    border: '4px solid #c9a227',
  },
  statBlock: {
    backgroundColor: '#2d1810',
    color: '#e8dcc4',
    padding: '24px',
    border: '4px double #c9a227',
  },
  statBlockTitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '20px',
    color: '#c9a227',
    margin: '0 0 4px 0',
    textAlign: 'center',
  },
  statBlockSubtitle: {
    fontSize: '12px',
    color: '#a08060',
    textAlign: 'center',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  statDivider: {
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '16px 0',
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '8px 0',
    borderBottom: '1px solid rgba(201, 162, 39, 0.2)',
  },
  statLabel: {
    color: '#a08060',
    fontSize: '14px',
  },
  statValue: {
    color: '#e8dcc4',
    fontSize: '14px',
    fontWeight: 'bold',
  },
  
  // Show Section
  showContent: {
    display: 'grid',
    gridTemplateColumns: '350px 1fr',
    gap: '60px',
    alignItems: 'start',
  },
  showPoster: {
    position: 'sticky',
    top: '100px',
  },
  posterFrame: {
    background: 'linear-gradient(135deg, #c9a227, #8b6914)',
    padding: '8px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  posterImage: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  posterInner: {
    background: 'linear-gradient(180deg, #2d1810, #1a0f08)',
    padding: '40px 24px',
    textAlign: 'center',
  },
  posterTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    color: '#e8dcc4',
    margin: '0 0 4px 0',
  },
  posterSubtitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '24px',
    color: '#3d6b1e',
    margin: '0',
    textShadow: '1px 1px 0 #1a3009',
  },
  posterDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '24px 0',
  },
  posterCredits: {
    fontSize: '14px',
    color: '#a08060',
    margin: '8px 0',
    fontStyle: 'italic',
  },
  posterIcons: {
    marginTop: '24px',
    display: 'flex',
    justifyContent: 'center',
    gap: '16px',
    fontSize: '32px',
  },
  posterIcon: {},
  showDetails: {
    lineHeight: 1.8,
  },
  showInfo: {
    marginTop: '40px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  infoCard: {
    display: 'flex',
    gap: '16px',
    padding: '20px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.3)',
  },
  infoIcon: {
    fontSize: '28px',
  },
  infoLabel: {
    display: 'block',
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#8b6914',
    marginBottom: '4px',
  },
  infoText: {
    fontSize: '18px',
    color: '#2d1810',
    margin: '0',
    fontWeight: 'bold',
  },
  infoSmall: {
    fontSize: '14px',
    color: '#6b5b4a',
    margin: '4px 0 0 0',
  },
  ticketLink: {
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    color: '#3d6b1e',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  
  // Cast Section
  centeredText: {
    textAlign: 'center',
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 48px auto',
    color: '#6b5b4a',
  },
  castGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '24px',
  },
  castCard: {
    textAlign: 'center',
    padding: '32px 16px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    transition: 'all 0.3s ease',
  },
  castIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  castPhoto: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #c9a227',
    marginBottom: '16px',
  },
  castName: {
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    color: '#2d1810',
    margin: '0 0 8px 0',
  },
  castRole: {
    fontSize: '14px',
    color: '#8b6914',
    margin: 0,
    letterSpacing: '1px',
  },
  castNote: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#a08060',
    fontStyle: 'italic',
    marginTop: '40px',
  },
  
  // Support Section
  supportContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 350px',
    gap: '60px',
    alignItems: 'start',
  },
  questScroll: {
    position: 'relative',
  },
  scrollTop: {
    height: '30px',
    background: 'linear-gradient(180deg, #8b6914, #c9a227)',
    borderRadius: '4px 4px 0 0',
  },
  scrollBody: {
    backgroundColor: '#f5ede0',
    color: '#2d1810',
    padding: '40px',
  },
  scrollBottom: {
    height: '30px',
    background: 'linear-gradient(0deg, #8b6914, #c9a227)',
    borderRadius: '0 0 4px 4px',
  },
  questTitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '24px',
    textAlign: 'center',
    color: '#2d1810',
    margin: '0 0 24px 0',
  },
  questText: {
    fontSize: '16px',
    lineHeight: 1.8,
    marginBottom: '24px',
  },
  questList: {
    listStyle: 'none',
    padding: 0,
    margin: '0 0 24px 0',
  },
  questReward: {
    backgroundColor: 'rgba(61, 107, 30, 0.1)',
    padding: '16px',
    borderLeft: '4px solid #3d6b1e',
    fontSize: '14px',
  },
  fundingProgress: {
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
    border: '2px solid #c9a227',
    padding: '32px',
    textAlign: 'center',
  },
  fundingTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '20px',
    color: '#c9a227',
    margin: '0 0 24px 0',
  },
  progressBar: {
    height: '20px',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: '10px',
    overflow: 'hidden',
    marginBottom: '16px',
  },
  progressFill: {
    width: '8.7%',
    height: '100%',
    background: 'linear-gradient(90deg, #3d6b1e, #5a9a2c)',
    borderRadius: '10px',
    transition: 'width 1s ease',
  },
  progressStats: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    color: '#a08060',
    marginBottom: '8px',
  },
  fundingDays: {
    fontSize: '14px',
    color: '#c9a227',
    fontWeight: 'bold',
    margin: '0 0 24px 0',
  },
  kickstarterButton: {
    display: 'inline-block',
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '16px 32px',
    backgroundColor: '#3d6b1e',
    color: '#e8dcc4',
    border: '2px solid #c9a227',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  
  // Contact Section
  contactContent: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '60px',
  },
  contactInfo: {},
  socialLinks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '32px',
  },
  socialLink: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.3)',
    color: '#2d1810',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  socialIcon: {
    fontSize: '24px',
  },
  contactForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  formGroup: {},
  formLabel: {
    display: 'block',
    fontSize: '14px',
    letterSpacing: '1px',
    color: '#8b6914',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: "'Crimson Text', Georgia, serif",
    backgroundColor: '#f5ede0',
    border: '2px solid #c9a227',
    color: '#2d1810',
    outline: 'none',
    boxSizing: 'border-box',
  },
  formTextarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: "'Crimson Text', Georgia, serif",
    backgroundColor: '#f5ede0',
    border: '2px solid #c9a227',
    color: '#2d1810',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
  },
  submitButton: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '16px 32px',
    backgroundColor: '#3d6b1e',
    color: '#e8dcc4',
    border: '2px solid #c9a227',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignSelf: 'flex-start',
  },
  
  // Footer
  footer: {
    backgroundColor: '#0d0705',
    padding: '60px 20px',
    textAlign: 'center',
  },
  footerContent: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  footerLogo: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    marginBottom: '8px',
  },
  footerLogoText: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '24px',
    color: '#c9a227',
  },
  footerTagline: {
    fontSize: '14px',
    color: '#a08060',
    letterSpacing: '2px',
    margin: '0 0 24px 0',
  },
  footerDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '24px auto',
    maxWidth: '200px',
  },
  footerCopy: {
    fontSize: '14px',
    color: '#6b5b4a',
    margin: '0 0 8px 0',
  },
  footerNote: {
    fontSize: '12px',
    color: '#4a3f35',
    margin: 0,
    fontStyle: 'italic',
  },
};

// Add CSS animation keyframes via style injection
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&display=swap');
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(3deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }
  
  * {
    box-sizing: border-box;
  }
  
  html {
    scroll-behavior: smooth;
  }
  
  button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(201, 162, 39, 0.3);
  }
  
  a:hover {
    opacity: 0.9;
  }
  
  @media (max-width: 900px) {
    .aboutGrid, .showContent, .supportContent, .contactContent {
      grid-template-columns: 1fr !important;
    }
  }
`;
document.head.appendChild(styleSheet);