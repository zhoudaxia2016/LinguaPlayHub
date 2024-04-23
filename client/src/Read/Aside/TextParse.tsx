import React, {useCallback} from 'react'
import {Form, Input, Button, Space} from 'antd'
import {useForm} from 'antd/es/form/Form';
const { TextArea } = Input

export default function TextSave({onSubmit}) {
  const [form] = useForm()
  const handlePaste = useCallback(async () => {
    const text = await navigator.clipboard.readText()
    form.setFieldsValue({text})
  }, [form])

  return (
    <Form
      form={form}
      name="textParse"
      labelCol={{ span: 3 }}
      style={{ maxWidth: 800, minWidth: 500 }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item<string>
        name="text"
        rules={[{ required: true, message: '请输入要解析的文本！' }]}
      >
        <TextArea size="large" allowClear rows={10}></TextArea>
      </Form.Item>
      <Space>
        <Button type="primary" onClick={handlePaste}>粘贴</Button>
        <Button type="primary" htmlType="submit">确定</Button>
      </Space>
    </Form>
  )
}
