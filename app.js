/* SA Municipal Electricity Tariff Tracker 2026/27 — Journey2Green
   All values traceable to dashboard_data.md sources. No invented numbers. */

'use strict';

// ---------- Brand palette ----------
const C = {
  green700: '#2E7D32',
  green900: '#1B5E20',
  green500: '#43A047',
  green100: '#E8F1E9',
  amber: '#C77D18',
  red: '#B23A2E',
  ink: '#1a1a1a',
  ink60: '#5a5a5a',
  line: '#e4e6e4'
};

// Harmonious extended series palette (restrained)
const SERIES = ['#1B5E20', '#43A047', '#7CB342', '#00897B', '#558B2F', '#9CCC65'];

const FONT_FAMILY = "Century Gothic, 'Twentieth Century', 'URW Gothic', Futura, 'Trebuchet MS', sans-serif";
Chart.defaults.font.family = FONT_FAMILY;
Chart.defaults.color = C.ink60;

// ---------- Formatters (UK English, ZAR) ----------
const fmtR = (n) => 'R' + Math.round(n).toLocaleString('en-GB');
const fmtPct = (n, d = 2) => n.toFixed(d) + '%';

// ---------- Data ----------
const GUIDELINE = 9.01; // national municipal guideline benchmark

const METROS = [
  { name: 'City of Cape Town', inc: 7.5, note: 'Lowest in the country', src: 'https://www.looksee.co.za/looksee/home/knowledge-hub/articles/July-2026-electricity-increases' },
  { name: 'City Power (Johannesburg)', inc: 8.63, note: 'Residential domestic 9.01%; average held at 8.63%', src: 'https://www.citizen.co.za/roodepoort-record/news-headlines/local-municipal-news/2026/07/01/city-power-implements-8-63-average-electricity-tariff-increase/' },
  { name: 'City of Tshwane', inc: 8.8, note: 'Four-block residential IBT', src: 'https://www.rateswatch.co.za/wp-content/uploads/2026/04/SAPOA-City-of-Tshwane-Budget-Flyer_20262027.pdf' },
  { name: 'eThekwini (Durban)', inc: 9.0, note: 'Flat rate, cut from proposed 10.5%', src: 'https://iol.co.za/mercury/news/2026-05-31-ethekwini-ratepayers-here-are-the-new-july-1-tariff-hikes/' },
  { name: 'City of Ekurhuleni', inc: 9.01, note: 'Aligned to ERTSA; moved to flat rate', src: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2026/03/Presentation-Electricity-Tariff-Increase-Application-for-the-2026-2027.pdf' },
  { name: 'Mangaung (Centlec)', inc: 9.9, note: 'Bloemfontein', src: 'https://www.looksee.co.za/looksee/home/knowledge-hub/articles/July-2026-electricity-increases' },
  { name: 'Nelson Mandela Bay', inc: 10.09, note: 'Gqeberha / Port Elizabeth', src: 'https://www.looksee.co.za/looksee/home/knowledge-hub/articles/July-2026-electricity-increases' },
  { name: 'Buffalo City', inc: 11.10, note: 'East London; own notice 11.10% (news cited 14%)', src: 'https://www.buffalocity.gov.za/notice.php?id=27956cc' }
];

const STATUS = [
  { name: 'City Power (Johannesburg)', detail: '2026/27 schedule implemented 1 July 2026; per-block c/kWh estimated pending official PDF.', status: 'estimate' },
  { name: 'eThekwini (Durban)', detail: 'Flat rate implemented 1 July 2026; final flat R/kWh at 9% pending official PDF.', status: 'estimate' },
  { name: 'City of Cape Town', detail: '2026/27 residential tariffs published in the official guide, from 1 July 2026.', status: 'published' },
  { name: 'City of Tshwane', detail: '2026/27 four-block IBT implemented 1 July 2026; per-block c/kWh estimated pending official PDF.', status: 'estimate' },
  { name: 'City of Ekurhuleni', detail: '2026/27 flat rate published and implemented 1 July 2026.', status: 'published' }
];

const IBT = [
  {
    id: 'citypower',
    label: 'City Power (Johannesburg)',
    estimated: true,
    unit: 'R/kWh excl VAT',
    caption: 'Residential Prepaid High. 2025/26 baseline with 2026/27 energy escalated approximately 9%.',
    blocks: [
      { block: 'Block 1', range: '0 to 350 kWh', rate: 'R2.6645 (2025/26) → ~R2.90 (2026/27)', note: 'First-block prepaid' },
      { block: 'Block 2', range: '351 to 500 kWh', rate: 'R3.0564 → ~R3.33', note: '' },
      { block: 'Block 3', range: 'Above 500 kWh', rate: 'R3.4826 → ~R3.80', note: 'Highest block' }
    ],
    fixed: '~R241.50/month combined service and network',
    fbe: '50 to 120 kWh, registered indigent',
    srcs: [
      { label: 'Johannesburg consolidated tariffs FY2025/2026 (PDF)', url: 'https://joburg.org.za/documents_/Documents/Amendment%20of%20Tariff%20Charges/Consolidated-Tariffs-FY20252026.FINAL.pdf' },
      { label: 'TDPel Media, City Power new charges', url: 'https://tdpelmedia.com/johannesburg-electricity-tariffs-rise-as-city-power-introduces-new-charges/' }
    ]
  },
  {
    id: 'tshwane',
    label: 'City of Tshwane',
    estimated: true,
    unit: 'R/kWh excl VAT',
    caption: 'Domestic Prepaid IBT. 2025/26 baseline with 2026/27 escalated approximately 8.8%.',
    blocks: [
      { block: 'Block 1', range: '0 to 100 kWh', rate: 'R2.9790 → ~R3.24', note: 'Lifeline first block' },
      { block: 'Block 2', range: '101 to 400 kWh', rate: 'R3.4864 → ~R3.79', note: '' },
      { block: 'Block 3', range: '401 to 650 kWh', rate: 'R3.7984 → ~R4.13', note: '' },
      { block: 'Block 4', range: 'Above 650 kWh', rate: 'R4.0948 → ~R4.46', note: 'Highest block' }
    ],
    fixed: 'No fixed residential energy charge',
    fbe: '~100 kWh, qualifying indigent',
    srcs: [
      { label: 'City of Tshwane residential tariff schedule (PDF)', url: 'https://topcharge.co.za/wp-content/uploads/2025/09/CoT_Res.pdf' }
    ]
  },
  {
    id: 'capetown',
    label: 'City of Cape Town',
    estimated: false,
    unit: 'c/kWh incl VAT',
    caption: 'From the official City guide, from 1 July 2026. Rates are published, not estimated.',
    blocks: [
      { block: 'Domestic Block 1', range: '0 to 600 kWh (valuation R500k to R1m)', rate: '413.79 c/kWh', note: 'Fixed R74.77/month' },
      { block: 'Domestic Block 2', range: 'Above 600 kWh', rate: '493.90 c/kWh', note: '' },
      { block: 'Home User Block 1', range: '0 to 600 kWh', rate: '355.95 c/kWh', note: 'Fixed R424.30/month' },
      { block: 'Home User Block 2', range: 'Above 600 kWh', rate: '469.06 c/kWh', note: '' },
      { block: 'Lifeline', range: 'Flat', rate: '283.04 c/kWh', note: 'No fixed charge' }
    ],
    fixed: 'Domestic R74.77/month; Home User R424.30/month; Lifeline none',
    fbe: '60 kWh (below 250 kWh average) or 25 kWh (250 to 450 kWh average)',
    srcs: [
      { label: 'City of Cape Town, understanding residential electricity tariffs (PDF)', url: 'https://resource.capetown.gov.za/documentcentre/Documents/Procedures,%20guidelines%20and%20regulations/Understanding-residential-electricity-tariffs.pdf' }
    ]
  },
  {
    id: 'ethekwini',
    label: 'eThekwini (Durban)',
    estimated: true,
    unit: 'R/kWh incl VAT',
    caption: 'Flat rate, no inclining block tariff. 2026/27 final flat rate pending official PDF.',
    blocks: [
      { block: 'Flat energy rate', range: 'All consumption', rate: 'R3.77/kWh (2025/26) → R4.17/kWh (2026/27)', note: 'No inclining blocks' }
    ],
    fixed: 'No fixed charges',
    fbe: '65 kWh, qualifying indigent',
    srcs: [
      { label: 'BizNews, South Africa\u2019s biggest cities to raise tariffs', url: 'https://www.biznews.com/news/south-africas-biggest-cities-to-raise-electricity-tariffs-from-july-2026' },
      { label: 'eThekwini tariff booklet 2025/26 (PDF)', url: 'https://www.durban.gov.za/uploads/0000/13/2025/10/27/tarrif-booklet-2025-26.pdf' }
    ]
  }
];

const HISTORY = [
  { fy: '2022/23', eskom: 9.61, muni: 8.61, src: 'https://www.eskom.co.za/distribution/wp-content/uploads/2022/03/Connect-2022_23.pdf' },
  { fy: '2023/24', eskom: 18.65, muni: 18.49, src: 'https://www.eskom.co.za/eskom-clarifies-the-18-65-tariff-increase/' },
  { fy: '2024/25', eskom: 12.74, muni: 12.72, src: 'https://www.eskom.co.za/distribution/wp-content/uploads/2024/05/ESK114-Eskom-Digital-Tariff-Booklet-2024_Final.pdf' },
  { fy: '2025/26', eskom: 12.74, muni: 11.32, src: 'https://www.eskom.co.za/distribution/2025-2026-price-increase/' },
  { fy: '2026/27', eskom: 8.76, muni: 9.01, src: 'https://www.nersa.org.za/files/files/2026/03/MediaStatement-NERSAapprovesEskomRetailTariffsandStructuralAdjustmentapplicationfor2026-27.pdf' },
  { fy: '2027/28', eskom: 8.83, muni: 8.83, src: 'https://www.nersa.org.za/files/files/2025/08/Mediastatement-NERSAandEskomsettlementontheSixthMulti-YearPriceDeterminationRevenuedecision.pdf' }
];

const SOURCES = [
  { label: 'NERSA media statement, Eskom retail tariffs and structural adjustment 2026/27 (PDF)', url: 'https://www.nersa.org.za/files/files/2026/03/MediaStatement-NERSAapprovesEskomRetailTariffsandStructuralAdjustmentapplicationfor2026-27.pdf' },
  { label: 'Eskom Schedule of Standard Prices FY2027, via Parliament (PDF)', url: 'https://www.parliament.gov.za/storage/app/media/Docs/tpap/01dx3n75fx2zqg2szsvfbzs26wen5swlu7.pdf' },
  { label: 'Engineering News, NERSA completes approval of distributor tariffs', url: 'https://www.engineeringnews.co.za/article/nersa-completes-its-consideration-and-approval-of-electricity-distributors-tariffs-2026-06-01' },
  { label: 'Parliament, committee briefed on NERSA MYPD6 miscalculation', url: 'https://www.parliament.gov.za/press-releases/media-statement-committee-electricity-and-energy-briefed-nersa-miscalculation-2025-2026-mypd6' },
  { label: 'NERSA and Eskom MYPD6 settlement media statement (PDF)', url: 'https://www.nersa.org.za/files/files/2025/08/Mediastatement-NERSAandEskomsettlementontheSixthMulti-YearPriceDeterminationRevenuedecision.pdf' },
  { label: 'Looksee, July 2026 electricity increases knowledge hub', url: 'https://www.looksee.co.za/looksee/home/knowledge-hub/articles/July-2026-electricity-increases' },
  { label: 'The Citizen, City Power implements 8.63% average increase', url: 'https://www.citizen.co.za/roodepoort-record/news-headlines/local-municipal-news/2026/07/01/city-power-implements-8-63-average-electricity-tariff-increase/' },
  { label: 'RatesWatch, City of Tshwane budget flyer 2026/2027 (PDF)', url: 'https://www.rateswatch.co.za/wp-content/uploads/2026/04/SAPOA-City-of-Tshwane-Budget-Flyer_20262027.pdf' },
  { label: 'IOL Mercury, eThekwini new 1 July tariff hikes', url: 'https://iol.co.za/mercury/news/2026-05-31-ethekwini-ratepayers-here-are-the-new-july-1-tariff-hikes/' },
  { label: 'City of Ekurhuleni electricity tariff increase application 2026/2027 (PDF)', url: 'https://www.ekurhuleni.gov.za/wp-content/uploads/2026/03/Presentation-Electricity-Tariff-Increase-Application-for-the-2026-2027.pdf' },
  { label: 'Buffalo City official tariff notice', url: 'https://www.buffalocity.gov.za/notice.php?id=27956cc' },
  { label: 'Johannesburg consolidated tariffs FY2025/2026 (PDF)', url: 'https://joburg.org.za/documents_/Documents/Amendment%20of%20Tariff%20Charges/Consolidated-Tariffs-FY20252026.FINAL.pdf' },
  { label: 'TDPel Media, City Power introduces new charges', url: 'https://tdpelmedia.com/johannesburg-electricity-tariffs-rise-as-city-power-introduces-new-charges/' },
  { label: 'City of Tshwane residential tariff schedule (PDF)', url: 'https://topcharge.co.za/wp-content/uploads/2025/09/CoT_Res.pdf' },
  { label: 'City of Cape Town residential electricity tariffs guide (PDF)', url: 'https://resource.capetown.gov.za/documentcentre/Documents/Procedures,%20guidelines%20and%20regulations/Understanding-residential-electricity-tariffs.pdf' },
  { label: 'BizNews, biggest cities raise electricity tariffs from July 2026', url: 'https://www.biznews.com/news/south-africas-biggest-cities-to-raise-electricity-tariffs-from-july-2026' },
  { label: 'eThekwini tariff booklet 2025/26 (PDF)', url: 'https://www.durban.gov.za/uploads/0000/13/2025/10/27/tarrif-booklet-2025-26.pdf' },
  { label: 'Eskom Connect 2022/23 tariff booklet (PDF)', url: 'https://www.eskom.co.za/distribution/wp-content/uploads/2022/03/Connect-2022_23.pdf' },
  { label: 'Eskom clarifies the 18.65% tariff increase', url: 'https://www.eskom.co.za/eskom-clarifies-the-18-65-tariff-increase/' },
  { label: 'Eskom digital tariff booklet 2024 (PDF)', url: 'https://www.eskom.co.za/distribution/wp-content/uploads/2024/05/ESK114-Eskom-Digital-Tariff-Booklet-2024_Final.pdf' },
  { label: 'Eskom 2025/2026 price increase', url: 'https://www.eskom.co.za/distribution/2025-2026-price-increase/' },
  { label: 'NERSA tariff portal', url: 'https://www.nersa.org.za/' }
];

// ---------- Render: status cards ----------
function renderStatus() {
  const el = document.getElementById('status-grid');
  el.innerHTML = STATUS.map(s => `
    <div class="status-card">
      <div class="name">${s.name}</div>
      <div class="detail">${s.detail}</div>
      <span class="badge ${s.status}">${s.status === 'published' ? 'Published' : 'Estimate'}</span>
    </div>`).join('');
}

// ---------- Render: benchmark table ----------
function renderBenchmarkTable() {
  const tb = document.querySelector('#benchmark-table tbody');
  tb.innerHTML = METROS.map(m => {
    const delta = m.inc - GUIDELINE;
    let cls = 'delta-eq', txt = 'On guideline';
    if (delta > 0.001) { cls = 'delta-over'; txt = '+' + delta.toFixed(2) + ' pts above'; }
    else if (delta < -0.001) { cls = 'delta-under'; txt = delta.toFixed(2) + ' pts below'; }
    return `<tr>
      <td>${m.name}</td>
      <td class="num">${fmtPct(m.inc)}</td>
      <td class="num ${cls}">${txt}</td>
      <td>${m.note}</td>
      <td><a href="${m.src}" target="_blank" rel="noopener">Source</a></td>
    </tr>`;
  }).join('');
}

// ---------- Render: benchmark chart ----------
function renderBenchmarkChart() {
  const ctx = document.getElementById('benchmarkChart');
  const labels = METROS.map(m => m.name);
  const data = METROS.map(m => m.inc);
  const colors = METROS.map(m => m.inc > GUIDELINE + 0.001 ? C.amber : C.green700);

  const guidelineLine = {
    id: 'guidelineLine',
    afterDraw(chart) {
      const { ctx, chartArea, scales } = chart;
      const y = scales.y.getPixelForValue(GUIDELINE);
      ctx.save();
      ctx.strokeStyle = C.red;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);
      ctx.beginPath();
      ctx.moveTo(chartArea.left, y);
      ctx.lineTo(chartArea.right, y);
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = C.red;
      ctx.font = '700 12px ' + FONT_FAMILY;
      ctx.textAlign = 'right';
      ctx.fillText('Guideline 9.01%', chartArea.right - 6, y - 6);
      ctx.restore();
    }
  };

  new Chart(ctx, {
    type: 'bar',
    data: { labels, datasets: [{ label: '2026/27 increase', data, backgroundColor: colors, borderRadius: 4, maxBarThickness: 54 }] },
    plugins: [guidelineLine],
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: (c) => 'Increase: ' + fmtPct(c.parsed.y) } }
      },
      scales: {
        y: { beginAtZero: true, suggestedMax: 12, ticks: { callback: (v) => v + '%' }, title: { display: true, text: 'Average increase (%)' } },
        x: { ticks: { maxRotation: 40, minRotation: 40, font: { size: 10.5 } } }
      }
    }
  });
}

