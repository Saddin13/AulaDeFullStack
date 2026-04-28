import { UsuarioService } from '../service/UsuarioService.mjs';
import { CursoService } from '../service/CursoService.mjs';
import { ProgressoService } from '../service/ProgressoService.mjs';
import { TrilhaService } from '../service/TrilhaService.mjs';
import { CategoriaService } from '../service/CategoriaService.mjs';
import { AdminView } from '../view/AdminView.mjs';

const usuarioSvc = new UsuarioService();
const cursoSvc = new CursoService();
const progressoSvc = new ProgressoService();
const trilhaSvc = new TrilhaService();
const categoriaSvc = new CategoriaService();

export class AdminController {
    static init() {
        this.renderUsers();
        this.renderCursos();
        this.renderTrilhas();
        this.renderCategorias();
    }

    static renderUsers() {
        AdminView.renderUsersList(usuarioSvc.listar(), cursoSvc.listar());
    }

    static criarAluno(form) {
        const nome = document.getElementById('adminNewUserName').value;
        const email = document.getElementById('adminNewUserEmail').value;
        const cursoIdStr = document.getElementById('adminCourseSelect').value;

        const novoUser = usuarioSvc.salvar({ nomeCompleto: nome, email, senhaHash: "12345", isAdmin: false });

        if (cursoIdStr) {
            const curso = cursoSvc.buscarPorId(cursoIdStr);
            if(curso) {
                progressoSvc.matricular(novoUser.ID_Usuario, curso.ID_Curso, curso.Preco);
            }
        }

        alert(`🎓 Aluno Cadastrado!\nMatrícula: ${novoUser.ID_Usuario}\nSenha Temporária: 12345`);
        form.reset();
        this.renderUsers();
    }

    static excluirAluno(idMatricula) {
        if(confirm(`Tem certeza que deseja banir o aluno de matrícula ${idMatricula}? Suas matrículas e progressos serão perdidos.`)) {
            usuarioSvc.excluir(idMatricula);
            this.renderUsers();
        }
    }

    static darCurso(idMatricula) {
        let msg = "Selecione o Curso para matricular o Aluno:\n";
        cursoSvc.listar().forEach(c => msg += `${c.ID_Curso} - ${c.Titulo}\n`);
        const result = prompt(msg);
        
        if (result) {
            const cId = parseInt(result);
            const c = cursoSvc.buscarPorId(cId);
            if(!c) {
                alert('ID de curso inválida!');
                return;
            }
            try {
                progressoSvc.matricular(idMatricula, cId, c.Preco);
                alert(`Matrícula adicionada com sucesso ao aluno ${idMatricula}.`);
            } catch (e) {
                alert(e.message);
            }
        }
    }

    static renderCursos() {
        AdminView.renderCursosList(cursoSvc.listar(), categoriaSvc.listar(), trilhaSvc.listar());
    }

    static renderTrilhas() {
        AdminView.renderTrilhasList(trilhaSvc.listar());
    }

    static renderCategorias() {
        AdminView.renderCategoriasList(categoriaSvc.listar());
    }

    static criarCurso(form) {
        const titulo = document.getElementById('adminCursoTitulo').value;
        const descricao = document.getElementById('adminCursoDescricao').value;
        const categoriaId = document.getElementById('adminNewCursoCategoriaSelect').value;
        const nivel = document.getElementById('adminCursoNivel').value;
        const preco = document.getElementById('adminCursoPreco').value;
        
        const aulasNodes = form.querySelectorAll('.admin-curso-aula-item');
        const aulas = [];
        aulasNodes.forEach(node => {
            aulas.push({
                titulo: node.querySelector('.aula-titulo').value,
                videoId: node.querySelector('.aula-vt-id').value
            });
        });

        try {
            cursoSvc.salvar({
                titulo,
                descricao,
                id_categoria: Number(categoriaId),
                nivel,
                preco: Number(preco),
                id_instrutor: 'admin',
                totalAulas: aulas.length,
                totalHoras: 0,
                aulas
            });
            alert('Curso adicionado com sucesso!');
            form.reset();
            document.getElementById('adminCursoTotalAulas').dispatchEvent(new Event('input')); // limpa os dinâmicos
            this.renderCursos();
        } catch(e) {
            alert('Erro: ' + e.message);
        }
    }

