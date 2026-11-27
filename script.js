
// Ouvrir / fermer le catalogue complet des formations.
const otherCoursesToggle = document.getElementById("otherCoursesToggle");
const otherCoursesPanel = document.getElementById("otherCoursesPanel");
const openCatalogueLink = document.getElementById("openCatalogueLink");
function setCatalogueOpen(open, scrollToCatalogue = false) {
  if (!otherCoursesToggle || !otherCoursesPanel) return;
  otherCoursesToggle.setAttribute("aria-expanded", String(open));
  otherCoursesPanel.hidden = !open;
  if (open && scrollToCatalogue) {
    otherCoursesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
if (otherCoursesToggle && otherCoursesPanel) {
  // État initial : catalogue entièrement fermé, sans hauteur réservée.
  setCatalogueOpen(false);
  otherCoursesToggle.addEventListener("click", () => {
    const expanded = otherCoursesToggle.getAttribute("aria-expanded") === "true";
    setCatalogueOpen(!expanded);
  });
}
if (openCatalogueLink) {
  openCatalogueLink.addEventListener("click", event => {
    event.preventDefault();
    setCatalogueOpen(true, true);
  });
}

// Diaporama automatique des formations principales : une carte à la fois.
(() => {
  const track = document.getElementById("featuredCourseTrack");
  const viewport = document.querySelector(".featured-slider-viewport");
  const prev = document.querySelector(".carousel-prev");
  const next = document.querySelector(".carousel-next");
  const dotsHost = document.getElementById("featuredCarouselDots");
  if (!track || !viewport || !prev || !next || !dotsHost) return;
  const cards = Array.from(track.querySelectorAll(".course-card"));
  if (!cards.length) return;
  let current = 0;
  let timer = null;

  function visibleCount() {
    if (window.matchMedia("(max-width: 620px)").matches) return 1;
    if (window.matchMedia("(max-width: 1050px)").matches) return 2;
    return 4;
  }
  function maxIndex() { return Math.max(0, cards.length - visibleCount()); }
  function drawDots() {
    dotsHost.innerHTML = "";
    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "carousel-dot";
      dot.setAttribute("aria-label", "Afficher les formations à partir de la carte " + (i + 1));
      dot.addEventListener("click", () => { current = i; render(); restart(); });
      dotsHost.appendChild(dot);
    }
  }
  function render() {
    current = Math.min(current, maxIndex());
    const card = cards[0];
    const style = getComputedStyle(track);
    const gap = parseFloat(style.columnGap || style.gap) || 0;
    const step = card.getBoundingClientRect().width + gap;
    track.style.transform = "translateX(" + (-current * step) + "px)";
    Array.from(dotsHost.children).forEach((dot, i) => {
      dot.setAttribute("aria-current", String(i === current));
    });
    prev.disabled = current === 0;
    next.disabled = current === maxIndex();
    prev.style.opacity = current === 0 ? ".55" : "1";
    next.style.opacity = current === maxIndex() ? ".55" : "1";
  }
  function advance() {
    current = current >= maxIndex() ? 0 : current + 1;
    render();
  }
  function stop() { if (timer) window.clearInterval(timer); timer = null; }
  function restart() { stop(); timer = window.setInterval(advance, 3200); }
  prev.addEventListener("click", () => { current = current <= 0 ? maxIndex() : current - 1; render(); restart(); });
  next.addEventListener("click", () => { current = current >= maxIndex() ? 0 : current + 1; render(); restart(); });
  viewport.addEventListener("mouseenter", stop);
  viewport.addEventListener("mouseleave", restart);
  viewport.addEventListener("focusin", stop);
  viewport.addEventListener("focusout", restart);
  document.addEventListener("visibilitychange", () => document.hidden ? stop() : restart());
  window.addEventListener("resize", () => { drawDots(); render(); });
  drawDots(); render(); restart();
})();

const WHATSAPP_NUMBER = "243900864250 ";
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const registrationModal = document.getElementById("inscription");
const closeRegistration = document.getElementById("closeRegistration");
const registrationForm = document.getElementById("registrationForm");

function openRegistration(courseName) {
  if (courseName) document.getElementById("formationSelect").value = courseName;
  registrationModal.classList.add("is-open");
  registrationModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("registration-modal-open");
  window.setTimeout(() => {
    const firstField = registrationForm.querySelector('input[name="nom"]');
    if (firstField) firstField.focus();
  }, 120);
}
function hideRegistration() {
  registrationModal.classList.remove("is-open");
  registrationModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("registration-modal-open");
}

menuToggle.addEventListener("click", () => {
  const opened = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(opened));
  menuToggle.textContent = opened ? "✕" : "☰";
});
mainNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.querySelectorAll('a[href="#inscription"]').forEach(link => {
  link.addEventListener("click", event => {
    event.preventDefault();
    openRegistration();
  });
});
document.querySelectorAll(".course-link").forEach(button => {
  button.addEventListener("click", () => openRegistration(button.dataset.course));
});
closeRegistration.addEventListener("click", hideRegistration);
registrationModal.addEventListener("click", event => {
  if (event.target === registrationModal) hideRegistration();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && registrationModal.classList.contains("is-open")) hideRegistration();
});

