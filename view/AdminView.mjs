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
}
