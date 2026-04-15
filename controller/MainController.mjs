import { dbService } from '../service/DatabaseService.mjs';
import { UsuarioService } from '../service/UsuarioService.mjs';
import { NavbarView } from '../view/NavbarView.mjs';
import { LojaController } from './LojaController.mjs';
import { AlunoController } from './AlunoController.mjs';
import { AdminController } from './AdminController.mjs';

const usuarioSvc = new UsuarioService();

export class MainController {
    static currentUser = null;

    static init() {
        const sessionUserId = localStorage.getItem('CodeMaster_Session');
        if (sessionUserId) {
            this.currentUser = usuarioSvc.buscarPorId(sessionUserId);
        }
        
        this.renderInitialState();
        this.initEventListeners();
    }

    static renderInitialState() {
        NavbarView.render(this.currentUser);
        this.navigate('home');
        this.checkPasswordReset();
    }

    static initEventListeners() {
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.nav-view-link') || e.target.closest('[data-view]')) {
                e.preventDefault();
                const el = e.target.closest('[data-view]');
                if (el) this.navigate(el.dataset.view);
            }
        });
    }

    static checkPasswordReset() {
        if (this.currentUser && this.currentUser.SenhaHash === '12345') {
            const modal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
            modal.show();
        }
    }

    static navigate(viewId) {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) targetView.classList.remove('d-none');

        // Lógica Específica
        if (viewId === 'store') LojaController.init();
        if (viewId === 'student' && this.currentUser) AlunoController.init(this.currentUser);
        if (viewId === 'admin' && this.currentUser && this.currentUser.IsAdmin) AdminController.init();
        
        // Bloqueio de rotas protegidas
        if (viewId === 'student' && (!this.currentUser || this.currentUser.IsAdmin)) {
            if (!this.currentUser) alert('Você precisa estar logado como Aluno para acessar essa área.');
            this.navigate('home');
            return;
        }
        if (viewId === 'admin' && (!this.currentUser || !this.currentUser.IsAdmin)) {
            alert('Acesso negado. Apenas Administradores.');
            this.navigate('home');
        }
    }

    static showLogin() {
        const modal = new bootstrap.Modal(document.getElementById('loginModal'));
        modal.show();
    }
    
    static logout() {
        this.currentUser = null;
        localStorage.removeItem('CodeMaster_Session');
        this.renderInitialState();
        this.navigate('home');
    }
}
