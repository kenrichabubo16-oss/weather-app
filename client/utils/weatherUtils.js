export function degToCompass(deg = 0) {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

export function weatherToEmoji(main = "", id = 0) {
  const m = (main || "").toLowerCase();
  if (m.includes("thunder")) return "⛈️";
  if (m.includes("drizzle")) return "🌦️";
  if (m.includes("rain")) return "🌧️";
  if (m.includes("snow")) return "❄️";
  if (m.includes("cloud")) return "☁️";
  if (m.includes("clear")) return "☀️";
  if (id >= 700 && id < 800) return "🌫️";
  return "⛅";
}

export function formatHour(dtSec, tzOffsetSec = 0) {
  const d = new Date((dtSec + tzOffsetSec) * 1000);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true }).replace(" ", "");
}

export function formatWeekday(dtSec, tzOffsetSec = 0) {
  const d = new Date((dtSec + tzOffsetSec) * 1000);
  return d.toLocaleDateString("en-US", { weekday: "long" });
}

export function formatShortDate(dtSec, tzOffsetSec = 0) {
  const d = new Date((dtSec + tzOffsetSec) * 1000);
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short" });
}

export function sameYMD(a, b, tzOffsetSec = 0) {
  const da = new Date((a + tzOffsetSec) * 1000);
  const db = new Date((b + tzOffsetSec) * 1000);
  return (
    da.getUTCFullYear() === db.getUTCFullYear() &&
    da.getUTCMonth() === db.getUTCMonth() &&
    da.getUTCDate() === db.getUTCDate()
  );
}

export function buildDailyFromForecastList(list, tzOffsetSec = 0) {
  const days = [];
  for (const item of list) {
    const dt = item.dt;
    let bucket = days.find((d) => sameYMD(d._dt, dt, tzOffsetSec));
    if (!bucket) {
      bucket = { _dt: dt, items: [] };
      days.push(bucket);
    }
    bucket.items.push(item);
  }

  return days.slice(0, 7).map((d, idx) => {
    const temps = d.items.map((x) => x.main?.temp).filter((t) => typeof t === "number");
    const low = Math.round(Math.min(...temps));
    const high = Math.round(Math.max(...temps));

    const midday =
      d.items.find((x) => new Date((x.dt + tzOffsetSec) * 1000).getUTCHours() === 12) || d.items[0];

    const w = midday.weather?.[0] || {};
    const dayLabel = idx === 0 ? "Today" : idx === 1 ? "Tomorrow" : formatWeekday(d._dt, tzOffsetSec);

    return {
      day: dayLabel,
      date: formatShortDate(d._dt, tzOffsetSec),
      temp: Math.round((low + high) / 2),
      icon: weatherToEmoji(w.main, w.id),
      low,
      high,
      pop: Math.round(((midday.pop ?? 0) * 100)),
    };
  });
}

export function buildTempGraphFromForecastList(list, tzOffsetSec = 0) {
  const pickHour = (targetHour) => {
    const found = list.find((x) => new Date((x.dt + tzOffsetSec) * 1000).getUTCHours() === targetHour);
    return found?.main?.temp;
  };

  const fallback = list[0]?.main?.temp ?? 0;

  return [
    { time: "Morning", temp: Math.round(pickHour(6) ?? fallback) },
    { time: "Afternoon", temp: Math.round(pickHour(12) ?? fallback) },
    { time: "Evening", temp: Math.round(pickHour(18) ?? fallback) },
    { time: "Night", temp: Math.round(pickHour(0) ?? fallback) },
  ];
}
