/**
 * CHING MAE F. ABENOJA � INTERACTIVE PORTFOLIO ENGINE
 * Inspired by Justin Aran's portfolio: Luxury interactive feel,
 * Dynamic Analytics Lab, SQL Console, Interactive Canvas Chart,
 * Lightbox Modal, Funnel Calculator, and Theme Switcher.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCustomCursor();
  initDock();
  initAnalyticsLab();
  initProjectGallery();
  initCardDeckCarousel();
  initClipboardAndContact();
  initScrollAnimations();
});

/* ==========================================================================
   1. THEME SWITCHER (Light & Dark with LocalStorage & View Transition)
   ========================================================================== */
function initTheme() {
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const storedTheme = localStorage.getItem('cm_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const currentTheme = storedTheme || (systemPrefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', (e) => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';

      if (document.startViewTransition) {
        document.startViewTransition(() => {
          setTheme(newTheme);
        });
      } else {
        setTheme(newTheme);
      }
    });
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('cm_theme', theme);
    // Redraw chart if active to match theme colors
    if (window.renderActiveAnalyticsChart) {
      window.renderActiveAnalyticsChart();
    }
  }
}

/* ==========================================================================
   2. CUSTOM MAGNETIC CURSOR
   ========================================================================== */
function initCustomCursor() {
  const dot = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');
  if (!dot || !ring) return;

  let mouseX = -100, mouseY = -100;
  let ringX = -100, ringY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.2;
    ringY += (mouseY - ringY) * 0.2;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  requestAnimationFrame(renderRing);

  // Hover expansion on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, select, textarea, .project-card, .pillar-card, .kpi-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('cursor--hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('cursor--hover'));
  });
}

/* ==========================================================================
   3. APPLE-STYLE DOCK NAVIGATION (Mouse Magnification & Active Indicators)
   ========================================================================== */
function initDock() {
  const dockPanel = document.querySelector('.dock-panel');
  const dockItems = document.querySelectorAll('.dock-item');
  if (!dockPanel || !dockItems.length) return;

  const DEFAULT_SIZE = 44;
  const MAX_SIZE = 70;
  const DISTANCE = 135;

  dockPanel.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX;

    dockItems.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const itemCenterX = rect.left + rect.width / 2;
      const dist = Math.abs(mouseX - itemCenterX);

      if (dist < DISTANCE) {
        // Smooth cosine curve for authentic macOS dock magnification
        const factor = Math.cos((dist / DISTANCE) * (Math.PI / 2));
        const size = DEFAULT_SIZE + (MAX_SIZE - DEFAULT_SIZE) * factor;
        item.style.width = `${size}px`;
        item.style.height = `${size}px`;
      } else {
        item.style.width = `${DEFAULT_SIZE}px`;
        item.style.height = `${DEFAULT_SIZE}px`;
      }
    });
  });

  dockPanel.addEventListener('mouseleave', () => {
    dockItems.forEach((item) => {
      item.style.width = `${DEFAULT_SIZE}px`;
      item.style.height = `${DEFAULT_SIZE}px`;
    });
  });

  // Active section highlight based on scroll position
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let current = 'hero';
    const scrollPos = window.scrollY + 220;

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        current = sec.getAttribute('id');
      }
    });

    dockItems.forEach((item) => {
      const href = item.getAttribute('href');
      if (href && href === `#${current}`) {
        item.classList.add('is-active');
      } else if (href) {
        item.classList.remove('is-active');
      }
    });
  }, { passive: true });
}

/* ==========================================================================
   4. INTERACTIVE LIVE ANALYTICS & MARKETING LAB
   ========================================================================== */
