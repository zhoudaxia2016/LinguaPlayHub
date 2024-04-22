import createApi from '~/api'

const api = createApi('text')

export async function getText(id?) {
  const res = await api.get('/detail', {
    params: {id}
  })
  return res.data
}

export async function getTags() {
  const res = await api.get('/tag')
  return res.data
}

export async function deleteText(id) {
  const res = await api.post('/delete', {
    id
  })
  return res.data
}

export async function parseText(text: string) {
  const res = await api.post('/parse', {
    text
  })
  return res.data
}

export async function saveText(text) {
  const res = await api.post('/save', text)
  return res.data
}
