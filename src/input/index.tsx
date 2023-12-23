import type { FormEvent, KeyboardEvent } from 'react'
import './index.css'

export function OTPInput() {
  const inputAmounts = Array(4).fill(1)

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault()
    const $form = evt.target
    new FormData($form as HTMLFormElement)
  }

  function handleChange(evt: FormEvent) {
    const $input = evt.target as HTMLInputElement
    // React's onChange is JavaScript's onInput, so InputEvent
    ;(evt.nativeEvent as InputEvent).inputType !== `deleteContentBackward` &&
      ($input.nextElementSibling as HTMLElement)?.focus()
  }

  function handleKeyDown(evt: KeyboardEvent) {
    const $input = evt.target as HTMLInputElement
    let currentInput = $input
    console.log(evt)
    while (currentInput?.value === ``) {
      const prevInput = currentInput.previousElementSibling as HTMLInputElement
      prevInput?.value === `` && prevInput?.focus()
      currentInput = prevInput
    }
    if (isNaN(+evt.key) && evt.key !== `Backspace`) evt.preventDefault()
    if (evt.key === `Backspace`) {
      const prevInput = $input.previousElementSibling as HTMLElement
      setTimeout(() => prevInput?.focus())
    }
  }
  return (
    <form
      className='form-otp'
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
    >
      <div className='form-otp__box'>
        {inputAmounts.map((_, idx, arr) => (
          <input
            key={crypto.randomUUID()}
            type='text'
            pattern='[0-9]'
            maxLength={1}
            name={`input${idx}`}
            className='form-otp__input'
            required
            placeholder='･'
            inputMode='numeric'
            enterKeyHint={idx === arr.length - 1 ? `done` : `next`}
          />
        ))}
        <br />
        <br />
        <button type='submit'>submit</button>
      </div>
    </form>
  )
}
