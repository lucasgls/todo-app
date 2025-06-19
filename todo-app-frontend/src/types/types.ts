export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: 'Alta' | 'Media' | 'Baixa' | 'Nenhuma';
  data: string | null;
  status: 'Fazer' | 'Fazendo' | 'Feito';
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface TaskCreateData {
  title: string;
  description: string | null;
  priority: 'Alta' | 'Media' | 'Baixa' | 'Nenhuma';
  dueDate: string | null;
}

export interface TaskUpdateData {
  title?: string;
  description?: string | null;
  priority?: string;
  dueDate?: string | null;
  status?: string;
} 