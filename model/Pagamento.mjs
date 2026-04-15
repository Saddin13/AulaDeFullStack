export class Pagamento {
    constructor({ id, id_usuario, id_curso, valorPago, metodoPagamento }) {
        this.ID_Pagamento = id;
        this.ID_Usuario = String(id_usuario);
        this.ID_Curso = id_curso;
        this.ValorPago = valorPago;
        this.DataPagamento = new Date().toISOString();
        this.MetodoPagamento = metodoPagamento;
        this.Id_Transacao_Gateway = 'TXN-' + Math.random().toString(36).substr(2, 9).toUpperCase();
    }
}
