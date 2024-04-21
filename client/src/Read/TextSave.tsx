import React, {useCallback} from 'react'
import {Form, Input, Button, Select, Tag} from 'antd'
import type { SelectProps } from 'antd';

type TagRender = SelectProps['tagRender'];

export default function TextSave({onSubmit, tags}) {
  const tagOptions = tags.map(({title}, i) => {
    return {value: i, label: title}
  })

  const tagRender: TagRender = useCallback((props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={tags[value].color}
        onMouseDown={onPreventMouseDown}
        closable={closable}
        onClose={onClose}
        style={{ marginInlineEnd: 4 }}
      >
        {label}
      </Tag>
    )
  }, [tags])

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      autoComplete="off"
    >
      <Form.Item<string>
        label="标题"
        name="title"
        rules={[{ required: true, message: '请输入文章标题！' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<string[]>
        label="标签"
        name="tags"
      >
        <Select
          mode="multiple"
          tagRender={tagRender}
          options={tagOptions}
        />
      </Form.Item>

      <Form.Item<string>
        label="描述"
        name="desc"
      >
        <Input/>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        确定
      </Button>
    </Form>
  )
}
