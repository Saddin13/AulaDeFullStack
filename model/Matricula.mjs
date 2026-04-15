export class Matricula {
    constructor({ id, id_usuario, id_curso }) {
        this.ID_Matricula = id;
        this.ID_Usuario = String(id_usuario); 
        this.ID_Curso = id_curso;
        this.DataMatricula = new Date().toISOString();
        this.DataConclusao = null;
    }
}
