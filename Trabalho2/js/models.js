// models.js - Classes e Simulador de Banco de Dados Em Memória com LocalStorage

class Usuario {
    constructor(id, nomeCompleto, email, senhaHash, isAdmin = false) {
        // ID formatado para 5 dígitos (ex: '00001')
        this.ID_Usuario = String(id).padStart(5, '0');
        this.NomeCompleto = nomeCompleto;
        this.Email = email;
        this.SenhaHash = senhaHash;
        this.IsAdmin = isAdmin;
        this.DataCadastro = new Date().toISOString();
    }
}

class Categoria {
    constructor(id, nome, descricao) {
        this.ID_Categoria = id;
        this.Nome = nome;
        this.Descricao = descricao;
    }
}

class Curso {
    constructor(id, titulo, descricao, id_instrutor, id_categoria, nivel, totalAulas, totalHoras, preco) {
        this.ID_Curso = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Instrutor = id_instrutor;
        this.ID_Categoria = id_categoria;
        this.Nivel = nivel;
        this.DataPublicacao = new Date().toISOString();
        this.TotalAulas = totalAulas;
        this.TotalHoras = totalHoras;
        this.Preco = preco; // Adicionado Preço
    }
}

class Modulo {
    constructor(id, id_curso, titulo, ordem) {
        this.ID_Modulo = id;
        this.ID_Curso = id_curso;
        this.Titulo = titulo;
        this.Ordem = ordem;
    }
}

class Aula {
    constructor(id, id_modulo, titulo, tipoConteudo, url_conteudo, duracaoMinutos, ordem) {
        this.ID_Aula = id;
        this.ID_Modulo = id_modulo;
        this.Titulo = titulo;
        this.TipoConteudo = tipoConteudo; // Vídeo, Texto, Quiz
        this.URL_Conteudo = url_conteudo;
        this.DuracaoMinutos = duracaoMinutos;
        this.Ordem = ordem;
    }
}

class Matricula {
    constructor(id, id_usuario, id_curso) {
        this.ID_Matricula = id;
        this.ID_Usuario = typeof id_usuario === 'number' ? String(id_usuario).padStart(5, '0') : id_usuario;
        this.ID_Curso = id_curso;
        this.DataMatricula = new Date().toISOString();
        this.DataConclusao = null;
    }
}

class ProgressoAula {
    constructor(id_usuario, id_aula) {
        this.ID_Usuario = typeof id_usuario === 'number' ? String(id_usuario).padStart(5, '0') : id_usuario;
        this.ID_Aula = id_aula;
        this.DataConclusao = new Date().toISOString();
        this.Status = 'Concluído';
    }
}

class Avaliacao {
    constructor(id, id_usuario, id_curso, nota, comentario) {
        this.ID_Avaliacao = id;
        this.ID_Usuario = typeof id_usuario === 'number' ? String(id_usuario).padStart(5, '0') : id_usuario;
        this.ID_Curso = id_curso;
        this.Nota = nota;
        this.Comentario = comentario;
        this.DataAvaliacao = new Date().toISOString();
    }
}

class Certificado {
    constructor(id, id_usuario, id_curso) {
        this.ID_Certificado = id;
        this.ID_Usuario = typeof id_usuario === 'number' ? String(id_usuario).padStart(5, '0') : id_usuario;
        this.ID_Curso = id_curso;
        this.CodigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.DataEmissao = new Date().toISOString();
    }
}

class Pagamento {
    constructor(id, id_usuario, id_curso, valorPago, metodoPagamento) {
        this.ID_Pagamento = id;
        this.ID_Usuario = id_usuario;
        this.ID_Curso = id_curso;
        this.ValorPago = valorPago;
        this.DataPagamento = new Date().toISOString();
        this.MetodoPagamento = metodoPagamento;
        this.Id_Transacao_Gateway = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}


// Simulador de Banco de Dados MVC
class DatabaseModel {
    constructor() {
        this.usuarios = [];
        this.categorias = [];
        this.cursos = [];
        this.modulos = [];
        this.aulas = [];
        this.matriculas = [];
        this.progressos = [];
        this.avaliacoes = [];
        this.certificados = [];
        this.pagamentos = [];

        this.load();
    }

    save() {
        const data = {
            usuarios: this.usuarios,
            categorias: this.categorias,
            cursos: this.cursos,
            modulos: this.modulos,
            aulas: this.aulas,
            matriculas: this.matriculas,
            progressos: this.progressos,
            avaliacoes: this.avaliacoes,
            certificados: this.certificados,
            pagamentos: this.pagamentos
        };
        localStorage.setItem('CodeMaster_DB', JSON.stringify(data));
    }

    load() {
        const dataStr = localStorage.getItem('CodeMaster_DB');
        if (dataStr) {
            const data = JSON.parse(dataStr);
            this.usuarios = data.usuarios || [];
            this.categorias = data.categorias || [];
            this.cursos = data.cursos || [];
            this.modulos = data.modulos || [];
            this.aulas = data.aulas || [];
            this.matriculas = data.matriculas || [];
            this.progressos = data.progressos || [];
            this.avaliacoes = data.avaliacoes || [];
            this.certificados = data.certificados || [];
            this.pagamentos = data.pagamentos || [];
        } else {
            this.seedData();
            this.save();
        }
    }

