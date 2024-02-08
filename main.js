let sortAscending = true;

const collectionContainer = document.getElementById("collection");
const favoritesContainer = document.getElementById("favorites");
const types = document.querySelector(".types");
// fetching
const Api_url = "https://pokeapi.co/api/v2/pokemon?limit=30&offset=0";

const getPokemonData = (pokemon) => {
  return fetch(pokemon.url).then((res) => res.json());
};

const getData = (url) => {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      return Promise.all(data.results.map((item) => getPokemonData(item)));
    })
    .catch((error) => console.error("Error fetching data", error));
};

//Main code
document.addEventListener("DOMContentLoaded", async function () {
  const data = await getData(Api_url);
  displayCollection(data);
  displayHtml(displayRarity(data));
});

//Displaying
function displayCollection(collectionData) {
  const collectionContainer = document.getElementById("collection");
  collectionContainer.innerHTML = "";
  const cards = collectionData.map((item) => createCard(item));
  cards.forEach((card) => {
    collectionContainer.appendChild(card);
  });
}

function createCard(item, isFavorite = false) {
  const card = document.createElement("div");
  card.classList.add("card");

  const imageSrc = item.sprites.front_default;
  const weight = item.weight;
  const height = item.height;

  card.innerHTML = `
                <h3>${item.name}</h3>
                <img src="${imageSrc}" alt="${item.name}" />
                <p>Weight: ${weight} kg</p>
                <p>Height: ${height} dm</p>
            `;

  if (!isFavorite) {
    const button = document.createElement("button");
    button.textContent = isFavorite
      ? "Remove from Favorites"
      : "Add to Favorites";
    button.onclick = function (event) {
      event.preventDefault();
      moveItem(event);
    };
    card.appendChild(button);
  }

  if (isFavorite) {
    card.classList.add("favorite");
  }

  return card;
}

const moveItem = (event) => {
  const target = event.target;
  const card = target.parentElement;
  const container = card.parentElement.id;
  const containerToAppend =
    container === "collection" ? favoritesContainer : collectionContainer;
  containerToAppend.append(card);
};
//Sorting
const toggleSortButton = document.getElementById("toggleSortButton");
toggleSortButton.addEventListener("click", () => {
  const collectionContainerNew = Array.from(
    document.getElementById("collection").children
  );
  const favoritesContainerNew = Array.from(
    document.getElementById("favorites").children
  );
  [collectionContainerNew, favoritesContainerNew].forEach((container) => {
    container.sort(sortData);
  });
  collectionContainerNew.forEach((item) => {
    collectionContainer.append(item);
  });
  favoritesContainerNew.forEach((item) => favoritesContainer.append(item));
  sortAscending = !sortAscending;
});

const sortData = (a, b) => {
  const newA = a.getElementsByTagName("h3")[0].innerText;
  const newB = b.getElementsByTagName("h3")[0].innerText;
  const params = sortAscending ? [newA, newB] : [newB, newA];
  return params[0].localeCompare(params[1]);
};

function displayRarity(data) {
  const typeCounts = {};
  for (let i = 0; i < data.length; i++) {
    const typeName = data[i].types[0].type.name;
    if (typeCounts[typeName]) {
      typeCounts[typeName]++;
    } else {
      typeCounts[typeName] = 1;
    }
  }
  return typeCounts;
}

function displayHtml(object) {
  let html = "";
  for (const type in object) {
    if (object.hasOwnProperty(type)) {
      html += `<div>${object[type]}: ${capitalize(type)} pokemon </div>`;
    }
  }
  types.innerHTML = html;
}
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