// ---------- Render: IBT tabs ----------
function renderIBT() {
  const tabs = document.getElementById('ibt-tabs');
  const panels = document.getElementById('ibt-panels');
  tabs.innerHTML = IBT.map((m, i) => `<button class="tab-btn ${i === 0 ? 'active' : ''}" data-tab="${m.id}">${m.label}</button>`).join('');
  panels.innerHTML = IBT.map((m, i) => {
    const rows = m.blocks.map(b => `<tr><td>${b.block}</td><td>${b.range}</td><td class="num">${b.rate}</td><td>${b.note || '—'}</td></tr>`).join('');
    const srcLinks = m.srcs.map(s => `<a href="${s.url}" target="_blank" rel="noopener" style="color:var(--green-700);font-weight:700;text-decoration:none">${s.label}</a>`).join(' &nbsp;·&nbsp; ');
    return `<div class="tab-panel ${i === 0 ? 'active' : ''}" data-panel="${m.id}">
      <div class="chart-box">
        <div style="display:flex;align-items:baseline;gap:8px;flex-wrap:wrap">
          <strong style="font-size:1rem">${m.label}</strong>
          ${m.estimated ? '<span class="est-flag">2026/27 rates estimated</span>' : '<span class="est-flag" style="background:var(--green-100);color:var(--green-900)">Published</span>'}
          <span style="font-size:0.74rem;color:var(--ink-40);margin-left:auto">${m.unit}</span>
        </div>
        <p style="font-size:0.82rem;color:var(--ink-60);margin-top:6px">${m.caption}</p>
        <div class="table-wrap">
          <table>
            <thead><tr><th>Block</th><th>kWh range</th><th>Rate</th><th>Note</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
        <div class="meta-row">
          <div class="m-item"><div class="k">Fixed charge</div><div class="v">${m.fixed}</div></div>
          <div class="m-item"><div class="k">Free Basic Electricity</div><div class="v">${m.fbe}</div></div>
        </div>
        <p style="font-size:0.78rem;margin-top:14px">Sources: ${srcLinks}</p>
      </div>
    </div>`;
  }).join('');

  tabs.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    const id = btn.dataset.tab;
    tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === btn));
    panels.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p.dataset.panel === id));
  });
}

