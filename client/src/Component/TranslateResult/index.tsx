import React, {useEffect, useRef} from 'react'

const contentId = 'search-result-content'
const styleId = 'search-result-style'

function Content({html, style}) {
  const refContainer = useRef<HTMLDivElement | null>(null)
  const refShadowRoot = useRef<ShadowRoot | null>(null)

  useEffect(() => {
    const root = document.createElement('div')
    const shadowRoot = root.attachShadow({ mode: 'open' });
    refShadowRoot.current = shadowRoot
    refContainer.current?.appendChild(root)
  }, [])

  useEffect(() => {
    const oldStyleEle = refShadowRoot.current?.getElementById(styleId)
    if (oldStyleEle) {
      refShadowRoot.current?.removeChild(oldStyleEle)
    }
    const styleEle = document.createElement('style')
    styleEle.setAttribute('id', styleId)
    styleEle.innerHTML = style
    refShadowRoot.current?.appendChild(styleEle)
  }, [style])

  useEffect(() => {
    if (!refShadowRoot.current) {
      return
    }
    const oldContentEle = refShadowRoot.current.getElementById(contentId)
    if (oldContentEle) {
      refShadowRoot.current.removeChild(oldContentEle)
    }
    const contentEle = document.createElement('div')
    contentEle.setAttribute('id', contentId)
    contentEle.innerHTML = html || ''
    refShadowRoot.current.appendChild(contentEle)
  }, [html])

  return <div ref={refContainer} className="search-result-container"></div>
}

export default React.memo(Content)
