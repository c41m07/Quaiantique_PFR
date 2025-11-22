const tokenCookieName = "auth_token";
const btnSignout = document.getElementById("signoutbtn");
const roleCookieName = "role";

btnSignout.addEventListener("click", signOut);

function getRole() {
  return getCookie(roleCookieName);
}

// Gestion Token
function setToken(token) {
  setCookie(tokenCookieName, token, 7);
}

function getToken() {
  return getCookie(tokenCookieName);
}

//gestion de la connexion
function isConnected() {
  if (getToken() == null || getToken() == undefined) {
    return false;
  } else {
    return true;
  }
}

function signOut() {
  eraseCookie(tokenCookieName);
  eraseCookie(roleCookieName);
  window.location.href = "/";
}

// cookie management
function setCookie(name, value, days) {
  var expires = "";
  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = "; expires=" + date.toUTCString();
  }
  document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function eraseCookie(name) {
  document.cookie = name + "=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

//Show & Hide

function showAndHideElementForRole(role) {
  const userConnected = isConnected();
  const roleConnected = getRole();

  let allElementsToEdit = document.querySelectorAll("[data-show]");

  allElementsToEdit.forEach((element) => {
    switch (element.dataset.show) {
      case "disconnected":
        if (userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "connected":
        if (!userConnected) {
          element.classList.add("d-none");
        }
        break;
      case "admin":
        if (!userConnected || roleConnected != "admin") {
          element.classList.add("d-none");
        }
        break;
      case "client":
        if (!userConnected || roleConnected != "client") {
          element.classList.add("d-none");
        }
        break;
    }
  });
}
