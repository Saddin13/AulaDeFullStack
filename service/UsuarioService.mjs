import { dbService } from './DatabaseService.mjs';
import { Usuario } from '../model/Usuario.mjs';

export class UsuarioService {
    listar() {
        return dbService.data.usuarios;
    }

    buscarPorId(id) {
        return this.listar().find(u => u.ID_Usuario === String(id)) ?? null;
    }

    salvar(dados) {
        const erros = Usuario.validar(dados);
        if (erros.length) throw new Error(erros.join(' | '));
        
        const usuario = new Usuario(dados); // Vai auto gerar 'admin' se isAdmin ou '00000' num aleatorio se nao preenchido
        dbService.data.usuarios.push(usuario);
        dbService.save();
        return usuario;
    }

    atualizarSenha(id, novaSenha) {
        const u = this.buscarPorId(id);
        if (!u) throw new Error("Usuário não encontrado");
        u.SenhaHash = novaSenha;
        dbService.save();
    }

    excluir(id) {
        dbService.data.usuarios = dbService.data.usuarios.filter(u => u.ID_Usuario !== String(id));
        
        // Cascata simulada
        dbService.data.matriculas = dbService.data.matriculas.filter(m => m.ID_Usuario !== String(id));
        dbService.data.progressos = dbService.data.progressos.filter(p => p.ID_Usuario !== String(id));
        dbService.data.certificados = dbService.data.certificados.filter(c => c.ID_Usuario !== String(id));
        dbService.save();
    }
}
