const link =
  "https://fsa-puppy-bowl.herokuapp.com/api/2605-FTB-ET-WEB-FT/players";

let dogInfo = [];
let singleDogInfo = null;
const puppySelect = document.querySelector("#puppySelect");
const puppyStatus = document.querySelector("#puppyStatus");
const dform = document.querySelector("#dform");

const fetchAllPlayers = async () => {
  const response = await fetch(link);
  const data = await response.json();
  dogInfo = data.data.players;
};

const fetchSinglePlayer = async (playerId) => {
  const response = await fetch(`${link}/${playerId}`);
  const data = await response.json();
  singleDogInfo = data.data.player;
};

/**
 * Adds a new player to the roster via the API.
 * Once a player is added to the database, the new player
 * should appear in the all players page without having to refresh
 * @param {Object} newPlayer the player to add
 */
/* Note: we need data from our user to be able to add a new player
 * What does that sound like we need?
 */
/**
 * Note#2: addNewPlayer() expects you to pass in a
 * new player object when you call it. How can we
 * create a new player object and then pass it to addNewPlayer()?
 */

const addNewPlayer = async (newPlayer) => {
  const response = await fetch(link, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
    },
    body: JSON.stringify(newPlayer),
  });
  const data = await response.json();
  console.log(data);
};

/**
 * Removes a player from the roster via the API.
 * Once the player is removed from the database,
 * the player should also be removed from our view without refreshing
 * @param {number} playerId the ID of the player to remove
 */
/**
 * Note: In order to call removePlayer() a player's id is required.
 * Unless we know the id of the player we are trying to remove, we cannot call removePlayer()
 */

const removePlayer = async (playerId) => {
  //TODO
};

/**
 * Updates html to display a list of all players or a single player page.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player in the all player list is displayed with the following information:
 * - name
 * - image (with alt text of the player's name)
 *
 * Additionally, for each player we should be able to:
 * - See details of a single player. The page should show
 *    specific details about the player clicked such as: name, id, breed, status, image, and team or unassigned if no team
 * - Remove from roster. When a button is clicked, should remove the player
 *    from the database and our current view without having to refresh
 *
 */
const render = () => {
  const html = dogInfo.map((info) => {
    return `<div class="dogExpand" id="idfordiv" data-dogid=${info.id}>
    <img src="${info.imageUrl}" class="dogExpand" id="idforimage" data-dogid=${info.id}/>
    <h3 class="dogExpand" data-dogid=${info.id}>${info.name}</h3>
    </div>`;
  });
  puppySelect.innerHTML = html.join("");
  if (!singleDogInfo) {
    puppyStatus.innerHTML = "Please make a selection.";
  } else {
    puppyStatus.innerHTML = `<img id="selImg" src="${singleDogInfo.imageUrl}"/>
                            <p>Name: ${singleDogInfo.name}</p>
                            <p>Id: ${singleDogInfo.id}</p>
                            <p>Team: ${singleDogInfo.team ? singleDogInfo.team.name : "Unassigned"}</p>
                            <p>Breed: ${singleDogInfo.breed}</p>
                            <p>Status: ${singleDogInfo.status}</p>
                            <button>Remove from roster</button>
`;
  }
};

puppySelect.addEventListener("click", async (event) => {
  if (event.target.classList.contains("dogExpand")) {
    await fetchSinglePlayer(event.target.dataset.dogid);
    console.log(singleDogInfo);
    render();
  }
});

dform.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(dform);
  const newDog = {
    name: formData.get("dname"),
    breed: formData.get("dbreed"),
    status: formData.get("dstatus"),
    imageUrl: formData.get("dimageurl"),
  };
  await addNewPlayer(newDog);
  await fetchAllPlayers();
  render();
});

const init = async () => {
  await fetchAllPlayers();

  render();
};

init();
