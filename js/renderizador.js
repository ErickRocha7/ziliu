import { clamp } from "./utils.js";
import { animarEntradaCanvas } from "./animator.js";

export function atualizarCabecalho(serie, aula) {
    document.querySelector(".current-series").textContent = serie?.nome || "Ziliu";
    document.querySelector(".current-lesson").textContent = aula?.titulo || "Selecione uma aula";
}

export function renderizarMensagemCanvas(titulo, mensagem) {
    const canvas = document.querySelector("#canvas-content");
    const area = document.querySelector(".canvas-blank-area");

    canvas.innerHTML = `
        <section class="lesson-empty-state" aria-live="polite">
            <strong>${titulo}</strong>
            <p>${mensagem}</p>
        </section>
    `;

    area.classList.add("has-content");
    animarEntradaCanvas(canvas);
}

export function renderizarAula({ serie, aula, dadosAula, etapaAtual }) {
    const canvas = document.querySelector("#canvas-content");
    const area = document.querySelector(".canvas-blank-area");
    const totalEtapas = aula.total_etapas || dadosAula.etapas?.length || 1;
    const etapaSegura = clamp(etapaAtual, 1, totalEtapas);

    canvas.innerHTML = `
        <section class="lesson-shell" aria-live="polite">
            <div class="lesson-kicker">${serie.nome}</div>
            <h1 class="lesson-heading">${aula.titulo}</h1>
            <p class="lesson-summary">
                A estrutura da aula foi carregada. O canvas esta pronto para receber storytelling visual,
                KaTeX, SVGs, etapas animadas e interacoes pedagogicas nas proximas fases.
            </p>
        </section>
    `;

    area.classList.add("has-content");
    atualizarProgresso(etapaSegura, totalEtapas);
    animarEntradaCanvas(canvas);
}

export function atualizarProgresso(etapaAtual, totalEtapas) {
    const etapaSegura = clamp(etapaAtual, 1, totalEtapas || 1);
    const totalSeguro = Math.max(totalEtapas || 1, 1);
    const porcentagem = (etapaSegura / totalSeguro) * 100;

    document.querySelector("#progress-text").textContent = `Etapa ${etapaSegura} de ${totalSeguro}`;
    document.querySelector(".progress-fill").style.width = `${porcentagem}%`;
    document.querySelector("#btn-voltar").disabled = etapaSegura <= 1;
    document.querySelector("#btn-avancar").textContent = etapaSegura >= totalSeguro ? "Proxima Aula ->" : "Avancar";
}
