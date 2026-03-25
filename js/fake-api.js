document.addEventListener("DOMContentLoaded", () => {
  const contenedor = document.getElementById("productos");

  Promise.all([
    fetch("https://fakestoreapi.com/products/category/men's clothing").then(
      (r) => r.json(),
    ),
    fetch("https://fakestoreapi.com/products/category/women's clothing").then(
      (r) => r.json(),
    ),
  ]).then(([hombres, mujeres]) => {
    const productos = [...hombres, ...mujeres];

    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    productos.forEach((prod) => {
      contenedor.innerHTML += `
      <div class="col-6 col-md-3">
        <div class="card h-100 shadow-sm rounded-4">

          <img src="${prod.image}" class="card-img-top p-3" style="height:200px; object-fit:contain;">

          <div class="card-body text-center d-flex flex-column">

            <h6>${prod.title.substring(0, 40)}...</h6>
            <p>$${prod.price}</p>

            <button class="btn btn-dark mt-auto"
              onclick="agregarAlCarrito('${prod.title}', ${prod.price})">
              Agregar 🛒
            </button>

          </div>

        </div>
      </div>
    `;
    });
  });
});

const agregarAlCarrito = (nombre, precio) => {
  let cantidadInput = prompt(
    `¿Cuántas unidades de "${nombre}" deseas agregar al carrito?`,
    "1",
  );

  if (cantidadInput === null || cantidadInput.trim() === "") return;

  let cantidadAgregada = parseInt(cantidadInput);

  if (isNaN(cantidadAgregada) || cantidadAgregada <= 0) {
    alert("❌ Por favor, ingresa una cantidad válida mayor a cero.");
    return;
  }

  const carrito = JSON.parse(localStorage.getItem("carrito") ?? "[]");
  const index = carrito.findIndex((p) => p.nombre === nombre);

  if (index !== -1) {
    carrito[index].cantidad += cantidadAgregada;
  } else {
    carrito.push({ nombre, precio, cantidad: cantidadAgregada });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));

  alert(
    `✅ ¡Perfecto! Se han añadido ${cantidadAgregada} unidad(es) de "${nombre}" a tu carrito.`,
  );
};
