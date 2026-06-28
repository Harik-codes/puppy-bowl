const link =
  "https://fsa-puppy-bowl.herokuapp.com/api/2605-FTB-ET-WEB-FT/players";

let dogInfo = [];
let singleDogInfo = null;
const puppySelect = document.querySelector("#puppySelect");
const puppyStatus = document.querySelector("#puppyStatus");
const dform = document.querySelector("#dform");

const fetchAllPlayers = async () => {
  try {
    const response = await fetch(link);
    const data = await response.json();
    dogInfo = data.data.players;
  } catch (error) {
    console.log(error);
  }
};

const fetchSinglePlayer = async (playerId) => {
  try {
    const response = await fetch(`${link}/${playerId}`);
    const data = await response.json();
    singleDogInfo = data.data.player;
  } catch (error) {
    console.log(error);
  }
};

const addNewPlayer = async (newPlayer) => {
  try {
    const response = await fetch(link, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPlayer),
    });
    const data = await response.json();
    console.log(data);
  } catch (error) {
    console.log(error);
  }
};

const removePlayer = async (playerId) => {
  try {
    await fetch(`${link}/${playerId}`, {
      method: "DELETE",
    });
    dogInfo = dogInfo.filter((info) => {
      return info.id !== playerId * 1;
    });
  } catch (error) {
    console.log(error);
  }
};

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
                            <button class="deleteButton" data-singleid=${singleDogInfo.id}>Remove from roster</button>
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

puppyStatus.addEventListener("click", async (event) => {
  if (event.target.classList.contains("deleteButton")) {
    await removePlayer(event.target.dataset.singleid);
    singleDogInfo = null;
    render();
  }
});

const init = async () => {
  await fetchAllPlayers();

  render();
};

init();
