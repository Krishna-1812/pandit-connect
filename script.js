// JavaScript for PanditConnect

document.addEventListener('DOMContentLoaded', () => {
  // Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('show');
    });
  }

  // Highlight active navigation link based on current page
  const current = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === current || (href === 'index.html' && current === '')) {
      link.classList.add('active');
    }
  });

  // Set current year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // Home page search handler
  const homeSearchForm = document.querySelector('.search-bar');
  if (homeSearchForm) {
    const searchInput = homeSearchForm.querySelector('input[type="text"]');
    homeSearchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = searchInput.value.trim().toLowerCase();
      // Filter popular puja cards on the homepage based on query
      const cards = document.querySelectorAll('.popular-pujas .puja-card');
      let anyMatch = false;
      cards.forEach(card => {
        const titleEl = card.querySelector('h3');
        const title = titleEl ? titleEl.textContent.toLowerCase() : '';
        if (!query || title.includes(query)) {
          card.style.display = '';
          anyMatch = true;
        } else {
          card.style.display = 'none';
        }
      });
      // If there are matching cards, scroll into view of the popular section
      const popularSection = document.querySelector('.popular-pujas');
      if (popularSection) {
        popularSection.scrollIntoView({ behavior: 'smooth' });
      }
      // If no matches, show an alert
      if (!anyMatch && query) {
        alert('No matching pujas found on this page. Please visit the Services page for our full list.');
      }
    });
  }

  // Booking form handler
  const bookingForm = document.querySelector('#booking-form');
  if (bookingForm) {
    // Payment method toggling
    const paymentMethodSelect = bookingForm.querySelector('#payment-method');
    const cardFields = document.getElementById('card-fields');
    const upiField = document.getElementById('upi-field');
    if (paymentMethodSelect) {
      paymentMethodSelect.addEventListener('change', () => {
        const method = paymentMethodSelect.value;
        // Reset visibility
        if (cardFields) cardFields.style.display = method === 'card' ? '' : 'none';
        if (upiField) upiField.style.display = method === 'upi' ? '' : 'none';
      });
    }
    // Pre-fill service if passed via query string
    const params = new URLSearchParams(window.location.search);
    if (params.has('service')) {
      const serviceVal = decodeURIComponent(params.get('service'));
      const serviceSelect = bookingForm.querySelector('select[name="service"]');
      if (serviceSelect) {
        // Try to set value directly; fallback to adding new option if not present
        const option = Array.from(serviceSelect.options).find(opt => opt.value === serviceVal);
        if (option) {
          serviceSelect.value = serviceVal;
        } else {
          const newOpt = document.createElement('option');
          newOpt.value = serviceVal;
          newOpt.textContent = serviceVal;
          newOpt.selected = true;
          serviceSelect.appendChild(newOpt);
        }
      }
    }
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      // Collect form values, including payment details
      const paymentMethod = bookingForm.querySelector('#payment-method')?.value || '';
      const cardNumber = bookingForm.querySelector('#card-number')?.value.trim() || '';
      const cardExpiry = bookingForm.querySelector('#card-expiry')?.value || '';
      const cardCvv = bookingForm.querySelector('#card-cvv')?.value.trim() || '';
      const upiId = bookingForm.querySelector('#upi-id')?.value.trim() || '';
      const data = {
        name: bookingForm.querySelector('#full-name').value.trim(),
        email: bookingForm.querySelector('#email').value.trim(),
        phone: bookingForm.querySelector('#phone').value.trim(),
        location: bookingForm.querySelector('#city').value.trim(),
        service: bookingForm.querySelector('#service').value.trim(),
        pandit: bookingForm.querySelector('#pandit').value.trim(),
        date: bookingForm.querySelector('#date').value,
        time: bookingForm.querySelector('#time').value,
        details: bookingForm.querySelector('#details').value.trim(),
        payment: {
          method: paymentMethod,
          cardNumber: paymentMethod === 'card' ? cardNumber : '',
          cardExpiry: paymentMethod === 'card' ? cardExpiry : '',
          cardCvv: paymentMethod === 'card' ? cardCvv : '',
          upiId: paymentMethod === 'upi' ? upiId : ''
        },
        submitted: Date.now()
      };
      // Save to localStorage
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      bookings.push(data);
      localStorage.setItem('bookings', JSON.stringify(bookings));
      alert('Thank you! Your booking request has been submitted. We will contact you shortly.');
      bookingForm.reset();
      // Hide payment specific fields again after reset
      if (cardFields) cardFields.style.display = 'none';
      if (upiField) upiField.style.display = 'none';
    });
  }

  // Contact form handler
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = {
        name: contactForm.querySelector('#name').value.trim(),
        email: contactForm.querySelector('#email').value.trim(),
        subject: contactForm.querySelector('#subject').value.trim(),
        message: contactForm.querySelector('#message').value.trim(),
        submitted: Date.now()
      };
      const messages = JSON.parse(localStorage.getItem('messages') || '[]');
      messages.push(data);
      localStorage.setItem('messages', JSON.stringify(messages));
      alert('Thank you for reaching out! We will get back to you soon.');
      contactForm.reset();
    });
  }

  // Pandit filter handler on pandits page
  const filterForm = document.querySelector('#filter-form');
  if (filterForm) {
    filterForm.addEventListener('input', () => {
      const locationVal = filterForm.querySelector('select[name="location"]').value.toLowerCase();
      const languageVal = filterForm.querySelector('select[name="language"]').value.toLowerCase();
      const specialtyVal = filterForm.querySelector('select[name="specialty"]').value.toLowerCase();
      document.querySelectorAll('.pandit-list .pandit-item').forEach(item => {
        const loc = item.getAttribute('data-location').toLowerCase();
        const lang = item.getAttribute('data-language').toLowerCase();
        const spec = item.getAttribute('data-specialty').toLowerCase();
        const matchLocation = locationVal === '' || loc.includes(locationVal);
        const matchLanguage = languageVal === '' || lang.includes(languageVal);
        const matchSpecialty = specialtyVal === '' || spec.includes(specialtyVal);
        if (matchLocation && matchLanguage && matchSpecialty) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
});
