// filepath: c:\Env\Workspace\Quaiantique_PFR\js\auth\validation.js
// Utilitaires de validation partagés (extraits et adaptés depuis js/auth/signup.js)
(function (window) {
  "use strict";

  function setValid(input) {
    if (!input) return;
    input.classList.remove("is-invalid");
    input.classList.add("is-valid");
    input.setAttribute("aria-invalid", "false");
  }

  function setInvalid(input) {
    if (!input) return;
    input.classList.remove("is-valid");
    input.classList.add("is-invalid");
    input.setAttribute("aria-invalid", "true");
  }

  function validateRequired(input) {
    if (!input) return false;
    var val = (input.value || "").toString().trim();
    if (val !== "") {
      setValid(input);
      return true;
    } else {
      setInvalid(input);
      return false;
    }
  }

  function validateEmail(input) {
    if (!input) return false;
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var val = (input.value || "").toString().trim();
    if (emailRegex.test(val)) {
      setValid(input);
      return true;
    }
    setInvalid(input);
    return false;
  }

  function validatePassword(input) {
    if (!input) return false;
    // >=8 char, 1 lower, 1 upper, 1 digit, 1 special
    var passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    var val = input.value || "";
    if (passwordRegex.test(val)) {
      setValid(input);
      return true;
    }
    setInvalid(input);
    return false;
  }

  function checkPasswordMatch(passwordInput, confirmInput) {
    if (!confirmInput) return false;
    var p = passwordInput ? passwordInput.value || "" : "";
    var c = confirmInput.value || "";
    if (p === c && c !== "") {
      setValid(confirmInput);
      return true;
    }
    setInvalid(confirmInput);
    return false;
  }

  function validateNumber(input, opts) {
    if (!input) return false;
    var val = input.value;
    if (val === "" || val === null || typeof val === "undefined") {
      setInvalid(input);
      return false;
    }
    var num = Number(val);
    if (!isFinite(num) || Math.floor(num) !== num) {
      setInvalid(input);
      return false;
    }
    if (opts) {
      if (typeof opts.min === "number" && num < opts.min) {
        setInvalid(input);
        return false;
      }
      if (typeof opts.max === "number" && num > opts.max) {
        setInvalid(input);
        return false;
      }
    }
    setValid(input);
    return true;
  }

  function validateDateNotPast(input) {
    if (!input) return false;
    var v = input.value;
    if (!v) {
      setInvalid(input);
      return false;
    }
    // Compare dates at local day precision
    var inputDate = new Date(v + "T00:00:00");
    if (isNaN(inputDate.getTime())) {
      setInvalid(input);
      return false;
    }
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    if (inputDate >= today) {
      setValid(input);
      return true;
    }
    setInvalid(input);
    return false;
  }

  function validateTextOptional(input, maxLen) {
    if (!input) return true; // optional
    var v = (input.value || "").toString().trim();
    if (v === "") {
      // empty is allowed
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
      input.removeAttribute("aria-invalid");
      return true;
    }
    if (typeof maxLen === "number" && v.length > maxLen) {
      setInvalid(input);
      return false;
    }
    // simple sanitize: trim
    setValid(input);
    return true;
  }

  function validateImageFile(input, options) {
    if (!input) return false;
    var file = input.files && input.files[0];
    if (!file) {
      setInvalid(input);
      return false;
    }
    var allowed =
      options && options.allowedTypes
        ? options.allowedTypes
        : ["image/jpeg", "image/png", "image/webp"];
    var maxBytes =
      options && options.maxSizeMB
        ? options.maxSizeMB * 1024 * 1024
        : 5 * 1024 * 1024;
    if (
      allowed.indexOf(file.type) === -1 &&
      file.type.indexOf("image/") !== 0
    ) {
      setInvalid(input);
      return false;
    }
    if (file.size > maxBytes) {
      setInvalid(input);
      return false;
    }
    setValid(input);
    return true;
  }

  // Expose API
  window.QuaiValidation = {
    setValid: setValid,
    setInvalid: setInvalid,
    validateRequired: validateRequired,
    validateEmail: validateEmail,
    validatePassword: validatePassword,
    checkPasswordMatch: checkPasswordMatch,
    validateNumber: validateNumber,
    validateDateNotPast: validateDateNotPast,
    validateTextOptional: validateTextOptional,
    validateImageFile: validateImageFile,
  };
})(window);
