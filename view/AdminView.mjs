export class AdminView {
    static renderUsersList(usuarios, cursos) {
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
                    <button class="btn btn-sm btn-outline-primary admin-give-course" onclick="window.AdminController.darCurso('${u.ID_Usuario}')">Dar Curso</button>
                    <button class="btn btn-sm btn-outline-danger admin-delete-user" onclick="window.AdminController.excluirAluno('${u.ID_Usuario}')">Banir/Excluir</button>
                    ` : ''}
                </td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-users-list').innerHTML = html;
        
        const select = document.getElementById('adminCourseSelect');
        if(select.options.length <= 1) { // Só popula se não tiver
            select.innerHTML = '<option value="">Sem curso inicial</option>';
            cursos.forEach(c => {
                select.innerHTML += `<option value="${c.ID_Curso}">${c.Titulo}</option>`;
            });
        }
    }

    static renderCursosList(cursos, categorias, trilhas) {
        let html = `<div class="table-responsive"><table class="table table-hover align-middle bg-white rounded shadow-sm">
            <thead class="table-dark">
                <tr><th>ID</th><th>Título</th><th>Categoria</th><th>Trilha</th><th>Nível</th><th>Ações</th></tr>
            </thead>
            <tbody>`;
        
        cursos.forEach(c => {
            const cat = categorias.find(cat => cat.ID_Categoria == c.ID_Categoria);
            const trilha = trilhas ? trilhas.find(t => t.ID_Trilha == c.ID_Trilha) : null;
            html += `<tr>
                <td>${c.ID_Curso}</td>
                <td>${c.Titulo}</td>
                <td>${cat ? cat.Nome : '<span class="text-muted">N/A</span>'}</td>
                <td>${trilha ? trilha.Nome : '<span class="text-muted">N/A</span>'}</td>
                <td><span class="badge bg-warning text-dark">${c.Nivel || 'N/A'}</span></td>
                <td><button class="btn btn-sm btn-outline-secondary" onclick="window.AdminController.openEditarCursoModal(${c.ID_Curso})"><i class="bi bi-pencil"></i> Editar</button></td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-cursos-list').innerHTML = html;

        const select = document.getElementById('adminNewCursoCategoriaSelect');
        if(select) {
            select.innerHTML = '<option value="">Selecione uma Categoria...</option>';
            categorias.forEach(cat => {
                select.innerHTML += `<option value="${cat.ID_Categoria}">${cat.Nome}</option>`;
            });
        }
    }

    static renderTrilhasList(trilhas) {
        let html = `<div class="table-responsive"><table class="table table-hover align-middle bg-white rounded shadow-sm">
            <thead class="table-dark">
                <tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Ações</th></tr>
            </thead>
            <tbody>`;
        trilhas.forEach(t => {
            html += `<tr>
                <td>${t.ID_Trilha}</td>
                <td>${t.Nome}</td>
                <td>${t.Descricao}</td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="window.AdminController.openLinkCoursesModal('trilha', ${t.ID_Trilha})"><i class="bi bi-link-45deg"></i> Vincular Cursos</button></td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-trilhas-list').innerHTML = html;
    }

    static renderCategoriasList(categorias) {
        let html = `<div class="table-responsive"><table class="table table-hover align-middle bg-white rounded shadow-sm">
            <thead class="table-dark">
                <tr><th>ID</th><th>Nome</th><th>Descrição</th><th>Ações</th></tr>
            </thead>
            <tbody>`;
        categorias.forEach(c => {
            html += `<tr>
                <td>${c.ID_Categoria}</td>
                <td>${c.Nome}</td>
                <td>${c.Descricao}</td>
                <td><button class="btn btn-sm btn-outline-primary" onclick="window.AdminController.openLinkCoursesModal('categoria', ${c.ID_Categoria})"><i class="bi bi-link-45deg"></i> Vincular Cursos</button></td>
            </tr>`;
        });
        html += `</tbody></table></div>`;
        document.getElementById('admin-categorias-list').innerHTML = html;
    }
}
