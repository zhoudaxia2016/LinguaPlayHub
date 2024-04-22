export enum WORD_TAG {
  verb = 'VERB',
  adj = 'ADJ',
  adv = 'ADV',
  adp = 'ADP',
  aux = 'AUX',
  noun = 'NOUN',
}

export const wordColorMap = {
  [WORD_TAG.verb]: '#135D66',
  [WORD_TAG.adj]: '#C88EA7',
  [WORD_TAG.adv]: '#9BA4B5',
  [WORD_TAG.adp]: '#789461',
  [WORD_TAG.aux]: '#5C5470',
  [WORD_TAG.noun]: '#7A3E3E',
}

export const defaultWordColor = 'transparent'
