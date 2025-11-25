// filepath: c:\Env\Workspace\Quaiantique_PFR_front\js\validation\account.js
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
    var EmailInput = document.getElementById("EmailInput");
    var AllergieInput = document.getElementById("AllergieInput");
    var NbConvivesInput = document.getElementById("NbConvivesInput");
    var form = document.getElementById("form");

    function validateAccountForm() {
        var ok = true;
        // required name / prenom
        if (NomInput) {
            var isValidNom = window.QuaiValidation.validateRequired(NomInput);
            ok = ok && isValidNom;
        }
        if (PrenomInput) {
            var isValidPrenom = window.QuaiValidation.validateRequired(PrenomInput);
            ok = ok && isValidPrenom;
        }
        // allergies optional, max 200 chars
        if (EmailInput) {
            var isValidEmail = window.QuaiValidation.validateEmail(EmailInput);
            ok = ok && isValidEmail;
        }
        if (AllergieInput) {
            var isValidAllergie = window.QuaiValidation.validateTextOptional(AllergieInput, 200);
            ok = ok && isValidAllergie;
        }
        // number of convives: integer >=1 and <=20
        if (NbConvivesInput) {
            var isValidNbConvives = window.QuaiValidation.validateNumber(NbConvivesInput, {
                min: 1,
                max: 20,
            });
            ok = ok && isValidNbConvives;
        }
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
    if (EmailInput)
        EmailInput.addEventListener("keyup", function () {
            window.QuaiValidation.validateEmail(EmailInput);
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

