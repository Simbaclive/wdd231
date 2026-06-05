document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;


const menuButton = document.getElementById("menu");
const navMenu = document.getElementById("animatenav");

menuButton.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuButton.classList.toggle("open");
});

const jsonUrl = "data/members.json";
const container = document.getElementById("member-container");

async function fetchMembers() {
    try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error("Data fetch failed");
        const data = await response.json();
        displayMembers(data);
    } catch (error) {
        console.error("Error fetching data:", error);
        container.innerHTML = `<p>Unable to load chamber directory listings at this time.</p>`;
    }
}

function displayMembers(members) {
    container.innerHTML = ""; 
    
    members.forEach(member => {
        const card = document.createElement("section");
        card.className = "member-card";
        
       
        const levelNames = { 1: "Member", 2: "Silver", 3: "Gold" };
        
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy">
            <h3>${member.name}</h3>
            <p class="tagline"><em>${member.tagline}</em></p>
            <p><strong>Address:</strong> ${member.address}</p>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Level:</strong> ${levelNames[member.membershipLevel]}</p>
            <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
        `;
        container.appendChild(card);
    });
}


const gridBtn = document.getElementById("gridBtn");
const listBtn = document.getElementById("listBtn");

gridBtn.addEventListener("click", () => {
    container.className = "grid-mode";
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
});

listBtn.addEventListener("click", () => {
    container.className = "list-mode";
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
});

fetchMembers();