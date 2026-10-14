# J2G SA Electricity Tariff Tracker, Eskom and municipal, 2026/27

Static dashboard by Journey2Green tracking NERSA-approved electricity tariff increases for 2026/27: Eskom direct (8.76%, effective 1 April 2026) and the municipal guideline (9.01%, effective 1 July 2026), with metro comparisons, inclining block tariff (IBT) schedules, a household compounding model and a commercial and industrial (C&I) solar plus battery energy storage system (BESS) blended-tariff view.

Live site: https://j2g-tariff-tracker.pplx.app

## Structure

- `index.html`, `styles.css`, `app.js`: the site
- `chart.umd.min.js` (Chart.js 4.4.3), `html2canvas.min.js` (1.4.1), `jspdf.umd.min.js` (2.5.1): bundled libraries, no CDN calls
- `j2g-logo.jpg`: brand asset
- `*.png`, `security_review_report.md`: QA screenshots and pre-publish security review

## Run locally

```
python3 -m http.server 8099
```

Then open http://localhost:8099.

## Contact

Journey2Green, [journey2.green](https://journey2.green), wessel@journey2.green
