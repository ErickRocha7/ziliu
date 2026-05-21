const temGsap = () => typeof window.gsap !== "undefined";

export function animarEntradaCanvas(elemento) {
    if (!elemento || !temGsap()) {
        return;
    }

    window.gsap.fromTo(
        elemento,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.32, ease: "power2.out" }
    );
}

export function animarSidebarMobile(sidebar, aberta) {
    if (!sidebar || !temGsap() || window.matchMedia("(min-width: 769px)").matches) {
        return;
    }

    window.gsap.to(sidebar, {
        x: aberta ? 0 : "-104%",
        duration: 0.28,
        ease: "power2.out"
    });
}

export function animarFeedbackBotao(botao) {
    if (!botao || !temGsap()) {
        return;
    }

    window.gsap.fromTo(
        botao,
        { scale: 0.98 },
        { scale: 1, duration: 0.18, ease: "power2.out" }
    );
}
