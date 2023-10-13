const invited_placeholder = {
  name: 'JORMA',
  wins: 0,
  tie: 0,
  loss: 0,
  games: 0,
  points: 0,
}

export const generatePlaceholders = (maxPlayers, acceptedCount) => {
  const placeholdersCount = maxPlayers - acceptedCount
  return new Array(placeholdersCount).fill(invited_placeholder)
}
