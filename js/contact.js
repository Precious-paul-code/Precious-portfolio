/* Contact form validation: no empty fields, valid email, digits-only phone */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

const rules = {
  name:    v => v.trim() === "" ? "Please enter your name." : "",
  email:   v => v.trim() === "" ? "Please enter your email address."
                : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "Enter a valid email, e.g. name@example.com." : "",
  phone:   v => v.trim() === "" ? "Please enter your phone number."
                : !/^\d+$/.test(v.trim()) ? "Phone number must contain digits only (0–9)." : "",
  message: v => v.trim() === "" ? "Please write a message." : ""
};

function validateField(input) {
  const msg = rules[input.name](input.value);
  const field = input.closest(".field");
  field.classList.toggle("invalid", !!msg);
  field.querySelector(".error").textContent = msg;
  return !msg;
}

form.querySelectorAll("input, textarea").forEach(input => {
  input.addEventListener("blur", () => validateField(input));
  input.addEventListener("input", () => { if (input.closest(".field").classList.contains("invalid")) validateField(input); });
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const results = [...form.querySelectorAll("input, textarea")].map(validateField);
  status.className = "form-status";
  if (results.every(Boolean)) {
    const name = form.elements.name.value.trim().split(" ")[0];
    status.textContent = `Thank you, ${name}! Your message has been received. I'll get back to you soon.`;
    status.classList.add("show", "ok");
    form.reset();
  } else {
    form.querySelector(".invalid input, .invalid textarea")?.focus();
  }
});