// ---------- Render: context chart + table ----------
function renderContext() {
  const ctx = document.getElementById('contextChart');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: HISTORY.map(h => h.fy),
      datasets: [
        { label: 'Eskom direct', data: HISTORY.map(h => h.eskom), backgroundColor: C.green900, borderRadius: 4, maxBarThickness: 34 },
        { label: 'Municipal', data: HISTORY.map(h => h.muni), backgroundColor: C.green500, borderRadius: 4, maxBarThickness: 34 }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top', labels: { boxWidth: 12, boxHeight: 12, usePointStyle: true } },
        tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + fmtPct(c.parsed.y) } }
      },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => v + '%' }, title: { display: true, text: 'Annual increase (%)' } } }
    }
  });

  const tb = document.querySelector('#context-table tbody');
  tb.innerHTML = HISTORY.map(h => `<tr>
    <td>${h.fy}</td>
    <td class="num">${fmtPct(h.eskom)}</td>
    <td class="num">${fmtPct(h.muni)}</td>
    <td><a href="${h.src}" target="_blank" rel="noopener">Source</a></td>
  </tr>`).join('');
}

// ---------- Render: sources ----------
function renderSources() {
  document.getElementById('sources-grid').innerHTML =
    SOURCES.map(s => `<a href="${s.url}" target="_blank" rel="noopener">${s.label}</a>`).join('');
}

