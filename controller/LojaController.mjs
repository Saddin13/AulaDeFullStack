import { CursoService } from '../service/CursoService.mjs';
import { StoreView } from '../view/StoreView.mjs';
import { MainController } from './MainController.mjs';
import { UsuarioService } from '../service/UsuarioService.mjs';
import { ProgressoService } from '../service/ProgressoService.mjs';
import { TrilhaService } from '../service/TrilhaService.mjs';

const cursoSvc = new CursoService();
const usuarioSvc = new UsuarioService();
const progressoSvc = new ProgressoService();
const trilhaSvc = new TrilhaService();

export class LojaController {
    static selectedCourse = null;
    static selectedTrilha = null;
    static precoTrilha = 0;
    static pendingUserId = null;

    static init() {
        const cursos = cursoSvc.listar();
        StoreView.render(cursos);
        
        const trilhas = trilhaSvc.listar();
        const trilhaPrecos = {};
        const trilhaCursosCount = {};
        
        trilhas.forEach(t => {
            const cursosDaTrilha = cursos.filter(c => c.ID_Trilha == t.ID_Trilha);
            const somaCursos = cursosDaTrilha.reduce((sum, c) => sum + c.Preco, 0);
            trilhaPrecos[t.ID_Trilha] = somaCursos * 0.9;
            trilhaCursosCount[t.ID_Trilha] = cursosDaTrilha.length;
        });
        
        StoreView.renderTrilhas(trilhas, trilhaPrecos, trilhaCursosCount);
    }

    static prepararCheckout(cursoId) {
        this.selectedCourse = cursoSvc.buscarPorId(cursoId);
        this.selectedTrilha = null;
        
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

    static prepararCheckoutTrilha(trilhaId) {
        this.selectedTrilha = trilhaSvc.buscarPorId(trilhaId);
        this.selectedCourse = null;
        
        const cursosDaTrilha = cursoSvc.listar().filter(c => c.ID_Trilha == trilhaId);
        const somaCursos = cursosDaTrilha.reduce((sum, c) => sum + c.Preco, 0);
        this.precoTrilha = somaCursos * 0.9;
        
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById('view-checkout').classList.remove('d-none');
        
        const detailsLog = `Comprando Trilha: <b>${this.selectedTrilha.Nome}</b> por R$ ${this.precoTrilha.toFixed(2).replace('.',',')}`;

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
            
            if (this.selectedCourse) {
                progressoSvc.matricular(novoUser.ID_Usuario, this.selectedCourse.ID_Curso, this.selectedCourse.Preco);
            } else if (this.selectedTrilha) {
                const cursosDaTrilha = cursoSvc.listar().filter(c => c.ID_Trilha == this.selectedTrilha.ID_Trilha);
                cursosDaTrilha.forEach(c => progressoSvc.matricular(novoUser.ID_Usuario, c.ID_Curso, c.Preco * 0.9));
            }
            
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
            if (this.selectedCourse) {
                progressoSvc.matricular(MainController.currentUser.ID_Usuario, this.selectedCourse.ID_Curso, this.selectedCourse.Preco);
                alert(`✅ Compra do curso "${this.selectedCourse.Titulo}" aprovada com sucesso!`);
            } else if (this.selectedTrilha) {
                const cursosDaTrilha = cursoSvc.listar().filter(c => c.ID_Trilha == this.selectedTrilha.ID_Trilha);
                cursosDaTrilha.forEach(c => {
                    // Ignora erro se já estiver matriculado num curso da trilha
                    try { progressoSvc.matricular(MainController.currentUser.ID_Usuario, c.ID_Curso, c.Preco * 0.9); } catch(e) {}
                });
                alert(`✅ Compra da Trilha "${this.selectedTrilha.Nome}" aprovada com sucesso!`);
            }
            MainController.navigate('student');
        } catch(e) {
            alert(e.message);
        }
    }
}
