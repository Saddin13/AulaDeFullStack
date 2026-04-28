// Trilha.mjs
export class Trilha {
    constructor({ id, nome, descricao }) {
        this.ID_Trilha = id;
        this.Nome = nome;
        this.Descricao = descricao;
    }
    static validar(dados) { 
        const erros = [];
        if (!dados.nome?.trim()) erros.push('Nome da trilha é obrigatório');
        return erros;
    }
}