const paymentStatus = document.getElementById("paymentStatus");
const transactionField = document.getElementById("transactionField");
const payerPhoneField = document.getElementById("payerPhoneField");
const transactionCode = document.getElementById("transactionCode");
const payerPhone = document.getElementById("payerPhone");
function updatePaymentFields() {
  const alreadyPaid = paymentStatus.value === "J'ai déjà effectué le paiement";
  transactionField.hidden = !alreadyPaid;
  payerPhoneField.hidden = !alreadyPaid;
  transactionCode.required = alreadyPaid;
  payerPhone.required = alreadyPaid;
}
paymentStatus.addEventListener("change", updatePaymentFields);
updatePaymentFields();

registrationForm.addEventListener("submit", event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const message = [
    "📘 NOUVELLE DEMANDE D'INSCRIPTION — CULTIVA PRO", "",
    "👤 INFORMATIONS DU CANDIDAT",
    "Nom complet : " + data.get("nom"),
    "Téléphone / WhatsApp : " + data.get("telephone"),
    "E-mail : " + (data.get("email") || "Non renseigné"),
    "Ville / Province : " + data.get("ville"), "",
    "🎓 FORMATION",
    "Programme : " + data.get("formation"),
    "Niveau : " + (data.get("niveau") || "Non précisé"),
    "Mode : " + (data.get("mode") || "En ligne"), "",
    "💳 PAIEMENT",
    "Moyen choisi : " + data.get("moyen_paiement"),
    "État : " + data.get("etat_paiement"),
    "Référence transaction : " + (data.get("transaction") || "Non communiquée"),
    "Numéro du payeur : " + (data.get("numero_payeur") || "Non communiqué"), "",
    "📝 MESSAGE", data.get("message") || "Aucun", "",
    "Le candidat confirme l'exactitude des informations transmises."
  ].join("\n");
  const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
  const status = document.getElementById("formStatus");
  status.textContent = "Votre dossier est prêt. WhatsApp va s'ouvrir : vérifiez les informations puis appuyez sur Envoyer.";
  const popup = window.open(url, "_blank");
  if (!popup) status.innerHTML = 'WhatsApp ne s’est pas ouvert automatiquement. <a href="' + url + '" target="_blank" rel="noopener">Cliquez ici pour envoyer votre dossier</a>.';
});

// Demandes de professeur de proximité : transmission structurée à l'équipe CULTIVA PRO.
const proximityForm = document.getElementById("proximityForm");
if (proximityForm) {
  proximityForm.addEventListener("submit", event => {
    event.preventDefault();
    if (!proximityForm.reportValidity()) return;
    const values = new FormData(proximityForm);
    const message = [
      "📍 DEMANDE DE PROFESSEUR DE PROXIMITÉ — CULTIVA PRO",
      "",
      "Nom : " + values.get("nom"),
      "Téléphone / WhatsApp : " + values.get("telephone"),
      "Ville / quartier : " + values.get("lieu"),
      "Formation recherchée : " + values.get("formation"),
      "Précisions : " + (values.get("message") || "Aucune")
    ].join("\\n");
    const url = "https://wa.me/243971390573?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener");
  });
}

document.getElementById("year").textContent = new Date().getFullYear();

// Diaporama automatique des photos de la bannière, en conservant tous les textes.
(() => {
  const slides = Array.from(document.querySelectorAll(".hero-slideshow .hero-slide"));
  if (slides.length < 2) return;
  let active = 0;
  window.setInterval(() => {
    slides[active].classList.remove("is-active");
    active = (active + 1) % slides.length;
    slides[active].classList.add("is-active");
  }, 4500);
})();
