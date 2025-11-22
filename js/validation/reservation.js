// filepath: c:\Env\Workspace\Quaiantique_PFR\js\validation\reservation.js
// Validation pour la page reserver.html
(function () {
  "use strict";
  if (!window.QuaiValidation) {
    console.warn("QuaiValidation utilitaire non trouvé.");
    return;
  }

  var form = document.querySelector("form.col-12.col-md-8.mx-auto");
  var NomInput = document.getElementById("NomInput");
  var PrenomInput = document.getElementById("PrenomInput");
  var AllergieInput = document.getElementById("AllergieInput");
  var NbConvivesInput = document.getElementById("NbConvivesInput");
  var Dateinput = document.getElementById("Dateinput");
  var selectHour = document.getElementById("selectHour");
  var midiRadio = document.getElementById("midiRadio");
  var soirRadio = document.getElementById("soirRadio");
  var reserveBtn = document.getElementById("btnReserve");

  function validateReservationForm() {
    var ok = true;
    // Nom/Prenom are disabled -> ignore them in validation
    if (AllergieInput)
      ok = window.QuaiValidation.validateTextOptional(AllergieInput, 200) && ok;
    if (NbConvivesInput)
      ok =
        window.QuaiValidation.validateNumber(NbConvivesInput, {
          min: 1,
          max: 20,
        }) && ok;
    if (Dateinput)
      ok = window.QuaiValidation.validateDateNotPast(Dateinput) && ok;
    if (selectHour) {
      if (!selectHour.value || selectHour.value.trim() === "") {
        window.QuaiValidation.setInvalid(selectHour);
        ok = false;
      } else {
        window.QuaiValidation.setValid(selectHour);
      }
    }
    // radio check
    if (midiRadio || soirRadio) {
      var checked =
        (midiRadio && midiRadio.checked) || (soirRadio && soirRadio.checked);
      if (!checked) {
        // mark both as invalid visually
        if (midiRadio) window.QuaiValidation.setInvalid(midiRadio);
        if (soirRadio) window.QuaiValidation.setInvalid(soirRadio);
        ok = false;
      } else {
        if (midiRadio) window.QuaiValidation.setValid(midiRadio);
        if (soirRadio) window.QuaiValidation.setValid(soirRadio);
      }
    }
    return ok;
  }

  // listeners
  if (AllergieInput)
    AllergieInput.addEventListener("keyup", function () {
      window.QuaiValidation.validateTextOptional(AllergieInput, 200);
    });
  if (NbConvivesInput)
    NbConvivesInput.addEventListener("change", function () {
      window.QuaiValidation.validateNumber(NbConvivesInput, {
        min: 1,
        max: 20,
      });
    });
  if (Dateinput)
    Dateinput.addEventListener("change", function () {
      window.QuaiValidation.validateDateNotPast(Dateinput);
    });
  if (selectHour)
    selectHour.addEventListener("change", function () {
      if (selectHour.value) window.QuaiValidation.setValid(selectHour);
    });

  // attach submit handler to button if present
  if (reserveBtn) {
    reserveBtn.addEventListener("click", function (e) {
      if (!validateReservationForm()) {
        e.preventDefault();
        var firstInvalid = form ? form.querySelector(".is-invalid") : null;
        if (firstInvalid) firstInvalid.focus();
        return false;
      }
      // here you would submit via XHR or allow form.submit(); if button outside form, we can call form.submit()
      if (form) form.submit();
      return true;
    });
  }

  if (form) {
    form.addEventListener("submit", function (e) {
      if (!validateReservationForm()) {
        e.preventDefault();
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return false;
      }
      return true;
    });
  }
})();
