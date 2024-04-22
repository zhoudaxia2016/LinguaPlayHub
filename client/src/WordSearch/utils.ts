export function queryWord(word, dictList) {
  return fetch('/api/dict/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({word, dictList})
  }).then(res => res.json())
}
