export const parseDate = (date: string | number): Date => {
  const isUnixTimestamp = /^\d+$/.test(String(date))
  return isUnixTimestamp ? new Date(Number(date)) : new Date(date)
}
