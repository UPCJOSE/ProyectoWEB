document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");

  form.addEventListener("submit", (e) => {

    e.preventDefault(); 

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // para probar nomas
    if (
      email === "admin@unicesar.com" &&
      password === "1234"
    ) {

      localStorage.setItem("login", "true");
      localStorage.setItem("rol", role);
      localStorage.setItem("usuario", email);

      window.location.href = "/html/Finanzas.html";

    } else {
      alert("Credenciales incorrectas ");
    }

  });

});