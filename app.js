/* ==========================================================================
   ASU MLFTC STUDENT AMBASSADOR PRESENTATION LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const slides = Array.from(document.querySelectorAll('.slide'));
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');
  const currentSlideNum = document.getElementById('current-slide-num');
  const totalSlideNum = document.getElementById('total-slide-num');
  const progressContainer = document.querySelector('.progress-container');
  const btnStart = document.getElementById('btn-start-presentation');
  
  // Header / Presenter Tools
  const timerDisplay = document.getElementById('timer-display');
  const btnTimerReset = document.getElementById('btn-timer-reset');

  const btnNotesToggle = document.getElementById('btn-notes-toggle');
  const btnCloseNotes = document.getElementById('btn-close-notes');
  const presenterDrawer = document.getElementById('presenter-drawer');
  const notesContentArea = document.getElementById('notes-content-area');
  const btnFullscreen = document.getElementById('btn-fullscreen');

  // Slide 5 Step Remote elements
  const stepButtons = document.querySelectorAll('.step-btn');
  const stepDisplayCard = document.getElementById('step-display-card');
  const stepCardBadge = document.getElementById('step-card-badge');
  const stepCardTitle = document.getElementById('step-card-title');
  const stepCardDesc = document.getElementById('step-card-desc');
  const stepBulletContainer = document.getElementById('step-bullet-container');

  // Slide 6 Case Study Elements
  const analysisTabBtns = document.querySelectorAll('.analysis-tab-btn');
  const analysisPillarTitle = document.getElementById('analysis-pillar-title');
  const analysisPillarDesc = document.getElementById('analysis-pillar-desc');
  
  // --- Presentation State ---
  let currentSlideIndex = 0;
  const totalSlides = slides.length;
  
  // Timer State
  let timerInterval = null;
  let elapsedSeconds = 0;

  // --- Initialize Segmented Progress Bar ---
  progressContainer.replaceChildren(); // Safe clear
  const segments = [];
  slides.forEach((slide, idx) => {
    const seg = document.createElement('div');
    seg.className = 'progress-segment';
    seg.dataset.slide = idx;
    
    // Set tooltip text
    const topicEl = slide.querySelector('.slide-topic') || slide.querySelector('.welcome-badge');
    const titleText = topicEl ? topicEl.textContent.trim() : `Slide ${idx + 1}`;
    seg.title = titleText;
    
    seg.addEventListener('click', () => {
      goToSlide(idx);
    });
    progressContainer.appendChild(seg);
    segments.push(seg);
  });

  // --- Initialize Deck ---
  totalSlideNum.textContent = totalSlides;
  updatePresentation();
  startTimer();

  // --- Slide Navigation Logic ---
  function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;
    
    // Update Slide Classes
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'past');
      if (i < index) {
        slide.classList.add('past');
      } else if (i === index) {
        slide.classList.add('active');
      }
    });

    currentSlideIndex = index;
    updatePresentation();
  }

  function nextSlide() {
    if (currentSlideIndex < totalSlides - 1) {
      goToSlide(currentSlideIndex + 1);
    }
  }

  function prevSlide() {
    if (currentSlideIndex > 0) {
      goToSlide(currentSlideIndex - 1);
    }
  }

  function updatePresentation() {
    // Update Indicators
    currentSlideNum.textContent = currentSlideIndex + 1;
    segments.forEach((seg, idx) => {
      seg.classList.remove('active', 'completed');
      if (idx < currentSlideIndex) {
        seg.classList.add('completed');
      } else if (idx === currentSlideIndex) {
        seg.classList.add('active');
      }
    });

    // Enable/Disable navigation buttons
    btnPrev.disabled = currentSlideIndex === 0;
    btnNext.disabled = currentSlideIndex === totalSlides - 1;

    // Load Speaker Notes for Active Slide
    loadSpeakerNotes();
  }

  // --- Speaker Notes Sync ---
  function loadSpeakerNotes() {
    const activeSlide = slides[currentSlideIndex];
    const notesData = activeSlide.querySelector('.slide-notes-data');
    
    notesContentArea.textContent = ''; // Safe clear
    if (notesData) {
      // Clone DOM element safely to avoid innerHTML vulnerabilities
      const clonedNotes = notesData.cloneNode(true);
      // Remove display classes if any, make visible inside drawer
      clonedNotes.style.display = 'block';
      notesContentArea.appendChild(clonedNotes);
    } else {
      const emptyMsg = document.createElement('p');
      emptyMsg.textContent = 'No notes available for this slide.';
      notesContentArea.appendChild(emptyMsg);
    }
  }

  // Toggle Presenter Notes Sidebar
  function toggleNotes() {
    document.body.classList.toggle('notes-open');
    presenterDrawer.classList.toggle('hidden');
  }

  // --- Presentation Timer ---
  function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      elapsedSeconds++;
      updateTimerDisplay();
    }, 1000);
  }

  function updateTimerDisplay() {
    const minutes = Math.floor(elapsedSeconds / 60);
    const seconds = elapsedSeconds % 60;
    const pad = (val) => val.toString().padStart(2, '0');
    timerDisplay.textContent = `${pad(minutes)}:${pad(seconds)}`;
  }

  function resetTimer() {
    elapsedSeconds = 0;
    updateTimerDisplay();
  }



  // --- Fullscreen Trigger ---
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  // --- Case Study Analysis (Slide 6) ---
  const caseStudyData = {
    equity: {
      title: 'Advance Equity',
      desc: 'Instead of expecting the student to complete online homework on the same timeline, you design alternative offline-friendly modules and establish flexible pacing parameters. This ensures that their background limitations do not define their academic outcomes.'
    },
    inquiry: {
      title: 'Inquire Critically',
      desc: 'Rather than assuming why the student is falling behind, you speak compassionately with the student and their family to understand their digital limits. You gather accurate, empathetic insight before designing any academic adjustment.'
    },
    democracy: {
      title: 'Strengthen Democracy',
      desc: 'You foster a supportive, stigma-free classroom environment. By coordinating classroom learning times and encouraging collaboration, you ensure the student remains an active, valued member of the peer group.'
    },
    economy: {
      title: 'Support the Economy',
      desc: 'You coordinate with the school technology administrator to connect the family with local community broadband programs or library resources, supporting the student\'s long-term digital adaptivity.'
    }
  };

  analysisTabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const pillarKey = e.currentTarget.dataset.pillar;
      const data = caseStudyData[pillarKey];
      if (!data) return;

      // Update active states
      analysisTabBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // Update display text
      analysisPillarTitle.textContent = data.title;
      analysisPillarDesc.textContent = data.desc;
    });
  });

  // --- Slide 2: 3D Flip Cards ---
  const pillarCards = document.querySelectorAll('.pillar-card');
  pillarCards.forEach(card => {
    card.addEventListener('click', () => {
      card.classList.toggle('flipped');
    });
  });



  // --- Slide 4: Resource Detailed Panel Details ---
  const resourceItems = document.querySelectorAll('.resource-item');
  const resourceDetailsPanel = document.getElementById('resource-details-panel');
  const panelPlaceholder = document.getElementById('panel-placeholder');
  const panelContent = document.getElementById('panel-content');
  const panelDetailTitle = document.getElementById('panel-detail-title');
  const panelDetailTip = document.getElementById('panel-detail-tip');
  const panelDetailContact = document.getElementById('panel-detail-contact');

  const resourceData = {
    advisors: {
      title: 'Academic & Career Advising',
      tip: 'Pro Tip: Schedule a meeting during your first month! Don\'t wait for a registration hold. Your advisor can help map out your entire four years, guide you on certificate options, and prepare you for graduation and certification exams.',
      contact: '📧 Contact: educationadvising@asu.edu | 📞 Phone: 480-965-5555'
    },
    coaches: {
      title: 'MLFC Student Success Coaches',
      tip: 'Pro Tip: Think of success coaches as your personal development partners. If you\'re feeling overwhelmed by lesson planning, time management, or student teaching stress, meet with them to build personalized organization plans and study habits.',
      contact: '📧 Contact: MLFTCSuccessCoaches@asu.edu | Support Tab in My ASU'
    },
    trio: {
      title: 'TRIO Support Services',
      tip: 'Pro Tip: TRIO is perfect for first-generation, low-income, or disabled scholars. They provide peer mentoring, financial literacy workshops, and private tutoring resources. Apply early on My ASU to lock in your spot!',
      contact: '📧 Eligibility & Signup: My ASU Support Tab | TRIO SSS Program'
    }
  };

  resourceItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const resourceKey = e.currentTarget.dataset.resource;
      const data = resourceData[resourceKey];

      if (!data) return;

      // Handle active state highlights
      resourceItems.forEach(ri => ri.classList.remove('active'));
      e.currentTarget.classList.add('active');

      // Update Panel Details
      panelPlaceholder.classList.add('hidden');
      panelContent.classList.remove('hidden');

      panelDetailTitle.textContent = data.title;
      panelDetailTip.textContent = data.tip;
      panelDetailContact.textContent = data.contact;
    });
  });

  // --- Slide 5 Checklist Step Remote Logic ---
  const stepData = {
    1: {
      badge: 'Step 1 of 4: Admin Portal',
      title: 'Monitor "My ASU" Tasks',
      desc: 'Complete Priority Tasks on your portal to prevent registration holds or financial aid delays.',
      points: [
        'Check immunization requirements and uploads',
        'Verify financial aid tasks or pending signatures'
      ]
    },
    2: {
      badge: 'Step 2 of 4: Training',
      title: 'Complete "Sun Devil Ready"',
      desc: 'Access this online training via My ASU to get familiar with campus tools and academic success practices.',
      points: [
        'Log in to your Canvas dashboard',
        'Review the Sun Devil Ready orientation course modules'
      ]
    },
    3: {
      badge: 'Step 3 of 4: Communication',
      title: 'Check Official ASU Email Daily',
      desc: 'Never miss critical communications from advisors, instructors, or the Teachers College.',
      points: [
        'Configure ASU Outlook mail on your phone or computer',
        'Check inbox daily to stay in touch with academic advisors'
      ]
    },
    4: {
      badge: 'Step 4 of 4: Social Onboarding',
      title: 'Join "Devil2Devil" Community',
      desc: 'Meet your peers, coordinate housing, find study buddies, and join discussions before arriving.',
      points: [
        'Join the Devil2Devil server on Discord',
        'Introduce yourself and connect with Teachers College groups'
      ]
    }
  };

  let activeStep = 1;

  function renderActiveStep() {
    const data = stepData[activeStep];
    if (!data) return;

    stepCardBadge.textContent = data.badge;
    stepCardTitle.textContent = data.title;
    stepCardDesc.textContent = data.desc;

    // Clear and populate bullet list
    stepBulletContainer.replaceChildren(); // Safe clear
    const bulletList = document.createElement('ul');
    bulletList.className = 'step-bullet-list';

    data.points.forEach(pointText => {
      const bulletItem = document.createElement('li');
      bulletItem.className = 'step-bullet-item';
      bulletItem.textContent = pointText;
      bulletList.appendChild(bulletItem);
    });

    stepBulletContainer.appendChild(bulletList);

    // Update active button state
    stepButtons.forEach(btn => {
      if (parseInt(btn.dataset.step) === activeStep) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  // --- Event Listeners ---
  btnPrev.addEventListener('click', prevSlide);
  btnNext.addEventListener('click', nextSlide);
  btnStart.addEventListener('click', () => goToSlide(1));
  
  // Header Buttons
  btnTimerReset.addEventListener('click', resetTimer);

  btnNotesToggle.addEventListener('click', toggleNotes);
  btnCloseNotes.addEventListener('click', toggleNotes);
  btnFullscreen.addEventListener('click', toggleFullscreen);

  // Keyboard Navigation
  document.addEventListener('keydown', (event) => {
    // If user is focusing inside inputs (though none exist here), ignore key events
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) return;

    if (event.key === 'ArrowRight' || event.key === ' ') {
      event.preventDefault(); // Prevent spacebar scrolling
      nextSlide();
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prevSlide();
    }
  });

  // Slide 5 Step Remote click event
  stepButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      activeStep = parseInt(e.currentTarget.dataset.step);
      renderActiveStep();
    });
  });

  // Render initial view
  renderActiveStep();


});
