// service/DatabaseService.mjs
import { Usuario } from '../model/Usuario.mjs';
import { Categoria } from '../model/Categoria.mjs';
import { Curso } from '../model/Curso.mjs';
import { Modulo } from '../model/Modulo.mjs';
import { Aula } from '../model/Aula.mjs';
import { Trilha } from '../model/Trilha.mjs';

const KEY = 'CodeMaster_DB_v2';

export class DatabaseService {
    constructor() {
        this.data = {
            usuarios: [],
            categorias: [],
            cursos: [],
            modulos: [],
            aulas: [],
            matriculas: [],
            progressos: [],
            avaliacoes: [],
            certificados: [],
            pagamentos: [],
            trilhas: []
        };
        this.load();
    }

    save() {
        localStorage.setItem(KEY, JSON.stringify(this.data));
    }

    load() {
        const dataStr = localStorage.getItem(KEY);
        if (dataStr) {
            this.data = JSON.parse(dataStr);
        } else {
            this.seedData();
            this.save();
        }
    }

    nextId(tableName) {
        return this.data[tableName].length > 0 ? Math.max(...this.data[tableName].map(o => {
            const keys = Object.keys(o);
            const idKey = keys.find(k => k.startsWith('ID_'));
            return parseInt(o[idKey]) || 0;
        })) + 1 : 1;
    }

    seedData() {
        // Aluno tem ID padrao 00002
        this.data.usuarios.push(new Usuario({ id: 'admin', nomeCompleto: "Professor Admin", email: "admin@teste.com", senhaHash: "12345", isAdmin: true }));
        this.data.usuarios.push(new Usuario({ id: '00002', nomeCompleto: "Aluno Simulado", email: "aluno@teste.com", senhaHash: "senha123", isAdmin: false }));

        this.data.categorias.push(new Categoria({ id: 1, nome: "Backend", descricao: "Dev Backend" }));
        this.data.categorias.push(new Categoria({ id: 2, nome: "Frontend", descricao: "Dev Frontend" }));

        this.data.cursos.push(new Curso({ id: 1, titulo: "Masterclass de JavaScript Backend", descricao: "Node.js etc.", id_instrutor: "admin", id_categoria: 1, id_trilha: 1, nivel: "Avançado", totalAulas: 10, totalHoras: 40, preco: 99.90 }));
        this.data.cursos.push(new Curso({ id: 2, titulo: "Dominando ES6+ e Frontend Vanilla", descricao: "S/ Frameworks", id_instrutor: "admin", id_categoria: 2, id_trilha: 1, nivel: "Intermediário", totalAulas: 5, totalHoras: 20, preco: 49.90 }));
        this.data.cursos.push(new Curso({ id: 3, titulo: "Masterclass de JavaScript Backend Vol. 2", descricao: "Aprofundando em APIs", id_instrutor: "admin", id_categoria: 1, id_trilha: 1, nivel: "Avançado", totalAulas: 10, totalHoras: 40, preco: 99.90 }));
        this.data.cursos.push(new Curso({ id: 4, titulo: "Dominando ES6+ e Frontend Vanilla Vol. 2", descricao: "Projetos Reais", id_instrutor: "admin", id_categoria: 2, id_trilha: 1, nivel: "Intermediário", totalAulas: 5, totalHoras: 20, preco: 49.90 }));
        this.data.cursos.push(new Curso({ id: 5, titulo: "Masterclass de JavaScript Backend Vol. 3", descricao: "Microsserviços", id_instrutor: "admin", id_categoria: 1, id_trilha: 1, nivel: "Avançado", totalAulas: 10, totalHoras: 40, preco: 99.90 }));
        this.data.cursos.push(new Curso({ id: 6, titulo: "Dominando ES6+ e Frontend Vanilla Vol. 3", descricao: "Animações Avançadas", id_instrutor: "admin", id_categoria: 2, id_trilha: 1, nivel: "Avançado", totalAulas: 5, totalHoras: 20, preco: 49.90 }));

        this.data.modulos.push(new Modulo({ id: 1, id_curso: 1, titulo: "Introdução ao Node.js", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 2, id_curso: 1, titulo: "Criando a primeira API", ordem: 2 }));
        this.data.modulos.push(new Modulo({ id: 3, id_curso: 2, titulo: "Fundamentos do ES6+", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 4, id_curso: 3, titulo: "Bancos de Dados", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 5, id_curso: 4, titulo: "Consumo de APIs", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 6, id_curso: 5, titulo: "Docker e ECS", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 7, id_curso: 6, titulo: "Three.js Básico", ordem: 1 }));
        
        this.data.aulas.push(new Aula({ id: 1, id_modulo: 1, titulo: "O que é Node.js?", tipoConteudo: "Vídeo", url_conteudo: "hHM-hr9q4mo", duracaoMinutos: 15, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 2, id_modulo: 1, titulo: "Configurando o ambiente", tipoConteudo: "Vídeo", url_conteudo: "vf2vG07leiA", duracaoMinutos: 10, ordem: 2 }));
        this.data.aulas.push(new Aula({ id: 3, id_modulo: 3, titulo: "Let, Const e Arrow Functions", tipoConteudo: "Vídeo", url_conteudo: "hHM-hr9q4mo", duracaoMinutos: 15, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 4, id_modulo: 4, titulo: "Modelagem Relacional", tipoConteudo: "Vídeo", url_conteudo: "vf2vG07leiA", duracaoMinutos: 45, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 5, id_modulo: 5, titulo: "Fetch API", tipoConteudo: "Vídeo", url_conteudo: "hHM-hr9q4mo", duracaoMinutos: 12, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 6, id_modulo: 6, titulo: "Seu primeiro contêiner", tipoConteudo: "Vídeo", url_conteudo: "vf2vG07leiA", duracaoMinutos: 25, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 7, id_modulo: 7, titulo: "Eixos e Câmeras", tipoConteudo: "Vídeo", url_conteudo: "hHM-hr9q4mo", duracaoMinutos: 18, ordem: 1 }));

        this.data.trilhas.push(new Trilha({ id: 1, nome: "Fullstack Developer", descricao: "Do zero ao profissional em Backend e Frontend." }));
    }
}

// Instância singleton para uso por outros serviços da mesma forma que db global
export const dbService = new DatabaseService();
