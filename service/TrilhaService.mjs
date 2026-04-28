import { dbService } from './DatabaseService.mjs';
import { Trilha } from '../model/Trilha.mjs';

export class TrilhaService {
    listar() {
        return dbService.data.trilhas || [];
    }

    salvar(dados) {
        const erros = Trilha.validar(dados);
        if (erros.length > 0) throw new Error(erros.join('\n'));

        const novaTrilha = new Trilha({
            id: dbService.nextId('trilhas'),
            ...dados
        });

        if (!dbService.data.trilhas) dbService.data.trilhas = [];
        dbService.data.trilhas.push(novaTrilha);
        dbService.save();
        return novaTrilha;
    }
}
