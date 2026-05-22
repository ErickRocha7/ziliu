import { clamp } from "./utils.js";
import { animarEntradaCanvas } from "./animator.js";

export function atualizarCabecalho(serie, aula) {
    document.querySelector(".current-series").textContent = serie?.nome || "Ziliu";
    document.querySelector(".current-lesson").textContent = aula?.titulo || "Selecione uma aula";
}

export function renderizarCabecalhoAula(serie, aula) {
    const kickerEl = document.querySelector(".lesson-kicker");
    const headingEl = document.querySelector(".lesson-heading");
    const summaryEl = document.querySelector(".lesson-summary");

    if (kickerEl) kickerEl.textContent = serie?.nome || "";
    if (headingEl) headingEl.textContent = aula?.titulo || "";
    if (summaryEl) summaryEl.innerHTML = aula?.descricao || "Experiência visual interativa. Avance pelas etapas.";

    const area = document.querySelector(".canvas-blank-area");
    area.classList.add("has-content");
    animarEntradaCanvas(document.querySelector("#canvas-stage") || area);
}

export function renderizarMensagemCanvas(titulo, mensagem) {
    const header = document.querySelector(".lesson-header");
    const stage = document.querySelector("#canvas-stage");
    const area = document.querySelector(".canvas-blank-area");

    if (header) {
        header.innerHTML = `
            <div class="lesson-empty-state">
                <strong>${titulo}</strong>
                <p>${mensagem}</p>
            </div>
        `;
    }
    if (stage) stage.innerHTML = "";
    area.classList.add("has-content");
}

export function atualizarProgresso(etapaAtual, totalEtapas) {
    const etapaSegura = clamp(etapaAtual, 1, totalEtapas || 1);
    const totalSeguro = Math.max(totalEtapas || 1, 1);
    const porcentagem = (etapaSegura / totalSeguro) * 100;

    const progressText = document.querySelector("#progress-text");
    const progressFill = document.querySelector(".progress-fill");
    const btnVoltar = document.querySelector("#btn-voltar");
    const btnAvancar = document.querySelector("#btn-avancar");

    if (progressText) progressText.textContent = `Etapa ${etapaSegura} de ${totalSeguro}`;
    if (progressFill) progressFill.style.width = `${porcentagem}%`;
    if (btnVoltar) btnVoltar.disabled = etapaSegura <= 1;
    if (btnAvancar) btnAvancar.textContent = etapaSegura >= totalSeguro ? "Próxima Aula →" : "Avançar";
}

// Função legada (compatibilidade) - remove conteúdo antigo
export function renderizarAula({ serie, aula, dadosAula, etapaAtual }) {
    renderizarCabecalhoAula(serie, aula);
    atualizarProgresso(etapaAtual, aula.total_etapas || dadosAula?.etapas?.length || 1);
}