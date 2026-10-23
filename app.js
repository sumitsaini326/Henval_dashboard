const chartData = {
  week: {
    total: "$12,480",
    revenue: "$12,480",
    orders: "324",
    average: "$38.52",
    customers: "246",
    labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
    values: [24, 35, 30, 54, 43, 68, 61],
    aria: "Revenue chart for this week",
  },
  month: {
    total: "$48,294",
    revenue: "$48,294",
    orders: "1,248",
    average: "$38.70",
    customers: "892",
    labels: ["Oct 1", "Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 31"],
    values: [31, 43, 36, 59, 47, 77, 66],
    aria: "Revenue chart for this month",
  },
  year: {
    total: "$524,680",
    revenue: "$524,680",
    orders: "13,420",
    average: "$39.10",
    customers: "8,940",
    labels: ["Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"],
    values: [33, 40, 37, 56, 48, 73, 66],
    aria: "Revenue chart for this year",
  },
};

const svgNamespace = "http://www.w3.org/2000/svg";
const chart = document.querySelector("#revenue-chart");
const periodSelect = document.querySelector("#period-select");
const currentDate = new Intl.DateTimeFormat("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
}).format(new Date()).toUpperCase();
document.querySelector("#current-date").textContent = currentDate;

function makeSvgElement(name, attributes = {}) {
  const element = document.createElementNS(svgNamespace, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, value);
  }
  return element;
}

function renderChart(period) {
  const data = chartData[period];
  const width = 760;
  const top = 12;
  const bottom = 211;
  const left = 47;
  const right = 750;
  const chartHeight = bottom - top;
  const points = data.values.map((value, index) => ({
    x: left + (index * (right - left)) / (data.values.length - 1),
    y: bottom - (value / 100) * chartHeight,
  }));

  chart.replaceChildren();
  chart.setAttribute("aria-label", data.aria);
  const defs = makeSvgElement("defs");
  const gradient = makeSvgElement("linearGradient", { id: "chart-fill", x1: "0", x2: "0", y1: "0", y2: "1" });
  gradient.append(
    makeSvgElement("stop", { offset: "0%", "stop-color": "#8065eb", "stop-opacity": ".17" }),
    makeSvgElement("stop", { offset: "100%", "stop-color": "#8065eb", "stop-opacity": "0" }),
  );
  defs.append(gradient);
  chart.append(defs);

  for (let index = 0; index <= 4; index += 1) {
    const y = top + (chartHeight * index) / 4;
    const label = makeSvgElement("text", { x: "0", y: String(y + 4), class: "axis-label" });
    label.textContent = ["$5k", "$4k", "$3k", "$2k", "$1k"][index];
    chart.append(
      makeSvgElement("line", { x1: String(left), y1: String(y), x2: String(width), y2: String(y), class: "grid-line" }),
      label,
    );
  }

  const line = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");
  chart.append(makeSvgElement("path", { d: `${line} L ${right} ${bottom} L ${left} ${bottom} Z`, class: "chart-area" }));
  chart.append(makeSvgElement("path", { d: line, class: "chart-line" }));

  points.forEach((point, index) => {
    if (index === points.length - 1) {
      chart.append(makeSvgElement("circle", { cx: String(point.x), cy: String(point.y), r: "5", class: "chart-point" }));
    }
    const label = makeSvgElement("text", {
      x: String(point.x),
      y: String(bottom + 22),
      "text-anchor": "middle",
      class: "axis-label",
    });
    label.textContent = data.labels[index];
    chart.append(label);
  });

  document.querySelector("#chart-total").textContent = data.total;
  for (const [metric, value] of Object.entries(data)) {
    const target = document.querySelector(`[data-metric="${metric}"]`);
    if (target) target.textContent = value;
  }
}

periodSelect.addEventListener("change", () => renderChart(periodSelect.value));
renderChart(periodSelect.value);

const searchInput = document.querySelector("#transaction-search");
const transactionRows = [...document.querySelectorAll("#transaction-rows tr")];
const emptyState = document.querySelector("#empty-state");
const resultCount = document.querySelector("#result-count");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;
  for (const row of transactionRows) {
    const matches = row.dataset.search.includes(query);
    row.hidden = !matches;
    if (matches) visibleCount += 1;
  }
  emptyState.hidden = visibleCount !== 0;
  resultCount.textContent = query
    ? `Showing ${visibleCount} matching transaction${visibleCount === 1 ? "" : "s"}`
    : "Showing 5 of 1,248 transactions";
});

document.querySelector("#export-button").addEventListener("click", () => {
  const headers = ["Order", "Customer", "Email", "Date", "Amount", "Status"];
  const rows = transactionRows.map((row) => {
    const cells = row.querySelectorAll("td");
    return [
      cells[0].textContent.trim(),
      cells[1].querySelector("strong").textContent.trim(),
      cells[1].querySelector("small").textContent.trim(),
      cells[2].textContent.trim(),
      cells[3].textContent.trim(),
      cells[4].textContent.trim(),
    ];
  });
  const csv = [headers, ...rows]
    .map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(","))
    .join("\r\n");
  const file = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "henval-transactions.csv";
  link.click();
  URL.revokeObjectURL(downloadUrl);
});

document.querySelector(".theme-toggle").addEventListener("click", () => {
  const isDark = document.body.dataset.theme !== "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
});

const menuToggle = document.querySelector(".menu-toggle");
menuToggle.addEventListener("click", () => {
  const isOpen = document.body.classList.toggle("nav-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

document.querySelectorAll(".nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    document.querySelectorAll(".nav-link").forEach((item) => {
      item.classList.remove("active");
      item.removeAttribute("aria-current");
    });
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

document.body.addEventListener("click", (event) => {
  if (event.target.matches("body.nav-open")) {
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});
