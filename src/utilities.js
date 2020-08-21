export const addCommas = (value) => value && value.replace(/\B(?=(\d{3})+(?!\d))/g, '-')

export const removeDefis = (value) => value.replace(/-/g, '')

export const checkIsValidNumber = (input) => {
  if ((input) < 0 || isNaN((input))) {
    return false
  }

  return true
}

/**
 * Remove prefix, commas and extra decimals from value
 */
export const cleanValue = (
  value,
  prefix
) => {
  const withoutPrefix = prefix ? value.replace(prefix, '') : value
  const withoutDefis = removeDefis(withoutPrefix)
  const parsed = parseAbbrValue(withoutDefis) || withoutDefis
  return (parsed)
}

/**
 * Format value with commas and prefix
 */
export const formatValue = (value, caret, key) => {
  if (caret) {
    if ((caret === 4 || caret === 8) && key !== 'Delete' && key !== 'Backspace') {
      caret++
    } else if ((caret === 3 || caret === 7) && key === 'Backspace') {
      value && value.splice(caret - 1, 1)
      caret--
    } else if ((caret === 3 || caret === 7) && key === 'Delete') {
      value && value.splice(caret, 1)
    }
  }

  // update caret for non-digits
  if (key && key.length === 1 && /[^0-9]/.test(key)) caret--

  value = value && value.join('')
    // убираем все кроме чисел
    .replace(/[^0-9]+/g, '')
    // limit input to 10 digits
    .replace(/(.{10}).*$/, '$1')
    // insert "-" between groups of digits
    .replace(/^(.?.?.?)(.?.?.?)(.?.?)(.?.?)$/, ' $1-$2-$3-$4')
    // remove exescive "-" at the end
    .replace(/-*$/, '')
  return value
}

/* ******************************** */
/**
 * Abbreviate number eg. 1000 = 1k
 *
 * Source: https://stackoverflow.com/a/9345181
 */
export const abbrValue = (value, _decimalPlaces = 10) => {
  if (value > 999) {
    let valueLength = ('' + value).length
    const p = Math.pow
    const d = p(10, _decimalPlaces)
    valueLength -= valueLength % 3

    return Math.round((value * d) / p(10, valueLength)) / d + ' kMGTPE'[valueLength / 3]
  }

  return String(value)
}

const abbrMap = { k: 1000, m: 1000000, b: 1000000000 }

/**
 * Parse a value with abbreviation e.g 1k = 1000
 */
export const parseAbbrValue = (value) => {
  const match = value.match(/(\d+(.\d+)?)([kmb])$/i)

  if (match) {
    const [, digits, , abbr] = match
    const multiplier = abbr ? abbrMap[abbr.toLowerCase()] : null
    if (digits && multiplier) {
      console.log('test digits', (digits) * multiplier)
      return (digits) * multiplier
    }
  }

  return undefined
}