// ---------- Interactive compound model ----------
// FY year labels for the projection
const FY_LABELS = ['2026/27', '2027/28', '2028/29', '2029/30', '2030/31', '2031/32', '2032/33', '2033/34', '2034/35', '2035/36'];

// Fixed increase paths (fractions)
const MUNI_FIXED = [0.0901, 0.0883];   // 2026/27, 2027/28
const ESKOM_FIXED = [0.0876, 0.0883];  // 2026/27, 2027/28

let modelChart = null;

function buildPath(start, fixed, fwdRate, horizon) {
  // returns array of bills of length horizon (after each annual increase)
  const bills = [];
  let bill = start;
  for (let y = 0; y < horizon; y++) {
    const r = y < fixed.length ? fixed[y] : fwdRate;
    bill = bill * (1 + r);
    bills.push(bill);
  }
  return bills;
}

function totalExtra(bills, start) {
  // cumulative extra spend over horizon vs flat baseline, annualised (x12 per year)
  let tot = 0;
  for (const b of bills) tot += (b - start) * 12;
  return tot;
}

function recompute() {
  const start = Math.max(0, parseFloat(document.getElementById('startBill').value) || 0);
  const fwd = (parseFloat(document.getElementById('fwdRateRange').value) || 0) / 100;
  const horizon = parseInt(document.getElementById('horizonRange').value, 10) || 5;

  const muni = buildPath(start, MUNI_FIXED, fwd, horizon);
  const eskom = buildPath(start, ESKOM_FIXED, fwd, horizon);
  const labels = FY_LABELS.slice(0, horizon);

  // KPIs driven by municipal-account household
  const finalBill = muni[muni.length - 1];
  const cumulative = start > 0 ? (finalBill / start - 1) * 100 : 0;
  const extraMonth = finalBill - start;
  const extraYear = extraMonth * 12;
  const totExtra = totalExtra(muni, start);

  document.getElementById('kpi-cumulative').textContent = fmtPct(cumulative, 1);
  document.getElementById('kpi-cumulative-sub').textContent = `Municipal account, over ${horizon} years`;
  document.getElementById('kpi-extra-month').textContent = fmtR(extraMonth);
  document.getElementById('kpi-extra-month-sub').textContent = `By ${labels[labels.length - 1]}, vs starting bill`;
  document.getElementById('kpi-extra-year').textContent = fmtR(extraYear);
  document.getElementById('kpi-total-extra').textContent = fmtR(totExtra);

  // include starting point (year 0) for the trajectory line
  const chartLabels = ['Start'].concat(labels);
  const muniLine = [start].concat(muni);
  const eskomLine = [start].concat(eskom);

  if (!modelChart) {
    modelChart = new Chart(document.getElementById('modelChart'), {
      type: 'line',
      data: {
        labels: chartLabels,
        datasets: [
          { label: 'Municipal-account household', data: muniLine, borderColor: C.green700, backgroundColor: 'rgba(46,125,50,0.08)', fill: true, tension: 0.25, pointRadius: 4, pointBackgroundColor: C.green700, borderWidth: 2.5 },
          { label: 'Eskom-direct household', data: eskomLine, borderColor: C.amber, backgroundColor: 'rgba(199,125,24,0.05)', fill: false, tension: 0.25, pointRadius: 4, pointBackgroundColor: C.amber, borderWidth: 2.5, borderDash: [6, 4] }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 14, boxHeight: 3, usePointStyle: false } },
          tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + fmtR(c.parsed.y) + '/month' } }
        },
        scales: {
          y: { beginAtZero: false, ticks: { callback: (v) => 'R' + v.toLocaleString('en-GB') }, title: { display: true, text: 'Monthly bill (ZAR)' } }
        }
      }
    });
  } else {
    modelChart.data.labels = chartLabels;
    modelChart.data.datasets[0].data = muniLine;
    modelChart.data.datasets[1].data = eskomLine;
    modelChart.update();
  }
}