function initAnalyticsLab() {
  const canvas = document.getElementById('analyticsCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Channel datasets
  const channelData = {
    all: {
      kpis: { reach: '248,500', conv: '4.82%', cac: '?42.10', roas: '4.6x' },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spend: [12000, 15500, 19000, 22400, 26000, 31500],
      conversions: [540, 720, 910, 1150, 1380, 1690],
      breakdown: [
        { name: 'Social Media Campaigns', pct: 42 },
        { name: 'Google Ads & Search', pct: 28 },
        { name: 'University & Tech Events', pct: 18 },
        { name: 'Email & Retention', pct: 12 }
      ]
    },
    social: {
      kpis: { reach: '136,000', conv: '5.40%', cac: '?35.50', roas: '5.2x' },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spend: [6000, 8000, 9500, 11000, 13500, 16000],
      conversions: [320, 460, 580, 710, 890, 1080],
      breakdown: [
        { name: 'TikTok & Short-Form Video', pct: 54 },
        { name: 'Facebook Community / Pubmats', pct: 36 },
        { name: 'Instagram Stories & Reels', pct: 10 }
      ]
    },
    search: {
      kpis: { reach: '52,400', conv: '6.15%', cac: '?58.20', roas: '4.1x' },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spend: [3500, 4200, 5100, 6000, 6800, 7900],
      conversions: [140, 190, 240, 290, 340, 420],
      breakdown: [
        { name: 'Brand Search Queries', pct: 62 },
        { name: 'Targeted High-Intent Keywords', pct: 38 }
      ]
    },
    events: {
      kpis: { reach: '38,200', conv: '8.40%', cac: '?24.80', roas: '6.8x' },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spend: [2000, 2500, 3200, 4000, 4500, 5600],
      conversions: [180, 230, 310, 390, 470, 580],
      breakdown: [
        { name: 'AFK 2026 Major IT Summit', pct: 48 },
        { name: 'GDG Live Technical Streams', pct: 34 },
        { name: 'IBITS Academic Workshops', pct: 18 }
      ]
    },
    email: {
      kpis: { reach: '21,900', conv: '3.90%', cac: '?14.20', roas: '8.4x' },
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      spend: [500, 800, 1200, 1400, 1200, 2000],
      conversions: [60, 80, 110, 130, 140, 190],
      breakdown: [
        { name: 'Newsletter Updates', pct: 65 },
        { name: 'Event Registration Nurture', pct: 35 }
      ]
    }
  };

  let currentChannel = 'all';

  // Handle Channel filter pills
  const channelPills = document.querySelectorAll('.channel-pill-btn');
  channelPills.forEach(btn => {
    btn.addEventListener('click', () => {
      channelPills.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      currentChannel = btn.dataset.channel || 'all';
      updateDashboardData(currentChannel);
    });
  });

  function updateDashboardData(channelKey) {
    const data = channelData[channelKey] || channelData.all;
    
    // Update KPI values
    const kpiReach = document.getElementById('kpiReach');
    const kpiConv = document.getElementById('kpiConv');
    const kpiCac = document.getElementById('kpiCac');
    const kpiRoas = document.getElementById('kpiRoas');

    if (kpiReach) kpiReach.textContent = data.kpis.reach;
    if (kpiConv) kpiConv.textContent = data.kpis.conv;
    if (kpiCac) kpiCac.textContent = data.kpis.cac;
    if (kpiRoas) kpiRoas.textContent = data.kpis.roas;

    // Update breakdown bars
    const breakdownList = document.getElementById('breakdownList');
    if (breakdownList) {
      breakdownList.innerHTML = data.breakdown.map(item => `
        <div class="breakdown-item">
          <div class="breakdown-info">
            <span>${item.name}</span>
            <span>${item.pct}%</span>
          </div>
          <div class="breakdown-bar-bg">
            <div class="breakdown-bar-fill" style="width: ${item.pct}%"></div>
          </div>
        </div>
      `).join('');
    }

    renderChart(data);
  }

  // Draw chart on canvas
  function renderChart(data) {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const padX = 40;
    const padY = 30;
    const chartW = w - padX * 2;
    const chartH = h - padY * 2;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const gridColor = isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(11, 30, 63, 0.08)';
    const textColor = isDark ? 'rgba(255, 235, 245, 0.7)' : 'rgba(42, 14, 31, 0.65)';
    const spendColor = isDark ? '#FF5E97' : '#FF4D8D';
    const convColor = isDark ? '#FFA0C0' : '#FF85A2';

    ctx.clearRect(0, 0, w, h);

    // Draw horizontal grid lines
    ctx.strokeStyle = gridColor;
    ctx.lineWidth = 1;
    const rows = 4;
    for (let i = 0; i <= rows; i++) {
      const y = padY + (chartH / rows) * i;
      ctx.beginPath();
      ctx.moveTo(padX, y);
      ctx.lineTo(w - padX, y);
      ctx.stroke();
    }

    const maxSpend = Math.max(...data.spend) * 1.15;
    const maxConv = Math.max(...data.conversions) * 1.15;
    const pointsCount = data.months.length;
    const stepX = chartW / (pointsCount - 1);

    // Draw Month labels
    ctx.fillStyle = textColor;
    ctx.font = '11px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    data.months.forEach((m, idx) => {
      const x = padX + idx * stepX;
      ctx.fillText(m, x, h - 8);
    });

    // Helper to calculate coords
    const getSpendY = val => padY + chartH - (val / maxSpend) * chartH;
    const getConvY = val => padY + chartH - (val / maxConv) * chartH;

    // Line 1: Spend (Girly Pink) with subtle fill gradient
    const spendGrad = ctx.createLinearGradient(0, padY, 0, h - padY);
    spendGrad.addColorStop(0, isDark ? 'rgba(255, 94, 151, 0.35)' : 'rgba(255, 77, 141, 0.25)');
    spendGrad.addColorStop(1, 'rgba(255, 94, 151, 0)');

    ctx.beginPath();
    data.spend.forEach((val, i) => {
      const x = padX + i * stepX;
      const y = getSpendY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = spendColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Fill under spend
    ctx.lineTo(padX + (pointsCount - 1) * stepX, padY + chartH);
    ctx.lineTo(padX, padY + chartH);
    ctx.closePath();
    ctx.fillStyle = spendGrad;
    ctx.fill();

    // Line 2: Conversions (Coral)
    ctx.beginPath();
    data.conversions.forEach((val, i) => {
      const x = padX + i * stepX;
      const y = getConvY(val);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = convColor;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Draw interactive points
    data.spend.forEach((val, i) => {
      const x = padX + i * stepX;
      const y = getSpendY(val);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = spendColor;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#0A0F1D' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    data.conversions.forEach((val, i) => {
      const x = padX + i * stepX;
      const y = getConvY(val);
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = convColor;
      ctx.fill();
      ctx.strokeStyle = isDark ? '#0A0F1D' : '#FFFFFF';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }

  window.renderActiveAnalyticsChart = () => {
    updateDashboardData(currentChannel);
  };

  // Re-draw on window resize
  window.addEventListener('resize', () => {
    renderChart(channelData[currentChannel]);
  });

  // Initial render
  updateDashboardData('all');

  // Interactive SQL Console Queries
  initSqlConsole();
}

function initSqlConsole() {
  const sqlPresets = {
    1: {
      query: `<span class="sql-keyword">SELECT</span> channel, <span class="sql-fn">SUM</span>(conversions) <span class="sql-keyword">AS</span> total_conversions, <span class="sql-fn">ROUND</span>(<span class="sql-fn">AVG</span>(roas), 2) <span class="sql-keyword">AS</span> avg_roas<br><span class="sql-keyword">FROM</span> marketing_campaigns<br><span class="sql-keyword">GROUP BY</span> channel <span class="sql-keyword">ORDER BY</span> total_conversions <span class="sql-keyword">DESC</span>;`,
      headers: ['channel', 'total_conversions', 'avg_roas', 'status'],
      rows: [
        ['Social Media (TikTok/Meta)', '3,540', '5.2x', 'High Performer'],
        ['University Events (AFK/GDG)', '1,960', '6.8x', 'Highest ROI'],
        ['Google Search Ads', '1,620', '4.1x', 'Stable'],
        ['Newsletter Retention', '810', '8.4x', 'Cost-Efficient']
      ]
    },
    2: {
      query: `<span class="sql-keyword">SELECT</span> organization, role, term_year, department_reach<br><span class="sql-keyword">FROM</span> pup_it_leadership_roles<br><span class="sql-keyword">WHERE</span> academic_year = <span class="sql-str">'2026-2027'</span>;`,
      headers: ['organization', 'role', 'term_year', 'department_reach'],
      rows: [
        ['IBITS PUP Manila', 'President', 'A.Y. 2026�2027', '1,000+ IT Students'],
        ['Away From Keyboard (AFK 2026)', 'Overall Co-Head', 'May 2026', '1,250+ Attendees'],
        ['IBITS PUP Manila', 'Vice President', 'Oct 2025 � 2026', 'Department Operations']
      ]
    },
    3: {
      query: `<span class="sql-keyword">SELECT</span> dataset_name, record_category, format_method, administrative_division<br><span class="sql-keyword">FROM</span> dost_itdi_work_immersion<br><span class="sql-keyword">ORDER BY</span> dataset_name <span class="sql-keyword">ASC</span>;`,
      headers: ['dataset_name', 'record_category', 'tools_used', 'administrative_division'],
      rows: [
        ['DOST Administrative Datasets', 'Personnel & Operations', 'Google Sheets / Excel', 'ITDI Bicutan'],
        ['ITDI Technical Inventory Files', 'Equipment & Materials', 'Spreadsheet Formulas', 'Technical Division'],
        ['PAG-IBIG Member Record System', 'Citizen Member Records', 'Node.js / SQL DB', 'Public Services']
      ]
    }
  };

  const sqlEditor = document.getElementById('sqlCodeDisplay');
  const sqlTable = document.getElementById('sqlResultTable');
  const presetButtons = document.querySelectorAll('.sql-preset-btn');
  const runBtn = document.getElementById('runSqlBtn');

  let activePreset = 1;

  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      presetButtons.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      activePreset = btn.dataset.preset || 1;
      displayPreset(activePreset);
    });
  });

  function displayPreset(presetId) {
    const data = sqlPresets[presetId];
    if (sqlEditor) sqlEditor.innerHTML = data.query;
    if (sqlTable) {
      // Simulate quick query execution
      sqlTable.innerHTML = `
        <thead>
          <tr>${data.headers.map(h => `<th>${h}</th>`).join('')}</tr>
        </thead>
        <tbody>
          ${data.rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}
        </tbody>
      `;
    }
  }

  if (runBtn) {
    runBtn.addEventListener('click', () => {
      runBtn.textContent = 'Executing...';
      runBtn.style.opacity = '0.7';
      setTimeout(() => {
        runBtn.innerHTML = `? Query Executed (0.04s)`;
        runBtn.style.opacity = '1';
        displayPreset(activePreset);
        setTimeout(() => {
          runBtn.innerHTML = `? Run Query`;
        }, 1500);
      }, 300);
    });
  }

  // Initial load
  displayPreset(1);
}



/* ==========================================================================
   6. FEATURED PROJECTS FILTERING & LIGHTBOX MODAL
   ========================================================================== */
function initProjectGallery() {
  const tabs = document.querySelectorAll('.projects-tab');
  const cards = document.querySelectorAll('.project-card');
  const modal = document.getElementById('projectLightbox');
  const closeBtn = document.getElementById('lightboxCloseBtn');
  const backdrop = document.getElementById('lightboxBackdrop');

  // Filter tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const category = tab.dataset.filter || 'all';

      cards.forEach(card => {
        const cardCat = card.dataset.category || '';
        if (category === 'all' || cardCat.includes(category)) {
          card.style.display = 'flex';
          card.style.animation = 'cardFadeIn 0.4s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Project details database for modal
  const projectDetails = {
    dost: {
      category: 'Data Analytics & Data Management',
      title: 'DOST-ITDI Dataset Optimization & Auditing',
      client: 'DOST � Industrial Technology Development Institute (ITDI)',
      role: 'Work Immersion Data Intern',
      tools: 'Google Sheets, Microsoft Excel, Data Auditing, Workflow Analysis',
      img: 'assets/pubmat_work_2.png',
      impact: '15,000+ data rows formatted, 35% improvement in departmental administrative file accessibility.',
      story: `
        <h4>Project Background</h4>
        <p>During the work immersion internship at the DOST-ITDI Bicutan division, technical divisions relied on legacy dataset sheets that suffered from inconsistent nomenclature, redundant rows, and missing indexing.</p>
        <h4>Strategy & Execution</h4>
        <p>Systematically audited large volumes of dataset records, created standardized spreadsheet templates with automated lookup formulas, and conducted verification cross-checks with technical supervisors.</p>
        <h4>Results & Takeaways</h4>
        <p>Greatly streamlined administrative record retrieval times, eliminated data discrepancies, and laid the foundation for structured quantitative analysis.</p>
      `
    },
    pagibig: {
      category: 'Full-Stack Database System',
      title: 'PAG-IBIG Member Forms Management System',
      client: 'Academic Full-Stack Project',
      role: 'Full-Stack Web Developer & Database Architect',
      tools: 'Node.js, SQL, Express, HTML5, CSS3',
      img: 'assets/pubmat_work_3.png',
      impact: 'Full CRUD operations, 100% database transaction reliability, intuitive administrative UI.',
      story: `
        <h4>Problem Statement</h4>
        <p>Government agency form processing frequently suffers from manual transcription errors and inefficient record lookups.</p>
        <h4>Architecture & Solution</h4>
        <p>Architected a relational SQL database schema paired with a Node.js backend. Implemented secure CRUD endpoints for member registration, status modification, query filtering, and automated timestamp tracking.</p>
        <h4>Key Learnings</h4>
        <p>Deepened understanding of database normalization, relational integrity, query optimization, and user-friendly interface design.</p>
      `
    },
    pwd: {
      category: 'Web Accessibility & UI/UX',
      title: 'Enhanced Cagayan De Oro PWD Web Platform',
      client: 'Municipal Web Initiative',
      role: 'Front-End Web Developer',
      tools: 'HTML5, CSS3, JavaScript, WCAG 2.1 Guidelines',
      img: 'assets/project_pwd_website.png',
      impact: 'Enhanced navigation structure, high-contrast accessible design, compliant across desktop and mobile.',
      story: `
        <h4>Objective</h4>
        <p>Develop an accessible, functional municipal web platform to enhance digital service access for Persons with Disabilities (PWD) in Cagayan De Oro.</p>
        <h4>Execution</h4>
        <p>Designed clean semantic HTML structures, keyboard-navigable interface flows, scalable typography, screen-reader friendly ARIA annotations, and responsive CSS styling.</p>
        <h4>Outcomes</h4>
        <p>Provided an effortless citizen portal allowing PWD constituents to easily discover public services, submit requirements, and access community assistance.</p>
      `
    },
    gdg: {
      category: 'Event Marketing & Live Operations',
      title: 'Google Developer Groups (GDG) PUP Manila Event Marketing',
      client: 'GDG on Campus � PUP Manila',
      role: 'Event Host & Logistics Volunteer',
      tools: 'StreamYard, Canva, Corporate Sponsor Marketing, Analytics Tracking',
      img: 'assets/pubmat_why_flare_1.png',
      impact: '850+ live participants, 100% sponsor delivery on stream, high attendee engagement.',
      story: `
        <h4>Campaign & Role</h4>
        <p>Coordinated with the marketing division to promote corporate sponsor products, host live-streamed technical sessions, and manage real-time attendee interactions.</p>
        <h4>Execution</h4>
        <p>Facilitated smooth transitions between keynote speakers and sponsor segments, monitored live audience engagement metrics, and gathered post-event feedback surveys to quantify participant satisfaction.</p>
      `
    },
    hataw: {
      category: 'Marketing Campaign & Pubmat',
      title: 'Hataw PUP Women\'s Month Awareness Campaign',
      client: 'Hataw PUP Student Organization',
      role: 'Creative Designer & Marketing Content Lead',
      tools: 'Canva, Visual Storytelling, Social Engagement Strategy',
      img: 'assets/pubmat_women_hataw.png',
      impact: '3,000+ social reach, boosted engagement across student body, debunked key health myths.',
      story: `
        <h4>Campaign Concept</h4>
        <p>Designed an informative yet visually vibrant social media publication material addressing myths and facts about menstrual health during Women's Month.</p>
        <h4>Creative Strategy</h4>
        <p>Used high-impact typography, empathetic color palettes, and digestible infographic chunks to ensure maximum retention and shares among students.</p>
      `
    },
    flaremula: {
      category: 'Brand Identity & Recruitment Marketing',
      title: 'Flaremula "Why Flare?" & "What Can You Build Here?" Series',
      client: 'Flaremula Developer Community',
      role: 'Brand Designer & Visual Strategist',
      tools: 'Canva, Graphic Design, Brand Kit',
      img: 'assets/pubmat_why_flare_2.png',
      impact: '+45% applicant conversion for annual org recruitment drive.',
      story: `
        <h4>The Challenge</h4>
        <p>Recruiting top-tier tech students requires standing out in a crowded campus feed. Flaremula needed a cohesive visual identity that radiated modern developer energy.</p>
        <h4>The Solution</h4>
        <p>Created the multi-part "Why Flare?" and "What Can You Build Here?" publication series, featuring bold editorial layouts, strong value propositions, and clean call-to-actions.</p>
      `
    },
    marrow: {
      category: 'Editorial Leadership & Broadcast Media',
      title: 'The Marrow School Publication & Campus Radio',
      client: 'The Marrow (Official English Journalism Club)',
      role: 'Editor-in-Chief & News Anchor',
      tools: 'Editorial Workflow, News Anchoring, Content Strategy, Team Leadership',
      img: 'assets/pubmat_women_flare.png',
      impact: 'Supervised 20+ student journalists, published 4 issues, conducted daily campus radio broadcasts.',
      story: `
        <h4>Editorial Direction</h4>
        <p>Directed all writing assignments, verified journalistic standards, and established fact-checking protocols. Broadcasted timely campus news updates via radio programming to reach over 2,000 students daily.</p>
      `
    },
    video: {
      category: 'Motion Graphics & Video Editing',
      title: 'Event Highlights & Creative Motion Editing',
      client: 'Creative Media Showcase',
      role: 'Video Editor & Colorist',
      tools: 'Video Cutting, Color Grading, Audio Sync, YouTube Media',
      img: 'assets/video_thumb.jpg',
      impact: 'Dynamic pacing, synchronized beats, professional recap video featured on YouTube.',
      story: `
        <h4>Motion & Storytelling</h4>
        <p>Edited dynamic recap footage for campus events, capturing the emotion, attendee excitement, and high-energy moments. Handled pacing, multi-track audio mastering, and color grading.</p>
        <p><a href="https://www.youtube.com/watch?v=yNioLfkl-Co" target="_blank" class="btn btn-primary" style="margin-top:10px; display:inline-flex;">? Watch Video on YouTube</a></p>
      `
    },
    employee: {
      category: 'Full-Stack Web Application',
      title: 'Employee Management Application',
      client: 'Open Source Project � GitHub',
      role: 'Full-Stack Developer',
      tools: 'Full-Stack, CRUD Operations, Database, UI/UX Design',
      img: 'assets/pubmat_work_2.png',
      impact: 'Complete CRUD employee management system with an efficient admin UI and optimized database operations.',
      story: `
        <h4>Project Overview</h4>
        <p>Developed a comprehensive employee management application that enables organizations to efficiently track, create, update, and delete employee records through a clean and intuitive admin interface.</p>
        <h4>Technical Implementation</h4>
        <p>Implemented full CRUD operations with database integration, form validation, and a responsive front-end to ensure seamless usability for HR teams and administrators.</p>
        <h4>Outcome</h4>
        <p>Delivered a production-ready management tool demonstrating proficiency in full-stack development, database design, and user-centered interface engineering.</p>
        <p><a href="https://github.com/chinisChin/Employee-Management-App" target="_blank" class="btn btn-primary" style="margin-top:10px; display:inline-flex;">?? View on GitHub</a></p>
      `
    }
  };

  // Open modal on card click
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const pKey = card.dataset.project;
      const details = projectDetails[pKey];
      if (!details) return;

      document.getElementById('lightboxImg').src = details.img;
      document.getElementById('lightboxImg').alt = details.title;
      document.getElementById('lightboxCategory').textContent = details.category;
      document.getElementById('lightboxTitle').textContent = details.title;
      document.getElementById('lightboxClient').textContent = details.client;
      document.getElementById('lightboxRole').textContent = details.role;
      document.getElementById('lightboxTools').textContent = details.tools;
      document.getElementById('lightboxImpact').textContent = details.impact;
      document.getElementById('lightboxStory').innerHTML = details.story;

      modal.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close modal
  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   7. CLIPBOARD EMAIL & CONTACT FORM
   ========================================================================== */
function initClipboardAndContact() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const toast = document.getElementById('toastNotice');
  const contactForm = document.getElementById('contactForm');

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'abenojachingmae@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('? Email copied to clipboard: abenojachingmae@gmail.com');
      }).catch(() => {
        showToast('abenojachingmae@gmail.com');
      });
    });
  }

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-active');
    setTimeout(() => {
      toast.classList.remove('is-active');
    }, 3200);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const email = document.getElementById('formEmail').value;
      const role = document.getElementById('formRole').value;
      const msg = document.getElementById('formMessage').value;

      showToast(`Thank you, ${name}! Opening mail client...`);
      setTimeout(() => {
        const mailtoUrl = `mailto:abenojachingmae@gmail.com?subject=${encodeURIComponent(`[Portfolio Inquiry - ${role}] from ${name}`)}&body=${encodeURIComponent(`Hi Ching Mae,\n\n${msg}\n\nFrom: ${name} (${email})`)}`;
        window.location.href = mailtoUrl;
      }, 700);
    });
  }
}

