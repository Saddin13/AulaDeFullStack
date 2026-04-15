import { ProgressoService } from '../service/ProgressoService.mjs';
import { CursoService } from '../service/CursoService.mjs';
import { StudentView } from '../view/StudentView.mjs';
import { MainController } from './MainController.mjs';

const progressoSvc = new ProgressoService();
const cursoSvc = new CursoService();

export class AlunoController {
    static currentUser = null;
    static currentPlayingAula = null;

    static init(user) {
        this.currentUser = user;
        StudentView.renderHeader(user);
        this.studentNavigateTabs('mycourses');
    }

    static studentNavigateTabs(tabName) {
        if (tabName === 'mycourses') this.loadMyCourses();
        if (tabName === 'certificates') this.loadMyCertificates();
    }

    static loadMyCourses() {
        const myEnrollments = progressoSvc.listarMatriculas(this.currentUser.ID_Usuario);
        if (myEnrollments.length === 0) {
            StudentView.renderCourses(`<div class="alert alert-warning">Você não possui matrículas ativas. Conheça nossos cursos na loja!</div>`);
            return;
        }

        let html = `<div class="row g-4">`;
        myEnrollments.forEach(mat => {
            const curso = cursoSvc.buscarPorId(mat.ID_Curso);
            if(!curso) return;

            let totalAulasCurso = 0;
            let concluidas = 0;

            cursoSvc.obterModulos(curso.ID_Curso).forEach(mod => {
                const aulasModulo = cursoSvc.obterAulas(mod.ID_Modulo);
                totalAulasCurso += aulasModulo.length;
                aulasModulo.forEach(aula => {
                    if (progressoSvc.verificarProgressoFezAula(this.currentUser.ID_Usuario, aula.ID_Aula)) {
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
                            <button class="btn btn-sm btn-primary flex-grow-1" onclick="window.AlunoController.playNextAula(${curso.ID_Curso})"><i class="bi bi-play-circle me-1"></i> Assistir Próxima Aula</button>
                            <button class="btn btn-sm ${certClass}" onclick="window.AlunoController.emitirCertificado(${curso.ID_Curso})" ${percent === 100 ? '' : 'disabled'}>
                                <i class="bi bi-award"></i> Certificado
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        });
        html += `</div>`;
        StudentView.renderCourses(html);
    }

    static playNextAula(courseId) {
        let proximaAula = null;
        const modulosC = cursoSvc.obterModulos(courseId);

        for (let mod of modulosC) {
            const aulasM = cursoSvc.obterAulas(mod.ID_Modulo);
            for (let a of aulasM) {
                if (!progressoSvc.verificarProgressoFezAula(this.currentUser.ID_Usuario, a.ID_Aula)) {
                    proximaAula = a;
                    break;
                }
            }
            if(proximaAula) break;
        }

        if (proximaAula) {
            this.currentPlayingAula = proximaAula;
            StudentView.showVideoModal(proximaAula.Titulo);

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

    static onPlayerStateChange(event) {
        if (event.data === YT.PlayerState.ENDED) {
            progressoSvc.concluirAula(this.currentUser.ID_Usuario, this.currentPlayingAula.ID_Aula);
            alert(`✅ Aula "${this.currentPlayingAula.Titulo}" concluída!`);
            this.loadMyCourses(); 
            StudentView.closeVideoModal();
        }
    }

    static emitirCertificado(courseId) {
        const hasCert = progressoSvc.emitirCertificado(this.currentUser.ID_Usuario, courseId);
        alert(`🎓 Certificado de Código: ${hasCert.CodigoVerificacao}`);
        document.querySelector('[data-tab="certificates"]').click();
    }

    static loadMyCertificates() {
        const myCerts = progressoSvc.listarCertificados(this.currentUser.ID_Usuario);
        let html = `<div class="row">`;
        if (myCerts.length === 0) {
             html += `<div class="col-12"><div class="alert alert-secondary">Nenhum certificado emitido ainda.</div></div>`;
        } else {
            myCerts.forEach(cert => {
                const curso = cursoSvc.buscarPorId(cert.ID_Curso);
                html += `
                <div class="col-md-6 mb-4">
                    <div class="card bg-dark text-white p-3 border-0 rounded-4 shadow-lg position-relative overflow-hidden">
                        <div class="position-absolute opacity-10" style="right: -20px; bottom: -20px; font-size: 8rem;"><i class="bi bi-award-fill"></i></div>
                        <h6 class="text-warning text-uppercase mb-1">Certificado de Conclusão</h6>
                        <h4 class="fw-bold border-bottom border-secondary pb-3 mb-3 z-1 position-relative">${curso.Titulo}</h4>
                        <div class="d-flex justify-content-between z-1 position-relative">
                            <small class="text-muted">Data: <span class="text-light">${new Date(cert.DataEmissao).toLocaleDateString()}</span></small>
                            <small class="text-muted">Verificação: <span class="text-light fw-bold">${cert.CodigoVerificacao}</span></small>
                        </div>
                    </div>
                </div>`;
            });
        }
        html += `</div>`;
        StudentView.renderCertificates(html);
    }
}
