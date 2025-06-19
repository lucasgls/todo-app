import React, { useState } from 'react';
import { apiService } from '../api/apiService';
import toast from 'react-hot-toast';

interface LoginScreenProps {
  onLoginSuccess: (token: string) => void;
}

// Novo componente de modal de cadastro
const RegisterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await apiService.register(username, email, password);
      setSuccess('Cadastro realizado com sucesso! Faça login para continuar.');
      setUsername(''); setEmail(''); setPassword('');
      setTimeout(() => {
        onClose();
        toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      }, 800);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao cadastrar. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white/95 rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors" onClick={onClose} aria-label="Fechar modal">×</button>
        <h2 className="text-2xl font-bold text-gray-900 mb-1 text-center">Criar conta</h2>
        <p className="text-gray-500 text-sm text-center mb-4">Preencha os campos para se cadastrar</p>
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-2 text-sm text-center">{error}</p>}
        {success && <p className="bg-green-100 text-green-700 p-3 rounded-lg mb-2 text-sm text-center">{success}</p>}
        <form onSubmit={handleRegister} className="flex flex-col gap-4 mt-2">
          <div>
            <label className="text-gray-700 text-sm font-semibold" htmlFor="register-username">Nome de usuário</label>
            <input id="register-username" type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder-gray-400" placeholder="Seu nome de usuário" required />
          </div>
          <div>
            <label className="text-gray-700 text-sm font-semibold" htmlFor="register-email">Email</label>
            <input id="register-email" type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder-gray-400" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="text-gray-700 text-sm font-semibold" htmlFor="register-password">Senha</label>
            <input id="register-password" type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder-gray-400" placeholder="••••••••" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-base shadow-sm mt-2">
            {isLoading ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = await apiService.login(username, password);
      onLoginSuccess(token);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Ocorreu um erro desconhecido.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <RegisterModal isOpen={isRegisterOpen} onClose={() => setIsRegisterOpen(false)} />
      <div className="w-full max-w-md">
        <form onSubmit={handleLogin} className="bg-white/90 shadow-2xl rounded-2xl px-8 py-10 flex flex-col gap-6 border border-gray-100">
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-1 text-center">Login na sua conta</h1>
            <p className="text-gray-500 text-sm text-center">Entre com seu email e senha para acessar</p>
          </div>
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-2 text-sm text-center">{error}</p>}
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 text-sm font-semibold" htmlFor="username">Username</label>
            <input id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username / seu@email.com" className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder-gray-400" required />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 text-sm font-semibold" htmlFor="password">Senha</label>
              <span className="relative group">
                <a href="#" className="text-xs text-blue-500 hover:underline">Esqueceu a senha?</a>
                <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:flex px-3 py-1 rounded bg-gray-800 text-white text-xs shadow transition-opacity z-20 whitespace-nowrap">
                  então lembra kkk
                </span>
              </span>
            </div>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-gray-100 border border-gray-300 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-colors placeholder-gray-400" required />
          </div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-4 rounded-lg transition-colors disabled:opacity-50 text-base shadow-sm mt-2">
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          <div className="text-center text-sm text-gray-500 mt-2">
            Não tem uma conta?{' '}
            <button type="button" className="text-blue-600 hover:underline font-medium" onClick={() => setIsRegisterOpen(true)}>
              Cadastre-se
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 