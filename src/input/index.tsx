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
    // React's onChange is JavaScript's onInput, so InputEvent
    ;(evt.nativeEvent as InputEvent).inputType !== `deleteContentBackward` &&
      ($input.nextElementSibling as HTMLElement | null)?.focus()
  }

  function handleKeyDown({ target, key }: KeyboardEvent) {
    const $input = target as HTMLInputElement
    let currentInput = $input
    const prevInput = currentInput.previousElementSibling as HTMLInputElement
    while (currentInput?.value === ``) {
      prevInput?.value === `` && prevInput?.focus()
      currentInput = prevInput
    }
    if (key === `Backspace`) {
      setTimeout(() => prevInput?.focus())
    }
    if (isNaN(+key)) return
  }

  function handleKeyUp({ key, target }: KeyboardEvent) {
    const $input = target as HTMLInputElement
    const nextInput = $input.nextElementSibling as HTMLInputElement | null
    if ($input.value.length === 1) {
      nextInput?.focus()
      if (!isNaN(+key) && nextInput) {
        nextInput.value = key
      }
    }
  }

  function handlePaste(evt: ClipboardEvent<HTMLFormElement>) {
    const $input = evt.target as HTMLInputElement
    const $inputsParent = $input.parentElement!
    const inputsLength = $inputsParent.childElementCount
    const clip = evt.clipboardData.getData(`text`)
    for (let i = 0; i < inputsLength; i++) {
      const data = clip[i]
      if (isNaN(+data)) {
        evt.preventDefault()
        continue
      }
      ;($inputsParent.children[i] as HTMLInputElement).value = data
      ;($inputsParent.lastElementChild as HTMLInputElement).focus()
    }
  }
  return (
    <form
      className='form-otp'
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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
