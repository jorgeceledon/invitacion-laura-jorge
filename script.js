(() => {
  "use strict";

  const DEFAULT_KEY = "francesco-monachello";
  const BASE_URL = "https://jorgeceledon.github.io/invitacion-laura-jorge/";

  const opening = document.getElementById("opening");
  const openingCard = document.getElementById("openingCard");
  const openButton = document.getElementById("openInvitation");
  const shareButton = document.getElementById("shareButton");
  const toast = document.getElementById("toast");
  const invitation = document.getElementById("invitacion");

  function getGuestKey() {
    const params = new URLSearchParams(window.location.search);
    return (params.get("i") || DEFAULT_KEY).trim().toLowerCase();
  }

  function getGuest() {
    const key = getGuestKey();
    return {
      key,
      data: INVITADOS[key] || INVITADOS[DEFAULT_KEY]
    };
  }

  function fullGuestName(guest) {
    return [guest.nombre, guest.tratamiento].filter(Boolean).join(" ");
  }

  function applyGuest() {
    const { key, data: guest } = getGuest();
    const seatsWord = guest.cupos === 1 ? "persona" : "personas";
    const fullName = fullGuestName(guest);

    document.getElementById("coverGuestName").textContent = guest.nombre;
    document.getElementById("coverGuestTreatment").textContent = guest.tratamiento || "";
    document.getElementById("coverGuestTreatment").hidden = !guest.tratamiento;
    document.getElementById("coverSeats").textContent = guest.cupos;
    document.getElementById("coverSeatsWord").textContent = seatsWord;

    document.getElementById("pageGuestName").textContent = fullName;
    document.getElementById("pageSeats").textContent = guest.cupos;
    document.getElementById("cardSeats").textContent = guest.cupos;

    document.title = `Laura & Jorge — ${fullName}`;

    const canonicalUrl = `${BASE_URL}?i=${encodeURIComponent(key)}`;
    document.querySelector('meta[name="description"]')
      ?.setAttribute("content", `Invitación de boda de Laura y Jorge para ${fullName}. ${guest.cupos} ${seatsWord}.`);
    document.querySelector('meta[property="og:title"]')
      ?.setAttribute("content", `Laura & Jorge — Invitación para ${fullName}`);
    document.querySelector('meta[property="og:description"]')
      ?.setAttribute("content", `${guest.cupos} ${seatsWord} reservadas.`);
    return { guest, fullName, canonicalUrl };
  }

  const currentGuest = applyGuest();

  document.body.classList.add("locked", "ready");
  let alreadyOpened = false;

  function openInvitation(event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (alreadyOpened || !opening) return;

    alreadyOpened = true;
    opening.classList.add("is-hidden");
    document.body.classList.remove("locked");

    window.setTimeout(() => {
      opening.hidden = true;
      invitation?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 700);
  }

  openButton?.addEventListener("click", openInvitation);
  openingCard?.addEventListener("click", openInvitation);
  openingCard?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") openInvitation(event);
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2200);
  }

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
      if (error && error.name !== "AbortError") {
        showToast("No fue posible compartir el enlace");
      }
    }
  });
})();
