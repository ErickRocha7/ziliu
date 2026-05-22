import { clamp } from "./utils.js";
import { animarEntradaCanvas } from "./animator.js";

export function atualizarCabecalho(serie, aula) {
    document.querySelector(".current-series").textContent = serie?.nome || "Ziliu";
    document.querySelector(".current-lesson").textContent = aula?.titulo || "Selecione uma aula";
}

export function renderizarMensagemCanvas(titulo, mensagem) {
    const stage = document.querySelector("#canvas-stage");
    const area = document.querySelector(".canvas-blank-area");

    if (stage) {
        stage.innerHTML = `
            <div class="lesson-empty-state" style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; text-align: center;">
                <strong style="font-size: 1.5rem; margin-bottom: 1rem;">${titulo}</strong>
                <p style="font-size: 1.2rem; color: #475569;">${mensagem}</p>
            </div>
        `;
    }
    
    if (area) {
        area.classList.add("has-content");
    }
    
    animarEntradaCanvas(stage);
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