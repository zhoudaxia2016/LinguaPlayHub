const prefix = 'LanguaPlayHub-'

export default class Storage {
  name: string
  public data: any

  constructor(name, {readOnly, onSave}: {readOnly?: boolean, onSave?: Function} = {}) {
    this.name = prefix + name
    const json = localStorage.getItem(this.name)
    this.data = (json && json !== 'undefined') ? JSON.parse(json) : {}
    if (readOnly) {
      return
    }
    window.addEventListener('beforeunload', () => {
      let data = this.data
      if (onSave) {
        data = onSave(data)
      }
      localStorage.setItem(this.name, JSON.stringify(data))
    })
  }
}
