// service/DatabaseService.mjs
import { Usuario } from '../model/Usuario.mjs';
import { Categoria } from '../model/Categoria.mjs';
import { Curso } from '../model/Curso.mjs';
import { Modulo } from '../model/Modulo.mjs';
import { Aula } from '../model/Aula.mjs';

const KEY = 'CodeMaster_DB';

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
            pagamentos: []
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

        this.data.cursos.push(new Curso({ id: 1, titulo: "Masterclass de JavaScript Backend", descricao: "Node.js etc.", id_instrutor: "admin", id_categoria: 1, nivel: "Avançado", totalAulas: 10, totalHoras: 40, preco: 99.90 }));
        this.data.cursos.push(new Curso({ id: 2, titulo: "Dominando ES6+ e Frontend Vanilla", descricao: "S/ Frameworks", id_instrutor: "admin", id_categoria: 2, nivel: "Intermediário", totalAulas: 5, totalHoras: 20, preco: 49.90 }));

        this.data.modulos.push(new Modulo({ id: 1, id_curso: 1, titulo: "Introdução ao Node.js", ordem: 1 }));
        this.data.modulos.push(new Modulo({ id: 2, id_curso: 1, titulo: "Criando a primeira API", ordem: 2 }));
        
        this.data.aulas.push(new Aula({ id: 1, id_modulo: 1, titulo: "O que é Node.js?", tipoConteudo: "Vídeo", url_conteudo: "hHM-hr9q4mo", duracaoMinutos: 15, ordem: 1 }));
        this.data.aulas.push(new Aula({ id: 2, id_modulo: 1, titulo: "Configurando o ambiente", tipoConteudo: "Vídeo", url_conteudo: "vf2vG07leiA", duracaoMinutos: 10, ordem: 2 }));
    }
}

// Instância singleton para uso por outros serviços da mesma forma que db global
export const dbService = new DatabaseService();
