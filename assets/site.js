// One Tap website: small progressive enhancements. Every page works without this file.

(() => {
    const year = document.querySelector("[data-year]");
    if (year) year.textContent = new Date().getFullYear();

    // Back to top button on long pages.
    const top = document.querySelector(".back-to-top");
    if (top) {
        const update = () => top.classList.toggle("visible", window.scrollY > 600);
        window.addEventListener("scroll", update, { passive: true });
        update();
    }

    // Highlight the section being read in the table of contents.
    const links = [...document.querySelectorAll(".toc a[href^='#']")];
    if (!links.length || !("IntersectionObserver" in window)) return;
    const byId = new Map(links.map(link => [link.getAttribute("href").slice(1), link]));
    const visible = new Set();
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => entry.isIntersecting ? visible.add(entry.target.id) : visible.delete(entry.target.id));
        const current = [...byId.keys()].find(id => visible.has(id));
        if (!current) return;
        links.forEach(link => link.classList.toggle("active", link === byId.get(current)));
    }, { rootMargin: "-80px 0px -60% 0px" });
    byId.forEach((_, id) => {
        const section = document.getElementById(id);
        if (section) observer.observe(section);
    });

    // On small screens the contents start collapsed so the text comes first.
    const small = window.matchMedia("(max-width: 900px)").matches;
    const tocDetails = document.querySelector(".toc details");
    if (tocDetails && small) tocDetails.open = false;

    // On small screens, close the contents menu after picking a section.
    links.forEach(link => link.addEventListener("click", () => {
        const details = link.closest("details");
        if (details && window.matchMedia("(max-width: 900px)").matches) details.open = false;
    }));
})();
