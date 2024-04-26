const prefix = 'LanguaPlayHub-'

export default class Storage {
  name: string
  public data: any

  constructor(name: string, onSave?) {
    this.name = prefix + name
    const json = localStorage.getItem(this.name)
    this.data = json ? JSON.parse(json) : {}
    window.addEventListener('beforeunload', () => {
      const data = onSave?.(this.data)
      localStorage.setItem(this.name, JSON.stringify(data))
    })
  }
}
