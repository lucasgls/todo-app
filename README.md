
# Todo App Full-Stack com Java e React

![Java](https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/Spring_Boot-3.x-6DB33F?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

Este é um projeto **full-stack** de uma aplicação de gestão de tarefas, desenhado para demonstrar uma arquitetura robusta e moderna. O foco principal do desenvolvimento foi a construção de uma **API REST segura e profissional com Java e o ecossistema Spring**, servida por um cliente visualmente limpo em React.

## 🚀 Apresentação Visual da Aplicação

A aplicação oferece um fluxo de utilizador completo, desde o registo até à gestão de tarefas e funcionalidades de administração.

### 1. Autenticação e Registo
O sistema possui um fluxo de autenticação completo, permitindo o acesso seguro de utilizadores.

 # Tela de Login
 ![Tela de Login](https://github.com/user-attachments/assets/4e977533-826f-4b43-95c8-d1be8364017b) 
 
 # Tela de Registo 
 ![Tela de Cadastro](https://github.com/user-attachments/assets/f1a6b2b9-ba99-4d9c-b1f8-c3a238a3645c) 

### 2. Gestão de Tarefas
A interface principal da aplicação, onde o utilizador pode visualizar, criar, atualizar e apagar as suas tarefas.

# lista de tarefas
 ![Lista de Tarefas](https://github.com/user-attachments/assets/fa216836-c22c-4f8f-9c88-c5d2f7b6610d)  
# criação de tarefas
 ![Modal de Criação de Tarefa](https://github.com/user-attachments/assets/e4b5a8df-0b30-4147-b42a-4945bb46c7a2) 

### 3. Funcionalidades de Perfil e Administração
A aplicação inclui funcionalidades de visualização de perfil e um painel administrativo para a gestão de utilizadores.

# Perfil do utilizador
![Perfil do Utilizador](https://github.com/user-attachments/assets/77483c9f-a845-4228-a763-c925159ff7bb)  

# Menu de Opções
![Menu de Opções](https://github.com/user-attachments/assets/4d90eacf-fb24-4e30-8ad0-59fec9172328) 

# Painel Admin
![Painel de Admin](https://github.com/user-attachments/assets/1fbd5a1c-40f3-4fe1-81d9-25be6c51051f) 

## 🛠️ Arquitetura e Detalhes do Back-End

A API foi desenhada com uma arquitetura em camadas e segue as melhores práticas de desenvolvimento.

* **Segurança com Spring Security e JWT:** Sistema de autenticação completo com registo e login, geração de tokens JWT para comunicação *stateless* e proteção de rotas com `SecurityFilter`.
* **Controlo de Acesso Baseado em Permissões (Roles):** Separação clara entre as permissões de um `Utilizador` normal (`ROLE_USER`) e de um `Administrador` (`ROLE_ADMIN`), com *endpoints* devidamente protegidos através de `hasRole()`.
* **Gestão de Dados com Spring Data JPA:** Mapeamento de entidades (`User`, `Task`), configuração de relacionamentos `@OneToMany` e `@ManyToOne`, e acesso eficiente à base de dados com `JpaRepository`.
* **Migrations com Flyway:** Controlo de versão seguro e profissional do esquema da base de dados, garantindo a consistência em qualquer ambiente através de *scripts* SQL versionados.
* **Arquitetura Limpa:** Lógica de negócio bem definida e isolada na camada de Serviço (`UserService`, `TaskService`), com Controladores "magros" e Repositórios focados no acesso a dados.
* **Validação e Padrão DTO:** Uso de *Data Transfer Objects* (DTOs) para todas as operações (`POST`, `PUT`), garantindo que a API tenha um contrato claro, não exponha dados sensíveis e valide os dados de entrada.

## 💻 Stack Tecnológico

| Camada | Tecnologia |
| :--- | :--- |
| **Back-End** | Java 17+, Spring Boot, Spring Security, Spring Data JPA, JWT, Maven, Flyway |
| **Base de Dados** | MySQL |
| **Front-End** | React, TypeScript, Vite, Tailwind CSS |
