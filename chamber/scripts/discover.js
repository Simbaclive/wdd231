
import { discoverItems } from '../data/discover.mjs';

document.addEventListener("DOMContentLoaded", () => {

    const messageDisplay = document.getElementById("visit-message");
    const lastVisitEpoch = localStorage.getItem("lastChamberVisitDate");
    const currentEpoch = Date.now();

    if (!lastVisitEpoch) {
        messageDisplay.textContent = "Welcome! Let us know if you have any questions.";
    } else {
        const timeDifferenceMs = currentEpoch - parseInt(lastVisitEpoch);
        const totalDaysElapsed = Math.floor(timeDifferenceMs / (1000 * 60 * 60 * 24));

        if (timeDifferenceMs < (1000 * 60 * 60 * 24)) {
            messageDisplay.textContent = "Back so soon! Awesome!";
        } else {
            if (totalDaysElapsed === 1) {
                messageDisplay.textContent = "You last visited 1 day ago.";
            } else {
                messageDisplay.textContent = `You last visited ${totalDaysElapsed} days ago.`;
            }
        }
    }
   
    localStorage.setItem("lastChamberVisitDate", currentEpoch.toString());

  
    const gridContainer = document.getElementById("discoverGridContainer");
    if (gridContainer) {
        discoverItems.forEach(item => {
            const card = document.createElement("section");
            card.className = "attraction-card";
            
            card.style.gridArea = item.id;

            card.innerHTML = `
                <h2>${item.title}</h2>
                <figure>
                    <img src="${item.image}" alt="Visual presentation of ${item.title}" loading="lazy" width="300" height="200">
                </figure>
                <address>${item.address}</address>
                <p>${item.description}</p>
                <button type="button" class="learn-btn">Learn More</button>
            `;
            gridContainer.appendChild(card);
        });
    }
});