import { salvarProgresso, carregarProgresso } from "./armazenamento.js";
import { configurarNavegacao, definirAulaAtiva, renderizarSidebar, alternarSidebarMobile } from "./navegacao.js";
import { atualizarCabecalho, atualizarProgresso, renderizarMensagemCanvas } from "./renderizador.js";
import { animarFeedbackBotao } from "./animator.js";
import { buscarAulaNoManifesto, carregarJson, clamp, primeiraAula } from "./utils.js";
import { configurarTeclado } from "./teclado.js";
import { renderizarEtapa } from "./etapaDispatcher.js";

const estado = {
    manifesto: null,
    aulaAtual: null,
    serieAtual: null,
    dadosAulaAtual: null,
    etapaAtual: 1,
    limparEtapa: null
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
        estado.manifesto = await carregarJson("dados/manifesto.json", "Não foi possível encontrar o manifesto de aulas.");
        renderizarSidebar(estado.manifesto);

        const progresso = carregarProgresso();
        const aulaInicial = progresso.ultimaAula
            ? buscarAulaNoManifesto(estado.manifesto, progresso.ultimaAula)
            : primeiraAula(estado.manifesto);

        if (aulaInicial) {
            await carregarAulaPorId(aulaInicial.aula.id);
        } else {
            renderizarMensagemCanvas("Nenhuma aula cadastrada", "Adicione aulas ao manifesto para iniciar a experiência.");
        }
    } catch (erro) {
        console.error(erro);
        renderizarMensagemCanvas("Manifesto indisponível", "Não conseguimos carregar dados/manifesto.json. Confira se o arquivo existe e se a página está sendo servida por um servidor estático.");
    }

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

async function carregarAulaPorId(aulaId) {
    const resultado = buscarAulaNoManifesto(estado.manifesto, aulaId);
    if (!resultado) {
        renderizarMensagemCanvas("Aula não encontrada", "Esta aula não existe no manifesto atual.");
        return;
    }

    try {
        const dadosAula = await carregarJson(resultado.aula.arquivo, "Não foi possível carregar o arquivo da aula.");

        if (estado.limparEtapa) estado.limparEtapa();
        
        estado.serieAtual = resultado.serie;
        estado.aulaAtual = resultado.aula;
        estado.dadosAulaAtual = dadosAula;
        estado.etapaAtual = 1;
        estado.limparEtapa = null;

        atualizarCabecalho(resultado.serie, resultado.aula);
        definirAulaAtiva(resultado.aula.id);
        
        // === CORREÇÃO: adiciona a classe para esconder o placeholder ===
        const areaBranca = document.querySelector(".canvas-blank-area");
        if (areaBranca) areaBranca.classList.add("has-content");
        
        await renderizarEtapaAtual();
        
        const total = obterTotalEtapas();
        atualizarProgresso(estado.etapaAtual, total);
        
        salvarProgresso({ ultimaAula: resultado.aula.id });
    } catch (erro) {
        console.error(erro);
        renderizarMensagemCanvas("Aula indisponível", `Não conseguimos carregar ${resultado.aula.arquivo}.`);
    }
}

async function renderizarEtapaAtual() {
    if (!estado.dadosAulaAtual) return;
    
    const etapas = estado.dadosAulaAtual.etapas || [];
    const indice = estado.etapaAtual - 1;
    const etapa = etapas[indice];
    
    if (!etapa) {
        document.querySelector("#canvas-stage").innerHTML = `<div style="padding:2rem;">Etapa sem conteúdo definido.</div>`;
        return;
    }
    
    // Garantia extra: a classe já foi adicionada em carregarAulaPorId, mas reforça
    const areaBranca = document.querySelector(".canvas-blank-area");
    if (areaBranca) areaBranca.classList.add("has-content");
    
    const limpeza = await renderizarEtapa(etapa, { limparEtapaAnterior: estado.limparEtapa });
    estado.limparEtapa = limpeza;
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
    if (!estado.aulaAtual) return;
    const total = obterTotalEtapas();
    if (estado.etapaAtual <= 1) return;
    
    estado.etapaAtual = clamp(estado.etapaAtual - 1, 1, total);
    atualizarProgresso(estado.etapaAtual, total);
    renderizarEtapaAtual();
}

function avancarEtapa() {
    if (!estado.aulaAtual) return;
    const total = obterTotalEtapas();
    if (estado.etapaAtual >= total) {
        return;
    }
    
    estado.etapaAtual = clamp(estado.etapaAtual + 1, 1, total);
    atualizarProgresso(estado.etapaAtual, total);
    renderizarEtapaAtual();
}

function obterTotalEtapas() {
    return estado.aulaAtual?.total_etapas || estado.dadosAulaAtual?.etapas?.length || 1;
}