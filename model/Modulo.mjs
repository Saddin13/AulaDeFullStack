export class Modulo {
    constructor({ id, id_curso, titulo, ordem }) {
        this.ID_Modulo = id;
        this.ID_Curso = id_curso;
        this.Titulo = titulo;
        this.Ordem = ordem;
    }
    static validar(dados) { return []; }
}
