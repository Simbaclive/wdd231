import { savePreference, getPreference } from './storage-module.js';

document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("menu-toggle");
    const navUl = document.querySelector("nav ul");
    if (toggleBtn) toggleBtn.addEventListener("click", () => navUl.classList.toggle("open"));

    fetchAndDisplayInventory();
});

async function fetchAndDisplayInventory() {
    const dataUrl = 'data/inventory.json'; 
    const container = document.getElementById("menu-grid");

    try {
        const response = await fetch(dataUrl);
        if (!response.ok) throw new Error("Inventory target response error status code failed.");
        
        const itemsList = await response.json();
        
        renderGrid(itemsList, container);
        setupFilterMechanics(itemsList, container);
        
    } catch (error) {
        console.error("Runtime execution data pipeline failed:", error);
        if (container) {
            container.innerHTML = `<p style="color:red; font-weight:bold;">Unable to fetch menu data at this time. Please try again later.</p>`;
        }
    }
}

function renderGrid(items, elementPointer) {
    if (!elementPointer) return;
    elementPointer.innerHTML = "";
    
    if (items.length === 0) {
        elementPointer.innerHTML = `<p style="grid-column: 1/-1; text-align: center; font-style: italic; color: #718096; margin-top: 2rem;">No items match the selected criteria.</p>`;
        return;
    }
    
    items.forEach(item => {
        const cardHTML = `
            <div class="item-card">
                <div>
                    <img src="${item.image}" 
                         alt="${item.name}" 
                         loading="lazy" 
                         class="menu-img" 
                         style="width:100%; height:220px; object-fit:cover; border-radius:4px;"
                         onerror="this.onerror=null; this.src='images/menu.jpeg';">
                    <h3 style="margin: 0.5rem 0; color: var(--primary-espresso);">${item.name}</h3>
                    <p><strong>Category:</strong> ${item.category}</p>
                    <p><strong>Dietary Status:</strong> ${item.dietary.join(', ') || 'Standard'}</p>
                    <p style="color: var(--accent-honey); font-weight: 700;"><strong>Price:</strong> $${item.price.toFixed(2)}</p>
                </div>
                <button class="view-detail-btn" data-id="${item.id}" style="margin-top:1rem; padding:0.5rem 1rem; border:none; background:var(--primary-espresso); color:var(--white); cursor:pointer; border-radius:4px; font-weight:700; width:100%;">Details</button>
            </div>
        `;
        elementPointer.insertAdjacentHTML("beforeend", cardHTML);
    });

    setupModalInteractions(items);
}

function setupFilterMechanics(fullList, displayTarget) {
    const allBtn = document.getElementById("filter-all");
    const gfBtn = document.getElementById("filter-gf");
    const veganBtn = document.getElementById("filter-vegan");

    if (allBtn) {
        allBtn.addEventListener("click", () => renderGrid(fullList, displayTarget));
    }
    
    if (gfBtn) {
        gfBtn.addEventListener("click", () => {
            const filtered = fullList.filter(item => 
                item.dietary && item.dietary.some(status => status.toLowerCase() === "gluten-free")
            );
            renderGrid(filtered, displayTarget);
        });
    }

    if (veganBtn) {
        veganBtn.addEventListener("click", () => {
            const filtered = fullList.filter(item => 
                item.dietary && item.dietary.some(status => status.toLowerCase() === "vegan")
            );
            renderGrid(filtered, displayTarget);
        });
    }
}

function setupModalInteractions(itemsArray) {
    const modalElement = document.getElementById("detail-modal");
    const mTitle = document.getElementById("modal-title");
    const mDesc = document.getElementById("modal-description");
    const closeBtn = document.getElementById("close-modal");

    document.querySelectorAll(".view-detail-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const selectedId = e.target.getAttribute("data-id");
            const matchItem = itemsArray.find(i => i.id === selectedId);

            if (matchItem) {
                mTitle.textContent = matchItem.name;
                mDesc.textContent = `${matchItem.description} | Allergens flagged: ${matchItem.allergens.join(', ') || 'None'}.`;
                modalElement.style.display = "flex";
                modalElement.setAttribute("aria-hidden", "false");
                
                savePreference("lastViewedItem", matchItem.name);
            }
        });
    });

    if (closeBtn && modalElement) {
        closeBtn.addEventListener("click", () => {
            modalElement.style.display = "none";
            modalElement.setAttribute("aria-hidden", "true");
        });
    }
}