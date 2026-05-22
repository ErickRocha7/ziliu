// Mapeamento de tipos de etapa para funções de renderização
// Cada função recebe (container, config, contexto) e retorna uma função de limpeza (opcional)
const renderizadores = {};

// Renderizador padrão: texto simples (fallback)
renderizadores.texto = (container, config) => {
    container.innerHTML = `<div style="padding: 2rem; font-size: 1.2rem;">${config.conteudo || "Conteúdo em desenvolvimento"}</div>`;
    return () => {}; // sem limpeza especial
};

// Renderizador para KaTeX (fórmulas)
renderizadores.katex = async (container, config) => {
    if (!window.katex) {
        await import("https://cdn.jsdelivr.net/npm/katex@0.16.10/dist/katex.min.js");
    }
    const html = window.katex.renderToString(config.formula, {
        throwOnError: false,
        displayMode: config.displayMode !== false
    });
    container.innerHTML = `<div class="katex-wrapper" style="padding: 2rem; text-align: center;">${html}</div>`;
    return () => {};
};

// Renderizador para SVG geométrico (exemplo inicial)
renderizadores.geometria = async (container, config) => {
    // Aqui você chamará o módulo js/renderizadores/geometriaSVG.js
    // Implementação simplificada para demonstração:
    container.innerHTML = `
        <svg viewBox="0 0 800 450" style="width:100%; height:100%; background:#f9f9f9;">
            <text x="400" y="225" text-anchor="middle" fill="#333">Geometria SVG em breve</text>
        </svg>
    `;
    return () => {};
};

// Renderizador para Three.js (Material Dourado)
renderizadores.material3d = async (container, config) => {
    container.innerHTML = `<div style="display:flex; align-items:center; justify-content:center; height:100%; background:#eef2ff;">🔲 Renderizador 3D (Three.js) será carregado aqui</div>`;
    return () => {};
};

// Despachante principal
export async function renderizarEtapa(etapa, contexto = {}) {
    const container = document.querySelector("#canvas-stage");
    if (!container) return;

    // Se existir uma função de limpeza armazenada no contexto, chame-a
    if (contexto.limparEtapaAnterior && typeof contexto.limparEtapaAnterior === "function") {
        contexto.limparEtapaAnterior();
    }

    container.innerHTML = ""; // limpa o palco

    const tipo = etapa?.tipo || "texto";
    const config = etapa?.config || { conteudo: "Nenhuma configuração fornecida para esta etapa." };

    const renderizador = renderizadores[tipo];
    if (!renderizador) {
        console.warn(`Tipo de etapa desconhecido: ${tipo}`);
        container.innerHTML = `<div style="padding:2rem; color:red;">Renderizador não encontrado para tipo: ${tipo}</div>`;
        return () => {};
    }

    const limpeza = await renderizador(container, config);
    contexto.limparEtapaAnterior = limpeza || (() => {});
    return contexto.limparEtapaAnterior;
}

// Registro dinâmico de novos renderizadores (para extensibilidade)
export function registrarRenderizador(tipo, funcao) {
    renderizadores[tipo] = funcao;
}