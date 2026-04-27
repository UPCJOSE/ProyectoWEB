import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "admin@unicesar.com" && password === "1234") {
      localStorage.setItem("login", "true");
      navigate('/finanzas'); 
    } else {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="container py-5">
      <form onSubmit={handleLogin} className="card p-4 mx-auto" style={{maxWidth: '400px'}}>
        <h2 className="font-headline text-center mb-4">Elegancia y Estilo</h2>
        <input 
          type="email" 
          className="form-control mb-3" 
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)} 
        />
        <input 
          type="password" 
          className="form-control mb-3" 
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} 
        />
        <button type="submit" className="btn btn-dark w-100">Entrar</button>
      </form>
    </div>
  );
};