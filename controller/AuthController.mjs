import { UsuarioService } from '../service/UsuarioService.mjs';
import { MainController } from './MainController.mjs';

const usuarioSvc = new UsuarioService();

export class AuthController {
    static login(form) {
        const matriculaStr = document.getElementById('loginMatricula').value; // 'admin' ou id numerico
        const pss = document.getElementById('loginSenha').value;

        // Se o cara digitar 00001 e era string numerico n faz padding a priori, mas para alunos com 5 digit pad:
        // O Usuario model salva o admin como 'admin' (sem padding). Alunos ficam '00002'.
        const mstr = (matriculaStr.toLowerCase() === 'admin') ? 'admin' : String(matriculaStr).padStart(5, '0');

        const u = usuarioSvc.listar().find(us => us.ID_Usuario === mstr && us.SenhaHash === pss);
        if (u) {
            MainController.currentUser = u;
            localStorage.setItem('CodeMaster_Session', u.ID_Usuario);
            
            const m = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
            if(m) m.hide();
            
            MainController.renderInitialState();
            if (u.IsAdmin) {
                MainController.navigate('admin');
            } else {
                MainController.navigate('student');
            }
        } else {
            alert('Matrícula ou Senha inválidos.');
        }
        form.reset();
    }

    static resetPassword(form) {
        const nova = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        if (nova !== confirm) { alert('Senhas não coincidem!'); return; }
        if (nova.length < 5) { alert('Senha curta!'); return; }

        if(MainController.currentUser) {
            usuarioSvc.atualizarSenha(MainController.currentUser.ID_Usuario, nova);
            MainController.currentUser.SenhaHash = nova; // atualiza obj em memoria para ui
            alert('Senha atualizada com sucesso!');
            const m = bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal'));
            if(m) m.hide();
            MainController.renderInitialState();
        }
        form.reset();
    }
}
