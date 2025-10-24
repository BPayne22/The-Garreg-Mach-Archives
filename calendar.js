let allEvents = [];
let currentRoute = "White Clouds";
let currentMonthIndex = 0;
let monthsForRoute = [];

async function loadCalendar() {
  const res = await fetch("calendarEvents.json");
  allEvents = await res.json();
  setRoute(currentRoute);
}

function setRoute(route) {
  currentRoute = route;
  // Extract unique months for this route in order
  const routeEvents = allEvents.filter(e => e.route === route);
  const monthOrder = [...new Map(routeEvents.map(e => [e.month, e.chapter])).entries()];
  monthsForRoute = monthOrder.map(([month, chapter]) => ({ month, chapter }));
  currentMonthIndex = 0;
  renderMonth();
}

function renderMonth() {
  const { month, chapter } = monthsForRoute[currentMonthIndex];
  document.getElementById("monthTitle").textContent = `${month} (${chapter})`;

  const monthEvents = allEvents.filter(e => e.route === currentRoute && e.month === month);
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  monthEvents.sort((a,b) => a.day - b.day).forEach(ev => {
    const cell = document.createElement("div");
    cell.style.border = "1px solid #ccc";
    cell.style.padding = "6px";
    cell.style.minHeight = "60px";
    cell.style.cursor = "pointer";
    
    // blank day rendering
    if (ev.day === 0) {
      cell.innerHTML = ""; // blank cell
      cell.style.background = "#f0f0f0"; // optional styling
    } else {
    // normal rendering

    // Show only type if not "Nothing"
    let eventText = "";
    if (ev.event.type && ev.event.type !== "Nothing") {
      eventText = `<br><small>${ev.event.type}</small>`;
    }
    cell.innerHTML = `<strong>${ev.day}</strong>${eventText}`;

    // On click, update sidebar
    cell.addEventListener("click", () => showEventDetails(ev));
  }
    grid.appendChild(cell);
  });
}

function showEventDetails(ev) {
  const panel = document.getElementById("eventContent");
  if (ev.event.type === "Nothing") {
    panel.innerHTML = `<em>No event scheduled.</em>`;
  } else {
    panel.innerHTML = `
      <strong>Day ${ev.day} — ${ev.event.title || ev.event.type}</strong><br>
      <em>Type:</em> ${ev.event.type}<br>
      <p>${ev.event.notes || ""}</p>
    `;
  }
}

// Event listeners
document.getElementById("routeSelect").addEventListener("change", e => setRoute(e.target.value));
document.getElementById("prevMonth").addEventListener("click", () => {
  if (currentMonthIndex > 0) {
    currentMonthIndex--;
    renderMonth();
  }
});
document.getElementById("nextMonth").addEventListener("click", () => {
  if (currentMonthIndex < monthsForRoute.length - 1) {
    currentMonthIndex++;
    renderMonth();
  }
});

loadCalendar();
