import './index.less'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Table, Progress, Space, Button} from 'antd'
import {getVocab, deleteWord, updateWord} from './api'

interface IWord {
  id: number,
  name: string,
  status: number,
  create_date: string,
  finish_date: string,
}

export default function Vocab() {
  const [data, setData] = useState<IWord[]>([])

  const fetchData = useCallback(() => {
    getVocab().then(data => setData(data))
  }, [])

  const columns = useMemo(() => {
    const handleDelete = async (id) => {
      await deleteWord(id)
      fetchData()
    }
    const handleUpdate = async (id, status) => {
      await updateWord(id, status + 10)
      fetchData()
    }
    return [
      {title: '单词', dataIndex: 'name'},
      {title: '认识程度', dataIndex: 'status', render: (_, {status}) => <Progress type="circle" percent={status} size={30} />},
      {title: '创建日期', dataIndex: 'create_date'},
      {title: '完成日期', dataIndex: 'finish_date'},
      {title: '操作', key: 'action', render: (
        (_, {id, status}) =>
          <Space>
            <Button type="primary" onClick={() => handleDelete(id)}>删除</Button>
            <Button type="primary" onClick={() => handleUpdate(id, status)}>up</Button>
          </Space>
      )},
    ]
  }, [])

  useEffect(() => {
    fetchData()
  }, [])
  return (
    <div className="vocab">
      <Table columns={columns} dataSource={data} rowKey="id"/>
    </div>
  )
}
