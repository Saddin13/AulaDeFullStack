export class Usuario {
    constructor({ id, nomeCompleto, email, senhaHash, isAdmin = false }) {
        // Se isAdmin = true e sem id, forçamos 'admin'. Se for aluno, o id (ex: '00001') deve ser passado pelo service.
        this.ID_Usuario = id ?? (isAdmin ? 'admin' : String(Math.floor(Math.random() * 90000) + 10000).padStart(5, '0')); 
        this.NomeCompleto = nomeCompleto;
        this.Email = email;
        this.SenhaHash = senhaHash;
        this.IsAdmin = isAdmin;
        this.DataCadastro = new Date().toISOString();
    }

    static validar(dados) {
        const erros = [];
        if (!dados.nomeCompleto?.trim()) erros.push('Nome completo é obrigatório');
        if (!dados.email?.trim()) erros.push('E-mail é obrigatório');
        if (dados.senhaHash && dados.senhaHash.length < 5) erros.push('Senha deve ter no mínimo 5 caracteres');
        return erros;
    }
}
