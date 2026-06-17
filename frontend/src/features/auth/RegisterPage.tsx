import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../lib/api';

export const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/register', { name, email, password });
      login(res.data.access_token, res.data.user);
      navigate('/');
    } catch (err) {
      setError('Hubo un error al crear la cuenta.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md card">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="La Maxima Barbershop" className="w-40 h-auto mx-auto mb-4 drop-shadow-md" />
          <h2 className="text-2xl font-bold text-textHighlight">Crea tu cuenta</h2>
          <p className="text-textBase mt-2">Únete a La Maxima Barbershop</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-textBase mb-2">Nombre del Negocio / Tu Nombre</label>
            <input
              type="text"
              className="input-field"
              placeholder="Mi Peluquería"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textBase mb-2">Correo Electrónico</label>
            <input
              type="email"
              className="input-field"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-textBase mb-2">Contraseña</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <button type="submit" className="w-full btn-primary text-lg">
            Registrarse
          </button>
        </form>

        <p className="mt-6 text-center text-textBase text-sm">
          ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:text-primaryHover font-medium transition-colors">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
};
