
const pokemonList = document.getElementById('pokemonList');
const loadMoreButton = document.getElementById('loadMoreButton');

const openModalBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

const statusTable = document.getElementById('statusTable');

const maxRecords = 1080;
const limit = 1080;
let offset = 0;

const pokemons = [];
const index = {};


function convertPokemonToLi(pokemon, index) {
    return `
        <li class="pokemon ${pokemon.type}" 
        data-index="${index}" 
        id="pokemonItem-${index}" 
        data-image="${pokemon.photo}"
        data-stats="${pokemon.stats}"
        >
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>
            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>
                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `;
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit);

pokemonList.addEventListener('click', (event) => {
    const clickedLi = event.target.closest('li');
    if (clickedLi) {
        const index = clickedLi.getAttribute('data-index');
        if (index !== null) {
            const clickedPokemonItem = document.getElementById(`pokemonItem-${index}`);
            const name = clickedPokemonItem.querySelector('.name').textContent;
            const types = Array.from(clickedPokemonItem.querySelectorAll('.type')).map((type) => type.textContent);
            const image = clickedPokemonItem.getAttribute('data-image');
            const stats = clickedPokemonItem.getAttribute('data-stats').split(',');
            openModalWithPokemon(name, types, image, stats);
        }
    }
});



function openModalWithPokemon(name, types, image, stats) {
    modal.style.display = 'block';

    modal.classList.add(types[0]);

    document.getElementById('pokemonName').textContent = name;
    document.getElementById('pokemonTypes').textContent = `${types.join(' ')}`;
    document.getElementById('pokemonImage').src = image;

    document.getElementById('hpStat').textContent = `HP: ${stats[0]}`;
    document.getElementById('attackStat').textContent = `Attack: ${stats[1]}`;
    document.getElementById('defenseStat').textContent = `Defense: ${stats[2]}`;
    document.getElementById('specialAttackStat').textContent = `Special Attack: ${stats[3]}`;
    document.getElementById('specialDefenseStat').textContent = `Special Defense: ${stats[4]}`;
    document.getElementById('speedStat').textContent = `Speed: ${stats[5]}`;
}


closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

loadMoreButton.addEventListener('click', () => {
    offset += limit;
    const qtdRecordsWithNextPage = offset + limit;

    if (qtdRecordsWithNextPage >= maxRecords) {
        const newLimit = maxRecords - offset;
        loadPokemonItens(offset, newLimit);

        loadMoreButton.parentElement.removeChild(loadMoreButton);
    } else {
        loadPokemonItens(offset, limit);
    }
});
