// views.js - Manipulação do DOM

const views = {
    // Renderiza Lista da Loja (Cursos disponíveis para compra)
    renderStore(cursos, handlerComprar) {
        let html = '';
        cursos.forEach(curso => {
            html += `
            <div class="col-md-4 mb-4">
                <div class="card h-100 border-0 shadow-sm text-center py-4 px-3 transform-hover">
                    <span class="badge bg-warning text-dark mb-2 mx-auto">${curso.Nivel}</span>
                    <h5 class="fw-bold text-primary mb-3">${curso.Titulo}</h5>
                    <h2 class="display-6 fw-bold mb-3">R$ ${curso.Preco.toFixed(2).replace('.',',')}</h2>
                    <p class="text-muted mb-4" style="min-height: 50px;">${curso.Descricao}</p>
                    <p class="fw-bold text-dark mb-4"><i class="bi bi-clock me-2"></i> ${curso.TotalHoras} Horas | ${curso.TotalAulas} Aulas</p>
                    <button class="btn btn-outline-primary btn-lg rounded-pill store-buy-btn" data-id="${curso.ID_Curso}">Comprar Curso</button>
                </div>
            </div>`;
        });
        document.getElementById('store-container').innerHTML = html;
        
        document.querySelectorAll('.store-buy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => handlerComprar(parseInt(e.target.dataset.id)));
        });
    },

    // Renderiza a Área do Aluno (Cursos Matriculados)
    renderStudentDashboardHeader(user) {
        document.getElementById('student-header').innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="fw-bold m-0"><i class="bi bi-person-circle me-2"></i> ${user.NomeCompleto}</h3>
                    <p class="m-0 mt-1 opacity-75">Matrícula: <strong>${user.ID_Usuario}</strong> | ${user.Email}</p>
                </div>
            </div>
        `;
    },

    renderStudentCourses(matHtmList) {
        document.getElementById('student-content-area').innerHTML = matHtmList;
    },

    renderStudentCertificates(certHtmlList) {
        document.getElementById('student-content-area').innerHTML = certHtmlList;
    },

    showVideoModal(aula, courseId) {
        document.getElementById('videoModalLabel').innerText = `Assistindo: ${aula.Titulo}`;
        const modalEl = document.getElementById('videoModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    },

    closeVideoModal() {
        const modalEl = document.getElementById('videoModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }
    },

    // Renderiza o header dinâmico dependendo de logado / deslogado
    renderNavbar(user) {
        const navUl = document.querySelector('#navbarNav .navbar-nav');
        let html = `
            <li class="nav-item">
                <a class="nav-link nav-view-link active" href="#" data-view="home">Home</a>
            </li>
            <li class="nav-item">
                <a class="nav-link nav-view-link" href="#" data-view="store">Loja de Cursos</a>
            </li>
        `;

        if (user) {
            if (user.IsAdmin) {
                html += `
                <li class="nav-item">
                    <a class="nav-link nav-view-link" href="#" data-view="admin">Painel Admin</a>
                </li>`;
            } else {
                html += `
                <li class="nav-item">
                    <a class="nav-link nav-view-link" href="#" data-view="student">Área do Aluno</a>
                </li>`;
            }
            html += `
            <li class="nav-item ms-lg-3">
                <button class="btn btn-outline-danger btn-sm mt-1" id="logout-btn">Sair (${user.ID_Usuario})</button>
            </li>`;
        } else {
            html += `
            <li class="nav-item ms-lg-3">
                <button class="btn btn-outline-light btn-sm mt-1" id="login-btn">Entrar</button>
            </li>`;
        }

        navUl.innerHTML = html;
    },

    // Renderiza o Admin Panel
    renderAdminPanel(usuarios, cursos, handlerExcluir, handlerDarCurso) {
        let html = `<div class="table-responsive"><table class="table table-hover align-middle bg-white rounded shadow-sm">
            <thead class="table-dark">
                <tr>
                    <th>Matrícula</th>
                    <th>Nome</th>
                    <th>Email</th>
                    <th>Tipo</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
        `;
        
        usuarios.forEach(u => {
            html += `
            <tr>
                <td><strong>${u.ID_Usuario}</strong></td>
                <td>${u.NomeCompleto}</td>
                <td>${u.Email}</td>
                <td>${u.IsAdmin ? '<span class="badge bg-danger">Admin</span>' : '<span class="badge bg-secondary">Aluno</span>'}</td>
                <td>
                    ${!u.IsAdmin ? `
                    <button class="btn btn-sm btn-outline-primary admin-give-course" data-id="${u.ID_Usuario}">Dar Curso</button>
                    <button class="btn btn-sm btn-outline-danger admin-delete-user" data-id="${u.ID_Usuario}">Banir/Excluir</button>
                    ` : ''}
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-users-list').innerHTML = html;

        // Anexar eventos
        document.querySelectorAll('.admin-delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => handlerExcluir(e.target.dataset.id));
        });
        document.querySelectorAll('.admin-give-course').forEach(btn => {
            btn.addEventListener('click', (e) => handlerDarCurso(e.target.dataset.id));
        });
    }
};
window.views = views;
