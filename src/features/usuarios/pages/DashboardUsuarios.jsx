import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { fetchAuth } from "../../../core/utils/fetchAuth";
import styles from "../../shared/ModulePage.module.css";

const API = "https://localhost:7196/api";

const ROLES = [
  { id: 1, nombre: "Cliente" },
  { id: 2, nombre: "Sastre" },
  { id: 3, nombre: "Recepcionista" },
  { id: 4, nombre: "Administrador" },
];

const formInicial = {
  nombre: "",
  correo: "",
  password: "",
  rolId: 3,
  activo: true,
};

export const DashboardUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState(formInicial);
  const [editId, setEditId] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);

  const cargarUsuarios = async () => {
    try {
      const res = await fetchAuth(`${API}/Usuarios`);
      if (!res.ok) throw new Error();
      setUsuarios(await res.json());
    } catch {
      Swal.fire("Error", "No se pudieron cargar los usuarios.", "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const guardarUsuario = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.correo) {
      Swal.fire("Error", "Nombre y correo son obligatorios.", "error");
      return;
    }

    if (!editId && !form.password) {
      Swal.fire("Error", "La contraseña es obligatoria al crear.", "error");
      return;
    }

    const payload = {
      id: editId || 0,
      nombre: form.nombre,
      correo: form.correo,
      password: form.password,
      rol: Number(form.rolId),
      activo: form.activo,
    };

    try {
      const url = editId ? `${API}/Usuarios/${editId}` : `${API}/Usuarios`;
      const res = await fetchAuth(url, {
        method: editId ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();

      Swal.fire("Éxito", editId ? "Usuario actualizado." : "Usuario creado.", "success");
      setForm(formInicial);
      setEditId(null);
      setMostrarForm(false);
      cargarUsuarios();
    } catch {
      Swal.fire("Error", "No se pudo guardar el usuario.", "error");
    }
  };

  const editarUsuario = (u) => {
    setEditId(u.id);
    setForm({
      nombre: u.nombre,
      correo: u.correo,
      password: "",
      rolId: u.rolId || ROLES.find((r) => r.nombre === u.rol)?.id || 3,
      activo: u.activo,
    });
    setMostrarForm(true);
  };

  const eliminarUsuario = async (id) => {
    const result = await Swal.fire({
      title: "¿Eliminar usuario?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e74c3c",
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetchAuth(`${API}/Usuarios/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      Swal.fire("Eliminado", "Usuario eliminado.", "success");
      cargarUsuarios();
    } catch {
      Swal.fire("Error", "No se pudo eliminar.", "error");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Administración de usuarios</h1>
          <p className={styles.subtitle}>Solo visible para el administrador</p>
        </div>
        <button
          className={styles.btnPrimary}
          onClick={() => {
            setEditId(null);
            setForm(formInicial);
            setMostrarForm(!mostrarForm);
          }}
        >
          {mostrarForm ? "Cancelar" : "Nuevo usuario"}
        </button>
      </header>

      {mostrarForm && (
        <form className={styles.cardForm} onSubmit={guardarUsuario}>
          <div className={styles.formGrid}>
            <div className={styles.field}>
              <label>Nombre completo *</label>
              <input name="nombre" value={form.nombre} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>Correo *</label>
              <input type="email" name="correo" value={form.correo} onChange={handleChange} required />
            </div>
            <div className={styles.field}>
              <label>{editId ? "Nueva contraseña (opcional)" : "Contraseña *"}</label>
              <input type="password" name="password" value={form.password} onChange={handleChange} />
            </div>
            <div className={styles.field}>
              <label>Rol</label>
              <select name="rolId" value={form.rolId} onChange={handleChange}>
                {ROLES.map((r) => (
                  <option key={r.id} value={r.id}>{r.nombre}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} />
                {" "}Usuario activo
              </label>
            </div>
          </div>
          <div className={styles.formActions}>
            <button type="submit" className={styles.btnPrimary}>
              {editId ? "Actualizar" : "Crear usuario"}
            </button>
          </div>
        </form>
      )}

      <div className={styles.card} style={{ marginTop: "1.5rem" }}>
        {cargando ? (
          <p className={styles.loading}>Cargando usuarios...</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id}>
                  <td>{u.nombre}</td>
                  <td>{u.correo}</td>
                  <td>{u.rol}</td>
                  <td>
                    <span className={`${styles.badge} ${u.activo ? styles.badgeSuccess : styles.badgeDanger}`}>
                      {u.activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button className={styles.btnSecondary} onClick={() => editarUsuario(u)}>Editar</button>
                    <button className={styles.btnDanger} onClick={() => eliminarUsuario(u.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
