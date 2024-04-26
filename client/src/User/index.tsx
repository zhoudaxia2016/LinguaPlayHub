import './index.less'
import {Select, Descriptions} from "antd"
import React, {useCallback, useEffect, useState} from "react"
import useDicts from '~/hooks/useDicts'
import Storage from '~/helper/Storage'

const configStorage = new Storage('userConfig')

export default function User() {
  const [dicts] = useDicts()
  const [config, setConfig] = useState(configStorage.data || {})
  const handleSelectDict = useCallback((id) => {
    config.dictId = id
    setConfig({...config})
    configStorage.data = config
  }, [config])

  const dictOptions = dicts.map(({id, title}) => ({value: id, label: title}))
  const items = [
    {
      key: 0, label: '默认字典',
      children: <Select className="dict-select" style={{width: 200}} value={config.dictId}
                        options={dictOptions} onChange={handleSelectDict}/>
    }
  ]

  return (
    <div className="user-config">
      <Descriptions title="我的配置" items={items}/>
    </div>
  )
}
