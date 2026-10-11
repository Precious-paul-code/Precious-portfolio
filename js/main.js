/* Shared behaviour: mobile menu, scroll reveal, skill bars, footer year */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "✕" : "☰";
    });
  }

  document.querySelectorAll("[data-year]").forEach(el => (el.textContent = new Date().getFullYear()));

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      entry.target.querySelectorAll?.(".bar > i").forEach(b => (b.style.width = b.dataset.level + "%"));
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

  /* Password strength demo (Projects page) */
  const pw = document.getElementById("pw-input");
  if (pw) {
    const bar = document.querySelector("#pw-meter > i");
    const out = document.getElementById("pw-feedback");
    const checks = [
      { test: p => p.length >= 12, tip: "Use at least 12 characters" },
      { test: p => /[a-z]/.test(p) && /[A-Z]/.test(p), tip: "Mix upper and lower case" },
      { test: p => /\d/.test(p), tip: "Add a number" },
      { test: p => /[^A-Za-z0-9]/.test(p), tip: "Add a symbol (!@#$…)" },
      { test: p => !/(password|1234|qwerty|admin)/i.test(p), tip: "Avoid common words and patterns" }
    ];
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
    const colours = ["#ff5c5c", "#ff8a4c", "#f4b942", "#ff9ccf", "#ff6db3", "#ff4fa3"];
    pw.addEventListener("input", () => {
      const value = pw.value;
      if (!value) { bar.style.width = "0"; out.textContent = "Type a password to test it (nothing is stored or sent)."; return; }
      const passed = checks.filter(c => c.test(value));
      const score = passed.length;
      bar.style.width = ((score + 1) / 6) * 100 + "%";
      bar.style.background = colours[score];
      const missing = checks.filter(c => !c.test(value)).map(c => c.tip);
      out.innerHTML = `<strong>${labels[score]}</strong>` + (missing.length ? " — " + missing[0] : " — great job!");
    });
  }
});
