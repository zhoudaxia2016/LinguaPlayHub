import './index.less'
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import {Table, Progress, Space, Button, Input, Slider, Radio} from 'antd'
import {getVocab, deleteWord, updateWord} from './api'

interface IWord {
  id: number,
  kana: string,
  name: string,
  status: number,
  create_date: string,
  finish_date: string,
}

const textFilter = ({ setSelectedKeys, selectedKeys, confirm}) => (
  <div style={{ padding: 8 }}>
    <Input
      allowClear
      placeholder="输入假名|汉字"
      value={selectedKeys[0]}
      onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
      onPressEnter={() => confirm()}
      style={{ width: 130, marginRight: 10 }}
    />
    <Button
      type="primary"
      onClick={() => confirm()}
      size="small"
      style={{ width: 60 }}
    >
      确定
    </Button>
  </div>
)

const progressFilter = ({ setSelectedKeys, selectedKeys, confirm }) => {
    return (
    <div style={{padding: 8}}>
      <Slider
        min={1}
        max={100}
        onChange={val => setSelectedKeys([{...selectedKeys[0], num: val}]) && confirm()}
        style={{width: 130}} />
      <Button
        type="primary"
        onClick={() => confirm()}
        size="small"
        style={{width: 60}}
      >
        确定
      </Button>
      <Radio.Group style={{marginLeft: 8}} onChange={e => setSelectedKeys([{...selectedKeys[0], isGt: e.target.value === 0}])}>
        <Radio value={0}>&gt;</Radio>
        <Radio value={1}>&lt;</Radio>
      </Radio.Group>
    </div>
  )
}

const dateSorter = (a, b) => {
  return Number(new Date(a.create_date)) - Number(new Date(b.create_date))
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
      {
        title: '单词', dataIndex: 'name',
        filters: [
          {
            text: 'London',
            value: 'London',
          },
          {
            text: 'New York',
            value: 'New York',
          },
        ],
        filterDropdown: textFilter,
        onFilter: (value, {name, kana}) => name.includes(value) || kana.includes(value),
      },
      {title: '假名', dataIndex: 'kana'},
      {
        title: '认识程度', dataIndex: 'status',
        render: (_, {status}) => <Progress type="circle" percent={status} size={30} />,
        filterDropdown: progressFilter,
        onFilter: ({num = 0, isGt = true}: any, {status}) => isGt ? status >= num : status <= num,
        sorter: (a, b) => a.status - b.status,
      },
      {title: '创建日期', dataIndex: 'create_date', sorter: dateSorter},
      {title: '完成日期', dataIndex: 'finish_date', sorter: dateSorter},
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
