export class ProgressoAula {
    constructor({ id_usuario, id_aula }) {
        this.ID_Usuario = String(id_usuario);
        this.ID_Aula = id_aula;
        this.DataConclusao = new Date().toISOString();
        this.Status = 'Concluído';
    }
}
