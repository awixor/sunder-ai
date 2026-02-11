export const getCaretPosition = (
  element: HTMLElement
): { start: number; end: number } => {
  const selection = window.getSelection()
  if (!selection || !selection.rangeCount) return { start: 0, end: 0 }

  const range = selection.getRangeAt(0)
  const preCaretRange = range.cloneRange()
  preCaretRange.selectNodeContents(element)
  preCaretRange.setEnd(range.endContainer, range.endOffset)

  const start = preCaretRange.toString().length
  const end = start + range.toString().length

  return { start, end }
}

export const setCaretPosition = (element: HTMLElement, position: number) => {
  const selection = window.getSelection()
  const range = document.createRange()

  let currentNode: Node | null = null
  let currentPos = 0
  let found = false

  // Helper to traverse text nodes
  const traverse = (node: Node) => {
    if (found) return

    if (node.nodeType === Node.TEXT_NODE) {
      const len = node.textContent?.length || 0
      if (currentPos + len >= position) {
        range.setStart(node, position - currentPos)
        range.collapse(true)
        found = true
        return
      }
      currentPos += len
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        traverse(node.childNodes[i])
        if (found) return
      }
    }
  }

  traverse(element)

  // Handling position beyond total length (e.g. at the end)
  if (!found) {
    range.selectNodeContents(element)
    range.collapse(false) // Collapse to end
  }

  selection?.removeAllRanges()
  selection?.addRange(range)
}
