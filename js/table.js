// -------------------------------
// Monday Nite League - League Table
// -------------------------------

// Supabase client
const { createClient } = supabase;
const supabaseUrl = "https://wevedaffdzdvbkxydblw.supabase.co";
const supabaseKey = "sb_publishable_NJ5-zUej-yNedbcp4dMPrQ_IYRH4p6t"; 
const db = createClient(supabaseUrl, supabaseKey);

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
    console.error("Supabase error:", error);
    return;
  }

  data.forEach(row => {
    const fixture = row.fixture;
    const homeScore = row.home_score;
    const awayScore = row.away_score;

    // Split fixture: "Crown A v Punch"
    const [homeTeam, awayTeam] = fixture.split(" v ");

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

  // Build HTML table
  let html = `
    <table class="league-table">
      <tr>
        <th>Pos</th>
        <th>Team</th>
        <th>Pts</th>
        <th>W</th>
        <th>D</th>
        <th>L</th>
      </tr>
  `;

  leagueArray.forEach((t, index) => {
    html += `
      <tr>
        <td>${index + 1}</td>
        <td>${t.team}</td>
        <td>${t.points}</td>
        <td>${t.wins}</td>
        <td>${t.draws}</td>
        <td>${t.losses}</td>
      </tr>
    `;
  });

  html += `</table>`;

  // Insert into page
  document.getElementById("league-table").innerHTML = html;
}

// Run table
loadLeagueTable();
