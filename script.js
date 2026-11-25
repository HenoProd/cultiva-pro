const WHATSAPP_NUMBER = "243971390573";
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
document.getElementById("year").textContent = new Date().getFullYear();