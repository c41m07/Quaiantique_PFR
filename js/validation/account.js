// filepath: c:\Env\Workspace\Quaiantique_PFR\js\validation\account.js
// Validation pour la page account.html
(function () {
  "use strict";

  if (!window.QuaiValidation) {
    console.warn(
      "QuaiValidation utilitaire non trouvé. Assurez-vous que js/auth/validation.js est chargé.",
    );
    return;
  }

  var NomInput = document.getElementById("NomInput");
  var PrenomInput = document.getElementById("PrenomInput");
  var AllergieInput = document.getElementById("AllergieInput");
  var NbConvivesInput = document.getElementById("NbConvivesInput");
  var form = document.querySelector("form");

  function validateAccountForm() {
    var ok = true;
    // required name / prenom
    if (NomInput) ok = window.QuaiValidation.validateRequired(NomInput) && ok;
    if (PrenomInput)
      ok = window.QuaiValidation.validateRequired(PrenomInput) && ok;
    // allergies optional, max 200 chars
    if (AllergieInput)
      ok = window.QuaiValidation.validateTextOptional(AllergieInput, 200) && ok;
    // number of convives: integer >=1 and <=20
    if (NbConvivesInput)
      ok =
        window.QuaiValidation.validateNumber(NbConvivesInput, {
          min: 1,
          max: 20,
        }) && ok;
    return ok;
  }

  // Attacher listeners
  if (NomInput)
    NomInput.addEventListener("keyup", function () {
      window.QuaiValidation.validateRequired(NomInput);
    });
  if (PrenomInput)
    PrenomInput.addEventListener("keyup", function () {
      window.QuaiValidation.validateRequired(PrenomInput);
    });
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

  // On submit
  if (form) {
    form.addEventListener("submit", function (e) {
      if (!validateAccountForm()) {
        e.preventDefault();
        // focus first invalid
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return false;
      }
      // else allow submit
      return true;
    });
  }
})();
