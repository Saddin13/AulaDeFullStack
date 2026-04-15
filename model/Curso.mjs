export class Curso {
    constructor({ id, titulo, descricao, id_instrutor, id_categoria, nivel, totalAulas, totalHoras, preco }) {
        this.ID_Curso = id;
        this.Titulo = titulo;
        this.Descricao = descricao;
        this.ID_Instrutor = id_instrutor;
        this.ID_Categoria = id_categoria;
        this.Nivel = nivel;
        this.DataPublicacao = new Date().toISOString();
        this.TotalAulas = totalAulas;
        this.TotalHoras = totalHoras;
        this.Preco = preco;
    }

    static validar(dados) {
        const erros = [];
        if (!dados.titulo?.trim()) erros.push('Título do curso é obrigatório');
        if (dados.preco < 0) erros.push('Preço não pode ser negativo');
        return erros;
    }
}
