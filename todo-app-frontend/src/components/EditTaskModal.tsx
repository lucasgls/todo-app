import React, { useState, useEffect } from 'react';
import type { Task } from '../types/types';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateTask: (taskId: number, taskData: Partial<Task>) => void;
  isUpdating: boolean;
  task: Task | null;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ isOpen, onClose, onUpdateTask, isUpdating, task }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'Alta' | 'Media' | 'Baixa' | 'Nenhuma'>('Media');
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setDueDate(task.data ? task.data.split('T')[0] : '');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTask(task.id, {
      title,
      description: description || null,
      priority,
      data: dueDate || null
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white/95 dark:bg-neutral-900 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-md p-6 border border-white/20 dark:border-neutral-800" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Editar Tarefa</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="edit-task-title">Título</label>
            <input id="edit-task-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-100 dark:bg-neutral-800 border-2 border-transparent dark:border-neutral-700 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-0 transition-colors placeholder-gray-400 dark:placeholder-gray-500" required placeholder="Digite o título da tarefa" disabled={isUpdating}/>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="edit-task-description">Descrição</label>
            <textarea id="edit-task-description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full bg-gray-100 dark:bg-neutral-800 border-2 border-transparent dark:border-neutral-700 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-0 transition-colors placeholder-gray-400 dark:placeholder-gray-500" placeholder="Digite a descrição da tarefa (opcional)" disabled={isUpdating}></textarea>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="edit-task-priority">Prioridade</label>
              <select id="edit-task-priority" value={priority} onChange={e => setPriority(e.target.value as 'Alta' | 'Media' | 'Baixa' | 'Nenhuma')} className="w-full bg-gray-100 dark:bg-neutral-800 border-2 border-transparent dark:border-neutral-700 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-0 transition-colors" aria-label="Selecionar prioridade da tarefa" disabled={isUpdating}>
                <option value="Alta">Alta</option>
                <option value="Media">Média</option>
                <option value="Baixa">Baixa</option>
                <option value="Nenhuma">Nenhuma</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1" htmlFor="edit-task-due-date">Data de Entrega</label>
              <input id="edit-task-due-date" type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-gray-100 dark:bg-neutral-800 border-2 border-transparent dark:border-neutral-700 focus:border-blue-500 rounded-lg py-2 px-3 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-0 transition-colors" aria-label="Selecionar data de entrega da tarefa" disabled={isUpdating}/>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="bg-gray-200 dark:bg-neutral-700 text-gray-700 dark:text-gray-100 font-bold py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-neutral-600" disabled={isUpdating}>Cancelar</button>
            <button type="submit" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50" disabled={isUpdating}>
              {isUpdating ? 'A atualizar...' : 'Atualizar Tarefa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 