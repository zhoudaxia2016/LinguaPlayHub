import React, {useCallback, useContext, useEffect, useMemo} from 'react'
import {Form, Input, Button, Select, Tag} from 'antd'
import type { SelectProps } from 'antd'
import {ReadContext} from './'
import {useForm} from 'antd/es/form/Form';

type TagRender = SelectProps['tagRender'];

export default function TextSave({onSubmit}) {
  const {tags, text} = useContext(ReadContext)
  const tagOptions = tags.map(({title, id}) => {
    return {value: id, label: title}
  })

  const [form] = useForm()

  const tagColorMap: Map<number, string> = useMemo(() => {
    return new Map(tags.map(tag => ([tag.id, tag.color])))
  }, [tags])

  useEffect(() => {
    form.setFieldsValue({ title: text.title, tags: text.tags, desc: text.desc })
  }, [text])

  const tagRender: TagRender = useCallback((props) => {
    const { label, value, closable, onClose } = props;
    const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        color={tagColorMap.get(value)}
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
      form={form}
      name="basic"
      labelCol={{ span: 3 }}
      style={{ maxWidth: 800, minWidth: 500 }}
      initialValues={{ title: text.title, tags: text.tags, desc: text.desc }}
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

      <Form.Item wrapperCol={{ offset: 3 }}>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Form.Item>
    </Form>
  )
}
