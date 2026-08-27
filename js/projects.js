/* =========================================================
   GIFTED HANDS
   PROJECTS - SUPABASE CONNECTION
   ========================================================= */


/* =========================================================
   SUPABASE CONFIG
   ========================================================= */

const SUPABASE_URL = "https://metcnsyebuisikxmzdxb.supabase.co";
const SUPABASE_KEY = "sb_publishable_6IiRCfiaxHnkMN4geuKPGQ_gTR8gEvT";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);


/* =========================================================
   ELEMENTS
   ========================================================= */

const projectsContainer =
    document.getElementById("projects-container");

const noProjects =
    document.getElementById("no-projects");

const filterButtons =
    document.querySelectorAll(".filter-btn");

const modal =
    document.getElementById("project-modal");

const modalClose =
    document.getElementById("modal-close");

const modalOverlay =
    document.querySelector(".modal-overlay");

const modalImage =
    document.getElementById("modal-project-image");

const modalTitle =
    document.getElementById("modal-project-title");

const modalCategory =
    document.getElementById("modal-project-category");

const modalLocation =
    document.getElementById("modal-project-location");

const modalDescription =
    document.getElementById("modal-project-description");

const modalWhatsapp =
    document.getElementById("modal-whatsapp");


/* =========================================================
   PROJECT DATA
   ========================================================= */

let allProjects = [];


/* =========================================================
   LOAD PROJECTS
   ========================================================= */

async function loadProjects() {

    showLoading();

    try {

        const { data, error } = await supabaseClient
            .from("projects")
            .select(`
                id,
                title,
                slug,
                description,
                location,
                category,
                cover_image,
                featured,
                published,
                project_date,
                project_images (
                    id,
                    image_url,
                    image_type,
                    sort_order
                )
            `)
            .eq("published", true)
            .order("featured", {
                ascending: false
            })
            .order("created_at", {
                ascending: false
            });


        if (error) {
            throw error;
        }


        allProjects = data || [];


        if (allProjects.length === 0) {

            showNoProjects();

            return;
        }


        renderProjects(allProjects);

    } catch (error) {

        console.error(
            "Error loading projects:",
            error
        );

        showError();
    }
}


/* =========================================================
   RENDER PROJECTS
   ========================================================= */

function renderProjects(projects) {

    projectsContainer.innerHTML = "";

    noProjects.style.display = "none";


    if (!projects || projects.length === 0) {

        showNoProjects();

        return;
    }


    projects.forEach(project => {

        const card =
            createProjectCard(project);

        projectsContainer.appendChild(card);

    });
}


/* =========================================================
   CREATE PROJECT CARD
   ========================================================= */

function createProjectCard(project) {

    const article =
        document.createElement("article");

    article.className = "project-item";


    /* -----------------------------------------
       IMAGE
       ----------------------------------------- */

    const imageWrapper =
        document.createElement("div");

    imageWrapper.className =
        "project-item-image";


    let imageUrl =
        project.cover_image;


    /*
       If no cover image exists,
       use the first project gallery image.
    */

    if (
        !imageUrl &&
        project.project_images &&
        project.project_images.length > 0
    ) {

        const sortedImages =
            [...project.project_images]
                .sort(
                    (a, b) =>
                        a.sort_order - b.sort_order
                );


        imageUrl =
            sortedImages[0].image_url;
    }


    const image =
        document.createElement("img");

    image.src =
        imageUrl || "images/placeholder.jpg";

    image.alt =
        project.title || "Gifted Hands Project";

    image.loading = "lazy";


    imageWrapper.appendChild(image);


    /* -----------------------------------------
       FEATURED BADGE
       ----------------------------------------- */

    if (project.featured) {

        const badge =
            document.createElement("span");

        badge.className =
            "featured-badge";

        badge.textContent =
            "FEATURED";

        imageWrapper.appendChild(badge);
    }


    /* -----------------------------------------
       VIEW BUTTON
       ----------------------------------------- */

    const viewButton =
        document.createElement("button");

    viewButton.className =
        "project-view";

    viewButton.setAttribute(
        "aria-label",
        "View project"
    );

    viewButton.innerHTML =
        '<i class="fa-solid fa-arrow-up-right-from-square"></i>';


    viewButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openProject(project);

        }
    );


    imageWrapper.appendChild(viewButton);


    /* -----------------------------------------
       PROJECT INFORMATION
       ----------------------------------------- */

    const information =
        document.createElement("div");

    information.className =
        "project-item-info";


    const category =
        document.createElement("span");

    category.className =
        "project-item-category";

    category.textContent =
        project.category || "Furniture";


    const title =
        document.createElement("h3");

    title.textContent =
        project.title;


    const location =
        document.createElement("div");

    location.className =
        "project-item-location";


    location.innerHTML = `
        <i class="fa-solid fa-location-dot"></i>
        <span>${escapeHTML(
            project.location || "Nigeria"
        )}</span>
    `;


    information.appendChild(category);
    information.appendChild(title);
    information.appendChild(location);


    article.appendChild(imageWrapper);
    article.appendChild(information);


    /* -----------------------------------------
       OPEN PROJECT
       ----------------------------------------- */

    article.addEventListener(
        "click",
        () => openProject(project)
    );


    return article;
}


