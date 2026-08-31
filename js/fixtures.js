// -------------------------------
// Monday Nite League - Results List
// -------------------------------

// Load results from Supabase
async function loadResults() {
  const { data, error } = await db
    .from("results")
    .select("*")
    .order("week", { ascending: true });

  if (error) {
    console.error("Unable to load results", error);
    document.getElementById("results").innerHTML =
      "<p>Unable to load results.</p>";
    return;
  }

  let html = "";

  let currentWeek = null;

  data.forEach(row => {
    const fixture = row.fixture;
    const homeScore = row.home_score;
    const awayScore = row.away_score;
    const week = row.week;

    // Add week header when week changes
    if (week !== currentWeek) {
      currentWeek = week;
      html += `<h2>Week ${week}</h2>`;
    }

    // Display fixture and score
    html += `
      <div class="result-row">
        <strong>${fixture}</strong>
        <span>${homeScore} - ${awayScore}</span>
      </div>
    `;
  });

  document.getElementById("results").innerHTML = html;
}

// Run results list
loadResults();
