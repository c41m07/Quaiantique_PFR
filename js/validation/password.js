// filepath: c:\Env\Workspace\Quaiantique_PFR\js\validation\password.js
// Validation pour la page editpassword.html
(function () {
  "use strict";
  if (!window.QuaiValidation) {
    console.warn("QuaiValidation utilitaire non trouvé.");
    return;
  }

  var passwordInput = document.getElementById("PasswordInput");
  var confirmInput = document.getElementById("ValidatePasswordInput");
  var form = document.querySelector("form");

  if (passwordInput)
    passwordInput.addEventListener("keyup", function () {
      window.QuaiValidation.validatePassword(passwordInput);
    });
  if (confirmInput)
    confirmInput.addEventListener("keyup", function () {
      window.QuaiValidation.checkPasswordMatch(passwordInput, confirmInput);
    });

  if (form) {
    form.addEventListener("submit", function (e) {
      var ok = true;
      if (passwordInput)
        ok = window.QuaiValidation.validatePassword(passwordInput) && ok;
      if (confirmInput)
        ok =
          window.QuaiValidation.checkPasswordMatch(
            passwordInput,
            confirmInput,
          ) && ok;
      if (!ok) {
        e.preventDefault();
        var firstInvalid = form.querySelector(".is-invalid");
        if (firstInvalid) firstInvalid.focus();
        return false;
      }
      return true;
    });
  }
})();
