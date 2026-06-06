import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import styles from "./DashboardCliente.module.css";

const API_CLIENTES = "https://localhost:7196/api/Clientes";
const API_PRENDAS = "https://localhost:7196/api/PrendasCatalogo";
const API_PEDIDOS = "https://localhost:7196/api/Pedidos";

export const DashboardCliente = () => {
  const [usuarioLocal, setUsuarioLocal] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [searchParams, setSearchParams] = useSearchParams();
  const vista = searchParams.get("vista") || "catalogo";
  
  const [prendas, setPrendas] = useState([]);

  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");

  useEffect(() => {
    const userStr = localStorage.getItem("usuario");
    if (userStr) {
      const userObj = JSON.parse(userStr);
      setUsuarioLocal(userObj);
      cargarCliente(userObj.correo);
    }
  }, []);

  const cargarCliente = async (correo) => {
    try {
      const res = await fetchAuth(`${API_CLIENTES}/correo/${correo}`);
      
      if (!res.ok) {
        if (res.status === 404) setCliente({ noExiste: true });
        return;
      }

      const data = await res.json();
      setCliente(data);
      cargarCatálogo(); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const cargarCatálogo = async () => {
    try {
      const res = await fetchAuth(API_PRENDAS);
      const data = await res.json();
      setPrendas(data.filter((p) => p.activa));
    } catch (error) {
      console.error("Error cargando prendas:", error);
    }
  };

  const guardarPerfil = async (e) => {
    e.preventDefault();
    if (!telefono || !direccion) {
      Swal.fire("Atención", "Todos los campos son obligatorios", "warning");
      return;
    }

    try {
      const payload = {
        nombre: usuarioLocal.nombre, 
        correo: usuarioLocal.correo, 
        telefono,
        direccion,
      };

      const res = await fetchAuth(API_CLIENTES, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire("¡Perfecto!", "Tu perfil ha sido completado.", "success");
        cargarCliente(usuarioLocal.correo);
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo guardar el perfil", "error");
    }
  };

  const hacerPedido = async (prenda) => {
    const confirm = await Swal.fire({
      title: `¿Solicitar ${prenda.nombre}?`,
      text: `El costo base es de $${prenda.precioBase}. Nuestro equipo te contactará para agendar la toma de medidas.`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, hacer pedido",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#c9a84c"
    });

    if (!confirm.isConfirmed) return;

    try {
      const fechaEstimada = new Date();
      fechaEstimada.setDate(fechaEstimada.getDate() + 15);

      const payload = {
        clienteId: cliente.id,
        prendaCatalogoId: prenda.id,
        costoTotal: prenda.precioBase,
        saldoPendiente: prenda.precioBase, 
        estado: "Pendiente",
        fechaEntrega: fechaEstimada.toISOString()
      };

      const res = await fetchAuth(API_PEDIDOS, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        Swal.fire("¡Pedido realizado!", "Puedes verlo en la pestaña 'Mis Pedidos'.", "success");
        cargarCliente(usuarioLocal.correo); 
        setSearchParams({ vista: "pedidos" });
      }
    } catch (error) {
      Swal.fire("Error", "No se pudo crear el pedido", "error");
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando...</div>;

  //PANTALLA DE PERFIL INCOMPLETO
  if (cliente?.noExiste) {
    return (
      <div className={styles.page} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh'}}>
        <div className={styles.card} style={{ maxWidth: '500px', width: '100%', padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', color: '#181f21', fontFamily: "'Noto Serif', serif" }}>Completa tu perfil</h2>
          <p style={{ textAlign: 'center', color: '#747879', marginBottom: '2rem' }}>
            Para poder realizar pedidos y guardar tus medidas, necesitamos unos datos extra.
          </p>
          <form onSubmit={guardarPerfil}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Teléfono de contacto</label>
              <input type="text" className="form-control" value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Ej: 3001234567" />
            </div>
            <div style={{ marginBottom: '2rem' }}>
              <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '5px' }}>Dirección de envío/residencia</label>
              <input type="text" className="form-control" value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Ej: Calle 12 #34-56" />
            </div>
            <button type="submit" className={styles.btnGold} style={{ width: '100%' }}>Guardar mis datos</button>
          </form>
        </div>
      </div>
    );
  }

  //perfil Completo
  return (
    <div className={styles.page}>
      {/* VISTA 1: CATÁLOGO */}
      {vista === "catalogo" && (
        <section>
          <h2 className={styles.title}>Catálogo Premium</h2>
          <p className="text-muted mb-4">Selecciona una prenda para iniciar tu solicitud de confección.</p>
          <div className={styles.grid}>
            {prendas.map(prenda => (
              <div key={prenda.id} className={styles.card}>
                <div className={styles.imageWrap}>
                  <img src={prenda.imagenUrl ? `https://localhost:7196${prenda.imagenUrl}` : "https://placehold.co/600x800"} alt={prenda.nombre} className={styles.image} />
                </div>
                <div className={styles.cardBody}>
                  <span className={styles.type}>{prenda.tipoPrenda}</span>
                  <h3 className={styles.name}>{prenda.nombre}</h3>
                  <div className={styles.footer}>
                    <strong className={styles.price}>${prenda.precioBase}</strong>
                    <button className={styles.btnGold} onClick={() => hacerPedido(prenda)}>Solicitar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* VISTA 2: MIS PEDIDOS */}
      {vista === "pedidos" && (
        <section>
          <h2 className={styles.title}>Mis Pedidos</h2>
          {cliente.pedidos?.length > 0 ? (
             <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
               {cliente.pedidos.map(pedido => (
                 <div key={pedido.id} className={styles.card} style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                   <div>
                     <h4 style={{ margin: 0 }}>{pedido.prendaCatalogo?.nombre || "Prenda a medida"}</h4>
                     <p style={{ margin: 0, color: '#747879' }}>Fecha de entrega estimada: {new Date(pedido.fechaEntrega).toLocaleDateString()}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <strong style={{ display: 'block', fontSize: '1.2rem' }}>${pedido.costoTotal}</strong>
                     <span style={{ backgroundColor: '#181f21', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem' }}>
                       {pedido.estado}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <p>No tienes pedidos activos. Ve al catálogo para realizar uno.</p>
          )}
        </section>
      )}

      {/* VISTA 3: MI PERFIL */}
      {vista === "perfil" && (
        <section className={styles.card} style={{ padding: '2rem', maxWidth: '600px' }}>
          <h2 style={{ fontFamily: "'Noto Serif', serif" }}>Mis Datos</h2>
          <hr />
          <p><strong>Nombre:</strong> {cliente.nombre}</p>
          <p><strong>Correo:</strong> {cliente.correo}</p>
          <p><strong>Teléfono:</strong> {cliente.telefono}</p>
          <p><strong>Dirección:</strong> {cliente.direccion}</p>
          <p style={{ color: '#c9a84c', marginTop: '1rem', fontSize: '0.9rem' }}>
            * Para modificar tus medidas físicas, debes asistir al Atelier.
          </p>
        </section>
      )}
    </div>
  );
}; 