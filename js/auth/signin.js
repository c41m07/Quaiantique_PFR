console.log("Sign-in script loaded");
const mailInput = document.getElementById("EmailInput");
const passwordInput = document.getElementById("PasswordInput");
const btnSingin = document.getElementById("btnSignIn");
btnSingin.addEventListener("click", checkCredentials);

function checkCredentials() {
  console.log("Sign-in button clicked");
  //Appel d'API ICI
  if (mailInput.value == "test@mail.fr" && passwordInput.value == "123") {
    //placer un vrais token
    const token = "ceci_est_un_token_de_connexion_test_valide";
    setToken(token);
    setCookie(roleCookieName, "admin", 7);
    window.location.href = "/";
  } else {
    //connexion pas OK
    mailInput.classList.add("is-invalid");
    passwordInput.classList.add("is-invalid");
    return false;
  }
}
