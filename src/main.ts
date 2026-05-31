import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Sticky Header & Scroll Progress
  // ==========================================
  const header = document.querySelector('.header') as HTMLElement;
  const scrollProgress = document.getElementById('scrollProgress') as HTMLElement;

  window.addEventListener('scroll', () => {
    // Header scrolled class
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll Progress bar
    const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (windowHeight > 0) {
      const scrolledFraction = (window.scrollY / windowHeight) * 100;
      scrollProgress.style.width = `${scrolledFraction}%`;
    }
  });

  // ==========================================
  // 2. Mobile Menu Navigation
  // ==========================================
  const menuToggle = document.getElementById('menuToggle') as HTMLButtonElement;
  const mobileNav = document.getElementById('mobileNav') as HTMLElement;
  const mobileLinks = document.querySelectorAll('.mobile-link');

  const toggleMenu = () => {
    menuToggle.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  };

  menuToggle.addEventListener('click', toggleMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Close menu when clicking a link
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.classList.remove('no-scroll');
    });
  });

  // Close mobile nav on resize if open
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileNav.classList.contains('open')) {
      menuToggle.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
  });

  // ==========================================
  // 3. Navigation Active Link Observer
  // ==========================================
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileNavLinks = document.querySelectorAll('.mobile-link');

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px', // Center active range
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const activeId = entry.target.getAttribute('id');
        
        // Update Desktop Navigation
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });

        // Update Mobile Navigation
        mobileNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${activeId}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================
  // 4. Skills Bar Intersection Observer
  // ==========================================
  const skillBars = document.querySelectorAll('.skill-progress-bar');

  const skillsObserverOptions = {
    root: null,
    threshold: 0.1
  };

  const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBar = entry.target as HTMLElement;
        const progressValue = progressBar.getAttribute('data-progress') || '0%';
        progressBar.style.width = progressValue;
        // Unobserve after animating once
        observer.unobserve(progressBar);
      }
    });
  }, skillsObserverOptions);

  skillBars.forEach(bar => skillsObserver.observe(bar));

  // ==========================================
  // 5. Projects Interactive Filter System
  // ==========================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const projectCards = document.querySelectorAll('.project-card');

  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      tabButtons.forEach(btn => btn.classList.remove('active'));
      // Add active to current button
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter') || 'all';

      projectCards.forEach(card => {
        const projectCategory = card.getAttribute('data-category');
        const element = card as HTMLElement;

        // Visual fade animation
        element.style.opacity = '0';
        element.style.transform = 'scale(0.92) translateY(10px)';

        setTimeout(() => {
          if (filterValue === 'all' || projectCategory === filterValue) {
            element.style.display = 'flex';
            setTimeout(() => {
              element.style.opacity = '1';
              element.style.transform = 'scale(1) translateY(0)';
            }, 50);
          } else {
            element.style.display = 'none';
          }
        }, 300);
      });
    });
  });

  // ==========================================
  // 6. Interactive Contact Form Handler
  // ==========================================
  const contactForm = document.getElementById('contactForm') as HTMLFormElement;
  const btnSubmit = document.getElementById('btnSubmit') as HTMLButtonElement;
  const formSuccess = document.getElementById('formSuccess') as HTMLElement;
  const formError = document.getElementById('formError') as HTMLElement;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Disable button and animate text to indicate processing
      const originalText = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
      
      // Hide any previous feedback states
      formSuccess.classList.remove('show');
      formSuccess.style.display = 'none';
      formError.classList.remove('show');
      formError.style.display = 'none';

      // Gather Form Data
      const formData = new FormData(contactForm);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const subject = formData.get('subject') as string;
      const message = formData.get('message') as string;

      console.log('Sending message:', { name, email, subject, message });

      // Mock dynamic server response delay (1.5 seconds)
      setTimeout(() => {
        const isSuccess = true; // Simulating success for portfolio presentation

        // Restore button state
        btnSubmit.disabled = false;
        btnSubmit.innerHTML = originalText;

        if (isSuccess) {
          // Slide form up and show success message
          contactForm.style.opacity = '0.1';
          contactForm.style.pointerEvents = 'none';

          formSuccess.style.display = 'flex';
          setTimeout(() => {
            formSuccess.classList.add('show');
          }, 50);

          // Reset Form
          contactForm.reset();

          // Hide success message after 5 seconds
          setTimeout(() => {
            formSuccess.classList.remove('show');
            setTimeout(() => {
              formSuccess.style.display = 'none';
              contactForm.style.opacity = '1';
              contactForm.style.pointerEvents = 'all';
            }, 400);
          }, 5000);

        } else {
          // Show error message
          formError.style.display = 'flex';
          setTimeout(() => {
            formError.classList.add('show');
          }, 50);

          // Hide error after 4 seconds
          setTimeout(() => {
            formError.classList.remove('show');
            setTimeout(() => {
              formError.style.display = 'none';
            }, 400);
          }, 4000);
        }
      }, 1500);
    });
  }
});
