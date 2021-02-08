const DEFAULT_HEADER_HEIGHT = 100

const KEY_PAGE_UP = 33
const KEY_PAGE_DOWN = 34
const KEY_LEFT = 37
const KEY_UP = 38
const KEY_RIGHT = 39
const KEY_DOWN = 40

const FN_NEXT_PAGE = (node, { headerHeight = DEFAULT_HEADER_HEIGHT }) => {
  node.scrollTop += node.clientHeight - headerHeight
}

const FN_PREV_PAGE = (node, { headerHeight = DEFAULT_HEADER_HEIGHT }) => {
  node.scrollTop -= node.clientHeight - headerHeight
}

const FN_JUMP_TO_NEXT_GROUP = (
  node,
  { sectionKey = 'modal-group', headerHeight = DEFAULT_HEADER_HEIGHT }
) => {
  const groups = [...node.getElementsByClassName(sectionKey)]
  if (!groups.length) {
    return (node.scrollTop += headerHeight)
  }
  const next = groups.filter((a) => a.offsetTop > node.scrollTop + headerHeight)
  if (!next.length) return
  const group = next[0]
  const scrollTop = group.offsetTop
  node.scrollTop = scrollTop - headerHeight
}

const FN_JUMP_TO_PREV_GROUP = (
  node,
  { sectionKey = 'modal-group', headerHeight = DEFAULT_HEADER_HEIGHT }
) => {
  const groups = [...node.getElementsByClassName(sectionKey)]
  if (!groups.length) {
    node.scrollTop -= headerHeight
  }
  const next = groups.filter((a) => a.offsetTop < node.scrollTop + headerHeight)
  if (!next.length) {
    return
  }
  const group = next[next.length - 1]
  const scrollTop = group.offsetTop
  node.scrollTop = scrollTop - headerHeight
}

export class ModalKeyboardHandler {
  constructor(
    config = {
      sectionKey: 'modal-group',
      headerHeight: DEFAULT_HEADER_HEIGHT,
      hasHeader: true,
    }
  ) {
    if (!config instanceof Object) {
      throw Error('ModalKeyboardHandler must be created with a config object')
    }
    this.config = config
    if (this.config.hasHeader === false) {
      this.confin.headerHeight = 0
    }
  }

  getAction(keyCode) {
    switch (keyCode) {
      case KEY_UP:
        return -50
      case KEY_DOWN:
        return 50
      case KEY_RIGHT:
        return FN_JUMP_TO_NEXT_GROUP
      case KEY_LEFT:
        return FN_JUMP_TO_PREV_GROUP
      case KEY_PAGE_UP:
        return FN_PREV_PAGE
      case KEY_PAGE_DOWN:
        return FN_NEXT_PAGE
      default:
        return false
    }
  }

  handler = (target) => (e) => {
    const { keyCode } = e
    // console.log({ keyCode });
    const nodes = target.getElementsByClassName('modal-content')
    if (!nodes.length) {
      return
    }
    const node = nodes[0]
    let action = this.getAction(keyCode)
    if (!action) {
      return
    }
    if (action instanceof Function) {
      action(node, this.config)
    } else {
      node.scrollTop += action
    }
  }

  onOpenEnd = (node) => node.addEventListener('keydown', this.handler(node))
  onCloseEnd = (node) => {
    node.removeEventListener('keydown', this.handler)
  }
}
