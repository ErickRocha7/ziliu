export function configurarTeclado({ voltar, avancar, fecharSidebar }) {
    document.addEventListener("keydown", (evento) => {
        const elementoAtivo = document.activeElement;
        const digitando = ["INPUT", "TEXTAREA", "SELECT"].includes(elementoAtivo?.tagName);

        if (digitando) {
            return;
        }

        if (evento.key === "ArrowLeft") {
            voltar();
        }

        if (evento.key === "ArrowRight" || evento.key === " ") {
            evento.preventDefault();
            avancar();
        }

        if (evento.key === "Escape") {
            fecharSidebar();
        }
    });
}
