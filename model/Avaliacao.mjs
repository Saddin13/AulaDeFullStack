export class Avaliacao {
    constructor({ id, id_usuario, id_curso, nota, comentario }) {
        this.ID_Avaliacao = id;
        this.ID_Usuario = String(id_usuario);
        this.ID_Curso = id_curso;
        this.Nota = nota;
        this.Comentario = comentario;
        this.DataAvaliacao = new Date().toISOString();
    }
}