    static criarTrilha(form) {
        const nome = document.getElementById('adminTrilhaNome').value;
        const descricao = document.getElementById('adminTrilhaDescricao').value;

        try {
            trilhaSvc.salvar({ nome, descricao });
            alert('Trilha adicionada com sucesso!');
            form.reset();
            this.renderTrilhas();
        } catch(e) {
            alert('Erro: ' + e.message);
        }
    }

    static criarCategoria(form) {
        const nome = document.getElementById('adminCategoriaNome').value;
        const descricao = document.getElementById('adminCategoriaDescricao').value;

        try {
            categoriaSvc.salvar({ nome, descricao });
            alert('Categoria adicionada com sucesso!');
            form.reset();
            this.renderCategorias();
            this.renderCursos(); // To refresh select
        } catch(e) {
            alert('Erro: ' + e.message);
        }
    }
    static openEditarCursoModal(idCurso) {
        const curso = cursoSvc.buscarPorId(idCurso);
        if(!curso) return alert('Curso não encontrado.');

        document.getElementById('editCursoId').value = idCurso;
        document.getElementById('editCursoTitulo').value = curso.Titulo;
        document.getElementById('editCursoDescricao').value = curso.Descricao;
        document.getElementById('editCursoPreco').value = curso.Preco;
        document.getElementById('editCursoNivel').value = curso.Nivel || 'Iniciante';

        const catSelect = document.getElementById('editCursoCategoriaSelect');
        catSelect.innerHTML = '<option value="">Sem Categoria</option>';
        categoriaSvc.listar().forEach(c => {
            catSelect.innerHTML += `<option value="${c.ID_Categoria}" ${curso.ID_Categoria == c.ID_Categoria ? 'selected' : ''}>${c.Nome}</option>`;
        });

        const triSelect = document.getElementById('editCursoTrilhaSelect');
        triSelect.innerHTML = '<option value="">Sem Trilha</option>';
        trilhaSvc.listar().forEach(t => {
            triSelect.innerHTML += `<option value="${t.ID_Trilha}" ${curso.ID_Trilha == t.ID_Trilha ? 'selected' : ''}>${t.Nome}</option>`;
        });

        const modulos = cursoSvc.obterModulos(curso.ID_Curso);
        let aulas = [];
        if (modulos.length > 0) {
            aulas = cursoSvc.obterAulas(modulos[0].ID_Modulo);
        }

        const aulasInput = document.getElementById('editCursoTotalAulas');
        aulasInput.value = aulas.length;
        aulasInput.dispatchEvent(new Event('input')); // dispara recriação das views DOM

        const aulaNodes = document.querySelectorAll('.admin-edit-aula-item');
        aulaNodes.forEach((node, idx) => {
            if (aulas[idx]) {
                node.querySelector('.edit-aula-titulo').value = aulas[idx].Titulo;
                node.querySelector('.edit-aula-vt-id').value = aulas[idx].URL_Conteudo;
            }
        });

        const modal = new bootstrap.Modal(document.getElementById('editarCursoModal'));
        modal.show();
    }

