async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const callResponse = await fetch("http://localhost:3000/api/matches", {
      method: "POST",
      body: formData,
    });

    const result = await callResponse.json();

    if (!callResponse.ok) {
      return openErrorMessage(result);
    }

    console.log("Success Response:", result);
    renderPlayerScores(result.players);
    renderRounds(result.matchRounds);
    renderMatchMVP(
      result.mvp,
      result.players.find((player) => player.name === result.mvp)
    );
  } catch (error) {
    console.error("Error:", error);
    openErrorMessage(error);
  }
}

function formatData(data) {
  const datetimeFormatConfig = new Intl.DateTimeFormat("pt-BR", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return datetimeFormatConfig.format(new Date(data));
}

function buildPlayerScore(playerTimeline) {
  return playerTimeline.reduce(
    (score, playerEvent) => ({
      kills: playerEvent.type === "kill" ? score.kills + 1 : score.kills,
      deaths: playerEvent.type === "death" ? score.deaths + 1 : score.deaths,
    }),
    { kills: 0, deaths: 0 }
  );
}

function renderPlayerScores(playerData) {
  const players = playerData
    .map((player) => ({
      ...player,
      score: buildPlayerScore(player.playerTimeline),
    }))
    .toSorted((a, b) => {
      if (b.score.kills > a.score.kills) return 1;
      if (b.score.kills < a.score.kills) return -1;
      if (b.score.kills === a.score.kills) {
        return a.score.deaths - b.score.deaths;
      }
    })
    .map((player, index) => {
      return `
        <tr class="player-${index}">
          <td class="has-text-centered">#${index + 1}</td>
          <td>${player.name}</td>
          <td class="has-text-centered">${player.score.kills}</td>
          <td class="has-text-centered">${player.score.deaths}</td>
          <td class="has-text-centered">${player.bestStreak}</td>
          <td>${player.achievements?.join(", ")}</td>
        </tr>

    `;
    })
    .join("");

  const playerTable = document.getElementById("player-scores");
  playerTable.innerHTML = players;
}

function renderMatchMVP(mvp, playerData) {
  if (!mvp) return;

  const mvpBaseInfo = `
  <tr>
    <td>${mvp.player}</td>
    <td class="has-text-centered">${mvp.kills}</td>
    <td>${mvp.favoriteWeapon}</td>
  </tr>
  `;
  const mvpInfoSection = document.getElementById("mvp-stats-base-info");
  mvpInfoSection.innerHTML = mvpBaseInfo;
}

function renderRounds(matchRounds = []) {
  const rounds = matchRounds.map((round, index) => {
    const playerFlags = Object.entries(round.playersFlags)
      .toSorted((a, b) => b[1] - a[1])
      .map(([player, flags]) => `${player}: ${flags}`)
      .join(", ");

    return `
      <tr class="round-${index}">
        <td>${formatData(round.startedAt)}</td>
        <td>${formatData(round.finishedAt)}</td>
        <td>${playerFlags}</td>
      </tr>

    `;
  });

  const noRounds = `<div class="no-rounds">Não houveram rounds</div>`;

  const roundSection = document.getElementById("round-stats");
  roundSection.innerHTML = matchRounds.length ? rounds.join("") : noRounds;
}

const uploadInput = document.getElementById("file-upload-input");
uploadInput.addEventListener("change", ($event) => {
  if (!$event.target?.files?.[0]) return;

  const file = $event.target.files[0];
  const fileName = file.name;
  const fileNameElement = document.getElementById("file-name");
  fileNameElement.innerText = fileName;

  return uploadFile(file);
});

function selectTheme(theme) {
  const htmlTag = document.getElementsByTagName("html")[0];
  htmlTag.classList.remove("theme-light", "theme-dark");
  htmlTag.classList.add(`theme-${theme}`);

  const themeButtons = document.getElementsByClassName("theme-button");
  Array.from(themeButtons).forEach((button) => {
    button.classList.remove("is-success", "is-selected");

    if (button.classList.contains(`${theme}-theme-button`)) {
      button.classList.add("is-success", "is-selected");
    }
  });
}

function openErrorMessage(error) {
  const errorMessageSection = document.getElementById("error-message-section");
  errorMessageSection.classList.remove("is-hidden");

  const errorMessageTextSection =
    errorMessageSection.getElementsByClassName("message-body")[0];

  errorMessageTextSection.innerText = JSON.stringify(error, null, 4);
}

function closeErrorMessage() {
  const errorMessage = document.getElementById("error-message-section");
  errorMessage.classList.add("is-hidden");
}

if (window.matchMedia) {
  if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    selectTheme("dark");
  } else {
    selectTheme("light");
  }
}
