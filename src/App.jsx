import React, { useState, useEffect, useRef } from 'react';

// Show data for the carousel - Two shows
// Images: Place poster01.jpg, scroll01.jpg, poster02.jpg, scroll02.jpg, etc. in public/images/
// Show data for the carousel - Three distinct shows
// Images: Place poster01.jpg, scroll01.png, poster02.jpg, scroll02.png, etc. in public/images/
const showsData = [
  {
    id: 1,
    title: "Tabletop Role-Playing Game: The Musical!",
    poster: "/images/poster01.jpg",
    hasRealPoster: true,
    scrollImage: "/images/Scroll01.png",
    hasScrollImage: true,
    venue: "To Be Announced",
    address: "",
    date: "To Be Announced",
    doors: "",
    runtime: "",
    ticketUrl: "#",
    description: "A comedy adventure where the dice decide the ending!",
    tagline: "Where the dice decide the ending"
  },
  {
    id: 2,
    title: "The Dungeon Master's Lament",
    poster: "/images/poster02.jpg",
    hasRealPoster: true,
    cardWidth: 660,
    scrollImage: "/images/Scroll02.png",
    hasScrollImage: true,
    venue: "Unicorn Theatre",
    address: "18 Thames Street, Abingdon-on-Thames, OX14 3HZ",
    addressUrl: "https://www.google.co.uk/maps/place/Unicorn+Theatre/@51.6697211,-1.27998,18.5z/data=!4m6!3m5!1s0x4876b884ceab4109:0xc4267bf292c4aa58!8m2!3d51.6696807!4d-1.2789359!16s%2Fg%2F1ts2zs8m?entry=ttu&g_ep=EgoyMDI2MDIwNC4wIKXMDSoASAFQAw%3D%3D",
    date: "Friday 20 February 2026\nSaturday 21 February 2026",
    doors: "19:00",
    runtime: "Approx. 2hrs - incl. interval",
    ticketUrl: "https://www.ticketsource.co.uk/whats-on/abingdon/unicorn-theatre/mystery-at-murderingham-manor-and-more/e-kqamxo",
    description: "A tale of one DM's struggle against the chaos of their party.",
    tagline: "One DM. Five players. Infinite chaos."
  }
];

