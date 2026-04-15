export class Certificado {
    constructor({ id, id_usuario, id_curso }) {
        this.ID_Certificado = id;
        this.ID_Usuario = String(id_usuario);
        this.ID_Curso = id_curso;
        this.CodigoVerificacao = 'CERT-' + Math.random().toString(36).substr(2, 9).toUpperCase();
        this.DataEmissao = new Date().toISOString();
    }
}
