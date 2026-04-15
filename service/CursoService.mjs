import { dbService } from './DatabaseService.mjs';

export class CursoService {
    listar() {
        return dbService.data.cursos;
    }

    buscarPorId(id) {
        return this.listar().find(c => c.ID_Curso === Number(id)) ?? null;
    }

    listarPorCategoria(catId) {
        return this.listar().filter(c => c.ID_Categoria === Number(catId));
    }

    // Auxiliares para a visualização da tela
    obterModulos(cursoId) {
        return dbService.data.modulos.filter(m => m.ID_Curso === Number(cursoId)).sort((a, b) => a.Ordem - b.Ordem);
    }

    obterAulas(moduloId) {
        return dbService.data.aulas.filter(a => a.ID_Modulo === Number(moduloId)).sort((a, b) => a.Ordem - b.Ordem);
    }
}
