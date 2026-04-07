type LexicalNode = {
  children?: LexicalNode[]
  text?: string
  type?: string
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

const renderLexicalNode = (node: LexicalNode): string => {
  if (node.type === 'linebreak') {
    return '<br>'
  }

  if (typeof node.text === 'string') {
    return escapeHtml(node.text)
  }

  const children = Array.isArray(node.children)
    ? node.children.map(renderLexicalNode).join('')
    : ''

  if (node.type === 'paragraph') {
    return children ? `<p>${children}</p>` : ''
  }

  return children
}

export const getDescriptionHtml = (
  descriptionHtml: unknown,
  descriptionRichText?: unknown
): string => {
  if (typeof descriptionHtml === 'string') {
    return descriptionHtml
  }

  if (
    descriptionRichText &&
    typeof descriptionRichText === 'object' &&
    'root' in descriptionRichText &&
    descriptionRichText.root &&
    typeof descriptionRichText.root === 'object' &&
    'children' in descriptionRichText.root &&
    Array.isArray(descriptionRichText.root.children)
  ) {
    return descriptionRichText.root.children.map(renderLexicalNode).join('')
  }

  return ''
}