// ---------- Wire up controls (two-way sync) ----------
function bindSync(rangeId, numId, outId, suffix, isInt) {
  const range = document.getElementById(rangeId);
  const num = numId ? document.getElementById(numId) : null;
  const out = outId ? document.getElementById(outId) : null;
  const update = (val) => {
    if (num) num.value = val;
    if (out) out.textContent = isInt ? `${val} ${suffix}` : `${parseFloat(val).toFixed(1)}${suffix}`;
    recompute();
  };
  range.addEventListener('input', () => update(range.value));
  if (num) num.addEventListener('input', () => {
    let v = parseFloat(num.value) || 0;
    // clamp to range bounds
    v = Math.min(parseFloat(range.max), Math.max(parseFloat(range.min), v));
    range.value = v;
    recompute();
  });
}

function initControls() {
  // start bill + consumption: range<->number
  bindSync('startBillRange', 'startBill', null, '', false);
  bindSync('consumptionRange', 'consumption', null, '', false);
  // forward rate + horizon: range<->readout
  bindSync('fwdRateRange', null, 'fwdRateOut', '%', false);
  bindSync('horizonRange', null, 'horizonOut', 'years', true);
}

// ---------- C&I customer view (Journey2Green blended-tariff engineering) ----------
// Fixed known grid path for years 1 and 2, then editable forward rate from year 3.
const CI_GRID_FIXED = [0.0901, 0.0883]; // 2026/27 municipal, 2027/28
const CI_OWNED_Y1 = 95;    // owned solar+BESS levelised cost, c/kWh year 1
const CI_OWNED_ESC = 0.02; // O&M-only escalation

