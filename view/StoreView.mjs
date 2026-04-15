export class StoreView {
    static render(cursos) {
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
                    <button class="btn btn-outline-primary btn-lg rounded-pill store-buy-btn" onclick="window.LojaController.prepararCheckout(${curso.ID_Curso})">Comprar Curso</button>
                </div>
            </div>`;
        });
        document.getElementById('store-container').innerHTML = html;
    }
}