/* ==========================================================================
   8. SCROLL REVEAL ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (!('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   9. INTERACTIVE CARD DECK CAROUSEL ENGINE (Photos & Pubmats Stack)
   ========================================================================== */
function initCardDeckCarousel() {
  const deck = document.getElementById('cardDeck');
  const prevBtn = document.getElementById('cdPrevBtn');
  const nextBtn = document.getElementById('cdNextBtn');
  const countDisplay = document.getElementById('cdCount');
  const titleDisplay = document.getElementById('cdTitle');
  const subDisplay = document.getElementById('cdSub');
  if (!deck) return;

  // Custom photo slides (easy to add/modify more pictures here!)
  const slides = [
    {
      image: 'assets/profile.jpg',
      badge: 'Ching Mae � President',
      title: 'Ching Mae F. Abenoja',
      caption: 'IBITS President (2026�2027) � Data Analyst & Marketing Strategist'
    },
    {
      image: 'assets/pubmat_women_hataw.png',
      badge: 'Pubmat Campaign',
      title: 'Women\'s Month Awareness Campaign',
      caption: 'Creative design debunking myths and facts with vibrant visuals for Hataw PUP.'
    },
    {
      image: 'assets/pubmat_why_flare_1.png',
      badge: 'Brand Identity',
      title: 'Why Flare? � Recruitment Series',
      caption: 'Cohesive branding pubmat engaging student software developers.'
    },
    {
      image: 'assets/pubmat_why_flare_2.png',
      badge: 'Visual Collateral',
      title: 'What Can You Build Here?',
      caption: 'Highlighting community opportunities with crisp typography and modern aesthetics.'
    },
    {
      image: 'assets/pubmat_work_2.png',
      badge: 'Data Project',
      title: 'DOST-ITDI Dataset Management',
      caption: 'Standardized administrative files and spreadsheet record optimization.'
    },
    {
      image: 'assets/project_pwd_website.png',
      badge: 'Web Accessibility',
      title: 'Cagayan De Oro PWD Web Platform',
      caption: 'Accessible municipal web interface designed for Persons with Disabilities.'
    }
  ];

  let topIndex = 0;
  const n = slides.length;
  let isBusy = false;

  const wrap = (i, count) => ((i % count) + count) % count;

  function pad2(num) {
    return num < 10 ? '0' + num : String(num);
  }

  function renderDeck() {
    deck.innerHTML = '';

    slides.forEach((slide, i) => {
      const depth = wrap(i - topIndex, n);
      const card = document.createElement('div');
      card.className = 'cd-card';

      // Tilt angle based on pseudo-random calculation
      const tilt = ((i * 7) % 11) - 5;
      const isTop = depth === 0;

      card.setAttribute('data-top', isTop ? '1' : '0');

      // Resting pose of stacked deck
      const d = Math.min(depth, 3);
      const posY = d ? -d * 16 : 0;
      const scale = 1 - d * 0.055;
      const rot = isTop ? 0 : tilt;
      const opacity = depth > 3 ? 0 : 1;
      const shade = 1 - d * 0.08;

      card.style.transform = `translateY(${posY}px) scale(${scale}) rotate(${rot}deg)`;
      card.style.zIndex = n - depth;
      card.style.opacity = opacity;
      card.style.filter = isTop ? 'none' : `brightness(${shade})`;

      card.innerHTML = `
        <span class="cd-card-badge">${slide.badge}</span>
        <img src="${slide.image}" alt="${slide.title}" draggable="false" />
      `;

      if (isTop) {
        attachDragEvents(card);
      }

      deck.appendChild(card);
    });

    const activeSlide = slides[topIndex];
    if (titleDisplay) titleDisplay.textContent = activeSlide.title;
    if (subDisplay) subDisplay.textContent = activeSlide.caption;
    if (countDisplay) countDisplay.innerHTML = `<b>${pad2(topIndex + 1)}</b> / ${pad2(n)}`;
  }

  function throwTop(dirX) {
    if (isBusy || n < 2) return;
    isBusy = true;
    const topCard = deck.querySelector('.cd-card[data-top="1"]');
    if (!topCard) {
      isBusy = false;
      return;
    }

    const direction = dirX >= 0 ? 1 : -1;
    const throwW = deck.offsetWidth || 400;

    topCard.setAttribute('data-fly', '1');
    topCard.style.transform = `translate(${direction * throwW * 1.3}px, -40px) rotate(${direction * 18}deg)`;
    topCard.style.opacity = '0';

    setTimeout(() => {
      topIndex = wrap(topIndex + 1, n);
      renderDeck();
      isBusy = false;
    }, 400);
  }

  function pullBack() {
    if (isBusy || n < 2) return;
    isBusy = true;
    topIndex = wrap(topIndex - 1, n);
    renderDeck();
    const newTop = deck.querySelector('.cd-card[data-top="1"]');
    if (newTop) {
      newTop.setAttribute('data-fly', '1');
      const throwW = deck.offsetWidth || 400;
      newTop.style.transform = `translate(${-throwW * 1.3}px, -40px) rotate(-18deg)`;
      newTop.style.opacity = '0';
      requestAnimationFrame(() => {
        newTop.style.transform = 'translateY(0) scale(1) rotate(0deg)';
        newTop.style.opacity = '1';
        setTimeout(() => {
          isBusy = false;
        }, 420);
      });
    } else {
      isBusy = false;
    }
  }

  // Pointer drag events for realistic throw
  function attachDragEvents(card) {
    let startX = 0, startY = 0, curX = 0, curY = 0;
    let isDragging = false;
    let lastTime = 0, lastX = 0, velocityX = 0;

    card.onpointerdown = (e) => {
      if (isBusy || (e.pointerType === 'mouse' && e.button !== 0)) return;
      card.setPointerCapture(e.pointerId);
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastTime = e.timeStamp;
      card.setAttribute('data-drag', '1');
    };

    card.onpointermove = (e) => {
      if (!isDragging) return;
      curX = e.clientX - startX;
      curY = e.clientY - startY;
      const dt = Math.max(1, e.timeStamp - lastTime);
      velocityX = 0.8 * ((e.clientX - lastX) / dt) + 0.2 * velocityX;
      lastX = e.clientX;
      lastTime = e.timeStamp;

      card.style.transform = `translate(${curX}px, ${curY}px) rotate(${curX * 0.05}deg)`;
    };

    const handleRelease = (e) => {
      if (!isDragging) return;
      isDragging = false;
      card.removeAttribute('data-drag');

      const throwThreshold = (deck.offsetWidth || 400) * 0.25;
      if (Math.abs(curX) > throwThreshold || (Math.abs(velocityX) > 0.5 && Math.abs(curX) > 20)) {
        throwTop(curX);
      } else {
        // Snap back
        card.style.transform = 'translateY(0) scale(1) rotate(0deg)';
      }
    };

    card.onpointerup = handleRelease;
    card.onpointercancel = handleRelease;
  }

  if (nextBtn) nextBtn.addEventListener('click', () => throwTop(1));
  if (prevBtn) prevBtn.addEventListener('click', () => pullBack());

  // Keyboard navigation
  deck.tabIndex = 0;
  deck.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') throwTop(1);
    if (e.key === 'ArrowLeft') pullBack();
  });

  // Initial render
  renderDeck();
}

