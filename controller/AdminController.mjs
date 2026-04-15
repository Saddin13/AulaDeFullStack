import { UsuarioService } from '../service/UsuarioService.mjs';
import { CursoService } from '../service/CursoService.mjs';
import { ProgressoService } from '../service/ProgressoService.mjs';
import { AdminView } from '../view/AdminView.mjs';

const usuarioSvc = new UsuarioService();
const cursoSvc = new CursoService();
const progressoSvc = new ProgressoService();

export class AdminController {
    static init() {
        this.renderUsers();
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
}
