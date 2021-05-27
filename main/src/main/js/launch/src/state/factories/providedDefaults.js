import { parseAndConsumeQuery } from '../../helpers/Routing'
import { getStorageValue } from '../../hooks/useLocalStorage'

export const initialValueGenerator = (key, fallback, isReferral) =>
  getStorageValue(key, fallback, isReferral)

export const providedDefaults = () => parseAndConsumeQuery()
