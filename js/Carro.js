document.addEventListener("DOMContentLoaded", () => {

  let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
  let contenedor = document.getElementById("listaCarrito");
  let total = 0;

  contenedor.innerHTML = "";

  if (carrito.length === 0) {
    contenedor.innerHTML = "<p class='text-center'>Tu carrito está vacío </p>";
    return;
  }

  carrito.forEach((producto, index) => {

    total += producto.precio * producto.cantidad;

    contenedor.innerHTML += `
      <div class="card mb-3">
        <div class="card-body d-flex justify-content-between align-items-center">

          <div>
            <h5>${producto.nombre}</h5>
            <p class="text-muted">$${producto.precio}</p>
          </div>

          <div class="d-flex align-items-center gap-2">
            <span>Cantidad: ${producto.cantidad}</span>
          </div>

          <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${index})">
            <i class="bi bi-trash"></i>
          </button>

        </div>
      </div>
    `;
  });

  document.getElementById("total").innerText = "$" + total;

});

function eliminarProducto(index) {

  let carrito = JSON.parse(localStorage.getItem("carrito"));

  carrito.splice(index, 1);

  localStorage.setItem("carrito", JSON.stringify(carrito));

  location.reload();
}