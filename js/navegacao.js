import { animarSidebarMobile } from "./animator.js";

let onSelecionarAula = null;
let aulaAtivaId = null;

export function configurarNavegacao(callback) {
    onSelecionarAula = callback;

    const sidebarScroll = document.querySelector(".sidebar-scroll");
    const app = document.querySelector(".ziliu-app");
    const menuToggle = document.querySelector(".menu-toggle");
    const overlay = document.querySelector(".sidebar-overlay");

    sidebarScroll.addEventListener("click", lidarComCliqueSidebar);
    sidebarScroll.addEventListener("keydown", lidarComTecladoSidebar);
    menuToggle.addEventListener("click", () => alternarSidebarMobile(!app.classList.contains("sidebar-open")));
    overlay.addEventListener("click", () => alternarSidebarMobile(false));
}

export function renderizarSidebar(manifesto) {
    const sidebarScroll = document.querySelector(".sidebar-scroll");

    sidebarScroll.innerHTML = (manifesto.series || []).map((serie) => `
        <section class="series-group" data-series-id="${serie.id}">
            <button class="series-button" type="button" aria-expanded="false">
                <span class="series-title">
                    <i data-lucide="folder"></i>
                    <span>${serie.nome}</span>
                </span>
                <i class="series-chevron" data-lucide="chevron-right"></i>
            </button>

            <div class="lesson-list">
                ${(serie.aulas || []).map((aula) => `
                    <div
                        class="lesson-link"
                        data-lesson-id="${aula.id}"
                        role="button"
                        tabindex="0"
                    >
                        <span class="lesson-status" aria-hidden="true">
                            <i data-lucide="circle"></i>
                        </span>
                        <span class="lesson-title">${aula.titulo}</span>
                    </div>
                `).join("")}
            </div>
        </section>
    `).join("");

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

export function definirAulaAtiva(aulaId) {
    aulaAtivaId = aulaId;

    document.querySelectorAll(".lesson-link").forEach((item) => {
        const ativa = item.dataset.lessonId === aulaAtivaId;
        item.classList.toggle("is-active", ativa);
        item.setAttribute("aria-current", ativa ? "page" : "false");

        if (ativa) {
            abrirSerie(item.closest(".series-group"));
        }
    });
}

export function alternarSidebarMobile(aberta) {
    const app = document.querySelector(".ziliu-app");
    const sidebar = document.querySelector(".sidebar");
    const menuToggle = document.querySelector(".menu-toggle");

    app.classList.toggle("sidebar-open", aberta);
    menuToggle.setAttribute("aria-expanded", String(aberta));
    animarSidebarMobile(sidebar, aberta);
}

function lidarComCliqueSidebar(evento) {
    const botaoSerie = evento.target.closest(".series-button");
    const linkAula = evento.target.closest(".lesson-link");

    if (botaoSerie) {
        const grupo = botaoSerie.closest(".series-group");
        grupo.classList.contains("is-open") ? fecharSerie(grupo) : abrirSerie(grupo);
    }

    if (linkAula && onSelecionarAula) {
        onSelecionarAula(linkAula.dataset.lessonId);
        alternarSidebarMobile(false);
    }
}

function lidarComTecladoSidebar(evento) {
    const linkAula = evento.target.closest(".lesson-link");

    if (!linkAula || !["Enter", " "].includes(evento.key)) {
        return;
    }

    evento.preventDefault();
    linkAula.click();
}

function abrirSerie(grupoAlvo) {
    document.querySelectorAll(".series-group").forEach((grupo) => {
        if (grupo === grupoAlvo) {
            grupo.classList.add("is-open");
            grupo.querySelector(".series-button").setAttribute("aria-expanded", "true");
        } else {
            fecharSerie(grupo);
        }
    });
}

function fecharSerie(grupo) {
    grupo.classList.remove("is-open");
    grupo.querySelector(".series-button").setAttribute("aria-expanded", "false");
}
