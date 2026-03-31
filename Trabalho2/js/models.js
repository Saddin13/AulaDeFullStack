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

// Seed de Módulos (Para o curso JS Backend)
db.modulos.push(new Modulo(1, 1, "Introdução ao Node.js", 1));
db.modulos.push(new Modulo(2, 1, "Criando a primeira API", 2));

// Seed de Aulas
db.aulas.push(new Aula(1, 1, "O que é Node.js?", "Vídeo", "https://video.url", 15, 1));
db.aulas.push(new Aula(2, 1, "Configurando o ambiente", "Texto", "https://texto.url", 10, 2));

// Seed de Planos
db.planos.push(new Plano(1, "Plano Starter", "Acesso aos cursos básicos.", 29.90, 1));
db.planos.push(new Plano(2, "Plano Pro JS Básico ao Avançado", "Acesso completo a todas as tecnologias e projetos.", 89.90, 6));
db.planos.push(new Plano(3, "Plano Lifetime Backend VIP", "Acesso vitalício aos módulos de arquitetura de alta escala.", 499.00, 120));

// Tornando o DB global para acessar do app.js
window.db = db;
