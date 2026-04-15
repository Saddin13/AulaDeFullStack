import { dbService } from './DatabaseService.mjs';
import { Matricula } from '../model/Matricula.mjs';
import { ProgressoAula } from '../model/ProgressoAula.mjs';
import { Certificado } from '../model/Certificado.mjs';
import { Pagamento } from '../model/Pagamento.mjs';

export class ProgressoService {
    matricular(idUsuario, idCurso, preco) {
        // Verifica se ja matriculado
        if (dbService.data.matriculas.find(m => m.ID_Usuario === String(idUsuario) && m.ID_Curso === Number(idCurso))) {
            throw new Error("Usuário já está matriculado neste curso!");
        }

        const idMat = dbService.nextId('matriculas');
        dbService.data.matriculas.push(new Matricula({ id: idMat, id_usuario: idUsuario, id_curso: idCurso }));
        
        const idPag = dbService.nextId('pagamentos');
        dbService.data.pagamentos.push(new Pagamento({ id: idPag, id_usuario: idUsuario, id_curso: idCurso, valorPago: preco, metodoPagamento: 'Cartao' }));
        dbService.save();
    }

    listarMatriculas(idUsuario) {
        return dbService.data.matriculas.filter(m => m.ID_Usuario === String(idUsuario));
    }

    concluirAula(idUsuario, idAula) {
        if (!dbService.data.progressos.find(p => p.ID_Usuario === String(idUsuario) && p.ID_Aula === Number(idAula))) {
            dbService.data.progressos.push(new ProgressoAula({ id_usuario: idUsuario, id_aula: idAula }));
            dbService.save();
        }
    }

    verificarProgressoFezAula(idUsuario, idAula) {
        return !!dbService.data.progressos.find(p => p.ID_Usuario === String(idUsuario) && p.ID_Aula === Number(idAula));
    }

    listarCertificados(idUsuario) {
        return dbService.data.certificados.filter(c => c.ID_Usuario === String(idUsuario));
    }

    emitirCertificado(idUsuario, idCurso) {
        let hasCert = this.dbCertificados().find(c => c.ID_Usuario === String(idUsuario) && c.ID_Curso === Number(idCurso));
        if (!hasCert) {
            const idCert = dbService.nextId('certificados');
            hasCert = new Certificado({ id: idCert, id_usuario: idUsuario, id_curso: idCurso });
            dbService.data.certificados.push(hasCert);
            dbService.save();
        }
        return hasCert;
    }

    dbCertificados() {
        return dbService.data.certificados;
    }
}
