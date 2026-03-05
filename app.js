// Redservices — small JS for UX (no dependencies)

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* Mobile nav */
const navToggle = $("#navToggle");
const navLinks = $("#navLinks");

function closeNav() {
  navLinks.classList.remove("open");
  navToggle.setAttribute("aria-expanded", "false");
}
function toggleNav() {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
}

navToggle?.addEventListener("click", toggleNav);
$$(".nav-link, .nav .btn").forEach(a => a.addEventListener("click", () => {
  if (window.matchMedia("(max-width: 860px)").matches) closeNav();
}));

/* Active section link */
const sections = ["projects", "skills", "about", "contact"].map(id => document.getElementById(id)).filter(Boolean);
const navMap = new Map();
$$(".nav-link").forEach(a => {
  const hash = (a.getAttribute("href") || "").replace("#", "");
  if (hash) navMap.set(hash, a);
});

const ioActive = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const id = e.target.id;
    navMap.forEach((el) => el.classList.remove("active"));
    navMap.get(id)?.classList.add("active");
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

sections.forEach(s => ioActive.observe(s));

/* Reveal on scroll */
const revealEls = $$(".reveal");
const ioReveal = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add("in");
      ioReveal.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => ioReveal.observe(el));

/* Footer year */
$("#year").textContent = String(new Date().getFullYear());

/* Demo contact form */
const toast = $("#toast");
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 2400);
}

$("#contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = $("#name").value.trim();
  const email = $("#email").value.trim();
  const message = $("#message").value.trim();

  if (!name || !email || !message) {
    showToast("Please fill in all fields.");
    return;
  }

  // Front-end only (replace with Formspree/Getform if you want real sending)
  e.target.reset();
  showToast("Message saved (demo). Add a form backend to actually send it.");
});

/* Close nav if resized to desktop */
window.addEventListener("resize", () => {
  if (!window.matchMedia("(max-width: 860px)").matches) closeNav();
});

// Email obfuscation + copy
(function setupEmailCopy(){
  const emailLink = document.getElementById("emailLink");
  const copyBtn = document.getElementById("copyEmailBtn");

  if (!emailLink || !copyBtn) return;

  // Split email so it's not directly visible in HTML source
  const user = "icrvenkovicbus";
  const domain = "gmail.com";
  const email = `${user}@${domain}`;

  // show text
  emailLink.textContent = email;

  // OPTIONAL: if you still want it clickable to open mail app
  emailLink.href = `mailto:${email}`;

  async function copyEmail(){
    try{
      await navigator.clipboard.writeText(email);
      if (typeof showToast === "function") showToast("Email copied to clipboard.");
    }catch{
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = email;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      if (typeof showToast === "function") showToast("Email copied to clipboard.");
    }
  }

  copyBtn.addEventListener("click", copyEmail);
})();