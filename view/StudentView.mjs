export class StudentView {
    static renderHeader(user) {
        document.getElementById('student-header').innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h3 class="fw-bold m-0"><i class="bi bi-person-circle me-2"></i> ${user.NomeCompleto}</h3>
                    <p class="m-0 mt-1 opacity-75">Matrícula: <strong>${user.ID_Usuario}</strong> | ${user.Email}</p>
                </div>
            </div>
        `;
    }

    static renderCourses(html) {
        document.getElementById('student-content-area').innerHTML = html;
    }

    static renderCertificates(html) {
        document.getElementById('student-content-area').innerHTML = html;
    }

    static showVideoModal(aulaSub, courseIdTitle) {
        document.getElementById('videoModalLabel').innerText = `Assistindo: ${aulaSub}`;
        const modalEl = document.getElementById('videoModal');
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }

    static closeVideoModal() {
        const modalEl = document.getElementById('videoModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) {
            modal.hide();
        }
    }
}
