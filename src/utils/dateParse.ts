export const parseDate = (date) => {
  const isUnixTimestamp = /^\d+$/.test(date)
  return isUnixTimestamp ? new Date(Number(date)) : new Date(date)
}
