(() => {
  "use strict";
  const DEFAULT_KEY = "francesco-monachello";
  const BASE_URL = "https://jorgeceledon.github.io/invitacion-laura-jorge/";

  const introLayer = document.getElementById("introLayer");
  const envelopeScreen = document.getElementById("envelopeScreen");
  const coverScreen = document.getElementById("coverScreen");
  const openingCard = document.getElementById("openingCard");
  const openEnvelopeBtn = document.getElementById("openEnvelope");
  const openInvitationBtn = document.getElementById("openInvitation");
  const backToEnvelopeBtn = document.getElementById("backToEnvelope");
  const brandButton = document.getElementById("brandButton");
  const headerBackButton = document.getElementById("headerBackButton");
  const shareButton = document.getElementById("shareButton");
  const toast = document.getElementById("toast");
  const invitation = document.getElementById("invitacion");
  const envelopeImage = document.querySelector(".envelope-image");

  function getGuestKey() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("i") || DEFAULT_KEY).trim().toLowerCase();
  }
  function getGuest() {
    const key = getGuestKey();
    return { key, data: INVITADOS[key] || INVITADOS[DEFAULT_KEY] };
  }
  function fullGuestName(guest) {
    return [guest.nombre, guest.tratamiento].filter(Boolean).join(" ");
  }
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }
  function activateIntro(screen) {
    introLayer.hidden = false;
    introLayer.classList.remove("is-hidden");
    document.body.classList.add("locked");
    envelopeScreen.classList.toggle("active", screen === "envelope");
    coverScreen.classList.toggle("active", screen === "cover");
    introLayer.scrollTop = 0;
  }
  function hideIntro() {
    introLayer.classList.add("is-hidden");
    document.body.classList.remove("locked");
    window.setTimeout(() => { introLayer.hidden = true; }, 560);
  }
  function applyGuest() {
    const { key, data: guest } = getGuest();
    const seatsWord = guest.cupos === 1 ? "persona" : "personas";
    const fullName = fullGuestName(guest);
    document.getElementById("envelopeGuestName").textContent = fullName;
    document.getElementById("coverGuestName").textContent = guest.nombre;
    const tr = document.getElementById("coverGuestTreatment");
    tr.textContent = guest.tratamiento || "";
    tr.hidden = !guest.tratamiento;
    document.getElementById("coverSeats").textContent = guest.cupos;
    document.getElementById("coverSeatsWord").textContent = seatsWord;
    document.getElementById("cardSeatsText").textContent = guest.cupos;
    document.getElementById("cardSeatsWord").textContent = seatsWord;
    document.title = `Laura & Jorge — ${fullName}`;
    const canonicalUrl = `${BASE_URL}?i=${encodeURIComponent(key)}`;
    document.querySelector('meta[name="description"]')?.setAttribute("content", `Invitación de boda de Laura y Jorge para ${fullName}. ${guest.cupos} ${seatsWord}.`);
    document.querySelector('meta[property="og:title"]')?.setAttribute("content", `Laura & Jorge — Invitación para ${fullName}`);
    document.querySelector('meta[property="og:description"]')?.setAttribute("content", `${guest.cupos} ${seatsWord} reservadas.`);
    return { guest, fullName, canonicalUrl };
  }

  const currentGuest = applyGuest();
  function revealEnvelope() {
    openingCard?.classList.add("is-ready");
  }
  if (envelopeImage?.complete && envelopeImage.naturalWidth > 0) {
    revealEnvelope();
  } else {
    envelopeImage?.addEventListener("load", revealEnvelope, { once: true });
  }
  activateIntro("envelope");

  function showEnvelope(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    activateIntro("envelope");
  }
  function showCover(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    activateIntro("cover");
  }
  function openInvitation(event) {
    if (event) { event.preventDefault(); event.stopPropagation(); }
    hideIntro();
    window.setTimeout(() => {
      invitation?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 150);
  }

  openEnvelopeBtn?.addEventListener("click", showCover);
  openingCard?.addEventListener("click", (event) => {
    if (event.target === openEnvelopeBtn) return;
    showCover(event);
  });
  openingCard?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") showCover(event);
  });
  backToEnvelopeBtn?.addEventListener("click", showEnvelope);
  openInvitationBtn?.addEventListener("click", openInvitation);
  brandButton?.addEventListener("click", showCover);
  headerBackButton?.addEventListener("click", showCover);

  shareButton?.addEventListener("click", async () => {
    const shareData = {
      title: "Laura & Jorge — Invitación de boda",
      text: `Invitación para ${currentGuest.fullName} · ${currentGuest.guest.cupos} cupos`,
      url: currentGuest.canonicalUrl
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(currentGuest.canonicalUrl);
        showToast("Enlace personalizado copiado");
      } else {
        showToast("Copia el enlace desde la barra del navegador");
      }
    } catch (error) {
      if (error && error.name !== "AbortError") showToast("No fue posible compartir el enlace");
    }
  });
})();
