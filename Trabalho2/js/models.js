// models.js - Classes e Simulador de Banco de Dados Em Memória

class Usuario {
    constructor(id, nomeCompleto, email, senhaHash) {
        this.ID_Usuario = id;
        this.NomeCompleto = nomeCompleto;
        this.Email = email;
        this.SenhaHash = senhaHash;
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
    constructor(id, titulo, descricao, id_instrutor, id_categoria, nivel, totalAulas, totalHoras) {
        this.ID_Curso = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Instrutor = id_instrutor;
        this.ID_Categoria = id_categoria;
        this.Nivel = nivel;
        this.DataPublicacao = new Date().toISOString();
        this.TotalAulas = totalAulas;
        this.TotalHoras = totalHoras;
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
        this.ID_Usuario = id_usuario;
        this.ID_Curso = id_curso;
        this.DataMatricula = new Date().toISOString();
        this.DataConclusao = null;
    }
}

class ProgressoAula {
    constructor(id_usuario, id_aula) {
        this.ID_Usuario = id_usuario;
        this.ID_Aula = id_aula;
        this.DataConclusao = new Date().toISOString();
        this.Status = 'Concluído';
    }
}

class Avaliacao {
    constructor(id, id_usuario, id_curso, nota, comentario) {
        this.ID_Avaliacao = id;
        this.ID_Usuario = id_usuario;
        this.ID_Curso = id_curso;
        this.Nota = nota;
        this.Comentario = comentario;
        this.DataAvaliacao = new Date().toISOString();
    }
}

class Trilha {
    constructor(id, titulo, descricao, id_categoria) {
        this.ID_Trilha = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Categoria = id_categoria;
    }
}

class TrilhaCurso {
    constructor(id_trilha, id_curso, ordem) {
        this.ID_Trilha = id_trilha;
        this.ID_Curso = id_curso;
        this.Ordem = ordem;
    }
}

class Certificado {
    constructor(id, id_usuario, id_curso, id_trilha) {
        this.ID_Certificado = id;
        this.ID_Usuario = id_usuario;
        this.ID_Curso = id_curso;
        this.ID_Trilha = id_trilha || null;
        this.CodigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.DataEmissao = new Date().toISOString();
    }
}

class Plano {
    constructor(id, nome, descricao, preco, duracaoMeses) {
        this.ID_Plano = id;
        this.Nome = nome;
        this.Descricao = descricao;
        this.Preco = preco;
        this.DuracaoMeses = duracaoMeses;
    }
}

class Assinatura {
    constructor(id, id_usuario, id_plano, duracaoMeses) {
        this.ID_Assinatura = id;
        this.ID_Usuario = id_usuario;
        this.ID_Plano = id_plano;

        const inicio = new Date();
        this.DataInicio = inicio.toISOString();

        const fim = new Date(inicio);
        fim.setMonth(fim.getMonth() + duracaoMeses);
        this.DataFim = fim.toISOString();
    }
}

class Pagamento {
    constructor(id, id_assinatura, valorPago, metodoPagamento) {
        this.ID_Pagamento = id;
        this.ID_Assinatura = id_assinatura;
        this.ValorPago = valorPago;
        this.DataPagamento = new Date().toISOString();
        this.MetodoPagamento = metodoPagamento;
        this.Id_Transacao_Gateway = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}

// Simulador de Banco de Dados
class Database {
    constructor() {
        this.usuarios = [];
        this.categorias = [];
        this.cursos = [];
        this.modulos = [];
        this.aulas = [];
        this.matriculas = [];
        this.progressos = [];
        this.avaliacoes = [];
        this.trilhas = [];
        this.trilhaCursos = [];
        this.certificados = [];
        this.planos = [];
        this.assinaturas = [];
        this.pagamentos = [];
    }

    // Gerador de ID Simples
    generateId(array) {
        return array.length > 0 ? array[array.length - 1].ID_Usuario || array[array.length - 1].ID_Categoria || array.length + 1 : 1;
    }

