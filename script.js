const cardContainer = document.getElementById("card-container");
const genreFilter = document.getElementById("genre-filter-list");
const statusFilterList = document.getElementById("status-filter-list");

let availableGenres = new Set();
let availableStatusProgress = new Set();
let currentFilter = "Todos";
let currentStatusFilter = "Todos";

let gameList = [];

async function loadData() {
    try{
        const response = await fetch("mockData.json");

        gameList = await response.json();

        initializeMetaData();
        renderFilterButtons();
        renderStatusOptions();
        renderGames(gameList);
    }
    catch(error) {
        console.error("Erro ao carregar os dados dos jogos:", error);
        cardContainer.innerHTML = `<p>Ops, ocorreu um erro ao carregar o catálogo...</p>`;
    }
}

function createGameCard(game) {
    const gameData = encodeURIComponent(JSON.stringify(game));
    return /*html*/`
        <article class="game-card" onclick="openModal('${gameData}')" tabIndex="0" role="button">
            <div class="game-cover-wrapper">
                <img src="images/covers/${game.filename}.jpg" alt="Capa do jogo" class="game-cover">
            </div>
            <h3>${game.name}</h3>
            <p class="genre">${game.genre}</p>
            <span class="price">${game.price}</span>
        </article>
    `;
}

function openModal(gameData) {
    const game = JSON.parse(decodeURIComponent(gameData));
    const modal = document.getElementById("details-modal");
    const modalBody = document.getElementById("modal-content")

    modalBody.innerHTML = /*html*/`
        <div class="modal-header">
            <img src="images/covers/${game.filename}.jpg" alt="${game.name}">
            <div>
                <h2>${game.name}</h2>
                <p><strong>Gênero:</strong> ${game.genre} | <strong>Status:</strong> ${game.status}</p>
            </div>
        </div>
        <div class="modal-description">
            <h3>Sobre o Jogo</h3>
            <p>${game.description || "Este jogo é uma experiência indie incrível ainda sem descrição detalhada."}</p>
        </div>
    `
    modal.classList.remove("hidden"); 
}

function closeModal() {
    const modal = document.getElementById("details-modal");
    modal.classList.add("hidden");
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
        availableStatusProgress.add(game.status);
    })
}

function renderFilterButtons() {
    const genres = ["Todos", ...availableGenres];

    genreFilter.innerHTML = genres.map((genre) => {
        const isActive = genre === currentFilter ? "filter-active" : "";

        return /*html*/`
            <li>
                <button class="filter-button ${isActive}" onclick="filterGames('${genre}', '${currentStatusFilter}')">
                    ${genre}
                </button>
            </li>
        `;
    }).join("");
}

function filterGames(selectedGenre, status = "Todos") {
    currentFilter = selectedGenre;
    currentStatusFilter = status;

    renderFilterButtons();
    renderStatusOptions();

    const filteredList = gameList.filter((game) => {
        const matchGenre = selectedGenre === "Todos" || game.genre === selectedGenre;
        const matchStatus = status === "Todos" || game.status === status;

        return matchGenre && matchStatus;
    })

    renderGames(filteredList);
}

function renderStatusOptions() {
    const availableStatus = ["Todos", ...availableStatusProgress];

    statusFilterList.innerHTML = availableStatus.map((status) => {
        const isActive = status === currentStatusFilter ? "filter-active" : "";

        return /*html*/`
            <li>
                <button class="filter-button ${isActive}" onclick="filterGames('${currentFilter}' , '${status}')">
                    ${status}
                </button>
            </li>
        `
    }).join("");
}

function searchGame(event) {
    event.preventDefault();
    const form = event.target;

    const query = form.query.value.toLowerCase().trim();

    currentFilter = "Todos";
    renderFilterButtons();

    if(query === "") {
        
        renderGames(gameList);
        return;
    }
    const gamesFound = gameList.filter((game) => {
        return game.name.toLowerCase().includes(query);
    });

    renderGames(gamesFound);

} 

loadData();