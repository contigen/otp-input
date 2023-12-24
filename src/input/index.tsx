import type { FormEvent, KeyboardEvent, ClipboardEvent } from 'react'
import './index.css'

export function OTPInput() {
  const INPUTS_LENGTH = Array(4).fill(1)

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault()
    const $form = evt.target
    new FormData($form as HTMLFormElement)
  }

  function handleChange(evt: FormEvent) {
    const $input = evt.target as HTMLInputElement
    console.log(evt)
    // React's onChange is JavaScript's onInput, so InputEvent
    ;(evt.nativeEvent as InputEvent).inputType !== `deleteContentBackward` &&
      ($input.nextElementSibling as HTMLElement)?.focus()
  }

  function handleKeyDown({ target, key }: KeyboardEvent) {
    const $input = target as HTMLInputElement
    let currentInput = $input
    console.log(`keydown`, target)
    while (currentInput?.value === ``) {
      const prevInput = currentInput.previousElementSibling as HTMLInputElement
      prevInput?.value === `` && prevInput?.focus()
      currentInput = prevInput
    }
    if (key === `Backspace`) {
      const prevInput = $input.previousElementSibling as HTMLElement
      setTimeout(() => prevInput?.focus())
    }
    if (isNaN(+key)) return
  }

  function handlePaste({
    target,
    clipboardData,
  }: ClipboardEvent<HTMLFormElement>) {
    const $input = target as HTMLInputElement
    const $inputsParent = $input.parentElement!
    const inputsLength = $inputsParent.childElementCount
    const clip = clipboardData.getData(`text`)
    for (let i = 0; i < inputsLength; i++) {
      const data = clip[i]
      if (isNaN(+data)) continue
      ;($inputsParent.children[i] as HTMLInputElement).value = data
    }
  }

  return (
    <form
      className='form-otp'
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
    >
      <div className='form-otp__box'>
        {INPUTS_LENGTH.map((_, idx, arr) => (
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
      </div>
      <br />
      <br />
      <button type='submit'>submit</button>
    </form>
  )
}
