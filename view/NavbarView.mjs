// view/NavbarView.mjs
export class NavbarView {
    static render(user) {
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
                <button class="btn btn-outline-danger btn-sm mt-1" id="logout-btn" onclick="window.MainController.logout()">Sair (${user.ID_Usuario})</button>
            </li>`;
        } else {
            html += `
            <li class="nav-item ms-lg-3">
                <button class="btn btn-outline-light btn-sm mt-1" id="login-btn" onclick="window.MainController.showLogin()">Entrar</button>
            </li>`;
        }

        navUl.innerHTML = html;
    }
}
