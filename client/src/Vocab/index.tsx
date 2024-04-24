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
  const [count, setCount] = useState(0)
  const [finishCount, setFinishCount] = useState(0)

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
      {title: '假名', dataIndex: 'kana'},
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

  useEffect(() => {
    const count = data.length
    let finishCount = 0
    data.forEach(({ status }) => {
      finishCount += status === 100 ? 1 : 0
    })
    setCount(count)
    setFinishCount(finishCount)
  }, [data])

  return (
    <div className="vocab">
      <Table columns={columns} dataSource={data} rowKey="id" pagination={{pageSize: 12}}
             sticky
             summary={() =>
              <Table.Summary fixed="top">
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0}>
                    <span className="vocab-summary-item">总数: {count}</span>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>
                    <span className="vocab-summary-item">已掌握: {finishCount}</span>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
             }
      />
    </div>
  )
}