const ROUTE_LABEL = {
  dci: 'Outright / DCI',
  btm: 'PPA behind-the-meter (BTM)',
  weps: 'PPA wheeled (WEPS)'
};

let ciChart = null;

const ciNum = (id) => parseFloat(document.getElementById(id).value) || 0;
function ciSelectedRoute() {
  const el = document.querySelector('input[name="ciRoute"]:checked');
  return el ? el.value : 'dci';
}

// c/kWh -> displayed c/kWh string with thousands separators
const fmtC = (n) => Math.round(n).toLocaleString('en-GB') + ' c/kWh';

function ciComputeSeries(inputs) {
  const { gridToday, forwardEsc, ppaY1, ppaEsc, wepsAdder, selfGen, horizon } = inputs;
  // Grid (do-nothing) trajectory
  const grid = [];
  let g = gridToday;
  for (let y = 0; y < horizon; y++) {
    const r = y < CI_GRID_FIXED.length ? CI_GRID_FIXED[y] : forwardEsc;
    g = g * (1 + r);
    grid.push(g);
  }
  // Self-gen cost paths
  const dciGen = [], btmGen = [], wepsGen = [];
  for (let y = 0; y < horizon; y++) {
    dciGen.push(CI_OWNED_Y1 * Math.pow(1 + CI_OWNED_ESC, y));
    btmGen.push(ppaY1 * Math.pow(1 + ppaEsc, y));
    wepsGen.push((ppaY1 + wepsAdder) * Math.pow(1 + ppaEsc, y));
  }
  const blend = (gen) => grid.map((gr, y) => selfGen * gen[y] + (1 - selfGen) * gr);
  return {
    grid,
    dci: blend(dciGen),
    btm: blend(btmGen),
    weps: blend(wepsGen)
  };
}

function ciRecompute() {
  const spend = Math.max(0, ciNum('ciSpend'));
  const gridToday = Math.max(1, ciNum('ciGridToday'));
  const selfGen = ciNum('ciSelfGenRange') / 100;
  const forwardEsc = ciNum('ciForwardEscRange') / 100;
  const ppaEsc = ciNum('ciPpaEscRange') / 100;
  const ppaY1 = ciNum('ciPpaTariff');
  const wepsAdder = ciNum('ciWepsAdder');
  const horizon = parseInt(document.getElementById('ciHorizonRange').value, 10) || 20;
  const route = ciSelectedRoute();

  // annual kWh from annual spend / grid tariff today (both in R, convert c->R)
  const annualKWh = spend / (gridToday / 100);

  const s = ciComputeSeries({ gridToday, forwardEsc, ppaY1, ppaEsc, wepsAdder, selfGen, horizon });
  const sel = s[route];

  // Annual saving (R) each year = (grid - solution) c/kWh, /100 to R, x annual kWh
  const annualSaving = sel.map((v, y) => (s.grid[y] - v) / 100 * annualKWh);
  const cumSaving = annualSaving.reduce((a, b) => a + b, 0);

  const gridY1 = s.grid[0];
  const solY1 = sel[0];
  const save1R = (gridY1 - solY1) / 100 * annualKWh;
  const save1Pct = gridY1 > 0 ? (gridY1 - solY1) / gridY1 * 100 : 0;
  const perKwhY1 = gridY1 - solY1;

  // KPIs
  document.getElementById('ci-kpi-today').textContent = fmtC(gridToday);
  document.getElementById('ci-kpi-y1').textContent = fmtC(solY1);
  document.getElementById('ci-kpi-y1-sub').textContent = ROUTE_LABEL[route];
  document.getElementById('ci-kpi-save1').textContent = fmtR(save1R);
  document.getElementById('ci-kpi-save1-sub').textContent = 'Year 1, ' + fmtPct(save1Pct, 1) + ' below grid';
  document.getElementById('ci-kpi-cum').textContent = fmtR(cumSaving);
  document.getElementById('ci-kpi-cum-sub').textContent = 'Undiscounted, over ' + horizon + ' years';
  document.getElementById('ci-kpi-share').textContent = Math.round(selfGen * 100) + '%';
  document.getElementById('ci-kpi-perkwh').textContent = Math.round(perKwhY1).toLocaleString('en-GB') + ' c/kWh';

  // Lead-with-the-answer banner + crossover
  let crossYear = -1;
  for (let y = 0; y < horizon; y++) { if (s.grid[y] > sel[y]) { crossYear = y + 1; break; } }
  const ans = document.getElementById('ciAnswer');
  if (crossYear === 1) {
    ans.textContent = 'The grid curve is already above the J2G ' + ROUTE_LABEL[route] +
      ' solution in year 1: a year 1 gap of ' + Math.round(perKwhY1).toLocaleString('en-GB') +
      ' c/kWh, saving ' + fmtR(save1R) + ' in the first year.';
  } else if (crossYear > 1) {
    ans.textContent = 'The grid curve crosses above the J2G ' + ROUTE_LABEL[route] +
      ' solution in year ' + crossYear + '.';
  } else {
    ans.textContent = 'On these inputs the grid curve does not cross above the J2G ' +
      ROUTE_LABEL[route] + ' solution within ' + horizon + ' years.';
  }

  // Chart
  const labels = [];
  for (let y = 1; y <= horizon; y++) labels.push('Y' + y);

  const dim = 'rgba(120,120,120,0.28)';
  const routeColor = { dci: C.green700, btm: C.green500, weps: '#00897B' };
  const datasets = [
    {
      label: 'Do-nothing, grid only',
      data: s.grid,
      borderColor: C.red,
      backgroundColor: 'rgba(178,58,46,0.05)',
      fill: false, tension: 0.2, pointRadius: 0, borderWidth: 2.5
    }
  ];
  ['dci', 'btm', 'weps'].forEach((r) => {
    const isSel = r === route;
    datasets.push({
      label: 'Solar plus BESS, ' + ROUTE_LABEL[r] + (isSel ? '' : ' (other route)'),
      data: s[r],
      borderColor: isSel ? routeColor[r] : dim,
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.2,
      pointRadius: 0,
      borderWidth: isSel ? 2.8 : 1.4,
      borderDash: isSel ? [] : [4, 4],
      order: isSel ? 0 : 2
    });
  });

  if (!ciChart) {
    ciChart = new Chart(document.getElementById('ciChart'), {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { position: 'top', labels: { boxWidth: 14, boxHeight: 3, usePointStyle: false, font: { size: 11 } } },
          tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + Math.round(c.parsed.y).toLocaleString('en-GB') + ' c/kWh' } }
        },
        scales: {
          y: { beginAtZero: false, ticks: { callback: (v) => v + ' c/kWh' }, title: { display: true, text: 'Blended tariff (c/kWh)' } },
          x: { title: { display: true, text: 'Projection year' } }
        }
      }
    });
  } else {
    ciChart.data.labels = labels;
    ciChart.data.datasets = datasets;
    ciChart.update();
  }

  // Table: show milestone years within horizon
  const milestones = [1, 5, 10, 15, 20, 25].filter((y) => y <= horizon);
  if (milestones[milestones.length - 1] !== horizon) milestones.push(horizon);
  const tb = document.querySelector('#ci-table tbody');
  tb.innerHTML = milestones.map((y) => {
    const i = y - 1;
    return '<tr>' +
      '<td>Year ' + y + '</td>' +
      '<td class="num">' + Math.round(s.grid[i]).toLocaleString('en-GB') + '</td>' +
      '<td class="num">' + Math.round(sel[i]).toLocaleString('en-GB') + '</td>' +
      '<td class="num delta-under">' + fmtR(annualSaving[i]) + '</td>' +
      '</tr>';
  }).join('');
}