    // Auto-increment genérico para propriedades que não são strings padronizadas com 0
    nextId(tableName) {
        return this[tableName].length > 0 ? Math.max(...this[tableName].map(o => {
            const keys = Object.keys(o);
            const idKey = keys.find(k => k.startsWith('ID_'));
            return parseInt(o[idKey]) || 0;
        })) + 1 : 1;
    }

    nextUserId() {
        return String(this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => parseInt(u.ID_Usuario))) + 1 : 1).padStart(5, '0');
    }

    seedData() {
        // Seed de Usuários (Admin com ID 00001, senha base "12345")
        // O Aluno terá ID 00002
        this.usuarios.push(new Usuario(1, "Professor Admin", "admin@teste.com", "12345", true));
        this.usuarios.push(new Usuario(2, "Aluno Simulado", "aluno@teste.com", "senha123", false));

        // Seed de Categorias
        this.categorias.push(new Categoria(1, "Backend", "Desenvolvimento no lado do servidor com tecnologias modernas."));
        this.categorias.push(new Categoria(2, "Frontend", "Desenvolvimento de interfaces e experiências web."));

        // Seed de Cursos Relacionados com Preço
        this.cursos.push(new Curso(1, "Masterclass de JavaScript Backend", "Aprenda Node.js, Express e arquitetura de microsserviços.", "00001", 1, "Avançado", 10, 40, 99.90));
        this.cursos.push(new Curso(2, "Dominando ES6+ e Frontend Vanilla", "Crie aplicações sem frameworks com foco em performance.", "00001", 2, "Intermediário", 5, 20, 49.90));
        this.cursos.push(new Curso(3, "React Ninja: Do Zero ao Profissional", "Construa SPA dinâmicas com a biblioteca mais popular do mercado.", "00001", 2, "Avançado", 8, 30, 89.90));
        this.cursos.push(new Curso(4, "Python para Engenharia de Dados", "Básico de Python e introdução à manipulação de grandes volumes de dados.", "00001", 1, "Iniciante", 6, 15, 69.90));
        this.cursos.push(new Curso(5, "DevOps e Docker Essencial", "Containerize suas aplicações e faça deploys fáceis com Docker.", "00001", 1, "Intermediário", 7, 25, 79.90));
        this.cursos.push(new Curso(6, "Golang de Alta Performance", "Aprenda a linguagem do Google construída para concorrência e velocidade.", "00001", 1, "Avançado", 5, 20, 119.90));

        // Seed de Módulos
        this.modulos.push(new Modulo(1, 1, "Introdução ao Node.js", 1));
        this.modulos.push(new Modulo(2, 1, "Criando a primeira API", 2));
        this.modulos.push(new Modulo(3, 2, "Fundamentos do ES6+", 1));
        this.modulos.push(new Modulo(4, 3, "Fundamentos do React", 1));
        this.modulos.push(new Modulo(5, 4, "Sintaxe Python Moderna", 1));
        this.modulos.push(new Modulo(6, 5, "Containers e Docker", 1));
        this.modulos.push(new Modulo(7, 6, "Iniciando com Go", 1));

        // Seed de Aulas
        this.aulas.push(new Aula(1, 1, "O que é Node.js?", "Vídeo", "hHM-hr9q4mo", 15, 1));
        this.aulas.push(new Aula(2, 1, "Configurando o ambiente", "Vídeo", "vf2vG07leiA", 10, 2));
        this.aulas.push(new Aula(3, 2, "Conceitos de API REST", "Vídeo", "zsjvFFKOm3c", 20, 1));
        this.aulas.push(new Aula(4, 3, "Por que focar no Vanilla?", "Vídeo", "Dwb5DuSvDNU", 15, 1));
        this.aulas.push(new Aula(5, 3, "Desmistificando Promises", "Vídeo", "RvYYCGs45L4", 25, 2));
        this.aulas.push(new Aula(6, 4, "Introdução ao React", "Vídeo", "Tn6-PIqc4UM", 15, 1));
        this.aulas.push(new Aula(7, 4, "Componentes e Props", "Vídeo", "MJhQvSQXzCA", 20, 2));
        this.aulas.push(new Aula(8, 4, "Virtual DOM na prática", "Vídeo", "PVxISmtB_nQ", 18, 3));
        this.aulas.push(new Aula(9, 5, "Python em alta velocidade", "Vídeo", "P5QdMF8QjhU", 12, 1));
        this.aulas.push(new Aula(10, 5, "Estruturas de Dados Essenciais", "Vídeo", "VchuKL44s6E", 25, 2));
        this.aulas.push(new Aula(11, 6, "A revolução do Docker", "Vídeo", "frAIdXs8DFI", 15, 1));
        this.aulas.push(new Aula(12, 6, "Criando seu primeiro Container", "Vídeo", "eGz9DS-aIeY", 30, 2));
        this.aulas.push(new Aula(13, 6, "Orquestração Básica", "Vídeo", "X48VuDVv0do", 20, 3));
        this.aulas.push(new Aula(14, 7, "Conhecendo a Linguagem Go", "Vídeo", "nPAo0F0kvZU", 10, 1));
        this.aulas.push(new Aula(15, 7, "Concorrência com Goroutines", "Vídeo", "f6kdp27TYZs", 18, 2));
    }
}

window.db = new DatabaseModel();
