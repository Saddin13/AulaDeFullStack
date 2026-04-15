// Categoria.mjs
export class Categoria {
    constructor({ id, nome, descricao }) {
        this.ID_Categoria = id;
        this.Nome = nome;
        this.Descricao = descricao;
    }
    static validar(dados) { return []; }
}
