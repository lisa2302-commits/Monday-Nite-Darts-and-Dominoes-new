// -------------------------------
// Monday Nite League - League Table
// -------------------------------

// All teams
const teams = [
  "Crown A",
  "Punch",
  "ICI",
  "Golden Cup",
  "The Park Inn",
  "Bird in Hand",
  "Victoria A",
  "Two Gates Club",
  "Funky Room",
  "Entwistle",
  "Crown B",
  "Victoria B"
];

// Build initial league object
let league = {};
teams.forEach(team => {
  league[team] = {
    team: team,
    points: 0,
    wins: 0,
    draws: 0,
    losses: 0
  };
});

// Load results from Supabase
async function loadLeagueTable() {
  const { data, error } = await db
    .from("results")
    .select("*");

  if (error) {
    console.error("Unable to load league table", error);
    document.getElementById("league-table").innerHTML =
      "<tr><td colspan='7'>Unable to load league table</td></tr>";
    return;
  }

  data.forEach(row => {
    const fixture = row.fixture;
    const homeScore = row.home_score;
    const awayScore = row.away_score;

    // NEW FIX: Parse "Team A 7 - 7 Team B"
    const match = fixture.match(/(.+?)\s(\d+)\s-\s(\d+)\s(.+)/);

    if (!match) {
      console.error("Fixture format incorrect:", fixture);
      return;
    }

    const homeTeam = match[1].trim();
    const awayTeam = match[4].trim();

    // Add points
    league[homeTeam].points += homeScore;
    league[awayTeam].points += awayScore;

    // Wins / Draws / Losses
    if (homeScore > awayScore) {
      league[homeTeam].wins++;
      league[awayTeam].losses++;
    } else if (awayScore > homeScore) {
      league[awayTeam].wins++;
      league[homeTeam].losses++;
    } else {
      league[homeTeam].draws++;
      league[awayTeam].draws++;
    }
  });

  // Convert to array for sorting
  let leagueArray = Object.values(league);

  // Sort: Points → Wins → Alphabetical
  leagueArray.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.wins !== a.wins) return b.wins - a.wins;
    return a.team.localeCompare(b.team);
  });

  // Build HTML table rows
  let html = "";

  leagueArray.forEach((t, index) => {
    const played = t.wins + t.draws + t.losses;

    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${t.team}</td>
        <td>${played}</td>
        <td>${t.points}</td>
        <td>${t.wins}</td>
        <td>${t.draws}</td>
        <td>${t.losses}</td>
      </tr>
    `;
  });

  // Insert into page
  document.getElementById("league-table").innerHTML = html;
}

// Run table
loadLeagueTable();