// Fantasy tabletop-inspired website for The Natural Ones Theatre Group
export default function TheNaturalOnesWebsite() {
  const [activeSection, setActiveSection] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [kickstarterData, setKickstarterData] = useState({
    pledged: null,
    goal: null,
    daysRemaining: null,
    backers: null,
    percentFunded: null,
    isLive: null,
    isSuccessful: null,
    state: 'loading'
  });
  const [kickstarterLoading, setKickstarterLoading] = useState(true);
  const [kickstarterError, setKickstarterError] = useState(false);
  const [formStatus, setFormStatus] = useState('idle'); // idle | sending | success | error

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    const form = e.target;
    const formData = new URLSearchParams({
      'form-name': 'contact',
      name: form.elements.name.value,
      email: form.elements.email.value,
      message: form.elements.message.value,
      mailing_list: form.elements.mailing_list.checked ? 'yes' : 'no',
    });
    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString(),
      });
      if (!res.ok) throw new Error('Form submission failed');
      setFormStatus('success');
      form.reset();
    } catch {
      setFormStatus('error');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = ['home', 'about', 'show', 'cast', 'support', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-50% 0px -50% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Fetch Kickstarter data
  useEffect(() => {
    const fetchKickstarterData = async () => {
      setKickstarterLoading(true);
      setKickstarterError(false);

      try {
        const response = await fetch('/.netlify/functions/kickstarter');
        if (response.ok) {
          const data = await response.json();
          if (data.error) {
            setKickstarterError(true);
          }
          setKickstarterData({
            pledged: data.pledged,
            goal: data.goal,
            daysRemaining: data.daysRemaining,
            backers: data.backers,
            percentFunded: data.percentFunded || (data.pledged && data.goal ? ((data.pledged / data.goal) * 100) : null),
            isLive: data.isLive,
            isSuccessful: data.isSuccessful,
            state: data.state || 'unknown'
          });
        } else {
          setKickstarterError(true);
        }
      } catch (error) {
        console.error('Failed to fetch Kickstarter data:', error);
        setKickstarterError(true);
      } finally {
        setKickstarterLoading(false);
      }
    };

    fetchKickstarterData();

    // Refresh data every 5 minutes while page is open
    const interval = setInterval(fetchKickstarterData, 5 * 60 * 1000);
    return () => clearInterval(interval);
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
                className="nav-link-btn"
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
          <div style={styles.heroDivider}>
            <span style={styles.dividerLine}></span>
            <span style={{...styles.dividerDot, color: '#c9a227', fontFamily: "'Vatican Light', serif", fontSize: '32px'}}>&</span>
            <span style={styles.dividerLine}></span>
          </div>
          <h2 style={{...styles.heroShowTitle, fontFamily: "'Poiret One', sans-serif"}}>Mystery at Murderingham Manor...</h2>
          <h2 style={{...styles.heroShowSubtitle, fontFamily: "'Caveat Brush', cursive"}}>And More...</h2>
          <div style={styles.heroDivider}>
            <span style={styles.dividerLine}></span>
            <span style={styles.dividerDot}>✦</span>
            <span style={styles.dividerLine}></span>
          </div>
          <div style={styles.heroButtons}>
            <button style={styles.primaryButton} onClick={() => scrollToSection('about')}>
              Scroll To Adventure
            </button>
            <div style={styles.scrollArrow}>↓</div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" style={styles.sectionAbout}>
        <div style={styles.sectionInner}>
          <SectionHeader title="About Us" subtitle="We Rolled a One. We Kept Playing." />
          <div style={styles.aboutGrid}>
            <div style={styles.aboutText}>
              <p style={{...styles.paragraph, marginBottom: '40px'}}>
                <span style={styles.dropCap}>E</span>very great adventure starts somewhere. Ours started with
                a name that didn't stick.
              </p>
              <p style={styles.paragraph}>
                The Natural Ones began life as <span style={{fontStyle: 'italic'}}>A Box of Frogs</span> — which,
                in hindsight, was less a name and more a description of our rehearsal process. After a few
                iterations (none of which we'll be sharing, for legal and dignity reasons), we landed
                on <strong>The Natural Ones</strong>: a nod to the most feared roll in tabletop gaming, the
                dreaded natural one on a D20. For the uninitiated, a natural one means total, catastrophic
                failure. Your sword shatters. Your spell backfires. You fall off the bridge you were standing
                perfectly still on.
              </p>
              <p style={styles.paragraph}>
                We thought it suited us rather well.
              </p>
              <p style={styles.paragraph}>
                <strong>The Natural Ones</strong> are an Oxfordshire-based performing arts group made up of a
                brilliant selection of weirdos who all happen to be brilliant singers and actors
                too. We're dedicated to original comedy theatre — the kind of shows where the scripts are new,
                the laughs are genuine, and the props budget is optimistic at best.
              </p>
              <p style={styles.paragraph}>
                Our founder, <strong>James A. Coleman</strong> — scriptwriter, lyricist, director and
                producer — is both a lifelong musical theatre obsessive and an irredeemable nerd, which really
                made this whole thing an inevitability. After years of performing, crewing, writing and directing
                amateur productions across the country, he discovered tabletop role-playing games in his early
                20s and immediately thought: <span style={{fontStyle: 'italic'}}>this needs to be a
                musical.</span> Six years of development later — which is either dedication or stubbornness
                depending on who you ask — <span style={{fontStyle: 'italic'}}>Tabletop Role-Playing Game: The Musical!</span> was born.
              </p>
              <p style={styles.paragraph}>
                The music comes from <strong>Richard Baker</strong>, an Olivier Award-nominated composer whose
                work includes <span style={{fontStyle: 'italic'}}>Peter Pan Goes Wrong</span> (West End, Broadway,
                and BBC), <span style={{fontStyle: 'italic'}}>Hadestown</span>, and Mischief
                Theatre's <span style={{fontStyle: 'italic'}}>Mischief Movie Night</span>. James has known Richard
                for many years and, knowing he was both extraordinarily talented and unlikely to say no, asked
                him to bring the show's mad songs and scenes to life.
              </p>
              <p style={styles.paragraph}>
                First assembled to perform <span style={{fontStyle: 'italic'}}>TTRPG:TM</span> in Abingdon in
                2025, the group launched with a sold-out debut in January of that year before taking the show to
                the Cheltenham Fringe Festival and performing extracts at MCM London Comic Con — where we had a
                fantastic time and still managed to feel pretty out of place despite the surroundings. We're currently
                preparing our newest comedy, <span style={{fontStyle: 'italic'}}>Mystery at Murderingham
                Manor</span>, while also performing <span style={{fontStyle: 'italic'}}>TTRPG:TM</span> in
                venues across the country and working towards our next great quest: the Edinburgh Fringe Festival
                in 2026.
              </p>
              <p style={styles.paragraph}>
                We're a group of fledgling artists with big ambitions, questionable judgement, and an unreasonable
                fondness for puns. If that sounds like your sort of thing, we'd love to have you along for the ride.
              </p>
              <div style={styles.aboutDivider}></div>
              <div
                style={styles.meetCastLink}
                onClick={() => scrollToSection('cast')}
              >
                <span style={{marginRight: '8px'}}>&#8594;</span> Meet the Creatives & Cast
              </div>
            </div>
            <div style={styles.aboutCard}>
              {/* TO ADD GROUP PHOTO: Place group-photo.jpg in public/images/ folder */}
              <GroupPhoto />
              <div style={styles.statBlock}>
                <h3 style={styles.statBlockTitle}>The Natural Ones</h3>
                <div style={styles.statBlockSubtitle}>Performing Arts Group</div>
                <div style={styles.statDivider}></div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Founded:</span>
                  <span style={styles.statValue}>Oxfordshire, UK</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Class:</span>
                  <span style={styles.statValue}>Bards & Nerds</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Alignment:</span>
                  <span style={styles.statValue}>Chaotic Creative</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Props Budget:</span>
                  <span style={styles.statValue}>Optimistic</span>
                </div>
                <div style={styles.statRow}>
                  <span style={styles.statLabel}>Quest:</span>
                  <span style={styles.statValue}>Edinburgh Fringe 2026</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Show Section */}
      <section id="show" style={styles.sectionShow}>
        <div style={styles.sectionInner}>
          <SectionHeader title="The Shows" subtitle="Our Quest Begins" />
          <p style={styles.centeredText}>
            Click on a poster to reveal performance details
          </p>
          <ShowCarousel shows={showsData} />
        </div>
      </section>

      {/* Cast Section */}
      <section id="cast" style={styles.sectionCast}>
        <div style={styles.sectionInner}>
          <SectionHeader title="The Party" subtitle="Meet Your Adventurers" light />

          {/* The Creatives */}
          <h3 style={styles.castSubheading}>The Creatives</h3>
          <div className="creatives-grid-row" style={styles.creativesGridRow}>
            {[
              { name: 'Richard Baker', role: 'Composer', icon: '🎵', photo: 'member1.jpg', bio: 'Bio coming soon.', gridColumn: '1 / 3' },
              { name: 'James A. Coleman', role: 'Writer & Lyricist', icon: '📜', photo: 'member2.jpg', bio: 'Bio coming soon.', gridColumn: '3' },
              { name: 'Emma Coleman-Williams', role: 'Producer / Company Secretary', icon: '🎭', photo: 'member3.jpg', bio: 'Bio coming soon.', gridColumn: '4 / 6' },
            ].map((member, index) => (
              <div key={index} className="cast-card-clean" style={{...styles.castCardClean, width: 'auto', gridColumn: member.gridColumn, justifySelf: 'center'}} onClick={() => setSelectedMember(member)}>
                <CastPhoto src={`/images/cast/${member.photo}`} fallbackIcon={member.icon} name={member.name} />
                <h3 style={styles.castName}>{member.name}</h3>
                {member.role && <p style={styles.castRole}>{member.role}</p>}
              </div>
            ))}
          </div>

          {/* The Cast ~ Past & Present */}
          <h3 style={styles.castSubheading}>The Cast ~ Past & Present</h3>
          {/* Row 1: 5 members */}
          <div className="cast-grid-row" style={styles.castGridRow}>
            {[
              { name: 'Mollie Clare', role: '', icon: '🎭', photo: 'member4.jpg', bio: 'Bio coming soon.' },
              { name: 'Caroline Dorgan', role: '', icon: '🎭', photo: 'member5.jpg', bio: 'Bio coming soon.' },
              { name: 'Matthew Edwards', role: '', icon: '🎭', photo: 'member6.jpg', bio: 'Bio coming soon.' },
              { name: 'Jake Furness', role: '', icon: '🎭', photo: 'member7.jpg', bio: 'Bio coming soon.' },
              { name: 'Zo\u00eb Harper', role: '', icon: '🎭', photo: 'member8.jpg', bio: 'Bio coming soon.' },
            ].map((member, index) => (
              <div key={index} className="cast-card-clean" style={styles.castCardClean} onClick={() => setSelectedMember(member)}>
                <CastPhoto src={`/images/cast/${member.photo}`} fallbackIcon={member.icon} name={member.name} />
                <h3 style={styles.castName}>{member.name}</h3>
                {member.role && <p style={styles.castRole}>{member.role}</p>}
              </div>
            ))}
          </div>
          {/* Row 2: 4 members (offset) */}
          <div className="cast-grid-row" style={{...styles.castGridRow, marginTop: '-20px'}}>
            {[
              { name: 'Nicki Jean', role: '', icon: '🎭', photo: 'member9.jpg', bio: 'Bio coming soon.' },
              { name: 'Kyran Pritchard', role: '', icon: '🎭', photo: 'member10.jpg', bio: 'Bio coming soon.' },
              { name: 'Sreya Rao', role: '', icon: '🎭', photo: 'member11.jpg', bio: 'Bio coming soon.' },
              { name: 'Daniel Robert', role: '', icon: '🎭', photo: 'member12.jpg', bio: 'Bio coming soon.' },
            ].map((member, index) => (
              <div key={index} className="cast-card-clean" style={styles.castCardClean} onClick={() => setSelectedMember(member)}>
                <CastPhoto src={`/images/cast/${member.photo}`} fallbackIcon={member.icon} name={member.name} />
                <h3 style={styles.castName}>{member.name}</h3>
                {member.role && <p style={styles.castRole}>{member.role}</p>}
              </div>
            ))}
          </div>
          {/* Row 3: 3 members (offset) */}
          <div className="cast-grid-row" style={{...styles.castGridRow, marginTop: '-20px'}}>
            {[
              { name: 'Rebekah Tennyson', role: '', icon: '🎭', photo: 'member13.jpg', bio: 'Bio coming soon.' },
              { name: 'Cate Welmers', role: '', icon: '🎭', photo: 'member14.jpg', bio: 'Bio coming soon.' },
              { name: 'Joel Williams', role: '', icon: '🎭', photo: 'member15.jpg', bio: 'Bio coming soon.' },
            ].map((member, index) => (
              <div key={index} className="cast-card-clean" style={styles.castCardClean} onClick={() => setSelectedMember(member)}>
                <CastPhoto src={`/images/cast/${member.photo}`} fallbackIcon={member.icon} name={member.name} />
                <h3 style={styles.castName}>{member.name}</h3>
                {member.role && <p style={styles.castRole}>{member.role}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cast Member Modal */}
      {selectedMember && (
        <div style={styles.castModalOverlay} onClick={() => setSelectedMember(null)}>
          <div style={styles.castModalContent} onClick={(e) => e.stopPropagation()}>
            <button style={styles.castModalClose} onClick={() => setSelectedMember(null)}>✕</button>
            <div style={styles.castModalLayout}>
              <div style={styles.castModalPhotoWrap}>
                <img
                  className="cast-modal-photo"
                  src={`/images/cast/${selectedMember.photo}`}
                  alt={selectedMember.name}
                  style={styles.castModalPhoto}
                />
              </div>
              <div style={styles.castModalInfo}>
                <h2 style={styles.castModalName}>{selectedMember.name}</h2>
                {selectedMember.role && <p style={styles.castModalRole}>{selectedMember.role}</p>}
                <p style={styles.castModalBio}>{selectedMember.bio}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Section */}
      <section id="support" style={styles.sectionHighlight}>
        <div style={styles.sectionInner}>
          <SectionHeader title="Support Our Quest" subtitle="Help Us Reach Edinburgh" />

          {/* Funding Progress - Full Width, Prominent */}
          <div className="supportFundingBar" style={styles.supportFundingBar}>
            {kickstarterLoading ? (
              <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
                <p style={styles.loadingText}>Loading campaign data...</p>
              </div>
            ) : kickstarterError || kickstarterData.pledged === null ? (
              <div style={styles.errorContainer}>
                <p style={styles.errorText}>Visit Kickstarter to see our progress!</p>
              </div>
            ) : (
              <>
                {kickstarterData.isSuccessful && (
                  <div style={styles.successBanner}>
                    Campaign Successfully Funded!
                  </div>
                )}
                <div style={styles.supportProgressRow}>
                  <div style={styles.supportProgressBarWrap}>
                    <div style={styles.supportProgressBarTrack}>
                      <div style={{...styles.supportProgressBarFill, width: `${Math.min(kickstarterData.percentFunded || 0, 100)}%`}}></div>
                    </div>
                    <div style={styles.supportProgressLabels}>
                      <span style={styles.supportProgressRaised}>
                        £{kickstarterData.pledged?.toLocaleString() || '0'} raised
                      </span>
                      <span style={styles.supportProgressGoal}>
                        Goal: £{kickstarterData.goal?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="supportStatsRow" style={styles.supportStatsRow}>
                  <div style={styles.supportStatBlock}>
                    <span style={styles.supportStatValue}>
                      {kickstarterData.percentFunded?.toFixed(0) || 0}%
                    </span>
                    <span style={styles.supportStatLabel}>Funded</span>
                  </div>
                  {kickstarterData.backers !== null && (
                    <div style={styles.supportStatBlock}>
                      <span style={styles.supportStatValue}>
                        {kickstarterData.backers?.toLocaleString() || '0'}
                      </span>
                      <span style={styles.supportStatLabel}>Backers</span>
                    </div>
                  )}
                  {kickstarterData.isLive && kickstarterData.daysRemaining !== null && (
                    <div style={styles.supportStatBlock}>
                      <span style={{...styles.supportStatValue, color: '#c9a227'}}>
                        {kickstarterData.daysRemaining}
                      </span>
                      <span style={styles.supportStatLabel}>
                        {kickstarterData.daysRemaining === 1 ? 'Day Left' : 'Days Left'}
                      </span>
                    </div>
                  )}
                  {!kickstarterData.isLive && kickstarterData.state !== 'loading' && (
                    <div style={styles.supportStatBlock}>
                      <span style={styles.supportStatLabel}>Campaign has ended</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* The Pitch */}
          <div style={styles.supportPitch}>
            <p style={styles.paragraph}>
              Taking <em>TTRPG:TM</em> to the Edinburgh Fringe is the biggest thing we've ever
              attempted — and we can't wait. But the Fringe is one of the most expensive places
              to put on a show. Venue hire, marketing, accommodation, and the general cost of
              keeping a cast fed and upright for a festival run all add up fast. We've been saving
              and fundraising for months, but we need your help to get us over the line.
            </p>
            <p style={styles.paragraph}>
              Our Kickstarter is live now, and every pledge — whether it's a fiver or something
              altogether more ambitious — gets us closer to Edinburgh and keeps our dreams (and our
              cast) alive.
            </p>
          </div>

          {/* What the Funds Cover - Compact Inline Grid */}
          <div className="supportFundsGrid" style={styles.supportFundsGrid}>
            {[
              { label: 'Venue Hire', icon: 'M3 21V7l9-4 9 4v14l-9-4-9 4zm9-4l7 3.1V8.3L12 5.2 5 8.3v11.5L12 17z' },
              { label: 'Travel & Accommodation', icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z' },
              { label: 'Marketing & Promotion', icon: 'M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z' },
              { label: 'Costumes & Props', icon: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z' },
              { label: 'Musical Accompaniment', icon: 'M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z' },
            ].map((item, i) => (
              <div key={i} style={styles.supportFundItem}>
                <svg style={styles.supportFundIcon} viewBox="0 0 24 24" fill="currentColor">
                  <path d={item.icon} />
                </svg>
                <span style={styles.supportFundLabel}>{item.label}</span>
              </div>
            ))}
          </div>

          {/* Reward Tier Highlights */}
          <h3 style={styles.supportRewardsHeading}>Reward Highlights</h3>
          <div className="supportRewardGrid" style={styles.supportRewardGrid}>
            {[
              { price: '£5', title: 'Support the Show', desc: 'A social media shout-out and our eternal, undying gratitude. We mean that. We will be grateful forever. It might get weird.', limited: false },
              { price: '£15', title: 'Behind the Scenes', desc: 'Exclusive behind-the-scenes footage from three years of development. See how it all comes together.', limited: false },
              { price: '£60', title: 'Meet the Cast', desc: 'Coming to see us live? Get photos with the cast after the show.', limited: false },
              { price: '£100', title: 'Name the Villain', desc: 'Our dastardly antagonist, the Mayor of Sarriar Town, needs a name — and you get to choose it for a live performance.', limited: 'Only 7 available' },
              { price: '£600', title: 'Roll the D20', desc: 'Come to a live show and roll the dice that decides the fate of our heroes. One available — yes, really, just one.', limited: 'Only 1 available' },
              { price: '£600', title: 'Play a One-Shot', desc: 'Play a full tabletop RPG session with members of the cast, in character, on a brand new quest.', limited: 'Only 5 available' },
              { price: '£1,000', title: 'Play the Monster', desc: 'Step on stage in costume and play a creature in the climax of the show. Courage optional.', limited: 'Strictly limited — only 5 available' },
            ].map((tier, i, arr) => (
              <div key={i} style={{...styles.supportRewardCard, ...(i === arr.length - 1 && arr.length % 3 === 1 ? { gridColumn: '2' } : {})}}>

                {tier.limited && (
                  <span style={styles.supportRewardBadge}>{tier.limited}</span>
                )}
                <span style={styles.supportRewardPrice}>{tier.price}</span>
                <h4 style={styles.supportRewardTitle}>{tier.title}</h4>
                <p style={styles.supportRewardDesc}>{tier.desc}</p>
              </div>
            ))}
          </div>
          <p style={styles.supportRewardsCta}>
            These are just a few of the rewards available —{' '}
            <a
              href="https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.supportRewardsLink}
            >
              see all tiers on Kickstarter
            </a>.
          </p>

          {/* Call to Action */}
          <div style={styles.supportCtaWrap}>
            <a
              href="https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.supportCtaButton}
            >
              {kickstarterData.isLive ? 'Back Us on Kickstarter' : 'View on Kickstarter'}
            </a>
            <p style={styles.supportClosingCopy}>
              Every penny goes directly towards getting this show — and this ridiculous, talented
              group of people — to Edinburgh. Back us, follow us, share us, or simply wish us well.
              We'll take all the help we can get.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" style={styles.sectionContact}>
        <div style={styles.sectionInner}>
          <SectionHeader title="Contact" subtitle="Send a Message" />

          <p style={styles.contactIntro}>
            Got a question? Want to book us for a show? Think you can help us on our quest to Edinburgh?
            Send us a message via carrier pigeon (or the more reliable methods below).
          </p>

          {/* Social Links - Find Us */}
          <div style={styles.contactSocialBlock}>
            <span style={styles.contactSublabel}>Find Us</span>
            <div className="contactSocialRow" style={styles.contactSocialRow}>
              <a href="https://www.instagram.com/tabletopmusical" target="_blank" rel="noopener noreferrer" className="contact-social-link" style={styles.contactSocialLink} aria-label="Instagram">
                <svg style={styles.contactSocialSvg} viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@tabletopmusical" target="_blank" rel="noopener noreferrer" className="contact-social-link" style={styles.contactSocialLink} aria-label="TikTok">
                <svg style={styles.contactSocialSvg} viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M448 209.9a210.1 210.1 0 0 1-122.8-39.3v178.8A162.6 162.6 0 1 1 185 188.3v89.9a74.6 74.6 0 1 0 52.2 71.2V0h88a121 121 0 0 0 1.9 22.2 122.2 122.2 0 0 0 53.9 80.2 121 121 0 0 0 67 20.1z"/></svg>
              </a>
              <a href="https://www.facebook.com/people/Tabletop-Role-Playing-Game-The-Musical/61572807667929/" target="_blank" rel="noopener noreferrer" className="contact-social-link" style={styles.contactSocialLink} aria-label="Facebook">
                <svg style={styles.contactSocialSvg} viewBox="0 0 512 512" aria-hidden="true"><path fill="currentColor" d="M512 256C512 114.6 397.4 0 256 0S0 114.6 0 256c0 120 82.7 220.8 194.2 248.5V334.2h-56.6v-78.2h56.6v-61.3c0-56 33.4-86.9 84.4-86.9 24.4 0 50 4.4 50 4.4v55.1h-28.2c-27.8 0-36.4 17.2-36.4 34.9v42h62.1l-9.9 78.2h-52.2v170.3C429.3 476.8 512 376 512 256z"/></svg>
              </a>
              <a href="https://bsky.app/profile/tabletopmusical.bsky.social" target="_blank" rel="noopener noreferrer" className="contact-social-link" style={styles.contactSocialLink} aria-label="Bluesky">
                <svg style={styles.contactSocialSvg} viewBox="0 0 600 530" aria-hidden="true"><path fill="currentColor" d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.72 40.255-67.24 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"/></svg>
              </a>
              <a href="https://www.kickstarter.com/projects/1310830097/tabletop-role-playing-game-the-musical-at-the-fringe" target="_blank" rel="noopener noreferrer" className="contact-social-link" style={styles.contactSocialLink} aria-label="Kickstarter">
                <svg style={styles.contactSocialSvg} viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M86.4 5.5c-28.8 0-52.3 23.5-52.3 52.3v396.4c0 28.8 23.5 52.3 52.3 52.3h58.2c28.8 0 52.3-23.5 52.3-52.3V313.8l107 140.2c17.2 22.5 49.4 26.7 71.9 9.5l40.2-30.7c22.5-17.2 26.7-49.4 9.5-71.9L310.7 218l96.7-126.8c17.2-22.5 12.9-54.7-9.5-71.9l-40.2-30.7c-22.5-17.2-54.7-12.9-71.9 9.5L196.9 124.5V57.8c0-28.8-23.5-52.3-52.3-52.3z"/></svg>
              </a>
            </div>
          </div>

          {/* Contact Form - Get In Touch */}
          <div style={styles.contactFormBlock}>
            <span style={styles.contactSublabel}>Get In Touch</span>
            {formStatus === 'success' ? (
              <div style={styles.formSuccessMessage}>
                <span style={styles.formSuccessIcon}>&#10003;</span>
                <p style={styles.formSuccessText}>Message sent! We'll get back to you soon.</p>
                <button
                  type="button"
                  style={styles.formResetButton}
                  onClick={() => setFormStatus('idle')}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form className="contactFormInner" style={styles.contactFormInner} onSubmit={handleContactSubmit}>
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }}><input name="bot-field" /></p>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="contact-name">Your Name</label>
                  <input id="contact-name" type="text" name="name" required style={styles.formInput} placeholder="Adventurer name..." />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="contact-email">Your Email</label>
                  <input id="contact-email" type="email" name="email" required style={styles.formInput} placeholder="your@email.com" />
                </div>
                <div style={styles.formGroup}>
                  <label style={styles.formLabel} htmlFor="contact-message">Message</label>
                  <textarea id="contact-message" name="message" required style={styles.formTextarea} rows={5} placeholder="Your message..."></textarea>
                </div>
                <div style={styles.formCheckboxGroup}>
                  <label style={styles.formCheckboxLabel} htmlFor="contact-mailing-list">
                    <input id="contact-mailing-list" type="checkbox" name="mailing_list" value="yes" style={styles.formCheckbox} />
                    <span>Keep me updated about The Natural Ones</span>
                  </label>
                </div>
                {formStatus === 'error' && (
                  <p style={styles.formErrorText}>Something went wrong. Please try again.</p>
                )}
                <button type="submit" style={styles.submitButton} disabled={formStatus === 'sending'}>
                  {formStatus === 'sending' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
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

// Show Carousel Component with flip animation
function ShowCarousel({ shows }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState(null);
  const [infoVisible, setInfoVisible] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Use ref for animated offset to ensure synchronous updates with index changes
  const offsetRef = useRef(0);
  const [renderTrigger, setRenderTrigger] = useState(0);
  const forceRender = () => setRenderTrigger(n => n + 1);

  // Keyboard navigation with arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        handlePrev(flippedIndex !== null);
      } else if (e.key === 'ArrowRight') {
        handleNext(flippedIndex !== null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Click outside to close flipped view
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (flippedIndex === null) return;

      // Check if click is outside the carousel container
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setInfoVisible(false);
        setTimeout(() => setFlippedIndex(null), 100);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [flippedIndex]);

  // Spacing between poster positions
  const spacing = 425;

  // Animate carousel rotation smoothly from a starting offset to a target offset
  const animateCarousel = (fromOffset, toOffset, onComplete) => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    const startTime = performance.now();
    const duration = 400; // Animation duration in ms

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic for smooth deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentOffset = fromOffset + (toOffset - fromOffset) * easeOut;

      // Update ref and trigger re-render
      offsetRef.current = currentOffset;
      forceRender();

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        // CRITICAL: Set offset to 0 SYNCHRONOUSLY before changing index
        // This ensures no flicker because when React renders with new index,
        // the offset is already 0
        offsetRef.current = 0;

        // Update index first
        if (onComplete) onComplete();

        // Delay isAnimating reset to next frame to ensure index change
        // has rendered before opacity transitions are re-enabled
        requestAnimationFrame(() => {
          setIsAnimating(false);
        });
      }
    };

    setIsAnimating(true);
    offsetRef.current = fromOffset;
    animationRef.current = requestAnimationFrame(animate);
  };

  // Navigate to previous poster with smooth carousel rotation
  const handlePrev = (keepFlipped = false) => {
    if (isAnimating || isDragging) return;

    const newIndex = currentIndex === 0 ? shows.length - 1 : currentIndex - 1;

    // Animate from 0 to full spacing (rotating right)
    animateCarousel(0, spacing, () => {
      setCurrentIndex(newIndex);
      if (keepFlipped && flippedIndex !== null) {
        setFlippedIndex(newIndex);
        setInfoVisible(true);
      }
    });
  };

  // Navigate to next poster with smooth carousel rotation
  const handleNext = (keepFlipped = false) => {
    if (isAnimating || isDragging) return;

    const newIndex = currentIndex === shows.length - 1 ? 0 : currentIndex + 1;

    // Animate from 0 to negative spacing (rotating left)
    animateCarousel(0, -spacing, () => {
      setCurrentIndex(newIndex);
      if (keepFlipped && flippedIndex !== null) {
        setFlippedIndex(newIndex);
        setInfoVisible(true);
      }
    });
  };

  const handlePosterClick = (index, slot) => {
    // Don't trigger click if we just finished dragging or animating
    if (hasDragged) {
      setHasDragged(false);
      return;
    }
    if (isAnimating) return;

    if (index !== currentIndex) {
      // Clicked on a side poster - use visual slot to determine direction
      if (slot < 0) {
        handlePrev(flippedIndex !== null);
      } else {
        handleNext(flippedIndex !== null);
      }
      return;
    }

    // Clicked on center poster - toggle flip
    if (flippedIndex === index) {
      // Unflip
      setInfoVisible(false);
      setTimeout(() => setFlippedIndex(null), 100);
    } else {
      // Flip
      setFlippedIndex(index);
      setTimeout(() => setInfoVisible(true), 400);
    }
  };

  // Mouse/touch drag handling
  const handleDragStart = (e) => {
    if (isAnimating) return;
    setIsDragging(true);
    setHasDragged(false);
    setStartX(e.type === 'touchstart' ? e.touches[0].clientX : e.clientX);
    e.preventDefault();
  };

  const handleDragMove = (e) => {
    if (!isDragging) return;
    const currentX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const diff = startX - currentX;
    setDragOffset(diff);
    if (Math.abs(diff) > 10) {
      setHasDragged(true);
    }
  };

  const handleDragEnd = () => {
    if (!isDragging) return;

    const currentDragOffset = dragOffset;
    const threshold = 100; // Distance needed to trigger navigation
    const isFlipped = flippedIndex !== null;

    // Transfer drag offset to animation offset ref before clearing drag state
    offsetRef.current = currentDragOffset;
    setDragOffset(0);
    setIsDragging(false);

    if (Math.abs(currentDragOffset) > threshold) {
      // Navigate - animate from current drag position to full spacing
      const newIndex = currentDragOffset > 0
        ? (currentIndex === 0 ? shows.length - 1 : currentIndex - 1)
        : (currentIndex === shows.length - 1 ? 0 : currentIndex + 1);

      const targetOffset = currentDragOffset > 0 ? spacing : -spacing;

      // Animate from where we dragged to the final position
      animateCarousel(currentDragOffset, targetOffset, () => {
        setCurrentIndex(newIndex);
        if (isFlipped) {
          setFlippedIndex(newIndex);
          setInfoVisible(true);
        }
      });
    } else if (Math.abs(currentDragOffset) > 5) {
      // Snap back to center with animation (only if we moved a bit)
      animateCarousel(currentDragOffset, 0);
    } else {
      // Didn't drag enough, just reset
      offsetRef.current = 0;
    }
  };

  // Get style for a specific visual position (-1 = left, 0 = center, 1 = right)
  // Creates smooth 3D carousel effect with continuous position interpolation
  const getPositionStyleForSlot = (slot, actualIndex) => {
    // Combined offset from drag and animation (ref for animation, state for drag)
    const totalOffset = isDragging ? dragOffset : offsetRef.current;

    // Calculate continuous position based on slot and offset
    // Normalize offset to a fraction of spacing (-1 to 1 range)
    const offsetFraction = totalOffset / spacing;

    // Effective position for this slot (continuous value)
    const effectivePosition = slot - offsetFraction;

    // Calculate translateX based on effective position
    const translateX = effectivePosition * spacing;

    // Calculate scale: 1 at center (position 0), smaller towards edges
    const distanceFromCenter = Math.abs(effectivePosition);
    const scale = Math.max(0.6, 1 - distanceFromCenter * 0.3);

    // Calculate opacity: full at center, faded towards edges
    const baseOpacity = Math.max(0.2, 1 - distanceFromCenter * 0.7);
    const opacity = flippedIndex !== null && flippedIndex !== actualIndex ? 0.1 : baseOpacity;

    // Z-index: higher for center, lower for edges
    const zIndex = Math.round(10 - distanceFromCenter * 5);

    // 3D rotation for carousel depth effect (posters angle away from center)
    const rotateY = effectivePosition * -25;

    // Only use opacity transition when not animating carousel (for flip fade effect)
    const shouldTransitionOpacity = !isAnimating && !isDragging;

    return {
      transform: `translateX(${translateX}px) scale(${scale}) rotateY(${rotateY}deg)`,
      opacity,
      zIndex: Math.max(1, zIndex),
      transition: shouldTransitionOpacity ? 'opacity 0.4s ease-out' : 'none',
    };
  };

  // Generate items to render: always render both shows at fixed slots for smooth animation
  const getItemsToRender = () => {
    const otherIndex = currentIndex === 0 ? 1 : 0;

    // Always render in order: left, center, right with stable keys for animation
    return [
      { show: shows[otherIndex], actualIndex: otherIndex, slot: -1, key: 'slot-left' },
      { show: shows[currentIndex], actualIndex: currentIndex, slot: 0, key: 'slot-center' },
      { show: shows[otherIndex], actualIndex: otherIndex, slot: 1, key: 'slot-right' },
    ];
  };

  // Display index for info (use flippedIndex when flipped, otherwise currentIndex)
  const displayIndex = flippedIndex !== null ? flippedIndex : currentIndex;

  return (
    <div ref={containerRef} style={styles.carouselContainer}>
      <div
        ref={carouselRef}
        style={styles.carouselTrack}
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
      >
        {getItemsToRender().map((item) => (
          <div
            key={item.key}
            style={{
              ...styles.carouselSlide,
              ...(item.show.cardWidth ? { width: `${item.show.cardWidth}px` } : {}),
              ...getPositionStyleForSlot(item.slot, item.actualIndex),
            }}
            onClick={() => handlePosterClick(item.actualIndex, item.slot)}
          >
            <div style={{
              ...styles.flipCard,
              transform: flippedIndex === item.actualIndex ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}>
              {/* Front of card - Poster */}
              <div style={styles.flipCardFront}>
                <PosterCard show={item.show} />
              </div>

              {/* Back of card - Scroll image or generated scroll */}
              <div style={styles.flipCardBack}>
                {item.show.hasScrollImage ? (
                  <ScrollImage src={item.show.scrollImage} />
                ) : (
                  <div style={styles.scrollReveal}>
                    <div style={styles.scrollRevealTop}></div>
                    <div style={styles.scrollRevealBody}>
                      <h3 style={styles.scrollRevealTitle}>{item.show.title}</h3>
                      <p style={styles.scrollRevealDesc}>{item.show.description}</p>
                      <div style={styles.scrollDivider}></div>
                      <p style={styles.scrollRevealVenue}>{item.show.venue}</p>
                    </div>
                    <div style={styles.scrollRevealBottom}></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Info box that pops in when flipped - to the right of poster */}
      <div style={{
        ...styles.infoPopup,
        opacity: infoVisible && flippedIndex !== null ? 1 : 0,
        transform: infoVisible && flippedIndex !== null ? 'translateY(-50%) scale(1)' : 'translateY(-50%) translateX(30px) scale(0.95)',
        pointerEvents: infoVisible && flippedIndex !== null ? 'auto' : 'none',
      }}>
        {flippedIndex !== null && shows[flippedIndex] && (
          <>
            <div style={styles.infoPopupHeader}>
              <span style={styles.infoPopupIcon}>📜</span>
              <h4 style={styles.infoPopupTitle}>Performance Details</h4>
            </div>
            <div style={styles.infoPopupContent}>
              <div style={styles.infoPopupItem}>
                <span style={styles.infoPopupItemIcon}>📍</span>
                <div>
                  <strong style={styles.infoPopupLabel}>Venue</strong>
                  <p style={styles.infoPopupText}>{shows[flippedIndex].venue}</p>
                  {shows[flippedIndex].address && (
                    shows[flippedIndex].addressUrl ? (
                      <a href={shows[flippedIndex].addressUrl} target="_blank" rel="noopener noreferrer" style={{...styles.infoPopupSmall, display: 'block'}}>{shows[flippedIndex].address}</a>
                    ) : (
                      <p style={styles.infoPopupSmall}>{shows[flippedIndex].address}</p>
                    )
                  )}
                </div>
              </div>
              <div style={styles.infoPopupItem}>
                <span style={styles.infoPopupItemIcon}>🗓️</span>
                <div>
                  <strong style={styles.infoPopupLabel}>Next Performance</strong>
                  <p style={styles.infoPopupText}>{shows[flippedIndex].date.split('\n').map((line, i) => (
                    <span key={i}>{i > 0 && <br />}{line}</span>
                  ))}</p>
                  {(shows[flippedIndex].doors || shows[flippedIndex].runtime) && (
                    <p style={styles.infoPopupSmall}>Doors: {shows[flippedIndex].doors} | Runtime: {shows[flippedIndex].runtime}</p>
                  )}
                </div>
              </div>
              {shows[flippedIndex].ticketUrl && shows[flippedIndex].ticketUrl !== '#' && (
                <div style={styles.infoPopupItem}>
                  <span style={styles.infoPopupItemIcon}>🎫</span>
                  <div>
                    <strong style={styles.infoPopupLabel}>Tickets</strong>
                    <a
                      href={shows[flippedIndex].ticketUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={styles.infoPopupLink}
                    >
                      Book Now →
                    </a>
                  </div>
                </div>
              )}
            </div>
            <button
              style={styles.closeInfoButton}
              onClick={() => handlePosterClick(flippedIndex)}
            >
              Close
            </button>
          </>
        )}
      </div>

    </div>
  );
}

// Poster Card for carousel - handles real posters and placeholders
function PosterCard({ show }) {
  const [hasError, setHasError] = useState(false);

  // If no real poster or error loading, show placeholder
  if (!show.hasRealPoster || hasError) {
    return (
      <div style={styles.posterCardFallback}>
        <div style={styles.placeholderIcon}>🎭</div>
        <h3 style={styles.posterCardTitle}>{show.title}</h3>
        <div style={styles.posterCardDivider}></div>
        <p style={styles.placeholderTagline}>{show.tagline}</p>
        <div style={styles.posterCardIcons}>
          <span>🎲</span>
          <span>⚔️</span>
          <span>🎵</span>
        </div>
        <p style={styles.placeholderStatus}>{show.date}</p>
      </div>
    );
  }

  return (
    <img
      src={show.poster}
      alt={show.title}
      style={styles.posterCardImage}
      onError={() => setHasError(true)}
    />
  );
}

// Scroll Image component for the back of flipped posters
function ScrollImage({ src }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    // Fallback to a simple styled scroll if image fails to load
    return (
      <div style={styles.scrollImageFallback}>
        <p style={styles.scrollImageFallbackText}>📜</p>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt="Performance scroll"
      style={styles.scrollImage}
      onError={() => setHasError(true)}
    />
  );
}

// Cast Photo Component - shows photo if available, falls back to green oval
function CastPhoto({ src, fallbackIcon, name }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <div style={styles.castPhotoPlaceholder}></div>;
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
    fontFamily: "'Lora', 'Crimson Text', 'Georgia', serif",
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
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 40px',
    zIndex: 100,
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  },
  navLogo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    cursor: 'pointer',
  },
  navLogoText: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
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
    minHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '40px 20px 40px 20px',
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
    whiteSpace: 'nowrap',
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
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    justifyContent: 'center',
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
    marginTop: '80px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
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

  // Sections — alternating solid colours with hard lines
  // Hero(dark) → About(cream) → Shows(cream) → Cast(dark) → Support(cream) → Contact(cream) → Footer(dark)
  section: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionAbout: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionShow: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionCast: {
    padding: '100px 20px',
    background: `
      radial-gradient(ellipse at center, rgba(61, 107, 30, 0.15) 0%, transparent 70%),
      linear-gradient(180deg, #1a0f08 0%, #2d1810 50%, #1a0f08 100%)
    `,
    color: '#e8dcc4',
  },
  sectionHighlight: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionContact: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionAlt: {
    padding: '100px 20px',
    background: '#f5ede0',
    color: '#2d1810',
  },
  sectionInner: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 40px',
  },
  
  // Section Header
  sectionHeader: {
    textAlign: 'center',
    marginBottom: '20px',
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
    gridTemplateColumns: '1fr 320px',
    gap: '24px',
    alignItems: 'start',
  },
  aboutText: {
    lineHeight: 1.8,
  },
  paragraph: {
    fontSize: '18px',
    marginBottom: '24px',
    lineHeight: 1.8,
    textAlign: 'justify',
  },
  dropCap: {
    float: 'left',
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '88px',
    lineHeight: '64px',
    paddingTop: '8px',
    paddingRight: '14px',
    color: '#3d6b1e',
  },
  aboutDivider: {
    height: '1px',
    background: 'linear-gradient(90deg, rgba(201, 162, 39, 0.4), rgba(201, 162, 39, 0.1))',
    margin: '40px 0 28px 0',
  },
  meetCastLink: {
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    fontWeight: '600',
    color: '#c9a227',
    cursor: 'pointer',
    letterSpacing: '1px',
    transition: 'color 0.3s ease',
  },
  aboutCard: {
    position: 'sticky',
    top: '100px',
    marginTop: '150px',
    transform: 'translateX(40px)',
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

  // Show Carousel Styles
  carouselContainer: {
    position: 'relative',
    width: '100%',
    minHeight: '950px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
    overflow: 'visible',
    paddingBottom: '40px',
  },
  carouselTrack: {
    position: 'relative',
    width: '625px',
    height: '879px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'grab',
    userSelect: 'none',
  },
  carouselSlide: {
    position: 'absolute',
    width: '625px',
    height: '879px',
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
  },
  flipCard: {
    position: 'relative',
    width: '100%',
    height: '100%',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  flipCardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    background: 'linear-gradient(135deg, #c9a227, #8b6914)',
    padding: '6px',
    boxShadow: '0 15px 50px rgba(0,0,0,0.4)',
    borderRadius: '4px',
  },
  flipCardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    WebkitBackfaceVisibility: 'hidden',
    transform: 'rotateY(180deg) scale(1.05)',
    borderRadius: '4px',
  },
  posterCardImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
    borderRadius: '2px',
  },
  posterCardFallback: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #2d1810 0%, #1a0f08 60%, #0d0705 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    textAlign: 'center',
    border: '2px solid rgba(201, 162, 39, 0.3)',
    boxSizing: 'border-box',
  },
  posterCardTitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '18px',
    color: '#c9a227',
    margin: '0 0 8px 0',
    lineHeight: 1.3,
  },
  posterCardSubtitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '20px',
    color: '#3d6b1e',
    margin: '0',
    textShadow: '1px 1px 0 #1a3009',
  },
  posterCardDivider: {
    width: '60%',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '16px 0',
  },
  posterCardIcons: {
    display: 'flex',
    gap: '12px',
    fontSize: '24px',
    marginTop: '8px',
  },
  placeholderIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  placeholderTagline: {
    fontSize: '13px',
    color: '#a08060',
    margin: '0 0 16px 0',
    fontStyle: 'italic',
    lineHeight: 1.4,
  },
  placeholderStatus: {
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    color: '#c9a227',
    marginTop: '16px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  scrollImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    borderRadius: '4px',
  },
  scrollImageFallback: {
    width: '100%',
    height: '100%',
    background: 'linear-gradient(180deg, #f5ede0 0%, #e8dcc4 50%, #f5ede0 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
  },
  scrollImageFallbackText: {
    fontSize: '120px',
  },
  scrollReveal: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  scrollRevealTop: {
    height: '24px',
    background: 'linear-gradient(180deg, #a08060, #c9a227)',
    borderRadius: '4px 4px 0 0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
  },
  scrollRevealBody: {
    flex: 1,
    background: 'linear-gradient(180deg, #f5ede0 0%, #e8dcc4 50%, #f5ede0 100%)',
    padding: '24px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    boxShadow: 'inset 0 0 30px rgba(139, 105, 20, 0.1)',
  },
  scrollRevealBottom: {
    height: '24px',
    background: 'linear-gradient(0deg, #a08060, #c9a227)',
    borderRadius: '0 0 4px 4px',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.3)',
  },
  scrollRevealTitle: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '16px',
    color: '#2d1810',
    margin: '0 0 12px 0',
    lineHeight: 1.3,
  },
  scrollRevealDesc: {
    fontSize: '14px',
    color: '#6b5b4a',
    margin: '0 0 16px 0',
    fontStyle: 'italic',
    lineHeight: 1.5,
  },
  scrollDivider: {
    width: '50%',
    height: '2px',
    background: 'linear-gradient(90deg, transparent, #c9a227, transparent)',
    margin: '8px 0 16px 0',
  },
  scrollRevealVenue: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    color: '#3d6b1e',
    margin: '0',
    fontWeight: 'bold',
  },
  infoPopup: {
    position: 'absolute',
    top: '50%',
    right: '-20px',
    transform: 'translateY(-50%)',
    width: '280px',
    backgroundColor: '#2d1810',
    border: '3px solid #c9a227',
    borderRadius: '8px',
    padding: '0',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 25,
    overflow: 'hidden',
  },
  infoPopupHeader: {
    background: 'linear-gradient(135deg, #c9a227, #8b6914)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  infoPopupIcon: {
    fontSize: '24px',
  },
  infoPopupTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    color: '#2d1810',
    margin: '0',
    letterSpacing: '1px',
    textTransform: 'uppercase',
  },
  infoPopupContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoPopupItem: {
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start',
  },
  infoPopupItemIcon: {
    fontSize: '20px',
    flexShrink: 0,
  },
  infoPopupLabel: {
    display: 'block',
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#c9a227',
    marginBottom: '4px',
  },
  infoPopupText: {
    fontSize: '14px',
    color: '#e8dcc4',
    margin: '0',
    fontWeight: 'bold',
  },
  infoPopupSmall: {
    fontSize: '11px',
    color: '#a08060',
    margin: '4px 0 0 0',
  },
  infoPopupLink: {
    fontFamily: "'Cinzel', serif",
    fontSize: '14px',
    color: '#3d6b1e',
    textDecoration: 'none',
    fontWeight: 'bold',
    backgroundColor: 'rgba(61, 107, 30, 0.2)',
    padding: '8px 12px',
    display: 'inline-block',
    marginTop: '4px',
    transition: 'all 0.3s ease',
  },
  closeInfoButton: {
    width: '100%',
    padding: '12px',
    fontFamily: "'Cinzel', serif",
    fontSize: '12px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    backgroundColor: 'rgba(201, 162, 39, 0.1)',
    border: 'none',
    borderTop: '1px solid rgba(201, 162, 39, 0.3)',
    color: '#c9a227',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },

  // Cast Section
  centeredText: {
    textAlign: 'center',
    fontSize: '18px',
    maxWidth: '600px',
    margin: '0 auto 15px auto',
    color: '#6b5b4a',
  },
  castGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '24px',
  },
  castGridRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '24px',
    marginBottom: '40px',
  },
  creativesGridRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '24px',
    marginBottom: '40px',
  },
  castSubheading: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: '24px',
    color: '#c9a227',
    textAlign: 'center',
    margin: '40px 0 24px 0',
    letterSpacing: '2px',
  },
  castCard: {
    textAlign: 'center',
    padding: '32px 16px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.2)',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
  },
  castCardClean: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: '16px 8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: 'calc((100% - 96px) / 5)',
    minWidth: '140px',
  },
  castIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  castPhoto: {
    width: '200px',
    height: '250px',
    maxWidth: '100%',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #3d6b1e',
    marginBottom: '16px',
  },
  castPhotoPlaceholder: {
    width: '200px',
    height: '250px',
    maxWidth: '100%',
    borderRadius: '50%',
    border: '3px solid #3d6b1e',
    marginBottom: '16px',
    backgroundColor: 'rgba(61, 107, 30, 0.15)',
  },
  castName: {
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    color: '#e8dcc4',
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
  castModalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.3s ease',
  },
  castModalContent: {
    position: 'relative',
    width: '90vw',
    maxWidth: '900px',
    padding: '48px',
    backgroundColor: '#1a0e08',
    border: '2px solid #3d6b1e',
    borderRadius: '12px',
  },
  castModalClose: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'none',
    border: 'none',
    color: '#c9a227',
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px 8px',
    lineHeight: 1,
  },
  castModalLayout: {
    display: 'flex',
    alignItems: 'center',
    gap: '48px',
  },
  castModalPhotoWrap: {
    flexShrink: 0,
  },
  castModalPhoto: {
    width: '300px',
    height: '375px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '3px solid #3d6b1e',
    animation: 'spinToOval 1s ease-out forwards',
    boxShadow: '0 0 40px rgba(61, 107, 30, 0.3), 0 0 80px rgba(61, 107, 30, 0.15)',
  },
  castModalInfo: {
    flex: 1,
  },
  castModalName: {
    fontFamily: "'Cinzel Decorative', 'Cinzel', serif",
    fontSize: '32px',
    color: '#c9a227',
    margin: '0 0 12px 0',
    letterSpacing: '2px',
  },
  castModalRole: {
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    color: '#8b6914',
    letterSpacing: '1px',
    margin: '0 0 24px 0',
  },
  castModalBio: {
    fontFamily: "'Crimson Text', serif",
    fontSize: '18px',
    color: '#e8dcc4',
    lineHeight: 1.8,
    margin: 0,
  },
  
  // Support Section
  supportFundingBar: {
    marginBottom: '48px',
    padding: '32px 40px',
    border: '2px solid #c9a227',
    borderRadius: '4px',
    background: 'linear-gradient(135deg, rgba(201, 162, 39, 0.08) 0%, rgba(45, 24, 16, 0.06) 100%)',
    textAlign: 'center',
  },
  supportProgressRow: {
    marginBottom: '24px',
  },
  supportProgressBarWrap: {
    maxWidth: '100%',
  },
  supportProgressBarTrack: {
    height: '28px',
    backgroundColor: 'rgba(45, 24, 16, 0.15)',
    borderRadius: '14px',
    overflow: 'hidden',
    border: '2px solid rgba(201, 162, 39, 0.4)',
    position: 'relative',
  },
  supportProgressBarFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #3d6b1e, #5a9a2c, #6db835)',
    borderRadius: '14px',
    transition: 'width 1.2s ease',
    boxShadow: 'inset 0 -2px 4px rgba(0,0,0,0.15), inset 0 2px 4px rgba(255,255,255,0.15)',
  },
  supportProgressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '10px',
  },
  supportProgressRaised: {
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#3d6b1e',
  },
  supportProgressGoal: {
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    color: '#8b6914',
  },
  supportStatsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '48px',
    flexWrap: 'wrap',
  },
  supportStatBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
  },
  supportStatValue: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#3d6b1e',
    lineHeight: 1.1,
  },
  supportStatLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#8b6914',
  },
  supportPitch: {
    maxWidth: '800px',
    margin: '0 auto 48px',
  },
  supportFundsGrid: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: '24px',
    marginBottom: '56px',
    padding: '24px 0',
    borderTop: '1px solid rgba(201, 162, 39, 0.3)',
    borderBottom: '1px solid rgba(201, 162, 39, 0.3)',
  },
  supportFundItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  supportFundIcon: {
    width: '20px',
    height: '20px',
    color: '#8b6914',
    flexShrink: 0,
  },
  supportFundLabel: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#2d1810',
  },
  supportRewardsHeading: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '28px',
    textAlign: 'center',
    color: '#2d1810',
    margin: '0 0 32px 0',
  },
  supportRewardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginBottom: '20px',
  },
  supportRewardCard: {
    position: 'relative',
    backgroundColor: '#faf5eb',
    border: '1px solid rgba(201, 162, 39, 0.4)',
    borderRadius: '4px',
    padding: '28px 24px 24px',
    boxShadow: '0 4px 12px rgba(45, 24, 16, 0.08)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    flexDirection: 'column',
  },
  supportRewardBadge: {
    position: 'absolute',
    top: '0',
    right: '16px',
    transform: 'translateY(-50%)',
    backgroundColor: '#c9a227',
    color: '#1a0f08',
    fontFamily: "'Cinzel', serif",
    fontSize: '10px',
    fontWeight: 'bold',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    padding: '4px 10px',
    borderRadius: '2px',
  },
  supportRewardPrice: {
    fontFamily: "'Cinzel Decorative', serif",
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#3d6b1e',
    marginBottom: '6px',
    display: 'block',
  },
  supportRewardTitle: {
    fontFamily: "'Cinzel', serif",
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#2d1810',
    margin: '0 0 10px 0',
    lineHeight: 1.3,
  },
  supportRewardDesc: {
    fontFamily: "'Crimson Text', Georgia, serif",
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#4a3728',
    margin: 0,
    flex: 1,
  },
  supportRewardsCta: {
    textAlign: 'center',
    fontSize: '16px',
    color: '#8b6914',
    fontStyle: 'italic',
    margin: '0 0 56px 0',
  },
  supportRewardsLink: {
    color: '#3d6b1e',
    textDecoration: 'underline',
    fontWeight: 'bold',
  },
  supportCtaWrap: {
    textAlign: 'center',
  },
  supportCtaButton: {
    display: 'inline-block',
    fontFamily: "'Cinzel', serif",
    fontSize: '18px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    padding: '20px 48px',
    backgroundColor: '#3d6b1e',
    color: '#e8dcc4',
    border: '2px solid #c9a227',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
    marginBottom: '24px',
  },
  supportClosingCopy: {
    maxWidth: '700px',
    margin: '0 auto',
    fontSize: '16px',
    lineHeight: 1.8,
    color: '#6b5a4e',
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: '24px',
    textAlign: 'center',
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '3px solid rgba(201, 162, 39, 0.3)',
    borderTopColor: '#c9a227',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#a08060',
  },
  errorContainer: {
    padding: '24px',
    textAlign: 'center',
  },
  errorText: {
    fontSize: '14px',
    color: '#a08060',
    marginBottom: '16px',
  },
  successBanner: {
    backgroundColor: 'rgba(61, 107, 30, 0.2)',
    border: '2px solid #3d6b1e',
    color: '#3d6b1e',
    padding: '12px 16px',
    borderRadius: '4px',
    marginBottom: '20px',
    fontWeight: 'bold',
    fontSize: '18px',
    fontFamily: "'Cinzel', serif",
    letterSpacing: '2px',
    textTransform: 'uppercase',
  },
  
  // Contact Section
  contactIntro: {
    fontSize: '18px',
    lineHeight: 1.8,
    textAlign: 'center',
    maxWidth: '700px',
    margin: '0 auto 48px',
    color: '#2d1810',
  },
  contactSocialBlock: {
    textAlign: 'center',
    marginBottom: '56px',
  },
  contactSublabel: {
    display: 'block',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: '#8b6914',
    marginBottom: '24px',
  },
  contactSocialRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '16px',
  },
  contactSocialLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.3)',
    borderRadius: '6px',
    color: '#2d1810',
    textDecoration: 'none',
    transition: 'all 0.3s ease',
  },
  contactSocialSvg: {
    width: '30px',
    height: '30px',
    flexShrink: 0,
    color: '#8b6914',
  },
  contactFormBlock: {
    textAlign: 'center',
  },
  contactFormInner: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'left',
  },
  formGroup: {},
  formLabel: {
    display: 'block',
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: '#8b6914',
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: "'Crimson Text', Georgia, serif",
    backgroundColor: 'rgba(45, 24, 16, 0.04)',
    border: '1px solid rgba(201, 162, 39, 0.4)',
    borderRadius: '4px',
    color: '#2d1810',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  },
  formTextarea: {
    width: '100%',
    padding: '14px 16px',
    fontSize: '16px',
    fontFamily: "'Crimson Text', Georgia, serif",
    backgroundColor: 'rgba(45, 24, 16, 0.04)',
    border: '1px solid rgba(201, 162, 39, 0.4)',
    borderRadius: '4px',
    color: '#2d1810',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
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
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    alignSelf: 'center',
    width: '100%',
    maxWidth: '300px',
  },
  formCheckboxGroup: {
    marginTop: '4px',
  },
  formCheckboxLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    lineHeight: 1.8,
    color: '#2d1810',
    cursor: 'pointer',
    padding: '14px',
    backgroundColor: 'rgba(45, 24, 16, 0.05)',
    border: '1px solid rgba(201, 162, 39, 0.3)',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  },
  formCheckbox: {
    width: '20px',
    height: '20px',
    accentColor: '#3d6b1e',
    cursor: 'pointer',
    flexShrink: 0,
  },
  formSuccessMessage: {
    maxWidth: '600px',
    margin: '0 auto',
    textAlign: 'center',
    padding: '48px 24px',
    backgroundColor: 'rgba(61, 107, 30, 0.08)',
    border: '1px solid rgba(61, 107, 30, 0.25)',
    borderRadius: '6px',
  },
  formSuccessIcon: {
    display: 'block',
    fontSize: '40px',
    color: '#3d6b1e',
    marginBottom: '16px',
  },
  formSuccessText: {
    fontSize: '18px',
    color: '#2d1810',
    marginBottom: '24px',
  },
  formResetButton: {
    fontFamily: "'Cinzel', serif",
    fontSize: '13px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    padding: '12px 28px',
    backgroundColor: 'transparent',
    color: '#8b6914',
    border: '1px solid rgba(201, 162, 39, 0.4)',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  formErrorText: {
    color: '#a03020',
    fontSize: '15px',
    textAlign: 'center',
    margin: 0,
  },

  // Footer
  footer: {
    background: `
      radial-gradient(ellipse at center, rgba(61, 107, 30, 0.15) 0%, transparent 70%),
      linear-gradient(180deg, #1a0f08 0%, #2d1810 50%, #1a0f08 100%)
    `,
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
  @import url('https://fonts.googleapis.com/css2?family=Caveat+Brush&family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;500;600;700&family=Crimson+Text:ital,wght@0,400;0,600;1,400&family=Lora:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Poiret+One&display=swap');
  
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(3deg); }
  }
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
    40% { transform: translateY(-10px); }
    60% { transform: translateY(-5px); }
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @keyframes spinToOval {
    0% {
      transform: rotateY(0deg) scale(0.5);
      opacity: 0;
      border-radius: 50%;
    }
    60% {
      transform: rotateY(540deg) scale(1);
      opacity: 1;
    }
    100% {
      transform: rotateY(720deg) scale(1);
      opacity: 1;
      border-radius: 50%;
    }
  }

  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }

  .cast-modal-photo {
    mask-image: radial-gradient(ellipse at center, black 60%, transparent 100%);
    -webkit-mask-image: radial-gradient(ellipse at center, black 60%, transparent 100%);
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

  button.nav-link-btn:hover {
    transform: none;
    box-shadow: none;
    text-shadow: 0 0 8px rgba(201, 162, 39, 0.6), 0 0 16px rgba(201, 162, 39, 0.3);
  }
  
  a:hover {
    opacity: 0.9;
  }

  .contact-social-link:hover {
    transform: translateY(-2px);
    background-color: rgba(45, 24, 16, 0.1) !important;
    border-color: rgba(201, 162, 39, 0.6) !important;
    box-shadow: 0 4px 12px rgba(201, 162, 39, 0.15);
    opacity: 1 !important;
  }

  .contactFormInner input:focus,
  .contactFormInner textarea:focus {
    border-color: #c9a227 !important;
    box-shadow: 0 0 0 3px rgba(201, 162, 39, 0.15);
  }

  @media (max-width: 900px) {
    .aboutGrid, .showContent {
      grid-template-columns: 1fr !important;
    }
    .supportRewardGrid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
    .supportStatsRow {
      gap: 32px !important;
    }
    .supportFundsGrid {
      gap: 16px !important;
    }
    .supportFundingBar {
      padding: 24px 20px !important;
    }
    .cast-grid-row .cast-card-clean {
      width: calc((100% - 48px) / 3) !important;
    }
    .creatives-grid-row {
      grid-template-columns: repeat(3, 1fr) !important;
    }
    .creatives-grid-row .cast-card-clean {
      grid-column: auto !important;
    }
  }

  @media (max-width: 600px) {
    .supportRewardGrid {
      grid-template-columns: 1fr !important;
    }
    .supportStatsRow {
      gap: 24px !important;
    }
    .supportFundsGrid {
      flex-direction: column !important;
      align-items: center !important;
    }
    .creatives-grid-row {
      grid-template-columns: 1fr !important;
    }
    .creatives-grid-row .cast-card-clean {
      grid-column: auto !important;
    }
    .cast-grid-row .cast-card-clean {
      width: calc((100% - 24px) / 2) !important;
    }
    .contactSocialRow {
      gap: 10px !important;
    }
    .contactSocialRow .contact-social-link {
      padding: 12px !important;
    }
    .contactFormInner {
      max-width: 100% !important;
    }
  }

  /* Carousel responsive styles */
  @media (max-width: 768px) {
    .carousel-info-popup {
      position: fixed !important;
      left: 50% !important;
      right: auto !important;
      top: 50% !important;
      transform: translate(-50%, -50%) !important;
      width: 90vw !important;
      max-width: 320px !important;
    }
  }

  /* Flip card perspective fix */
  .flip-card-container {
    perspective: 1200px;
  }

  /* Grabbing cursor when dragging */
  .carousel-track:active {
    cursor: grabbing;
  }
`;
document.head.appendChild(styleSheet);