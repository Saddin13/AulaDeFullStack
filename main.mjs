import { MainController } from './controller/MainController.mjs';
import { AuthController } from './controller/AuthController.mjs';
import { LojaController } from './controller/LojaController.mjs';
import { AlunoController } from './controller/AlunoController.mjs';
import { AdminController } from './controller/AdminController.mjs';

// Expõe os Controllers para os botões do HTML que têm "onclick='window.XXX'" e etc.
Object.assign(window, {
    MainController,
    AuthController,
    LojaController,
    AlunoController,
    AdminController
});

document.addEventListener('DOMContentLoaded', () => {
    MainController.init();

    // Attach listeners aos formulários estáticos
    document.getElementById('loginForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AuthController.login(e.target);
    });

    document.getElementById('resetPasswordForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AuthController.resetPassword(e.target);
    });

    document.getElementById('checkoutNewStudentForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        LojaController.handlePublicCoursePurchase(e.target);
    });

    document.getElementById('checkoutLoggedForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        LojaController.handleLoggedCoursePurchase();
    });

    document.getElementById('createPasswordForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        LojaController.handleCreatePassword(e.target);
    });

    document.getElementById('adminCreateUserForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.criarAluno(e.target);
    });

    document.getElementById('adminCreateCursoForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.criarCurso(e.target);
    });

    document.getElementById('adminCreateTrilhaForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.criarTrilha(e.target);
    });

    document.getElementById('adminCreateCategoriaForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.criarCategoria(e.target);
    });

    document.getElementById('adminCursoTotalAulas')?.addEventListener('input', (e) => {
        const num = parseInt(e.target.value) || 0;
        const container = document.getElementById('adminCursoAulasContainer');
        const list = document.getElementById('adminCursoAulasList');
        
        if (num > 0) {
            container.classList.remove('d-none');
            let html = '';
            for (let i = 1; i <= num; i++) {
                html += `
                <div class="mb-3 p-2 border rounded bg-white admin-curso-aula-item">
                    <label class="form-label fw-bold small text-primary">Aula ${i}</label>
                    <input type="text" class="form-control form-control-sm mb-2 aula-titulo" placeholder="Título da Aula ${i}" required>
                    <input type="text" class="form-control form-control-sm aula-vt-id" placeholder="ID do Vídeo no YouTube (Ex: hHM-hr9q4mo)" required>
                </div>
                `;
            }
            list.innerHTML = html;
        } else {
            container.classList.add('d-none');
            list.innerHTML = '';
        }
    });

    document.getElementById('editCursoTotalAulas')?.addEventListener('input', (e) => {
        const num = parseInt(e.target.value) || 0;
        const container = document.getElementById('editCursoAulasContainer');
        const list = document.getElementById('editCursoAulasList');
        
        if (num > 0) {
            container.classList.remove('d-none');
            // Só sobrescreve se o número aumentar sem popular dados reais primeiro, 
            // mas como é dinâmico, vamos desenhar o esqueleto (no Controller nós preenchemos)
            let html = '';
            for (let i = 1; i <= num; i++) {
                html += `
                <div class="mb-3 p-2 border rounded bg-white admin-edit-aula-item" data-index="${i-1}">
                    <label class="form-label fw-bold small text-primary">Aula ${i}</label>
                    <input type="text" class="form-control form-control-sm mb-2 edit-aula-titulo" placeholder="Título da Aula ${i}" required>
                    <input type="text" class="form-control form-control-sm edit-aula-vt-id" placeholder="ID do Vídeo no YouTube (Ex: hHM-hr9q4mo)" required>
                </div>
                `;
            }
            list.innerHTML = html;
        } else {
            container.classList.add('d-none');
            list.innerHTML = '';
        }
    });

    document.getElementById('editarCursoForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.saveEditarCursoModal(e.target);
    });

    document.getElementById('linkCoursesForm')?.addEventListener('submit', (e) => {
        e.preventDefault();
        AdminController.saveLinkCoursesModal(e.target);
    });
});
