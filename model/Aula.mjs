export class Aula {
    constructor({ id, id_modulo, titulo, tipoConteudo, url_conteudo, duracaoMinutos, ordem }) {
        this.ID_Aula = id;
        this.ID_Modulo = id_modulo;
        this.Titulo = titulo;
        this.TipoConteudo = tipoConteudo; 
        this.URL_Conteudo = url_conteudo;
        this.DuracaoMinutos = duracaoMinutos;
        this.Ordem = ordem;
    }
    static validar(dados) { return []; }
}
