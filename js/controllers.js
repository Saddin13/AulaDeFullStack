// controllers.js - Controladores da Aplicação MVC

class AppController {
    constructor(db, views) {
        this.db = db;
        this.views = views;
        this.currentUser = null;
        this.currentPlayingAula = null;
        this.ytPlayer = null;

        // Recupera a sessão atual do localStorage, se houver
        const sessionUserId = localStorage.getItem('CodeMaster_Session');
        if (sessionUserId) {
            this.currentUser = this.db.usuarios.find(u => u.ID_Usuario === sessionUserId);
            // Se a senha for "123456", força a troca (exceto para verificação de initial login q vai ser feita na UI)
        }

        this.initEventListeners();
        this.renderInitialState();
    }

    renderInitialState() {
        this.views.renderNavbar(this.currentUser);
        this.navigate('home');
        this.checkPasswordReset();
    }

    initEventListeners() {
        // Event Delegation para navegação do menu e botões de tela
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('.nav-view-link') || e.target.closest('[data-view]')) {
                e.preventDefault();
                const el = e.target.closest('[data-view]');
                if (el) this.navigate(el.dataset.view);
            }
            if (e.target.closest('#logout-btn')) {
                this.logout();
            }
            if (e.target.closest('#login-btn')) {
                const modal = new bootstrap.Modal(document.getElementById('loginModal'));
                modal.show();
            }
        });

        // Formulário de Login
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const mat = document.getElementById('loginMatricula').value;
            const pass = document.getElementById('loginSenha').value;
            this.login(mat, pass);
        });

        // Formulário de Cadastro (Aluno Público)
        document.getElementById('checkoutNewStudentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handlePublicCoursePurchase();
        });

        // Formulário de Compra Logado
        document.getElementById('checkoutLoggedForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLoggedCoursePurchase();
        });

        // Formulário de Troca de Senha
        document.getElementById('resetPasswordForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.changePassword();
        });

        // Formulário de Criação de Senha
        const createPasswordForm = document.getElementById('createPasswordForm');
        if (createPasswordForm) {
            createPasswordForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleCreatePassword();
            });
        }

        // Admin forms
        const adminCreateUserForm = document.getElementById('adminCreateUserForm');
        if (adminCreateUserForm) {
            adminCreateUserForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.adminCreateUser();
            });
        }
    }

    checkPasswordReset() {
        if (this.currentUser && this.currentUser.SenhaHash === '12345') {
            const modal = new bootstrap.Modal(document.getElementById('resetPasswordModal'));
            modal.show();
        }
    }

    changePassword() {
        const nova = document.getElementById('newPassword').value;
        const confirm = document.getElementById('confirmNewPassword').value;
        if (nova !== confirm) {
            alert('As senhas não coincidem!');
            return;
        }
        if (nova.length < 5) {
            alert('Senha muito curta.');
            return;
        }

        this.currentUser.SenhaHash = nova;
        this.db.save();
        alert('Senha atualizada com sucesso!');
        bootstrap.Modal.getInstance(document.getElementById('resetPasswordModal')).hide();
        this.renderInitialState();
    }

    login(matricula, senha) {
        const formattedMat = String(matricula).padStart(5, '0');
        const user = this.db.usuarios.find(u => u.ID_Usuario === formattedMat && u.SenhaHash === senha);
        if (user) {
            this.currentUser = user;
            localStorage.setItem('CodeMaster_Session', user.ID_Usuario);
            bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
            
            this.renderInitialState();
            
            // Navega para local correto
            if (user.IsAdmin) {
                this.navigate('admin');
            } else {
                this.navigate('student');
            }
        } else {
            alert('Matrícula ou Senha inválidos.');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('CodeMaster_Session');
        this.renderInitialState();
        this.navigate('home');
    }

    navigate(viewId) {
        // Oculta todas as sections
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        // Mostra view alvo
        const targetView = document.getElementById(`view-${viewId}`);
        if(targetView) targetView.classList.remove('d-none');

        // Lógica Específica
        if (viewId === 'store') this.initStore();
        if (viewId === 'student' && this.currentUser) this.initStudentDashboard();
        if (viewId === 'admin' && this.currentUser && this.currentUser.IsAdmin) this.initAdminDashboard();
        
        // Bloqueio de rotas protegidas
        if ((viewId === 'student' || viewId === 'checkout') && (!this.currentUser || this.currentUser.IsAdmin)) {
            if (!this.currentUser) alert('Você precisa estar logado como Aluno para acessar essa área.');
            this.navigate('home');
            return;
        }
        if (viewId === 'admin' && (!this.currentUser || !this.currentUser.IsAdmin)) {
            alert('Acesso negado. Apenas Administradores.');
            this.navigate('home');
        }
    }

    // --- LOJA / STORE ---
    initStore() {
        this.views.renderStore(this.db.cursos, (cursoId) => this.prepareCheckout(cursoId));
    }

    prepareCheckout(cursoId) {
        this.selectedCourse = this.db.cursos.find(c => c.ID_Curso === cursoId);
        
        // Esconde as outras telas e mostra o checkout respectivo
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        document.getElementById('view-checkout').classList.remove('d-none');
        
        const detailsLog = `Comprando: <b>${this.selectedCourse.Titulo}</b> por R$ ${this.selectedCourse.Preco.toFixed(2).replace('.',',')}`;

        if (this.currentUser) {
            document.getElementById('checkout-logged').classList.remove('d-none');
            document.getElementById('checkout-public').classList.add('d-none');
            document.getElementById('checkout-plan-info-logged').innerHTML = detailsLog;
        } else {
            document.getElementById('checkout-public').classList.remove('d-none');
            document.getElementById('checkout-logged').classList.add('d-none');
            document.getElementById('checkout-plan-info-public').innerHTML = detailsLog;
        }
    }

    handlePublicCoursePurchase() {
        const nome = document.getElementById('pubNome').value;
        const email = document.getElementById('pubEmail').value;
        
        // Cria usuário
        const newId = this.db.nextUserId();
        const novoUser = new Usuario(newId, nome, email, "12345", false);
        this.db.usuarios.push(novoUser);
        
        // Cria matrícula e pagamento
        this.createPurchaseData(newId, this.selectedCourse);
        this.db.save();
        
        document.getElementById('checkoutNewStudentForm').reset();
        
        this.pendingUserId = newId;
        document.getElementById('createPasswordAlertInfo').innerHTML = `<strong>Sucesso!</strong> Sua matrícula gerada é: <b>${newId}</b>`;
        
        const modal = new bootstrap.Modal(document.getElementById('createPasswordModal'));
        modal.show();
        
        this.navigate('home');
    }

    handleCreatePassword() {
        const nova = document.getElementById('createNewPassword').value;
        const confirm = document.getElementById('confirmCreateNewPassword').value;
        
        if (nova !== confirm) {
            alert('As senhas não coincidem!');
            return;
        }
        if (nova.length < 5) {
            alert('Senha muito curta.');
            return;
        }
        
        const user = this.db.usuarios.find(u => u.ID_Usuario === this.pendingUserId);
        if (user) {
            user.SenhaHash = nova;
            this.db.save();
            
            // Auto login
            this.currentUser = user;
            localStorage.setItem('CodeMaster_Session', user.ID_Usuario);
            
            bootstrap.Modal.getInstance(document.getElementById('createPasswordModal')).hide();
            this.renderInitialState();
            this.navigate('student');
            
            alert('Senha criada com sucesso! Você já está logado na sua nova conta.');
            this.pendingUserId = null;
        }
    }

    handleLoggedCoursePurchase() {
        // Verifica se já tem o curso
        if (this.db.matriculas.find(m => m.ID_Usuario === this.currentUser.ID_Usuario && m.ID_Curso === this.selectedCourse.ID_Curso)) {
            alert('Você já possui este curso!');
            return;
        }

        this.createPurchaseData(this.currentUser.ID_Usuario, this.selectedCourse);
        alert(`✅ Compra do curso "${this.selectedCourse.Titulo}" aprovada com sucesso!`);
        this.db.save();
        this.navigate('student');
    }

    createPurchaseData(matricula, curso) {
        const idMat = this.db.nextId('matriculas');
        this.db.matriculas.push(new Matricula(idMat, matricula, curso.ID_Curso));
        
        const idPag = this.db.nextId('pagamentos');
        this.db.pagamentos.push(new Pagamento(idPag, matricula, curso.ID_Curso, curso.Preco, 'Cartao'));
    }

    // --- ALUNO DÚVIDAS ---
    initStudentDashboard() {
        this.views.renderStudentDashboardHeader(this.currentUser);
        this.studentNavigateTabs('mycourses');
        
        // Listener tabs (limpa velhos p não duplicar mas usa onclick global pro layout)
        document.querySelectorAll('.student-tab-btn').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
                document.querySelectorAll('.student-tab-btn').forEach(b => b.classList.remove('active', 'bg-primary', 'text-white'));
                e.target.classList.add('active', 'bg-primary', 'text-white');
                this.studentNavigateTabs(e.target.dataset.tab);
            }
        });
    }

    studentNavigateTabs(tabName) {
        if (tabName === 'mycourses') this.loadMyCourses();
        if (tabName === 'certificates') this.loadMyCertificates();
    }

    loadMyCourses() {
        const myEnrollments = this.db.matriculas.filter(m => m.ID_Usuario === this.currentUser.ID_Usuario);
        if (myEnrollments.length === 0) {
            this.views.renderStudentCourses(`<div class="alert alert-warning">Você não possui matrículas ativas. Conheça nossos cursos na loja!</div>`);
            return;
        }

        let html = `<div class="row g-4">`;
        myEnrollments.forEach(mat => {
            const curso = this.db.cursos.find(c => c.ID_Curso === mat.ID_Curso);
            if(!curso) return;

            let totalAulasCurso = 0;
            let concluidas = 0;

            this.db.modulos.filter(m => m.ID_Curso === curso.ID_Curso).forEach(mod => {
                const aulasModulo = this.db.aulas.filter(a => a.ID_Modulo === mod.ID_Modulo);
                totalAulasCurso += aulasModulo.length;
                aulasModulo.forEach(aula => {
                    if (this.db.progressos.find(p => p.ID_Usuario === this.currentUser.ID_Usuario && p.ID_Aula === aula.ID_Aula)) {
                        concluidas++;
                    }
                });
            });

            const percent = totalAulasCurso > 0 ? Math.round((concluidas / totalAulasCurso) * 100) : 0;
            const certClass = percent === 100 ? 'btn-success btn-cert-emit' : 'btn-outline-secondary disabled';

            html += `
            <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm glass-card pointer">
                    <div class="card-body">
                        <span class="badge bg-warning text-dark mb-2">${curso.Nivel}</span>
                        <h5 class="fw-bold">${curso.Titulo}</h5>
                        
                        <div class="mt-4">
                            <div class="d-flex justify-content-between small text-muted mb-1">
                                <span>Progresso</span>
                                <span>${percent}%</span>
                            </div>
                            <div class="progress" style="height: 6px;">
                                <div class="progress-bar bg-success" role="progressbar" style="width: ${percent}%;"></div>
                            </div>
                        </div>

                        <div class="mt-4 d-flex gap-2">
                            <button class="btn btn-sm btn-primary flex-grow-1 btn-play-course" data-id="${curso.ID_Curso}"><i class="bi bi-play-circle me-1"></i> Assistir Próxima Aula</button>
                            <button class="btn btn-sm ${certClass}" data-id="${curso.ID_Curso}" ${percent === 100 ? '' : 'disabled'}>
                                <i class="bi bi-award"></i> Certificado
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
        this.views.renderStudentCourses(html);

        // Bind events for dynamically added buttons
        document.querySelectorAll('.btn-play-course').forEach(btn => {
            btn.addEventListener('click', (e) => this.playNextAula(parseInt(e.currentTarget.dataset.id)));
        });
        document.querySelectorAll('.btn-cert-emit').forEach(btn => {
            btn.addEventListener('click', (e) => this.emitirCertificado(parseInt(e.currentTarget.dataset.id)));
        });
    }

    playNextAula(courseId) {
        let proximaAula = null;
        const modulosC = this.db.modulos.filter(m => m.ID_Curso === courseId);
        modulosC.sort((a,b) => a.Ordem - b.Ordem);

        for (let mod of modulosC) {
            const aulasM = this.db.aulas.filter(aula => aula.ID_Modulo === mod.ID_Modulo);
            aulasM.sort((a,b) => a.Ordem - b.Ordem);

            for (let a of aulasM) {
                if (!this.db.progressos.find(p => p.ID_Usuario === this.currentUser.ID_Usuario && p.ID_Aula === a.ID_Aula)) {
                    proximaAula = a;
                    break;
                }
            }
            if(proximaAula) break;
        }

        if (proximaAula) {
            this.currentPlayingAula = proximaAula;
            this.views.showVideoModal(proximaAula, courseId);

            if (window.ytPlayerObj) {
                window.ytPlayerObj.loadVideoById(proximaAula.URL_Conteudo);
            } else {
                window.ytPlayerObj = new YT.Player('youtube-player', {
                    height: '100%',
                    width: '100%',
                    videoId: proximaAula.URL_Conteudo,
                    playerVars: { 'autoplay': 1, 'controls': 1 },
                    events: { 'onStateChange': (e) => this.onPlayerStateChange(e) }
                });
            }
        } else {
            alert("👏 Você já concluiu todas as aulas deste curso!");
        }
    }

    onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            this.db.progressos.push(new ProgressoAula(this.currentUser.ID_Usuario, this.currentPlayingAula.ID_Aula));
            this.db.save();
            alert(`✅ Aula "${this.currentPlayingAula.Titulo}" concluída!`);
            this.loadMyCourses(); 
            this.views.closeVideoModal();
        }
    }

    emitirCertificado(courseId) {
        let hasCert = this.db.certificados.find(c => c.ID_Usuario === this.currentUser.ID_Usuario && c.ID_Curso === courseId);
        if (!hasCert) {
            hasCert = new Certificado(this.db.nextId('certificados'), this.currentUser.ID_Usuario, courseId);
            this.db.certificados.push(hasCert);
            this.db.save();
            alert(`🎓 Certificado Gerado com Sucesso!\nCódigo: ${hasCert.CodigoVerificacao}`);
        } else {
            alert(`ℹ️ Você já possui um certificado emitido.\nCódigo: ${hasCert.CodigoVerificacao}`);
        }
        document.querySelector('[data-tab="certificates"]').click();
    }

    loadMyCertificates() {
        const myCerts = this.db.certificados.filter(c => c.ID_Usuario === this.currentUser.ID_Usuario);
        let html = `<div class="row">`;
        if (myCerts.length === 0) {
             html += `<div class="col-12"><div class="alert alert-secondary">Nenhum certificado emitido ainda.</div></div>`;
        } else {
            myCerts.forEach(cert => {
                const cursoTitle = this.db.cursos.find(c => c.ID_Curso === cert.ID_Curso).Titulo;
                html += `
                <div class="col-md-6 mb-4">
                    <div class="card bg-dark text-white p-3 border-0 rounded-4 shadow-lg position-relative overflow-hidden">
                        <div class="position-absolute opacity-10" style="right: -20px; bottom: -20px; font-size: 8rem;"><i class="bi bi-award-fill"></i></div>
                        <h6 class="text-warning text-uppercase mb-1">Certificado de Conclusão</h6>
                        <h4 class="fw-bold border-bottom border-secondary pb-3 mb-3 z-1 position-relative">${cursoTitle}</h4>
                        <div class="d-flex justify-content-between z-1 position-relative">
                            <small class="text-muted">Data: <span class="text-light">${new Date(cert.DataEmissao).toLocaleDateString()}</span></small>
                            <small class="text-muted">Verificação: <span class="text-light fw-bold">${cert.CodigoVerificacao}</span></small>
                        </div>
                    </div>
                </div>`;
            });
        }
        html += `</div>`;
        this.views.renderStudentCertificates(html);
    }

    // --- ADMIN DASHBOARD ---
    initAdminDashboard() {
        // Popula seletor de cursos no formulário
        const select = document.getElementById('adminCourseSelect');
        select.innerHTML = '<option value="">Sem curso inicial</option>';
        this.db.cursos.forEach(c => {
            select.innerHTML += `<option value="${c.ID_Curso}">${c.Titulo}</option>`;
        });

        this.renderAdminUsersList();
    }

    renderAdminUsersList() {
        this.views.renderAdminPanel(
            this.db.usuarios, 
            this.db.cursos, 
            (idUser) => this.adminDeleteUser(idUser),
            (idUser) => this.adminGiveCourse(idUser)
        );
    }

    adminCreateUser() {
        const nome = document.getElementById('adminNewUserName').value;
        const email = document.getElementById('adminNewUserEmail').value;
        const cursoIdStr = document.getElementById('adminCourseSelect').value;

        const newId = this.db.nextUserId();
        const novoUser = new Usuario(newId, nome, email, "12345", false);
        this.db.usuarios.push(novoUser);

        if (cursoIdStr) {
            const idMat = this.db.nextId('matriculas');
            this.db.matriculas.push(new Matricula(idMat, newId, parseInt(cursoIdStr)));
        }

        this.db.save();
        alert(`🎓 Aluno Cadastrado!\nMatrícula: ${newId}\nSenha Temporária: 12345`);
        document.getElementById('adminCreateUserForm').reset();
        this.renderAdminUsersList();
    }

    adminDeleteUser(idMatricula) {
        if(confirm(`Tem certeza que deseja banir o aluno de matrícula ${idMatricula}? Suas matrículas e progressos serão perdidos.`)) {
            // Delete user and cascade
            this.db.usuarios = this.db.usuarios.filter(u => u.ID_Usuario !== idMatricula);
            this.db.matriculas = this.db.matriculas.filter(m => m.ID_Usuario !== idMatricula);
            this.db.progressos = this.db.progressos.filter(p => p.ID_Usuario !== idMatricula);
            this.db.certificados = this.db.certificados.filter(c => c.ID_Usuario !== idMatricula);
            
            this.db.save();
            this.renderAdminUsersList();
        }
    }

    adminGiveCourse(idMatricula) {
        let msg = "Selecione o Curso para matricular o Aluno:\n";
        this.db.cursos.forEach(c => msg += `${c.ID_Curso} - ${c.Titulo}\n`);
        const result = prompt(msg);
        
        if (result) {
            const cId = parseInt(result);
            if(isNaN(cId) || !this.db.cursos.find(c => c.ID_Curso === cId)) {
                alert('ID de curso inválida!');
                return;
            }
            if (this.db.matriculas.find(m => m.ID_Usuario === idMatricula && m.ID_Curso === cId)) {
                alert('Aluno já matriculado neste curso!');
                return;
            }

            const idMat = this.db.nextId('matriculas');
            this.db.matriculas.push(new Matricula(idMat, idMatricula, cId));
            this.db.save();
            alert(`Matrícula adicionada com sucesso ao aluno ${idMatricula}.`);
        }
    }

}

// Inicializa quando DOM está pronto
document.addEventListener('DOMContentLoaded', () => {
    // window.db é carregado primeiro no models.js, views.js é logo depois.
    window.appController = new AppController(window.db, window.views);
});
