import { dbService } from './DatabaseService.mjs';
import { Curso } from '../model/Curso.mjs';
import { Modulo } from '../model/Modulo.mjs';
import { Aula } from '../model/Aula.mjs';

export class CursoService {
    listar() {
        return dbService.data.cursos;
    }

    salvar(dados) {
        const erros = Curso.validar(dados);
        if (erros.length > 0) throw new Error(erros.join('\n'));

        const novoCurso = new Curso({
            id: dbService.nextId('cursos'),
            ...dados,
            totalAulas: dados.aulas ? dados.aulas.length : (dados.totalAulas || 0)
        });

        dbService.data.cursos.push(novoCurso);

        // Se foram passadas as aulas, criar o módulo e as aulas automaticamente
        if (dados.aulas && dados.aulas.length > 0) {
            const novoModulo = new Modulo({
                id: dbService.nextId('modulos'),
                id_curso: novoCurso.ID_Curso,
                titulo: "Módulo Único",
                ordem: 1
            });
            dbService.data.modulos.push(novoModulo);

            dados.aulas.forEach((aulaData, index) => {
                const novaAula = new Aula({
                    id: dbService.nextId('aulas'),
                    id_modulo: novoModulo.ID_Modulo,
                    titulo: aulaData.titulo,
                    tipoConteudo: "Vídeo",
                    url_conteudo: aulaData.videoId,
                    duracaoMinutos: 15, // Duração padrão estática
                    ordem: index + 1
                });
                dbService.data.aulas.push(novaAula);
            });
        }

        dbService.save();
        return novoCurso;
    }

    buscarPorId(id) {
        return this.listar().find(c => c.ID_Curso === Number(id)) ?? null;
    }

    atualizar() {
        dbService.save();
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
