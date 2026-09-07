document.addEventListener('DOMContentLoaded', function () {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
    const header = document.getElementById('header');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function () {
            navMenu.classList.toggle('show-nav');
        });
    }

    navLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            if (navMenu) navMenu.classList.remove('show-nav');
        });
    });

    function updateHeader() {
        if (!header) return;
        header.style.backgroundColor = window.scrollY > 40
            ? 'rgba(15, 15, 15, 0.95)'
            : 'rgba(28, 28, 28, 0.8)';
    }

    function getDocumentTop(element) {
        return element.getBoundingClientRect().top + window.scrollY;
    }

    function updateActiveLink() {
        const headerHeight = header ? header.offsetHeight : 80;
        const activationGap = Math.min(90, window.innerHeight * 0.12);
        const marker = window.scrollY + headerHeight + activationGap;
        let activeId = 'home';

        // IMPORTANT: getBoundingClientRect() gives the real page position even
        // when a section (such as About) is nested inside another container.
        navLinks.forEach(function (link) {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target || target.id === 'home') return;

            const sectionTop = getDocumentTop(target);
            if (sectionTop <= marker) activeId = target.id;
        });

        // Keep Contact active when the visitor reaches the very bottom.
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) {
            const contact = document.getElementById('contact');
            if (contact) activeId = 'contact';
        }

        navLinks.forEach(function (link) {
            link.classList.toggle('active', link.getAttribute('href') === '#' + activeId);
        });
    }

    updateHeader();
    updateActiveLink();
    window.addEventListener('scroll', function () {
        updateHeader();
        updateActiveLink();
    }, { passive: true });
    window.addEventListener('resize', updateActiveLink);
});

// Scroll reveal motion — lightweight and dependency-free.
document.addEventListener('DOMContentLoaded', function () {
    const items = document.querySelectorAll('.reveal-on-scroll');
    if (!('IntersectionObserver' in window)) {
        items.forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    const observer = new IntersectionObserver(function (entries, obs) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });

    items.forEach(function (el) { observer.observe(el); });
});

// Appointment popup form.
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('appointmentModal');
    const openButton = document.getElementById('openAppointmentModal');
    const form = document.getElementById('appointmentForm');
    const status = document.getElementById('appointmentStatus');
    const closeControls = modal ? modal.querySelectorAll('[data-appointment-close]') : [];
    let lastFocusedElement = null;

    if (!modal || !openButton || !form) return;

    function openModal() {
        lastFocusedElement = document.activeElement;
        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.classList.add('appointment-modal-open');
        window.setTimeout(function () {
            const firstInput = document.getElementById('appointmentName');
            if (firstInput) firstInput.focus();
        }, 80);
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('appointment-modal-open');
        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }
    }

    function setFieldError(field, message) {
        const wrapper = field.closest('.appointment-field');
        const error = form.querySelector('[data-error-for="' + field.id + '"]');
        if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
        if (error) error.textContent = message || '';
        field.setAttribute('aria-invalid', message ? 'true' : 'false');
    }

    function validateField(field) {
        const value = field.value.trim();
        let message = '';
        if (field.required && !value) {
            message = 'This field is required.';
        } else if (field.type === 'email' && value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
            message = 'Please enter a valid email address.';
        } else if (field.type === 'tel' && value && value.replace(/\\D/g, '').length < 7) {
            message = 'Please enter a valid phone number.';
        }
        setFieldError(field, message);
        return !message;
    }

    openButton.addEventListener('click', openModal);
    closeControls.forEach(function (control) {
        control.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && modal.classList.contains('is-open')) closeModal();
    });

    form.querySelectorAll('input, select, textarea').forEach(function (field) {
        field.addEventListener('input', function () {
            if (field.getAttribute('aria-invalid') === 'true') validateField(field);
        });
        field.addEventListener('change', function () { validateField(field); });
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (status) status.textContent = '';

        const requiredFields = Array.from(form.querySelectorAll('[required]'));
        const isValid = requiredFields.map(validateField).every(Boolean);
        if (!isValid) {
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        const data = new FormData(form);
        const lines = [
            'Hello, I would like to schedule an appointment at The Threading House.',
            '',
            'Name: ' + (data.get('name') || ''),
            'Email: ' + (data.get('email') || ''),
            'Phone: ' + (data.get('phone') || ''),
            'Service: ' + (data.get('service') || ''),
            'Message: ' + ((data.get('message') || '').trim() || 'No additional message')
        ];
        const whatsappUrl = 'https://wa.me/13126248007?text=' + encodeURIComponent(lines.join('\\n'));
        if (status) status.textContent = 'Opening WhatsApp with your appointment request…';
        window.open(whatsappUrl, '_blank', 'noopener');
    });
});

