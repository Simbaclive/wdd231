
const apiKey = '34663f22b35a854685a4efda3c0c32ae'; 
const lat = '-26.1076'; 
const lon = '28.0567';  

const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
const membersUrl = 'data/members.json';


async function fetchWeather() {
    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error('Weather data fetch failed');
        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        document.getElementById('weather-current').innerHTML = `<p>Weather currently unavailable.</p>`;
    }
}

function displayCurrentWeather(data) {
    const container = document.getElementById('weather-current');
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const iconCode = data.weather[0].icon;
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

    container.innerHTML = `
        <div class="weather-info">
            <img src="${iconUrl}" alt="${desc}" loading="lazy">
            <p class="current-temp"><strong>${temp}°C</strong></p>
            <p class="weather-desc">${desc.charAt(0).toUpperCase() + desc.slice(1)}</p>
        </div>
    `;
}

async function fetchForecast() {
    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error('Forecast data fetch failed');
        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

function displayForecast(data) {
    const container = document.getElementById('weather-forecast');
    container.innerHTML = ''; // Clear fallback text

    // Filter the forecast list to grab data points at 12:00 PM for the next 3 days
    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 3);

    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        const temp = Math.round(day.main.temp);
        const desc = day.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-day');
        forecastItem.innerHTML = `
            <span class="day-label"><strong>${dayName}:</strong></span>
            <span class="day-temp">${temp}°C</span>
            <span class="day-desc">(${desc})</span>
        `;
        container.appendChild(forecastItem);
    });
}

async function fetchSpotlights() {
    try {
        const response = await fetch(membersUrl);
        if (!response.ok) throw new Error('Members data fetch failed');
        const members = await response.json();
        
        
        const premiumMembers = members.filter(m => m.membershipLevel === 2 || m.membershipLevel === 3);
        
     
        const shuffled = premiumMembers.sort(() => 0.5 - Math.random());
        
     
        const selectedSpotlights = shuffled.slice(0, 3);
        
        displaySpotlights(selectedSpotlights);
    } catch (error) {
        console.error('Error fetching spotlights:', error);
        document.getElementById('spotlight-container').innerHTML = `<p>Failed to load featured spotlights.</p>`;
    }
}

function displaySpotlights(selectedMembers) {
    const container = document.getElementById('spotlight-container');
    container.innerHTML = '';

    selectedMembers.forEach(member => {
        const levelText = member.membershipLevel === 3 ? 'Gold' : 'Silver';
        
        const card = document.createElement('div');
        card.classList.add('spotlight-card', `level-${levelText.toLowerCase()}`);
        card.innerHTML = `
            <span class="badge">${levelText} Partner</span>
            <img src="images/${member.image}" alt="${member.name} Logo" loading="lazy">
            <h3>${member.name}</h3>
            <p class="tagline">"${member.tagline}"</p>
            <hr>
            <p><strong>Phone:</strong> ${member.phone}</p>
            <p><strong>Address:</strong> ${member.address}</p>
            <a href="${member.website}" target="_blank" rel="noopener noreferrer" class="visit-btn">Visit Website</a>
        `;
        container.appendChild(card);
    });
}


document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    fetchForecast();
    fetchSpotlights();
});
