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
});
