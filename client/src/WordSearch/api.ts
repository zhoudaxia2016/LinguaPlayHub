import createApi from '~/api'

const api = createApi('dict')

export async function updateStyle(id, style) {
  const res = await api.post('/style/update', {id, style})
  return res.data
}

export async function getDict(id) {
  const res = await api.get('/getdict', {
    params: {id}
  })
  return res.data
}
