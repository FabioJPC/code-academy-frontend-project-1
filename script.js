const cardContainer = document.getElementById("card-container");
const genreFilter = document.getElementById("genre-filter-list");

let availableGenres = new Set();
let currentFilter = "Todos";

let gameList = [];

async function loadData() {
    try{
        const response = await fetch("mockData.json");

        gameList = await response.json();

        initializeMetaData();
        renderFilterButtons();
        renderGames(gameList);
    }
    catch(error) {
        console.error("Erro ao carregar os dados dos jogos:", error);
        cardContainer.innerHTML = `<p>Ops, ocorreu um erro ao carregar o catálogo...</p>`;
    }
}

function createGameCard(game) {
    return /*html*/`
        <article class="game-card">
            <div class="game-cover-wrapper">
                <img src="images/covers/${game.filename}.jpg" alt="Capa do jogo" class="game-cover">
            </div>
            <h3>${game.name}</h3>
            <p class="genre">${game.genre}</p>
            <span class="price">${game.price}</span>
            <button class="primary-button">Ver</button>
        </article>
    `;
}

function renderGames(games) {
    if(games.length === 0) {
        cardContainer.innerHTML = `<p>Nenhum jogo encontrado...</p>`;
        return;
    }

    cardContainer.innerHTML = games
    .map((game)=>createGameCard(game))
    .join("");
}

function initializeMetaData() {
    gameList.forEach((game) => {
        availableGenres.add(game.genre);
    })
}

function renderFilterButtons() {
    const genres = ["Todos", ...availableGenres];

    genreFilter.innerHTML = genres.map((genre) => {
        const isActive = genre === currentFilter ? "active" : "";

        return /*html*/`
            <li>
                <button class="filter-button ${isActive}" onclick="filterGames('${genre}')">
                    ${genre}
                </button>
            </li>
        `;
    }).join("");
}

function filterGames(selectedGenre) {
    currentFilter = selectedGenre;

    renderFilterButtons();

    if(selectedGenre === "Todos") {
        renderGames(gameList);
    }
    else {
        filteredList = gameList.filter(game => game.genre === selectedGenre);
        renderGames(filteredList);
    }
}

loadData();