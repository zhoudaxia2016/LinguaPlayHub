import React, {useCallback, useEffect, useRef, useState} from 'react'
import {Popover} from  'antd'
import {TooltipPlacement} from 'antd/es/tooltip'

interface IProps {
  children: React.ReactNode,
  renderContent: (close: () => void) => React.ReactNode,
  placement?: TooltipPlacement,
}

export default function PopConfirm({children, renderContent, placement = 'right'}: IProps) {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const close = useCallback(() => {
    setPopoverVisible(false)
  }, [])

  return (
    <Popover open={popoverVisible} content={renderContent(close)} placement={placement} trigger="click" onOpenChange={setPopoverVisible}>
      {children}
    </Popover>
  )
}