/* =========================================================
   PROJECT MODAL
   ========================================================= */

function openProject(project) {

    modalCategory.textContent =
        project.category || "Furniture";


    modalTitle.textContent =
        project.title || "";


    modalLocation.textContent =
        project.location || "Nigeria";


    modalDescription.textContent =
        project.description ||
        "A beautiful project created by Gifted Hands Furniture & Interior Design.";


    let imageUrl =
        project.cover_image;


    if (
        !imageUrl &&
        project.project_images &&
        project.project_images.length > 0
    ) {

        const sortedImages =
            [...project.project_images]
                .sort(
                    (a, b) =>
                        a.sort_order - b.sort_order
                );


        imageUrl =
            sortedImages[0].image_url;
    }


    modalImage.src =
        imageUrl || "images/placeholder.jpg";


    modalImage.alt =
        project.title || "Project";


    /* -----------------------------------------
       WHATSAPP
       ----------------------------------------- */

    const message =
        `Hello Gifted Hands, I am interested in a design similar to "${project.title}".`;


    /*
       Replace 234XXXXXXXXXX with the
       actual Gifted Hands WhatsApp number.
    */

    const whatsappNumber =
        "2347060729582";


    modalWhatsapp.href =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;


    modal.classList.add("active");

    document.body.style.overflow =
        "hidden";
}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    modal.classList.remove("active");

    document.body.style.overflow =
        "";
}


if (modalClose) {

    modalClose.addEventListener(
        "click",
        closeModal
    );
}


if (modalOverlay) {

    modalOverlay.addEventListener(
        "click",
        closeModal
    );
}


/* ESC KEY */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("active")
        ) {

            closeModal();
        }

    }
);


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            const category =
                button.dataset.category;


            if (category === "all") {

                renderProjects(
                    allProjects
                );

                return;
            }


            const filteredProjects =
                allProjects.filter(
                    project =>
                        project.category
                            ?.toLowerCase() ===
                        category.toLowerCase()
                );


            renderProjects(
                filteredProjects
            );

        }
    );

});


/* =========================================================
   LOADING
   ========================================================= */

function showLoading() {

    projectsContainer.innerHTML = `
        <div class="projects-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading our projects...
            </p>

        </div>
    `;

    noProjects.style.display =
        "none";
}


/* =========================================================
   NO PROJECTS
   ========================================================= */

function showNoProjects() {

    projectsContainer.innerHTML = "";

    noProjects.style.display =
        "block";
}


/* =========================================================
   ERROR
   ========================================================= */

function showError() {

    projectsContainer.innerHTML = `
        <div class="projects-loading">

            <i
                class="fa-solid fa-triangle-exclamation"
                style="font-size:30px;color:var(--gold);"
            ></i>

            <p>
                Unable to load projects.
                Please try again later.
            </p>

        </div>
    `;
}


/* =========================================================
   BASIC HTML ESCAPING
   ========================================================= */

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;
}


/* =========================================================
   START
   ========================================================= */

loadProjects();
