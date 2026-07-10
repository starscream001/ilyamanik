const FEEDBACK_VISIBLE_MS = 1700;
const CLIPBOARD_TIMEOUT_MS = 800;

function copyWithTextarea(text) {
  if (typeof document.execCommand !== "function") {
    return false;
  }

  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.left = "0";
  field.style.top = "0";
  field.style.width = "1px";
  field.style.height = "1px";
  field.style.opacity = "0";
  document.body.append(field);
  field.focus();
  field.select();
  field.setSelectionRange(0, field.value.length);

  const didCopy = document.execCommand("copy");
  field.remove();
  return didCopy;
}

function copyWithClipboardApi(text) {
  if (typeof navigator === "undefined" || !navigator.clipboard || !window.isSecureContext) {
    return Promise.reject(new Error("Clipboard API unavailable"));
  }

  const timeout = new Promise((_, reject) => {
    window.setTimeout(() => reject(new Error("Clipboard API timeout")), CLIPBOARD_TIMEOUT_MS);
  });

  return Promise.race([navigator.clipboard.writeText(text), timeout]);
}

async function copyText(text) {
  if (copyWithTextarea(text)) return;
  await copyWithClipboardApi(text);
}

function resetCopyButton(button, label) {
  button.textContent = label;
  button.disabled = false;
  delete button.dataset.state;
}

function bindCopyButtons() {
  const statusRegion = document.querySelector("[data-copy-status]");
  const buttons = document.querySelectorAll("[data-copy]");

  buttons.forEach((button) => {
    const originalLabel = button.textContent;

    button.addEventListener("click", async () => {
      const textToCopy = button.dataset.copy;
      if (!textToCopy) return;

      button.disabled = true;
      button.textContent = "Копируется";

      try {
        await copyText(textToCopy);
        button.textContent = "Скопировано";
        button.dataset.state = "copied";
        if (statusRegion) {
          statusRegion.textContent = `Скопировано: ${button.dataset.copyLabel || "значение"}`;
        }
      } catch (error) {
        button.textContent = "Не вышло";
        if (statusRegion) {
          statusRegion.textContent = "Не удалось скопировать. Выделите значение вручную.";
        }
      }

      window.setTimeout(() => resetCopyButton(button, originalLabel), FEEDBACK_VISIBLE_MS);
    });
  });
}

bindCopyButtons();
