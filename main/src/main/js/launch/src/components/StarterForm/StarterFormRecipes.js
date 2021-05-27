// import _ from 'lodash'
// import { useEffect } from 'react'

// export const defaultsSpreader = (defaults) => (key, value, touched) => {
//   const spread = {
//     [key]: value.replace(/[^a-z\d.\-_]/gi, ''),
//   }
//   const recipe = _.get(defaults, [key, value])
//   if (recipe) {
//     Object.keys(recipe).forEach((aKey) => {
//       if (touched[aKey] !== true) {
//         spread[aKey] = recipe[aKey]
//       }
//     })
//   }
//   touched[key] = true
//   return spread
// }

// export const useInitialChangeWatcher = (
//   key,
//   value,
//   opts,
//   defaults,
//   handleChange,
//   optKey
// ) => {
//   useEffect(() => {
//     if (!value || !opts.find((opt) => opt.value === value)) {
//       const altOptKey = optKey || key
//       handleChange({
//         target: { name: key, value: defaults[altOptKey] },
//       })
//     }
//   }, [key, optKey, value, opts, defaults, handleChange])
// }
