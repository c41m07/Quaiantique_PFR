// filepath: c:\Env\Workspace\Quaiantique_PFR\js\validation\galerie.js
// Validation pour les modals de la galerie
(function () {
  "use strict";
  if (!window.QuaiValidation) {
    console.warn("QuaiValidation utilitaire non trouvé.");
    return;
  }

  function attachModal(
    modalId,
    titleInputId,
    fileInputId,
    submitButtonSelector,
  ) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    var titleInput = document.getElementById(titleInputId);
    var fileInput = fileInputId ? document.getElementById(fileInputId) : null;

    // find button inside modal
    var submitBtn = modal.querySelector(submitButtonSelector);
    if (!submitBtn) return;

    if (titleInput)
      titleInput.addEventListener("keyup", function () {
        window.QuaiValidation.validateRequired(titleInput);
      });
    if (fileInput)
      fileInput.addEventListener("change", function () {
        window.QuaiValidation.validateImageFile(fileInput, { maxSizeMB: 5 });
      });

    submitBtn.addEventListener("click", function (e) {
      var ok = true;
      if (titleInput)
        ok = window.QuaiValidation.validateRequired(titleInput) && ok;
      if (fileInput)
        ok =
          window.QuaiValidation.validateImageFile(fileInput, {
            maxSizeMB: 5,
          }) && ok;
      if (!ok) {
        e.preventDefault();
        var firstInvalid = modal.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return false;
      }
      // If modal's button should submit form, find a form
      var form = modal.querySelector("form");
      if (form) form.submit();
      return true;
    });
  }

  function attachDeleteModal(modalId, inputId, submitButtonSelector) {
    var modal = document.getElementById(modalId);
    if (!modal) return;
    var input = document.getElementById(inputId);
    var submitBtn = modal.querySelector(submitButtonSelector);
    if (!submitBtn) return;

    if (input)
      input.addEventListener("keyup", function () {
        // remove styling while typing
        var v = (input.value || "").toString().trim();
        if (v.toUpperCase() === "SUPPRIMER") {
          window.QuaiValidation.setValid(input);
        } else {
          window.QuaiValidation.setInvalid(input);
        }
      });

    submitBtn.addEventListener("click", function (e) {
      var val = input
        ? (input.value || "").toString().trim().toUpperCase()
        : "";
      if (val !== "SUPPRIMER") {
        e.preventDefault();
        if (input) {
          window.QuaiValidation.setInvalid(input);
          input.focus();
        }
        return false;
      }
      // submit form if exists
      var form = modal.querySelector("form");
      if (form) form.submit();
      return true;
    });
  }

  // Attach to known modals
  attachModal(
    "AddPhotoModal",
    "NameaddPhotoInput",
    "ImageInput",
    'button[type="button"]',
  );
  attachModal(
    "EditionPhotoModal",
    "NameeditPhotoInput",
    "ImageeditInput",
    'button[type="button"]',
  );
  // Delete modal uses special logic: must type SUPPRIMER
  attachDeleteModal(
    "DeletePhotoModal",
    "NamePhotoInput",
    'button[type="button"].btn-danger',
  );
})();