    // Auto-increment genérico
    nextId(tableName) {
        return this[tableName].length + 1;
    }
}

// Inicializando Seed de Dados
const db = new Database();

// Seed de Usuários
db.usuarios.push(new Usuario(1, "Professor Admin", "admin@teste.com", "hash123"));
db.usuarios.push(new Usuario(2, "Aluno Simulado", "aluno@teste.com", "hash123"));

// Seed de Categorias
db.categorias.push(new Categoria(1, "Backend", "Desenvolvimento no lado do servidor com tecnologias modernas."));
db.categorias.push(new Categoria(2, "Frontend", "Desenvolvimento de interfaces e experiências web."));

// Seed de Cursos Relacionados
db.cursos.push(new Curso(1, "Masterclass de JavaScript Backend", "Aprenda Node.js, Express e arquitetura de microsserviços.", 1, 1, "Avançado", 10, 40));
db.cursos.push(new Curso(2, "Dominando ES6+ e Frontend Vanilla", "Crie aplicações sem frameworks com foco em performance.", 1, 2, "Intermediário", 5, 20));
db.cursos.push(new Curso(3, "React Ninja: Do Zero ao Profissional", "Construa SPA dinâmicas com a biblioteca mais popular do mercado.", 1, 2, "Avançado", 8, 30));
db.cursos.push(new Curso(4, "Python para Engenharia de Dados", "Básico de Python e introdução à manipulação de grandes volumes de dados.", 1, 1, "Iniciante", 6, 15));
db.cursos.push(new Curso(5, "DevOps e Docker Essencial", "Containerize suas aplicações e faça deploys fáceis com Docker.", 1, 1, "Intermediário", 7, 25));
db.cursos.push(new Curso(6, "Golang de Alta Performance", "Aprenda a linguagem do Google construída para concorrência e velocidade.", 1, 1, "Avançado", 5, 20));

// Seed de Módulos
// Curso 1
db.modulos.push(new Modulo(1, 1, "Introdução ao Node.js", 1));
db.modulos.push(new Modulo(2, 1, "Criando a primeira API", 2));
// Curso 2
db.modulos.push(new Modulo(3, 2, "Fundamentos do ES6+", 1));
// Curso 3
db.modulos.push(new Modulo(4, 3, "Fundamentos do React", 1));
// Curso 4
db.modulos.push(new Modulo(5, 4, "Sintaxe Python Moderna", 1));
// Curso 5
db.modulos.push(new Modulo(6, 5, "Containers e Docker", 1));
// Curso 6
db.modulos.push(new Modulo(7, 6, "Iniciando com Go", 1));

// Seed de Aulas
// Curso 1 (Node/JS Backend)
db.aulas.push(new Aula(1, 1, "O que é Node.js?", "Vídeo", "hil4PMek7ms", 15, 1));
db.aulas.push(new Aula(2, 1, "Configurando o ambiente", "Vídeo", "vf2vG07leiA", 10, 2));
db.aulas.push(new Aula(3, 2, "Conceitos de API REST", "Vídeo", "zsjvFFKOm3c", 20, 1));

// Curso 2 (ES6+ Vanilla)
db.aulas.push(new Aula(4, 3, "Por que focar no Vanilla?", "Vídeo", "Dwb5DuSvDNU", 15, 1));
db.aulas.push(new Aula(5, 3, "Desmistificando Promises", "Vídeo", "RvYYCGs45L4", 25, 2));

// Curso 3 (React Ninja)
db.aulas.push(new Aula(6, 4, "Introdução ao React", "Vídeo", "Tn6-PIqc4UM", 15, 1));
db.aulas.push(new Aula(7, 4, "Componentes e Props", "Vídeo", "MJhQvSQXzCA", 20, 2));
db.aulas.push(new Aula(8, 4, "Virtual DOM na prática", "Vídeo", "PVxISmtB_nQ", 18, 3));

// Curso 4 (Python Dados)
db.aulas.push(new Aula(9, 5, "Python em alta velocidade", "Vídeo", "kNdIA-L8E3c", 12, 1));
db.aulas.push(new Aula(10, 5, "Estruturas de Dados Essenciais", "Vídeo", "VchuKL44s6E", 25, 2));

// Curso 5 (DevOps e Docker)
db.aulas.push(new Aula(11, 6, "A revolução do Docker", "Vídeo", "PiKncENmdCg", 15, 1));
db.aulas.push(new Aula(12, 6, "Criando seu primeiro Container", "Vídeo", "eGz9DS-aIeY", 30, 2));
db.aulas.push(new Aula(13, 6, "Orquestração Básica", "Vídeo", "X48VuDVv0do", 20, 3));

// Curso 6 (Golang)
db.aulas.push(new Aula(14, 7, "Conhecendo a Linguagem Go", "Vídeo", "nPAo0F0kvZU", 10, 1));
db.aulas.push(new Aula(15, 7, "Concorrência com Goroutines", "Vídeo", "f6kdp27TYZs", 18, 2));

// Seed de Planos
db.planos.push(new Plano(1, "Plano Starter", "Acesso aos cursos básicos.", 29.90, 1));
db.planos.push(new Plano(2, "Plano Pro JS Básico ao Avançado", "Acesso completo a todas as tecnologias e projetos.", 89.90, 6));
db.planos.push(new Plano(3, "Plano Lifetime Backend VIP", "Acesso vitalício aos módulos de arquitetura de alta escala.", 499.00, 120));

// Tornando o DB global para acessar do app.js
window.db = db;
