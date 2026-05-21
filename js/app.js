import { salvarProgresso, carregarProgresso } from "./armazenamento.js";
import { configurarNavegacao, definirAulaAtiva, renderizarSidebar, alternarSidebarMobile } from "./navegacao.js";
import { atualizarCabecalho, atualizarProgresso, renderizarAula, renderizarMensagemCanvas } from "./renderizador.js";
import { animarFeedbackBotao } from "./animator.js";
import { buscarAulaNoManifesto, carregarJson, clamp, primeiraAula } from "./utils.js";
import { configurarTeclado } from "./teclado.js";

const estado = {
    manifesto: null,
    aulaAtual: null,
    serieAtual: null,
    dadosAulaAtual: null,
    etapaAtual: 1
};

document.addEventListener("DOMContentLoaded", iniciarApp);

async function iniciarApp() {
    configurarControles();
    configurarNavegacao(carregarAulaPorId);
    configurarTeclado({
        voltar: voltarEtapa,
        avancar: avancarEtapa,
        fecharSidebar: () => alternarSidebarMobile(false)
    });

    try {
        estado.manifesto = await carregarJson("dados/manifesto.json", "Nao foi possivel encontrar o manifesto de aulas.");
        renderizarSidebar(estado.manifesto);

        const progresso = carregarProgresso();
        const aulaInicial = progresso.ultimaAula
            ? buscarAulaNoManifesto(estado.manifesto, progresso.ultimaAula)
            : primeiraAula(estado.manifesto);

        if (aulaInicial) {
            await carregarAulaPorId(aulaInicial.aula.id);
        } else {
            renderizarMensagemCanvas("Nenhuma aula cadastrada", "Adicione aulas ao manifesto para iniciar a experiencia.");
        }
    } catch (erro) {
        console.error(erro);
        renderizarMensagemCanvas("Manifesto indisponivel", "Nao conseguimos carregar dados/manifesto.json. Confira se o arquivo existe e se a pagina esta sendo servida por um servidor estatico.");
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function carregarAulaPorId(aulaId) {
    const resultado = buscarAulaNoManifesto(estado.manifesto, aulaId);

    if (!resultado) {
        renderizarMensagemCanvas("Aula nao encontrada", "Esta aula nao existe no manifesto atual.");
        return;
    }

    try {
        const dadosAula = await carregarJson(resultado.aula.arquivo, "Nao foi possivel carregar o arquivo da aula.");

        estado.serieAtual = resultado.serie;
        estado.aulaAtual = resultado.aula;
        estado.dadosAulaAtual = dadosAula;
        estado.etapaAtual = 1;

        atualizarCabecalho(resultado.serie, resultado.aula);
        definirAulaAtiva(resultado.aula.id);
        renderizarAula({
            serie: resultado.serie,
            aula: resultado.aula,
            dadosAula,
            etapaAtual: estado.etapaAtual
        });
        salvarProgresso({ ultimaAula: resultado.aula.id });
    } catch (erro) {
        console.error(erro);
        renderizarMensagemCanvas("Aula indisponivel", `Nao conseguimos carregar ${resultado.aula.arquivo}.`);
    }
}

function configurarControles() {
    document.querySelector("#btn-voltar").addEventListener("click", (evento) => {
        animarFeedbackBotao(evento.currentTarget);
        voltarEtapa();
    });

    document.querySelector("#btn-avancar").addEventListener("click", (evento) => {
        animarFeedbackBotao(evento.currentTarget);
        avancarEtapa();
    });
}

function voltarEtapa() {
    if (!estado.aulaAtual) {
        return;
    }

    const totalEtapas = obterTotalEtapas();
    estado.etapaAtual = clamp(estado.etapaAtual - 1, 1, totalEtapas);
    atualizarProgresso(estado.etapaAtual, totalEtapas);
}

function avancarEtapa() {
    if (!estado.aulaAtual) {
        return;
    }

    const totalEtapas = obterTotalEtapas();
    estado.etapaAtual = clamp(estado.etapaAtual + 1, 1, totalEtapas);
    atualizarProgresso(estado.etapaAtual, totalEtapas);
}

function obterTotalEtapas() {
    return estado.aulaAtual?.total_etapas || estado.dadosAulaAtual?.etapas?.length || 1;
}
