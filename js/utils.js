export function buscarAulaNoManifesto(manifesto, aulaId) {
    for (const serie of manifesto.series || []) {
        const aula = (serie.aulas || []).find((item) => item.id === aulaId);

        if (aula) {
            return { serie, aula };
        }
    }

    return null;
}

export function primeiraAula(manifesto) {
    const primeiraSerie = manifesto.series?.find((serie) => serie.aulas?.length);

    if (!primeiraSerie) {
        return null;
    }

    return {
        serie: primeiraSerie,
        aula: primeiraSerie.aulas[0]
    };
}

export async function carregarJson(caminho, mensagemErro) {
    const resposta = await fetch(caminho);

    if (!resposta.ok) {
        throw new Error(mensagemErro || `Não foi possível carregar ${caminho}.`);
    }

    return resposta.json();
}

export function clamp(valor, minimo, maximo) {
    return Math.min(Math.max(valor, minimo), maximo);
}

export function escapeHtml(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}
