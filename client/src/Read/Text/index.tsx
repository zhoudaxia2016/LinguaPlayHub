import './index.less'
import React from 'react'
import Token, {IToken} from './Token'

export interface IProps {
  tokens: IToken[]
}

function Section({tokens}: IProps) {
  return (
    <div className="sentence-section">
      {tokens.map((token, i) => (
        <Token key={i} token={token}/>
      ))}
    </div>
  )
}

export default React.memo(Section)
