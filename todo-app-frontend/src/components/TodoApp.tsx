import React, { useState, useEffect } from 'react';
import { apiService } from '../api/apiService';
import type { Task, UserProfile, TaskCreateData } from '../types/types';
import { TaskModal } from './TaskModal';
import { EditTaskModal } from './EditTaskModal';
import { FiLogOut, FiUsers, FiUser, FiMail, FiShield, FiRefreshCw } from 'react-icons/fi';


interface TodoAppProps {
  token: string;
  onLogout: () => void;
}

// Novo modal de perfil
const ProfileModal: React.FC<{ isOpen: boolean; onClose: () => void; user: UserProfile | null }> = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null;
  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 border border-gray-100 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors" onClick={onClose} aria-label="Fechar modal">×</button>
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
            <FiUser size={48} color="#6b7280" />
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">{user.username}</div>
            <div className="text-gray-500 text-base">{user.email}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TodoApp: React.FC<TodoAppProps> = ({ token, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Set<number>>(new Set());
  const [adminError, setAdminError] = useState<string | null>(null);
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [searchUserId, setSearchUserId] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [tasksData, profileData] = await Promise.all([
          apiService.getTasks(token),
          apiService.getProfile(token)
        ]);
        setTasks(tasksData);
        setUserProfile(profileData);
        
        // Se for admin, carregar usuários automaticamente
        if (profileData.role && profileData.role.toUpperCase().includes('ADMIN')) {
          loadUsers();
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('Ocorreu um erro desconhecido.');
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [token]);

  useEffect(() => {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    if (savedCompletedTasks) {
      try {
        const parsed = JSON.parse(savedCompletedTasks);
        setCompletedTasks(new Set(parsed));
      } catch {
        // ignore
      }
    }
  }, []);

  const saveCompletedTasks = (completedSet: Set<number>) => {
    localStorage.setItem('completedTasks', JSON.stringify(Array.from(completedSet)));
  };

  const handleCreateTask = async (taskData: TaskCreateData) => {
    setIsCreating(true);
    setError(null);
    try {
      const newTask = await apiService.createTask(token, taskData);
      setTasks(prevTasks => [...prevTasks, newTask]);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao criar a tarefa. Tente novamente.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    setIsDeleting(taskId);
    setError(null);
    try {
      await apiService.deleteTask(token, taskId);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao apagar a tarefa. Tente novamente.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateTaskStatus = (task: Task) => {
    const isCompleted = completedTasks.has(task.id);
    const newCompletedTasks = new Set(completedTasks);
    if (isCompleted) newCompletedTasks.delete(task.id);
    else newCompletedTasks.add(task.id);
    setCompletedTasks(newCompletedTasks);
    saveCompletedTasks(newCompletedTasks);
  };

  const handleUpdateTask = async (taskId: number, taskData: Partial<Task>) => {
    setIsEditing(true);
    setError(null);
    try {
      const updatedTask = await apiService.updateTask(token, taskId, taskData);
      setTasks(prevTasks => prevTasks.map(t => t.id === taskId ? updatedTask : t));
      setIsEditModalOpen(false);
      setEditingTask(null);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError('Erro ao atualizar a tarefa. Tente novamente.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsEditModalOpen(true);
  };

  const getPriorityClass = (priority: string | null): string => {
    switch (priority) {
      case 'Alta': return 'bg-red-100 text-red-700';
      case 'Media': return 'bg-yellow-100 text-yellow-700';
      case 'Baixa': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Função para deletar tarefas concluídas e depois deslogar
  const handleLogoutComDelete = async () => {
    const savedCompletedTasks = localStorage.getItem('completedTasks');
    let completedIds: number[] = [];
    if (savedCompletedTasks) {
      try {
        completedIds = JSON.parse(savedCompletedTasks);
      } catch {
        completedIds = [];
      }
    }
    // Deletar cada tarefa concluída
    for (const id of completedIds) {
      try {
        await apiService.deleteTask(token, id);
      } catch {
        // Ignorar erros individuais para não travar o logout
      }
    }
    localStorage.removeItem('completedTasks');
    onLogout();
  };

  // Função para filtrar usuários por ID
  const filterUsersById = (searchId: string) => {
    if (!searchId.trim()) {
      setFilteredUsers(users);
      return;
    }
    
    const filtered = users.filter(user => 
      user.id.toString().includes(searchId.trim())
    );
    setFilteredUsers(filtered);
  };

  // Função para carregar usuários
  const loadUsers = async () => {
    setUsersLoading(true);
    setAdminError(null);
    try {
      const data = await apiService.getUsers(token);
      setUsers(data);
      setFilteredUsers(data); // Inicializar filtrados com todos os usuários
    } catch {
      setAdminError('Erro ao buscar usuários.');
    } finally {
      setUsersLoading(false);
    }
  };

  // Função para obter cor baseada no role
  const getRoleColor = (role: string) => {
    const roleLower = role.toLowerCase();
    if (roleLower.includes('admin')) {
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        badge: 'bg-red-100 text-red-800'
      };
    } else {
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        badge: 'bg-blue-100 text-blue-800'
      };
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans flex flex-col relative">
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <div className="container mx-auto flex justify-between items-center px-6 gap-4">
          {/* Dropdown de usuário moderno */}
          <div className="relative">
            <button
              className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center border-2 border-white shadow hover:ring-2 hover:ring-blue-400 transition-all focus:outline-none"
              onClick={() => setAdminSidebarOpen((v) => !v)}
              aria-label="Abrir menu do usuário"
            >
              <FiUser size={28} color="#6b7280" />
            </button>
            {/* Dropdown */}
            {adminSidebarOpen &&
              <div className="absolute left-0 mt-2 w-64 bg-white text-gray-800 rounded-xl shadow-2xl border border-gray-200 z-50 animate-fade-in overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <FiUser size={22} color="#6b7280" />
                  </div>
                  <div>
                    <div className="font-semibold text-base">{userProfile?.username}</div>
                    <div className="text-xs text-gray-500">{userProfile?.email}</div>
                  </div>
                </div>
                <div className="flex flex-col py-2">
                  <button
                    className="flex items-center gap-2 px-5 py-3 w-full text-left text-sm text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    onClick={() => setIsProfileModalOpen(true)}
                  >
                    <FiUser size={18} /> Ver perfil
                  </button>
                  {userProfile && userProfile.role && userProfile.role.toUpperCase().includes('ADMIN') && (
                    <button
                      className="flex items-center gap-2 px-5 py-3 hover:bg-gray-50 transition-colors text-left text-sm"
                      onClick={() => { setShowUsersModal(true); setAdminSidebarOpen(false); }}
                    >
                      <FiUsers size={18} /> Listar Usuários
                    </button>
                  )}
                  <button
                    className="flex items-center gap-2 px-5 py-3 hover:bg-gray-50 transition-colors text-left text-sm border-t border-gray-200 mt-2"
                    onClick={handleLogoutComDelete}
                  >
                    <FiLogOut size={18} /> Sair
                  </button>
                </div>
              </div>
            }
          </div>
          {/* Botão de logout fixo no header */}
          <button onClick={handleLogoutComDelete} className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-red-50 focus:outline-none">
            <FiLogOut size={20} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      {/* Modal para listar usuários (apenas para admins) */}
      {userProfile && userProfile.role && userProfile.role.toUpperCase().includes('ADMIN') && showUsersModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-4xl mx-4 p-6 md:p-8 border border-white/20 relative animate-fade-in">
            <button 
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 flex items-center justify-center text-gray-500 hover:text-red-600 transition-colors" 
              onClick={() => setShowUsersModal(false)} 
              aria-label="Fechar modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <FiUsers size={20} color="white" />
              </div>
              <div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800">Usuários do Sistema</h3>
                <p className="text-gray-600 text-sm">Visualização detalhada dos usuários</p>
              </div>
            </div>

            {/* Campo de busca por ID */}
            <div className="mb-6">
              <div className="flex items-end justify-between">
                <div className="w-64">
                  <label htmlFor="searchUserId" className="block text-sm font-medium text-gray-700 mb-2">
                    Buscar por ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="searchUserId"
                      value={searchUserId}
                      onChange={(e) => {
                        setSearchUserId(e.target.value);
                        filterUsersById(e.target.value);
                      }}
                      placeholder="Digite o ID..."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm bg-white text-gray-800 placeholder-gray-400"
                    />
                    {searchUserId && (
                      <button
                        onClick={() => {
                          setSearchUserId('');
                          setFilteredUsers(users);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        aria-label="Limpar busca"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                <button
                  onClick={loadUsers}
                  disabled={usersLoading}
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                  aria-label="Atualizar lista de usuários"
                >
                  <FiRefreshCw size={16} className={usersLoading ? 'animate-spin' : ''} />
                </button>
              </div>
              {searchUserId && (
                <div className="mt-2 text-sm text-gray-600">
                  {filteredUsers.length === 0 ? (
                    <span className="text-red-600">Nenhum usuário encontrado com ID "{searchUserId}"</span>
                  ) : (
                    <span className="text-green-600">
                      {filteredUsers.length} usuário{filteredUsers.length !== 1 ? 's' : ''} encontrado{filteredUsers.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              )}
            </div>

            {adminError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                {adminError}
              </div>
            )}

            {usersLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Carregando usuários...</span>
              </div>
            ) : filteredUsers.length > 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header da tabela */}
                <div className="bg-gray-50 px-4 md:px-6 py-4 border-b border-gray-200">
                  <div className="grid grid-cols-12 gap-2 md:gap-4 text-xs md:text-sm font-semibold text-gray-700">
                    <div className="col-span-1">ID</div>
                    <div className="col-span-4">Usuário</div>
                    <div className="col-span-5 hidden md:block">Email</div>
                    <div className="col-span-2">Role</div>
                  </div>
                </div>
                
                {/* Lista de usuários */}
                <div className="max-h-96 overflow-y-auto">
                  {filteredUsers.map((user, index) => {
                    const roleColors = getRoleColor(user.role);
                    const displayRole = user.role.toLowerCase().includes('admin') ? 'admin' : 'user';
                    return (
                      <div
                        key={user.id}
                        className={`px-4 md:px-6 py-4 border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                      >
                        <div className="grid grid-cols-12 gap-2 md:gap-4 items-center">
                          <div className="col-span-1">
                            <span className="text-xs md:text-sm font-mono text-gray-500">#{user.id}</span>
                          </div>
                          <div className="col-span-4">
                            <div className="flex items-center gap-2 md:gap-3">
                              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center">
                                <FiUser size={12} color="white" />
                              </div>
                              <span className="font-medium text-gray-900 text-sm md:text-base">{user.username}</span>
                            </div>
                          </div>
                          <div className="col-span-5 hidden md:block">
                            <div className="flex items-center gap-2">
                              <FiMail size={14} color="#9ca3af" />
                              <span className="text-gray-700 text-sm">{user.email}</span>
                            </div>
                          </div>
                          <div className="col-span-2">
                            <span className={`inline-flex items-center gap-1 px-2 md:px-3 py-1 rounded-full text-xs font-medium ${roleColors.badge}`}>
                              <FiShield size={10} />
                              {displayRole}
                            </span>
                          </div>
                        </div>
                        {/* Email visível apenas em mobile */}
                        <div className="md:hidden mt-2">
                          <div className="flex items-center gap-2">
                            <FiMail size={12} color="#9ca3af" />
                            <span className="text-gray-600 text-xs">{user.email}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <FiUsers size={24} color="#9ca3af" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchUserId ? 'Nenhum usuário encontrado' : 'Nenhum usuário encontrado'}
                </h3>
                <p className="text-gray-500">
                  {searchUserId ? 'Tente ajustar sua busca ou clique em "Atualizar Lista"' : 'Clique em "Atualizar Lista" para carregar os usuários'}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow container mx-auto p-4 md:p-8 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg p-6 md:p-8 mt-20">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center">Minhas Tarefas</h1>
          {isLoading && <p className="text-center text-gray-500">A carregar tarefas...</p>}
          {error && (
            <div className="text-center text-red-500 p-3 bg-red-100 rounded-lg mb-4 flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError(null)} className="text-red-600 hover:text-red-800 ml-2" aria-label="Fechar mensagem de erro">✕</button>
            </div>
          )}
          {isCreating && <p className="text-center text-blue-500 p-3 bg-blue-100 rounded-lg mb-4">A criar tarefa...</p>}
          <div className="space-y-4">
            {!isLoading && !error && tasks.map((task) => {
              const isCompleted = completedTasks.has(task.id);
              return (
                <div key={task.id} className={`bg-white p-4 rounded-lg shadow-sm group ${isCompleted ? 'opacity-50' : ''}`}>
                  <div className="flex items-start">
                    <input type="checkbox" checked={isCompleted} onChange={() => handleUpdateTaskStatus(task)} className="h-6 w-6 mt-1 rounded-full border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer disabled:opacity-50" aria-label={`Marcar tarefa "${task.title}" como ${isCompleted ? 'não concluída' : 'concluída'}`}/>
                    <div className="ml-4 flex-grow">
                      <span className={`text-gray-800 font-medium ${isCompleted ? 'line-through text-blue-600' : ''}`}>{task.title}</span>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getPriorityClass(task.priority)}`}>{task.priority || 'N/A'}</span>
                        {task.data && (<span className="flex items-center gap-1">{new Date(task.data).toLocaleDateString('pt-PT')}</span>)}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button onClick={() => handleEditTask(task)} disabled={isEditing} className="text-gray-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 disabled:opacity-50" aria-label="Editar Tarefa">✎</button>
                      <button onClick={() => handleDeleteTask(task.id)} disabled={isDeleting === task.id} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 disabled:opacity-50" aria-label="Apagar Tarefa">🗑️</button>
                    </div>
                  </div>
                </div>
              );
            })}
            {!isLoading && !error && tasks.length === 0 && <p className="text-center text-gray-500 py-4">Nenhuma tarefa encontrada. Adicione uma!</p>}
          </div>
        </div>
      </main>
      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-8 right-8 bg-blue-600 text-white p-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 text-2xl font-bold w-16 h-16 flex items-center justify-center" aria-label="Adicionar Nova Tarefa">+</button>
      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAddTask={handleCreateTask} isCreating={isCreating} />
      <EditTaskModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingTask(null); }} onUpdateTask={handleUpdateTask} isUpdating={isEditing} task={editingTask} />
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={userProfile} />
    </div>
  );
}; 