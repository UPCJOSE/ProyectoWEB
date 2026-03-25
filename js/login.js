document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("formLogin");

  form.addEventListener("submit", (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const role = document.getElementById("role").value;

    // para probar nomas
    if (email === "admin@unicesar.com" && password === "1234") {
      localStorage.setItem("login", "true");
      localStorage.setItem("rol", role);
      localStorage.setItem("usuario", email);

      if (role === "administrador") {
        window.location.href = "/html/finanzas.html"; 
      }
      else if (role === "cliente") {
        window.location.href = "/html/Cliente/principal.html"; 
      }
      else if (role === "recepcionista") {
        window.location.href = "/html/Recepcionista/dashboard.html"; 
      }
      else if (role === "sastre") {
        window.location.href = "/html/pedidos.html"; 
      }
    } else {
      alert("Credenciales incorrectas");
    }

  });

});