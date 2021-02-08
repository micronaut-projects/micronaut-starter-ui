import {
  KEY_CODE_ALT,
  KEY_CODE_D,
  KEY_CODE_ENTER,
  KEY_CODE_P,
  KEY_CODE_QUESTION,
  KEY_CODE_SHIFT,
} from '../constants/keyCodes'

export const HELP_SHORTCUT = {
  label: 'Help',
  textValue: '?',
  keys: [KEY_CODE_SHIFT, KEY_CODE_QUESTION],
}

export const PREVIEW_SHORTCUT = {
  label: 'Preview',
  textValue: '⌥ + p',
  keys: [KEY_CODE_ALT, KEY_CODE_P],
}

export const DIFF_SHORTCUT = {
  label: 'Show Diff',
  textValue: '⌥ + d',
  keys: [KEY_CODE_ALT, KEY_CODE_D],
}

export const GENERATE_SHORTCUT = {
  label: 'Create a Zip',
  textValue: '⌥ + ⏎',
  keys: [KEY_CODE_ALT, KEY_CODE_ENTER],
}

export const SHORTCUT_REGISTRY = [
  HELP_SHORTCUT,
  PREVIEW_SHORTCUT,
  DIFF_SHORTCUT,
  GENERATE_SHORTCUT,
]
