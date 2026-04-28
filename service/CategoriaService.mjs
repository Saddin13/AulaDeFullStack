import { dbService } from './DatabaseService.mjs';
import { Categoria } from '../model/Categoria.mjs';

export class CategoriaService {
    listar() {
        return dbService.data.categorias;
    }

    salvar(dados) {
        const nova = new Categoria({
            id: dbService.nextId('categorias'),
            ...dados
        });

        dbService.data.categorias.push(nova);
        dbService.save();
        return nova;
    }
}
