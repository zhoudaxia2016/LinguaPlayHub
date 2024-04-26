import {useCallback, useEffect, useState} from "react"

export default function useDicts() {
  const [dicts, setDicts] = useState<any[]>([])
  const fetchDicts = useCallback(() => {
    fetch('/api/dict/all').then(async (res) => {
      const json = await res.json()
      setDicts(json)
    })
  }, [])
  useEffect(() => {
    fetchDicts()
  }, [])

  return [dicts, fetchDicts] as const
}
