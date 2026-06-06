import Swal from "sweetalert2";

const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const payloadBase64 = token.split(".")[1];
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    const expDate = payload.exp * 1000;
    return Date.now() > expDate;
  } catch (error) {
    return true;
  }
};

export const fetchAuth = async (url, options = {}) => {
  const token = localStorage.getItem("token");

  if (!token || isTokenExpired(token)) {
    Swal.fire({
      icon: "warning",
      title: "Sesión expirada",
      text: "Por favor, inicia sesión nuevamente.",
      confirmButtonColor: "#c9a84c",
    });

    localStorage.clear();

    window.location.href = "/login";

    throw new Error("Token expirado o inexistente");
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    Swal.fire("No autorizado", "Tu sesión es inválida.", "error");
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Petición rechazada por el servidor");
  }

  return response;
};
