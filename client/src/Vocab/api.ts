import createApi from '~/api'

const api = createApi('vocab')

export async function addWord(name, kana?) {
  const res = await api.post('/add', {name, kana})
  return res.data
}

export async function updateWord(id, status) {
  const res = await api.post('/update', {id, status})
  return res.data
}

export async function deleteWord(id) {
  const res = await api.post('/delete', {id})
  return res.data
}

export async function searchWord(name, iskana?) {
  const res = await api.get('/search', {params: {name, iskana}})
  return res.data
}

export async function getVocab() {
  const res = await api.get('/all')
  return res.data
}

