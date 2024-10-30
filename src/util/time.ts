const units = {
  year: 24 * 60 * 60 * 1000 * 365,
  month: (24 * 60 * 60 * 1000 * 365) / 12,
  day: 24 * 60 * 60 * 1000,
  hour: 60 * 60 * 1000,
  minute: 60 * 1000,
  second: 1000,
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" })

export const getRelativeTime = (d1: Date, d2: Date = new Date()) => {
  const elapsed = d1.getTime() - d2.getTime()

  // "Math.abs" accounts for both "past" & "future" scenarios
  for (let [u, val] of Object.entries(units))
    if (Math.abs(elapsed) > val || u === "second")
      return rtf.format(
        Math.round(elapsed / val),
        u as Intl.RelativeTimeFormatUnit,
      )

  return ""
}
