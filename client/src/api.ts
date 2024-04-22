import axios from 'axios'

const instances = new Map()
const baseUrl = '/api/'

export default function getInstance(path: string) {
  let instance = instances.get(path)
  if (!instance) {
    instance = axios.create({
      baseURL: baseUrl + path
    })
    instances.set(path, instance)
  }
  return instance
}
