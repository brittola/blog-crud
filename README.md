# Blog com CRUD

O projeto consiste num Blog com CRUD completo de categorias e artigos.
A aplicação também contempla um sistema de login, permitindo criar e excluir usuários.

## O que foi utilizado

- Node.js (Express, Express-Session, Bcryptjs)
- MySQL (Sequelize)
- EJS

### Como foi feito/Como funciona
#### -> Front-end
- Na parte do front-end, foi utilizado o Bootstrap (o foco da aplicação é o back-end);
- Ao usuário comum só é permitido ler os artigos e selecionar por categorias;
- O projeto contempla uma paginação para os artigos, com lógica feita no back-end;
- Na área administrativa, foi utilizado o editor de texto TinyMCE para criação dos artigos;
#### -> Back-end
- No back-end é configurada a conexão com o banco de dados, com relação "one to many" de Categorias e Artigos, e permite:
  - Criar, ler, editar e excluir Categorias/Artigos;
  - Criar e excluir usuários.
- Os usuários servem para ter acesso a área administrativa;
- O projeto possui, portanto, um sistema de login, com senhas salvas em hash;
- É utilizado um middleware para controlar o acesso às rotas administrativas;
- Todas as páginas são renderizadas com o EJS.

Obs.: Para rodar o código na sua máquina, é necessário realizar a configuração do Sequelize com o seu banco de dados, nos arquivos:
- /database/connection.js
- /articles/Article.js
- /categories/Category.js
- /user/User.js

Utilize o comando abaixo para instalar as bibliotecas presentes do projeto:
```bash
npm install
```
