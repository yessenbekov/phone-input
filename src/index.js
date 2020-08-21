import React, { useEffect, useState, useRef } from 'react'
import './index.css'
import { Input } from 'semantic-ui-react'

import { checkIsValidNumber, cleanValue, formatValue } from './utilities'

export default function PhoneInput ({ error, id, name, prefix, onChange, value, ...other }) {
  // to distinguish <del> from <backspace>
  const [key, setKey] = useState(undefined)
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef(null)
  const phoneCode = prefix || '+7'
  const _defaultValue = value ? formatValue((value.split('')), value.length, '') : ''
  const defNumber = `${phoneCode}${_defaultValue}`

  const [stateValue, setStateValue] = useState(defNumber)

  function formatPhone (event) {
    const {
      target: { selectionStart, value }
    } = event

    const valueOnly = cleanValue(value, phoneCode)

    if (!valueOnly) {
      onChange && onChange(null)
      return setStateValue('')
    }

    if (checkIsValidNumber(valueOnly)) {
      const val2 = valueOnly.split('')
      const formattedValue = formatValue(val2, selectionStart, key)
      const fullNumber = `${phoneCode}${formattedValue}`
      if (selectionStart) {
        const cursor = selectionStart + (formattedValue.length - value.length) || 1
        setCursor(cursor)
      }
      setStateValue(fullNumber)
    }

    onChange && onChange(valueOnly)
  }

  useEffect(() => {
    if (inputRef && inputRef.current) {
      inputRef.current.setSelectionRange(cursor, cursor)
    }
  }, [cursor, inputRef, stateValue])

  return (
    <Input
      error={error}
      input={
        <input
          id={id}
          name={name}
          onChange={formatPhone}
          onKeyDown={event => setKey(event.key)}
          value={stateValue}
          maxLength='16'
          ref={inputRef}
          {...other}
        />
      }
    />

  )
}
