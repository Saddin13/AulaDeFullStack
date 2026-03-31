// app.js - Lógica principal da Single Page Application

const app = {
    currentUser: 2, // ID do Aluno Simulado (ver models.js)

    init() {
        // Pré-matricular o aluno Simulado no Curso 1 para testes
        if (db.matriculas.length === 0) {
            db.matriculas.push(new Matricula(1, this.currentUser, 1));
        }

        // Setup event listeners forms
        this.setupCheckoutForm();
        
        // Carrega views iniciais
        this.renderPlans();
    },

    // Navegação Principal SPA
    navigate(viewId) {
        // Oculta todas as sections
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.add('d-none'));
        // Remove atalho ativo na navbar
        document.querySelectorAll('.nav-view-link').forEach(link => link.classList.remove('active'));

        // Mostra view alvo
        document.getElementById(`view-${viewId}`).classList.remove('d-none');
        
        // Se clicar pela navbar tenta ativar (só visual)
        const activeLink = document.querySelector(`.nav-view-link[onclick="app.navigate('${viewId}')"]`);
        if (activeLink) activeLink.classList.add('active');

        // Dispara renderizadores específicos
        if (viewId === 'admin') this.renderAdminCategories();
        if (viewId === 'student') this.renderStudentDashboard();
        if (viewId === 'checkout') this.renderPlans();
    },

    // -----------------------------------------------------
    // ADMIN MODULE (Gestão Acadêmica Básica - Visualização)
    // -----------------------------------------------------
    adminNavigate(section, btnElement) {
        // Atualiza UI list-group
        document.querySelectorAll('.override-list-group .list-group-item').forEach(btn => btn.classList.remove('active'));
        btnElement.classList.add('active');

        if (section === 'categories') this.renderAdminCategories();
        if (section === 'courses') this.renderAdminCourses();
        if (section === 'trails') {
            document.getElementById('admin-content-area').innerHTML = `<h5 class="text-muted">Área de Trilhas em Construção...</h5>`;
        }
    },

    renderAdminCategories() {
        let html = `<div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="mb-0">Gestão de Categorias</h4>
                        <button class="btn btn-sm btn-primary">+ Nova Categoria</button>
                    </div>
                    <div class="table-responsive">
                    <table class="table table-hover align-middle">
                        <thead class="table-light"><tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Ações</th></tr></thead>
                        <tbody>`;
        db.categorias.forEach(cat => {
            html += `<tr>
                        <td>#${cat.ID_Categoria}</td>
                        <td class="fw-bold">${cat.Nome}</td>
                        <td>${cat.Descricao}</td>
                        <td><button class="btn btn-sm btn-outline-secondary"><i class="bi bi-pencil"></i></button></td>
                    </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-content-area').innerHTML = html;
    },

    renderAdminCourses() {
        let html = `<div class="d-flex justify-content-between align-items-center mb-3">
                        <h4 class="mb-0">Gestão de Cursos e Módulos</h4>
                        <button class="btn btn-sm btn-primary">+ Novo Curso</button>
                    </div>
                    <div class="row">`;
        db.cursos.forEach(curso => {
            const cat = db.categorias.find(c => c.ID_Categoria === curso.ID_Categoria);
            html += `<div class="col-12 mb-3">
                        <div class="card shadow-sm border-0">
                            <div class="card-body">
                                <span class="badge bg-secondary mb-2">${cat ? cat.Nome : 'Sem Cat'}</span>
                                <h5 class="card-title fw-bold">${curso.Titulo}</h5>
                                <p class="card-text text-muted small">${curso.Descricao}</p>
                                <hr>
                                <h6>Módulos (<span class="badge bg-primary text-white rounded-pill">${db.modulos.filter(m => m.ID_Curso === curso.ID_Curso).length}</span>)</h6>
                                <ul class="list-group list-group-flush small">`;
            
            db.modulos.filter(m => m.ID_Curso === curso.ID_Curso).forEach(mod => {
                const qtdAulas = db.aulas.filter(a => a.ID_Modulo === mod.ID_Modulo).length;
                html += `<li class="list-group-item d-flex justify-content-between align-items-center border-0 px-0">
                            ${mod.Titulo} 
                            <span class="badge bg-light text-dark rounded-pill">${qtdAulas} Aulas</span>
                         </li>`;
            });

            html += `           </ul>
                            </div>
                        </div>
                    </div>`;
        });
        html += `</div>`;
        document.getElementById('admin-content-area').innerHTML = html;
    },

    // -----------------------------------------------------
    // STUDENT MODULE (Área do Aluno, Progresso e Certificados)
    // -----------------------------------------------------
    studentNavigate(section, btnElement) {
        document.querySelectorAll('#student-tabs .nav-link').forEach(link => link.classList.remove('active', 'bg-primary', 'text-white'));
        btnElement.classList.add('active', 'bg-primary', 'text-white');

        if (section === 'mycourses') this.renderStudentCourses();
        if (section === 'certificates') this.renderStudentCertificates();
    },

    renderStudentDashboard() {
        const user = db.usuarios.find(u => u.ID_Usuario === this.currentUser);
        document.getElementById('student-header').innerHTML = `
            <h3 class="fw-bold m-0"><i class="bi bi-person-circle me-2"></i> ${user.NomeCompleto}</h3>
            <p class="m-0 mt-1 opacity-75">${user.Email}</p>
        `;
        // Ativar aba "Meus Cursos" p/ padrão
        const tabs = document.querySelectorAll('#student-tabs .nav-link');
        this.studentNavigate('mycourses', tabs[0]);
    },

    renderStudentCourses() {
        const myEnrollments = db.matriculas.filter(m => m.ID_Usuario === this.currentUser);
        
        if (myEnrollments.length === 0) {
            document.getElementById('student-content-area').innerHTML = `<div class="alert alert-warning">Você não possui matrículas ativas. Conheça nossos planos!</div>`;
            return;
        }

        let html = `<div class="row g-4">`;
        myEnrollments.forEach(mat => {
            const curso = db.cursos.find(c => c.ID_Curso === mat.ID_Curso);
            if(!curso) return;

            // Calcular progresso (Total de aulas Concluidas do usuário dentro dos modulos deste curso)
            let totalAulasCurso = 0;
            let concluidas = 0;

            db.modulos.filter(m => m.ID_Curso === curso.ID_Curso).forEach(mod => {
                const aulasModulo = db.aulas.filter(a => a.ID_Modulo === mod.ID_Modulo);
                totalAulasCurso += aulasModulo.length;
                aulasModulo.forEach(aula => {
                    if (db.progressos.find(p => p.ID_Usuario === this.currentUser && p.ID_Aula === aula.ID_Aula)) {
                        concluidas++;
                    }
                });
            });

            const percent = totalAulasCurso > 0 ? Math.round((concluidas / totalAulasCurso) * 100) : 0;
            const certClass = percent === 100 ? 'btn-success' : 'btn-outline-secondary disabled';

            html += `
            <div class="col-md-6">
                <div class="card h-100 border-0 shadow-sm glass-card pointer">
                    <div class="card-body">
                        <span class="badge bg-warning text-dark mb-2">${curso.Nivel}</span>
                        <h5 class="fw-bold">${curso.Titulo}</h5>
                        <p class="text-muted small">${curso.Descricao}</p>
                        
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
                            <button class="btn btn-sm btn-primary flex-grow-1" onclick="app.simularAssistirAula(${curso.ID_Curso})">Anotar Aula (+ Progresso)</button>
                            <button class="btn btn-sm ${certClass}" ${percent === 100 ? `onclick="app.emitirCertificado(${curso.ID_Curso})"` : ''} title="Emissão liberada em 100%">
                                <i class="bi bi-award"></i> Emite Certificado
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
        document.getElementById('student-content-area').innerHTML = html;
    },

    simularAssistirAula(courseId) {
        // Encontra a primeira aula não concluída deste curso
        let proximaAula = null;
        for (let mod of db.modulos.filter(m => m.ID_Curso === courseId)) {
            for (let a of db.aulas.filter(aula => aula.ID_Modulo === mod.ID_Modulo)) {
                if (!db.progressos.find(p => p.ID_Usuario === this.currentUser && p.ID_Aula === a.ID_Aula)) {
                    proximaAula = a;
                    break;
                }
            }
            if(proximaAula) break;
        }

        if (proximaAula) {
            db.progressos.push(new ProgressoAula(this.currentUser, proximaAula.ID_Aula));
            alert(`✅ Aula "${proximaAula.Titulo}" concluída com sucesso!`);
            this.renderStudentCourses();
        } else {
            alert("👏 Você já concluiu todas as aulas deste curso!");
        }
    },

    emitirCertificado(courseId) {
        // Verifica se já existe
        let hasCert = db.certificados.find(c => c.ID_Usuario === this.currentUser && c.ID_Curso === courseId);
        if (!hasCert) {
            hasCert = new Certificado(db.nextId('certificados'), this.currentUser, courseId, null);
            db.certificados.push(hasCert);
            alert(`🎓 Certificado Gerado com Sucesso!\nCódigo: ${hasCert.CodigoVerificacao}`);
        } else {
            alert(`ℹ️ Você já possui um certificado emitido.\nCódigo: ${hasCert.CodigoVerificacao}`);
        }
        // Navega para a aba de certificados
        const tabs = document.querySelectorAll('#student-tabs .nav-link');
        this.studentNavigate('certificates', tabs[1]);
    },

    renderStudentCertificates() {
        const myCerts = db.certificados.filter(c => c.ID_Usuario === this.currentUser);
        
        let html = `<div class="row">`;
        if (myCerts.length === 0) {
             html += `<div class="col-12"><div class="alert alert-secondary">Nenhum certificado emitido ainda.</div></div>`;
        } else {
            myCerts.forEach(cert => {
                const cursoTitle = db.cursos.find(c => c.ID_Curso === cert.ID_Curso).Titulo;
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
        document.getElementById('student-content-area').innerHTML = html;
    },

    // -----------------------------------------------------
    // FINANCE MODULE (Planos, Checkout e Assinaturas)
    // -----------------------------------------------------
    renderPlans() {
        let html = '';
        db.planos.forEach(p => {
            html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-sm text-center py-4 px-3 transform-hover">
                    <h5 class="fw-bold text-primary mb-3">${p.Nome}</h5>
                    <h2 class="display-6 fw-bold mb-3">R$ ${p.Preco.toFixed(2).replace('.',',')}</h2>
                    <p class="text-muted mb-4" style="min-height: 50px;">${p.Descricao}</p>
                    <p class="fw-bold text-dark mb-4"><i class="bi bi-calendar-event me-2"></i> ${p.DuracaoMeses} Meses de Acesso</p>
                    <button class="btn btn-outline-primary btn-lg rounded-pill" onclick="app.showCheckout(${p.ID_Plano})">Assinar Agora</button>
                </div>
            </div>`;
        });
        document.getElementById('plans-container').innerHTML = html;
    },

    showCheckout(planId) {
        app.selectedPlan = db.planos.find(p => p.ID_Plano === planId);
        document.getElementById('plans-container').classList.add('d-none');
        document.getElementById('checkout-form-container').classList.remove('d-none');
        
        document.getElementById('checkout-plan-info').innerHTML = `
            <strong>Resumo:</strong> Você selecionou o <b>${app.selectedPlan.Nome}</b> no valor de <b>R$ ${app.selectedPlan.Preco.toFixed(2).replace('.',',')}</b>.
        `;
    },

    setupCheckoutForm() {
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const method = document.getElementById('checkoutMethod').value;
            
            // 1. Cria Assinatura
            const idAssinatura = db.nextId('assinaturas');
            const assinatura = new Assinatura(idAssinatura, this.currentUser, app.selectedPlan.ID_Plano, app.selectedPlan.DuracaoMeses);
            db.assinaturas.push(assinatura);

            // 2. Registra Pagamento
            const pagamento = new Pagamento(db.nextId('pagamentos'), idAssinatura, app.selectedPlan.Preco, method);
            db.pagamentos.push(pagamento);

            alert(`✅ Sucesso! Pagamento via ${method} aprovado.\nTransação: ${pagamento.Id_Transacao_Gateway}\nAssinatura liberada!`);
            
            // Retorna ao estado de planos
            document.getElementById('checkoutForm').reset();
            document.getElementById('checkout-form-container').classList.add('d-none');
            document.getElementById('plans-container').classList.remove('d-none');
            
            // Navega para Aluno
            this.navigate('student');
        });
    }
};

// Start App when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
