// 1. Definimos los datos de cada prenda
const prendas = [
    { nombre: "CAMISETA", medidas: ["Cuello", "Pecho", "Cintura", "Manga", "Largo"] },
    { nombre: "PANTALÓN", medidas: ["Cintura", "Cadera", "Largo total", "Entrepierna", "Ancho Bajo"] },
    { nombre: "BLUSA", medidas: ["Ancho de espalda", "Largo de Espalda", "Hombros", "Busto", "Talla delandero", "Manga"] },
    { nombre: "FALDA", medidas: ["Contorno cintura", "Alto de cadera", "Contorno de cadera", "Largo"] },
];

const contenedor = document.getElementById('contenedor-prendas');

// 2. Función para crear la tarjeta de cada prenda
prendas.forEach(prenda => {
    let inputsHTML = "";

    // Generamos los inputs para cada medida de esta prenda
    prenda.medidas.forEach(medida => {
        inputsHTML += `
            <div class="col-6 mb-3">
                <label class="form-label small fw-bold">${medida}</label>
                <input type="text" class="form-control form-control-sm" placeholder="cm">
            </div>`;
    });

    // Construimos la tarjeta completa (usando tu diseño original)
    const cardHTML = `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card shadow-sm rounded-4 h-100">
                <div class="card-body p-4">
                    <h6 class="text-secondary fw-semibold mb-4 text-center border-bottom pb-2">
                        ${prenda.nombre}
                    </h6>
                    <div class="row">
                        ${inputsHTML}
                    </div>
                    <div class="row mt-3">
                        <div class="col-6">
                            <button class="btn btn-primary w-100 btn-sm">Guardar</button>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-secondary w-100 btn-sm">Limpiar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Lo inyectamos en el HTML
    contenedor.innerHTML += cardHTML;
});