function ciUpdateRouteInputs() {
  const route = ciSelectedRoute();
  const showPpa = route === 'btm' || route === 'weps';
  const showWeps = route === 'weps';
  document.querySelectorAll('.ci-ppa-only').forEach((el) => el.classList.toggle('show', showPpa));
  document.querySelectorAll('.ci-weps-only').forEach((el) => el.classList.toggle('show', showWeps));
}

function initCiControls() {
  // number+range pairs
  bindSync('ciSpendRange', 'ciSpend', null, '', false);
  bindSync('ciGridTodayRange', 'ciGridToday', null, '', false);
  bindSync('ciPpaTariffRange', 'ciPpaTariff', null, '', false);
  bindSync('ciWepsAdderRange', 'ciWepsAdder', null, '', false);
  // range+readout
  bindSync('ciSelfGenRange', null, 'ciSelfGenOut', '%', true);
  bindSync('ciForwardEscRange', null, 'ciForwardEscOut', '%', false);
  bindSync('ciPpaEscRange', null, 'ciPpaEscOut', '%', false);
  bindSync('ciHorizonRange', null, 'ciHorizonOut', 'years', true);

  // route radios
  document.getElementById('ciRouteGroup').addEventListener('change', () => {
    ciUpdateRouteInputs();
    ciRecompute();
  });

  // override recompute target: bindSync calls recompute(); we need ciRecompute for these inputs.
  // Instead, attach dedicated listeners so both models update independently.
  const ciIds = ['ciSpendRange', 'ciSpend', 'ciGridTodayRange', 'ciGridToday',
    'ciPpaTariffRange', 'ciPpaTariff', 'ciWepsAdderRange', 'ciWepsAdder',
    'ciSelfGenRange', 'ciForwardEscRange', 'ciPpaEscRange', 'ciHorizonRange'];
  ciIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', ciRecompute);
  });

  ciUpdateRouteInputs();
}

// ---------- Init ----------
document.addEventListener('DOMContentLoaded', () => {
  renderStatus();
  renderBenchmarkTable();
  renderBenchmarkChart();
  renderIBT();
  renderContext();
  renderSources();
  initControls();
  recompute();
  initCiControls();
  ciRecompute();
  initPdfExport();
});

// ---------- PDF export ----------
function initPdfExport() {
  const btn = document.getElementById('downloadPdf');
  if (!btn) return;
  btn.addEventListener('click', () => exportPdf(btn));
}