    static saveEditarCursoModal(form) {
        const idCurso = Number(document.getElementById('editCursoId').value);
        const curso = cursoSvc.buscarPorId(idCurso);
        if(curso) {
            curso.Titulo = document.getElementById('editCursoTitulo').value;
            curso.Descricao = document.getElementById('editCursoDescricao').value;
            curso.Preco = Number(document.getElementById('editCursoPreco').value);
            curso.Nivel = document.getElementById('editCursoNivel').value;

            const catId = document.getElementById('editCursoCategoriaSelect').value;
            const triId = document.getElementById('editCursoTrilhaSelect').value;
            curso.ID_Categoria = catId ? Number(catId) : null;
            curso.ID_Trilha = triId ? Number(triId) : null;

            // Extrair as aulas dinâmicas
            const aulasNodes = form.querySelectorAll('.admin-edit-aula-item');
            const aulasNovas = [];
            aulasNodes.forEach(node => {
                aulasNovas.push({
                    titulo: node.querySelector('.edit-aula-titulo').value,
                    videoId: node.querySelector('.edit-aula-vt-id').value
                });
            });

            curso.TotalAulas = aulasNovas.length;

            cursoSvc.atualizar(); // Atualiza os dados base do curso primeiro

            // Temos que atualizar módulo e aulas
            // Para simplificar: deletar tudo atrelado e re-inserir.
            Promise.all([
                import('../service/DatabaseService.mjs'),
                import('../model/Modulo.mjs'),
                import('../model/Aula.mjs')
            ]).then(([{ dbService }, { Modulo }, { Aula }]) => {
                const modulos = dbService.data.modulos.filter(m => m.ID_Curso === curso.ID_Curso);
                modulos.forEach(m => {
                    dbService.data.aulas = dbService.data.aulas.filter(a => a.ID_Modulo !== m.ID_Modulo);
                });
                dbService.data.modulos = dbService.data.modulos.filter(m => m.ID_Curso !== curso.ID_Curso);

                if (aulasNovas.length > 0) {
                    const novoModulo = new Modulo({
                        id: dbService.nextId('modulos'),
                        id_curso: curso.ID_Curso,
                        titulo: "Módulo Único",
                        ordem: 1
                    });
                    dbService.data.modulos.push(novoModulo);

                    aulasNovas.forEach((aulaData, index) => {
                        const novaAula = new Aula({
                            id: dbService.nextId('aulas'),
                            id_modulo: novoModulo.ID_Modulo,
                            titulo: aulaData.titulo,
                            tipoConteudo: "Vídeo",
                            url_conteudo: aulaData.videoId,
                            duracaoMinutos: 15,
                            ordem: index + 1
                        });
                        dbService.data.aulas.push(novaAula);
                    });
                }
                dbService.save();
                this.renderCursos();
                bootstrap.Modal.getInstance(document.getElementById('editarCursoModal')).hide();
                alert('Curso atualizado com sucesso!');
            });
        }
    }

    static openLinkCoursesModal(type, targetId) {
        document.getElementById('linkTargetId').value = targetId;
        document.getElementById('linkTargetType').value = type;

        let targetObj = type === 'categoria' ? categoriaSvc.listar().find(c => c.ID_Categoria == targetId) : trilhaSvc.listar().find(t => t.ID_Trilha == targetId);
        
        document.getElementById('linkCoursesModalDesc').innerText = `Selecione os cursos pertencentes a ${type === 'categoria' ? 'Categoria' : 'Trilha'}: ${targetObj.Nome}`;

        let html = '';
        cursoSvc.listar().forEach(c => {
            const isChecked = (type === 'categoria' && c.ID_Categoria == targetId) || (type === 'trilha' && c.ID_Trilha == targetId);
            html += `
            <div class="form-check mb-2">
                <input class="form-check-input link-course-cb" type="checkbox" value="${c.ID_Curso}" id="linkCourseCb${c.ID_Curso}" ${isChecked ? 'checked' : ''}>
                <label class="form-check-label" for="linkCourseCb${c.ID_Curso}">
                    <strong>${c.ID_Curso}</strong> - ${c.Titulo}
                </label>
            </div>
            `;
        });
        document.getElementById('linkCoursesCheckboxes').innerHTML = html;

        const modal = new bootstrap.Modal(document.getElementById('linkCoursesModal'));
        modal.show();
    }

    static saveLinkCoursesModal(form) {
        const targetId = Number(document.getElementById('linkTargetId').value);
        const type = document.getElementById('linkTargetType').value;

        // Limpa a categoria/trilha de todos os cursos para este target, depois marca os que foram selecionados
        cursoSvc.listar().forEach(c => {
            if (type === 'categoria') {
                if (c.ID_Categoria == targetId) c.ID_Categoria = null;
            } else {
                if (c.ID_Trilha == targetId) c.ID_Trilha = null;
            }
        });

        const checkboxes = document.querySelectorAll('.link-course-cb:checked');
        checkboxes.forEach(cb => {
            const cId = Number(cb.value);
            const curso = cursoSvc.buscarPorId(cId);
            if (curso) {
                if (type === 'categoria') curso.ID_Categoria = targetId;
                else curso.ID_Trilha = targetId;
            }
        });

        cursoSvc.atualizar();
        this.renderCursos(); // Atualiza a tabela de Cursos para refletir
        bootstrap.Modal.getInstance(document.getElementById('linkCoursesModal')).hide();
    }
}
