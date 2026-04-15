import { CursoService } from '../service/CursoService.mjs';
import { StoreView } from '../view/StoreView.mjs';
import { MainController } from './MainController.mjs';
import { UsuarioService } from '../service/UsuarioService.mjs';
import { ProgressoService } from '../service/ProgressoService.mjs';

const cursoSvc = new CursoService();
const usuarioSvc = new UsuarioService();
const progressoSvc = new ProgressoService();

export class LojaController {
    static selectedCourse = null;
    static pendingUserId = null;

    static init() {
        StoreView.render(cursoSvc.listar());
    }

    static prepararCheckout(cursoId) {
        this.selectedCourse = cursoSvc.buscarPorId(cursoId);
        
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById('view-checkout').classList.remove('d-none');
        
        const detailsLog = `Comprando: <b>${this.selectedCourse.Titulo}</b> por R$ ${this.selectedCourse.Preco.toFixed(2).replace('.',',')}`;

        if (MainController.currentUser) {
            document.getElementById('checkout-logged').classList.remove('d-none');
            document.getElementById('checkout-public').classList.add('d-none');
            document.getElementById('checkout-plan-info-logged').innerHTML = detailsLog;
        } else {
            document.getElementById('checkout-public').classList.remove('d-none');
            document.getElementById('checkout-logged').classList.add('d-none');
            document.getElementById('checkout-plan-info-public').innerHTML = detailsLog;
        }
    }

    static handlePublicCoursePurchase(form) {
        const nome = document.getElementById('pubNome').value;
        const email = document.getElementById('pubEmail').value;
        
        try {
            const novoUser = usuarioSvc.salvar({ nomeCompleto: nome, email, senhaHash: "12345", isAdmin: false });
            progressoSvc.matricular(novoUser.ID_Usuario, this.selectedCourse.ID_Curso, this.selectedCourse.Preco);
            
            form.reset();
            this.pendingUserId = novoUser.ID_Usuario;
            document.getElementById('createPasswordAlertInfo').innerHTML = `<strong>Sucesso!</strong> Sua matrícula gerada é: <b>${novoUser.ID_Usuario}</b>`;
            
            const modal = new bootstrap.Modal(document.getElementById('createPasswordModal'));
            modal.show();
            
            MainController.navigate('home');
        } catch(e) {
            alert(e.message);
        }
    }

    static handleCreatePassword(form) {
        const nova = document.getElementById('createNewPassword').value;
        const confirm = document.getElementById('confirmCreateNewPassword').value;
        
        if (nova !== confirm) { alert('As senhas não coincidem!'); return; }
        if (nova.length < 5) { alert('Senha muito curta.'); return; }
        
        usuarioSvc.atualizarSenha(this.pendingUserId, nova);
        
        const user = usuarioSvc.buscarPorId(this.pendingUserId);
        MainController.currentUser = user;
        localStorage.setItem('CodeMaster_Session', user.ID_Usuario);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('createPasswordModal'));
        if(modal) modal.hide();
        
        MainController.renderInitialState();
        MainController.navigate('student');
        
        alert('Senha criada com sucesso! Você já está logado na sua nova conta.');
        this.pendingUserId = null;
        form.reset();
    }

    static handleLoggedCoursePurchase() {
        try {
            progressoSvc.matricular(MainController.currentUser.ID_Usuario, this.selectedCourse.ID_Curso, this.selectedCourse.Preco);
            alert(`✅ Compra do curso "${this.selectedCourse.Titulo}" aprovada com sucesso!`);
            MainController.navigate('student');
        } catch(e) {
            alert(e.message);
        }
    }
}
