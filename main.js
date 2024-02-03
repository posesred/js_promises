let collectionData = [];
let favoritesData = [];
let sortAscending = true;

document.addEventListener('DOMContentLoaded', function () {
    const collectionContainer = document.getElementById('collection');
    const favoritesContainer = document.getElementById('favorites');

    fetch('https://pokeapi.co/api/v2/pokemon?limit=30&offset=0')
        .then(response => response.json())
        .then(data => {
            collectionData = data.results;
            displayCollection();
        })
        .catch(error => console.error('Error fetching data:', error));

    async function displayCollection() {
        collectionContainer.innerHTML = "";

        const cards = await Promise.all(collectionData.map(item => createCard(item)));

        cards.forEach(card => {
            collectionContainer.appendChild(card);
        });
    }

    async function createCard(item, isFavorite = false) {
        const card = document.createElement('div');
        card.className = 'card';
    
        try {
            const response = await fetch(item.url);
            const data = await response.json();
    
            const imageSrc = data.sprites.front_default;
            const weight = data.weight;
            const height = data.height;
    
            card.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${imageSrc}" alt="${item.name}" />
                <p>Weight: ${weight} kg</p>
                <p>Height: ${height} dm</p>
            `;
    
            if (!isFavorite) {
                const button = document.createElement('button');
                button.textContent = isFavorite ? 'Remove from Favorites' : 'Add to Favorites';
                button.onclick = function () {
                    isFavorite ? removeFromFavorites(item.name) : addToFavorites(item.name);
                };
                card.appendChild(button);
            }
    
            if (isFavorite) {
                card.classList.add('favorite');
            }
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
        }
    
        return card;
    }

    window.addToFavorites = function (itemName) {
        const selectedItem = collectionData.find(item => item.name === itemName);
        if (selectedItem) {
            favoritesData.push(selectedItem);
            collectionData = collectionData.filter(item => item.name !== itemName);
            displayCollection();
            displayFavorites();
        }
    };

    async function displayFavorites() {
        favoritesContainer.innerHTML = "";

        const favoriteCards = await Promise.all(favoritesData.map(item => createCard(item, true)));

        favoriteCards.forEach(card => {
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove from Favorites';
            removeButton.onclick = function () {
                removeFromFavorites(card.querySelector('h3').textContent);
            };

            card.appendChild(removeButton);
            favoritesContainer.appendChild(card);
        });
    }

    window.removeFromFavorites = function (itemName) {
        const removedItem = favoritesData.find(item => item.name === itemName);
        if (removedItem) {
            collectionData.push(removedItem);
            favoritesData = favoritesData.filter(item => item.name !== itemName);
            displayCollection();
            displayFavorites();
        }
    };

    const toggleSortButton = document.getElementById('toggleSortButton');
    toggleSortButton.addEventListener('click', toggleSort);

    function toggleSort() {
        if (sortAscending) {
            collectionData.sort((a, b) => a.name.localeCompare(b.name));
            favoritesData.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            collectionData.sort((a, b) => b.name.localeCompare(a.name));
            favoritesData.sort((a, b) => b.name.localeCompare(a.name));
        }

        sortAscending = !sortAscending;
        displayCollection();
        displayFavorites();
    }

    function displayTotal() {
        const totalSum = collectionData.length + favoritesData.length;
        console.log('Total items:', totalSum);
    }

    displayCollection();
    displayFavorites();
    displayTotal();
});
