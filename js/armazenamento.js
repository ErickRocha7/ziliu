const CHAVE_PROGRESSO = "ziliu_progresso";

const progressoPadrao = {
    ultimaAula: null,
    aulasConcluidas: [],
    ultimoAcesso: null
};

export function carregarProgresso() {
    try {
        const bruto = localStorage.getItem(CHAVE_PROGRESSO);

        if (!bruto) {
            return { ...progressoPadrao };
        }

        return {
            ...progressoPadrao,
            ...JSON.parse(bruto)
        };
    } catch (erro) {
        console.warn("Não foi possível carregar o progresso local.", erro);
        return { ...progressoPadrao };
    }
}

export function salvarProgresso(parcial) {
    const progressoAtual = carregarProgresso();
    const proximoProgresso = {
        ...progressoAtual,
        ...parcial,
        ultimoAcesso: new Date().toISOString()
    };

    localStorage.setItem(CHAVE_PROGRESSO, JSON.stringify(proximoProgresso));
    return proximoProgresso;
}
