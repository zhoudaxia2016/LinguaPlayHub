import React, {useCallback, useState} from 'react'
import {Popover} from  'antd'
import {TooltipPlacement} from 'antd/es/tooltip'

interface IProps {
  children: React.ReactNode,
  renderContent: (close: () => void) => React.ReactNode,
  placement?: TooltipPlacement,
  onOpenChange?: (isOpen: boolean) => void, 
}

export default function PopConfirm({children, renderContent, onOpenChange, placement = 'right'}: IProps) {
  const [popoverVisible, setPopoverVisible] = useState(false)
  const close = useCallback(() => {
    setPopoverVisible(false)
  }, [])
  const handleOpenChange = useCallback((isOpen) => {
    onOpenChange?.(isOpen)
    setPopoverVisible(isOpen)
  }, [])

  return (
    <Popover open={popoverVisible} content={renderContent(close)} placement={placement} trigger="click" onOpenChange={handleOpenChange}>
      {children}
    </Popover>
  )
}
