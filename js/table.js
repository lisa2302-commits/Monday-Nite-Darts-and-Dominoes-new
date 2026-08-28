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


const SUPABASE_URL =
  "https://wevedaffdzdvbkxydblw.supabase.co";

const SUPABASE_KEY =
  "YOUR_PUBLISHABLE_KEY_HERE";


const supabaseClient =
  window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );


async function loadLeagueTable() {

  const table =
    document.getElementById("leagueTable");

  if (!table) return;


  table.innerHTML = `
    <tr>
      <td colspan="4">
        Loading table...
      </td>
    </tr>
  `;


  const { data: results, error } =
    await supabaseClient
      .from("results")
      .select("*")
      .order("week", { ascending: true });


  if (error) {

    console.error(error);

    table.innerHTML = `
      <tr>
        <td colspan="4">
          ❌ Unable to load league table.
        </td>
      </tr>
    `;

    return;

  }


  const data = {};


  teams.forEach(team => {

    data[team] = {

      played: 0,

      points: 0

    };

  });


  results.forEach(result => {

    if (!result.fixture) return;


    const parts =
      result.fixture.split(" v ");


    if (parts.length !== 2) return;


    const home =
      parts[0];

    const away =
      parts[1];


    if (!data[home] || !data[away]) return;


    const homeScore =
      Number(result.home_score) || 0;

    const awayScore =
      Number(result.away_score) || 0;


    data[home].played++;

    data[away].played++;


    // 1 point for every game won

    data[home].points += homeScore;

    data[away].points += awayScore;

  });


  const sortedTeams =
    Object.entries(data).sort((a, b) => {

      if (
        b[1].points !==
        a[1].points
      ) {

        return (
          b[1].points -
          a[1].points
        );

      }


      return (
        a[0].localeCompare(b[0])
      );

    });


  table.innerHTML = "";


  sortedTeams.forEach(
    (team, index) => {

      table.innerHTML += `

        <tr>

          <td>
            ${index + 1}
          </td>

          <td>
            ${team[0]}
          </td>

          <td>
            ${team[1].played}
          </td>

          <td>
            ${team[1].points}
          </td>

        </tr>

      `;

    }
  );

}


loadLeagueTable();
