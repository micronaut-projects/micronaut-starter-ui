import {
  KEY_CODE_A,
  KEY_CODE_ALT,
  KEY_CODE_B,
  KEY_CODE_D,
  KEY_CODE_ENTER,
  KEY_CODE_J,
  KEY_CODE_L,
  KEY_CODE_P,
  KEY_CODE_QUESTION,
  KEY_CODE_SHIFT,
  KEY_CODE_T,
  KEY_CODE_V,
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

export const NEXT_VERSION_SHORTCUT = {
  label: 'Toggle to the Next Micronaut Version',
  textValue: '⌥ + v',
  keys: [KEY_CODE_ALT, KEY_CODE_V],
}

export const NEXT_APP_TYPE_SHORTCUT = {
  label: 'Toggle to the Next Application Type',
  textValue: '⌥ + a',
  keys: [KEY_CODE_ALT, KEY_CODE_A],
}

export const NEXT_JDK_SHORTCUT = {
  label: 'Toggle to the Next Java Version',
  textValue: '⌥ + j',
  keys: [KEY_CODE_ALT, KEY_CODE_J],
}

export const NEXT_LANG_SHORTCUT = {
  label: 'Toggle to the Next Language',
  textValue: '⌥ + l',
  keys: [KEY_CODE_ALT, KEY_CODE_L],
}

export const NEXT_BUILD_SHORTCUT = {
  label: 'Toggle to the Next Build',
  textValue: '⌥ + b',
  keys: [KEY_CODE_ALT, KEY_CODE_B],
}

export const NEXT_TEST_SHORTCUT = {
  label: 'Toggle to the Next Test Frameword',
  textValue: '⌥ + t',
  keys: [KEY_CODE_ALT, KEY_CODE_T],
}

export const SHORTCUT_REGISTRY = [
  HELP_SHORTCUT,
  PREVIEW_SHORTCUT,
  DIFF_SHORTCUT,
  GENERATE_SHORTCUT,
  NEXT_VERSION_SHORTCUT,
  NEXT_APP_TYPE_SHORTCUT,
  NEXT_JDK_SHORTCUT,
  NEXT_LANG_SHORTCUT,
  NEXT_BUILD_SHORTCUT,
  NEXT_TEST_SHORTCUT,
]