async function exportPdf(btn) {
  if (typeof html2canvas === 'undefined' || !window.jspdf) {
    alert('PDF libraries did not load. Please refresh and try again.');
    return;
  }
  const label = btn.querySelector('.pdf-btn-label');
  const original = label ? label.textContent : '';
  if (label) label.textContent = 'Preparing PDF, ';
  btn.disabled = true;
  document.body.classList.add('pdf-exporting');

  try {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const usableW = pageW - margin * 2;
    const usableH = pageH - margin * 2;

    // Collect fine-grained blocks so cards, charts and tables are never split.
    // For each top-level section we take its header, then each self-contained
    // child block (KPI card, chart, table, callout) as its own keep-together unit.
    const blocks = [];
    const sections = Array.from(document.querySelectorAll('main.wrap > section, header.site-header'));
    for (const sec of sections) {
      if (sec.tagName === 'HEADER') { blocks.push(sec); continue; }
      const head = sec.querySelector('.section-head');
      if (head) blocks.push(head);
      const note = sec.querySelector(':scope > .alert-note');
      if (note) blocks.push(note);
      const subheads = sec.querySelectorAll(':scope > .subhead');

      // Special-case the IBT schedules section: it is a tabbed panel where only
      // one metro is visible. Capture the tab bar plus the active panel's card,
      // and skip the generic sweeps (which would otherwise capture the hidden
      // panels and emit blank pages).
      const ibtPanelsHost = sec.querySelector('#ibt-panels');
      if (ibtPanelsHost) {
        subheads.forEach(b => { if (!blocks.includes(b)) blocks.push(b); });
        const tabsBar = sec.querySelector('#ibt-tabs');
        if (tabsBar) blocks.push(tabsBar);
        const activeCard = sec.querySelector('#ibt-panels .tab-panel.active .chart-box');
        if (activeCard) blocks.push(activeCard);
        continue;
      }

      // Individual KPI cards keep together on their own.
      const cards = sec.querySelectorAll('.kpi-card');
      const controls = sec.querySelectorAll('.controls');
      // Capture .chart-box only (it wraps .chart-holder, so do not add the holder too).
      const charts = sec.querySelectorAll('.chart-box');
      const tables = sec.querySelectorAll('.table-wrap');
      const callouts = sec.querySelectorAll('.ci-callout, .fixed-note');
      [...subheads, ...cards, ...controls, ...charts, ...tables, ...callouts].forEach(b => {
        if (b && !blocks.includes(b)) blocks.push(b);
      });
      // Fallback: if a section produced no recognised child blocks, take it whole.
      if (!head && !cards.length && !charts.length && !tables.length && !callouts.length && !controls.length) {
        blocks.push(sec);
      }
    }

    let cursorY = margin;
    let firstOnPage = true;

    for (const el of blocks) {
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });
      const imgW = usableW;
      const imgH = (canvas.height * imgW) / canvas.width;
      const imgData = canvas.toDataURL('image/jpeg', 0.92);

      if (imgH <= usableH) {
        // Fits on one page. Move to a new page if it will not fit in the space left.
        if (!firstOnPage && cursorY + imgH > pageH - margin) {
          pdf.addPage();
          cursorY = margin;
        }
        pdf.addImage(imgData, 'JPEG', margin, cursorY, imgW, imgH);
        cursorY += imgH + 5;
        firstOnPage = false;
      } else {
        // Block genuinely taller than one page (rare): give it a fresh page and
        // slice only that block. Start on a new page unless the page is empty.
        if (!firstOnPage) { pdf.addPage(); cursorY = margin; }
        const pageCanvasH = Math.floor((usableH * canvas.width) / imgW);
        let sy = 0;
        while (sy < canvas.height) {
          const sliceH = Math.min(pageCanvasH, canvas.height - sy);
          const slice = document.createElement('canvas');
          slice.width = canvas.width;
          slice.height = sliceH;
          const ctx = slice.getContext('2d');
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, slice.width, slice.height);
          ctx.drawImage(canvas, 0, sy, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
          const sliceData = slice.toDataURL('image/jpeg', 0.92);
          const sliceImgH = (sliceH * imgW) / canvas.width;
          pdf.addImage(sliceData, 'JPEG', margin, margin, imgW, sliceImgH);
          sy += sliceH;
          if (sy < canvas.height) { pdf.addPage(); }
          cursorY = margin + sliceImgH + 5;
        }
        firstOnPage = false;
      }
    }

    // Footer with source line and page numbers on every page.
    const total = pdf.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      pdf.setPage(i);
      pdf.setFontSize(7);
      pdf.setTextColor(120);
      pdf.text('Journey2Green, SA Electricity Tariff Tracker, Eskom and municipal, 2026/27. Source: NERSA decision, June 2026.', margin, pageH - 4);
      pdf.text(i + ' / ' + total, pageW - margin, pageH - 4, { align: 'right' });
    }

    pdf.save('J2G_SA_Electricity_Tariff_Tracker_Eskom_and_Municipal_2026-27.pdf');
  } catch (err) {
    console.error(err);
    alert('Sorry, the PDF could not be generated. Please try again.');
  } finally {
    document.body.classList.remove('pdf-exporting');
    if (label) label.textContent = original;
    btn.disabled = false;
  }
}
