import { useState, useEffect, useRef } from "react";
import { fetchAuth } from "../utils/fetchAuth";
import styles from "./BuscarCliente.module.css";

const API = "http://localhost:5000/api";

/**
 * Búsqueda de cliente por nombre (no lista extensa).
 * onSelect({ id, nombre }) cuando el usuario elige un resultado.
 */
export const BuscarCliente = ({
  value,
  onChange,
  onSelect,
  placeholder = "Buscar cliente por nombre...",
  disabled = false,
}) => {
  const [query, setQuery] = useState("");
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);
  const [sinResultados, setSinResultados] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    if (value?.nombre) {
      setClienteSeleccionado(value);
      setQuery(value.nombre);
    } else if (!value) {
      setClienteSeleccionado(null);
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setMostrarLista(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!query.trim() || (clienteSeleccionado && query === clienteSeleccionado.nombre)) {
      setResultados([]);
      setSinResultados(false);
      return;
    }

    const timer = setTimeout(async () => {
      setBuscando(true);
      try {
        const res = await fetchAuth(
          `${API}/Clientes/buscar?q=${encodeURIComponent(query.trim())}`
        );
        if (res.ok) {
          const data = await res.json();
          setResultados(data);
          setSinResultados(data.length === 0);
          setMostrarLista(true);
        }
      } catch {
        setResultados([]);
        setSinResultados(true);
      } finally {
        setBuscando(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, clienteSeleccionado]);

  const seleccionar = (cliente) => {
    setClienteSeleccionado(cliente);
    setQuery(cliente.nombre);
    setMostrarLista(false);
    setSinResultados(false);
    onSelect?.(cliente);
    onChange?.(cliente.id);
  };

  const limpiar = () => {
    setQuery("");
    setClienteSeleccionado(null);
    setResultados([]);
    setSinResultados(false);
    onSelect?.(null);
    onChange?.("");
  };

  return (
    <div className={styles.wrap} ref={wrapRef}>
      <div className={styles.inputRow}>
        <input
          type="text"
          className={styles.input}
          value={query}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setClienteSeleccionado(null);
            onChange?.("");
            onSelect?.(null);
          }}
          onFocus={() => query.trim() && setMostrarLista(true)}
        />
        {query && !disabled && (
          <button type="button" className={styles.btnClear} onClick={limpiar} aria-label="Limpiar">
            ×
          </button>
        )}
      </div>

      {buscando && <span className={styles.hint}>Buscando...</span>}

      {sinResultados && query.trim() && !clienteSeleccionado && (
        <span className={styles.noExiste}>No existe el cliente</span>
      )}

      {mostrarLista && resultados.length > 0 && (
        <ul className={styles.lista}>
          {resultados.map((c) => (
            <li key={c.id}>
              <button type="button" className={styles.item} onClick={() => seleccionar(c)}>
                <strong>{c.nombre}</strong>
                {c.telefono && <span>{c.telefono}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
