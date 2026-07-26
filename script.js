(() => {
  "use strict";

  const opening = document.getElementById("opening");
  const openingCard = document.getElementById("openingCard");
  const openButton = document.getElementById("openInvitation");
  const shareButton = document.getElementById("shareButton");
  const toast = document.getElementById("toast");
  const invitation = document.getElementById("invitacion");

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
      invitation?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 700);
  }

  openButton?.addEventListener("click", openInvitation);
  openingCard?.addEventListener("click", openInvitation);

  openingCard?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      openInvitation(event);
    }
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
      text: "Invitación para Francesco Monachello y Sra. · 2 cupos",
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Enlace copiado");
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
