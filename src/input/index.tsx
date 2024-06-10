import {
  type FormEvent,
  type KeyboardEvent,
  type ClipboardEvent,
  useRef,
  useEffect,
} from 'react'
import './index.css'

export function OTPInput() {
  const INPUTS_LENGTH = Array(4).fill(1)

  function handleSubmit(evt: FormEvent) {
    evt.preventDefault()
    const $form = evt.target
    new FormData($form as HTMLFormElement)
    alert(`Submitted!`)
  }

  function handleChange({ nativeEvent, target }: FormEvent) {
    const $input = target as HTMLInputElement
    // React's onChange is JavaScript's onInput, so InputEvent
    ;(nativeEvent as InputEvent).inputType !== `deleteContentBackward` &&
      ($input.nextElementSibling as HTMLElement | null)?.focus()
  }

  function handleKeyDown(evt: KeyboardEvent) {
    const key = evt.key
    if (!evt.ctrlKey && key.length === 1 && isNaN(+key)) evt.preventDefault()
    const $input = evt.target as HTMLInputElement
    const prevInput = $input.previousElementSibling as HTMLInputElement
    {
      let currentInput = $input
      // hacky?
      while (key !== `Tab` && currentInput?.value === ``) {
        const prevInput =
          currentInput.previousElementSibling as HTMLInputElement
        prevInput?.value === `` && prevInput?.focus()
        currentInput = prevInput
      }
    }
    if (key === `Backspace`) {
      evt.preventDefault()
      $input.value = ``
      setTimeout(() => prevInput?.focus())
    }
  }

  function handleKeyUp({ key, target }: KeyboardEvent) {
    const $input = target as HTMLInputElement
    const nextInput = $input.nextElementSibling as HTMLInputElement | null
    if ($input.value.length === 1 && key !== `Backspace`) {
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
      // eslint-disable-next-line no-extra-semi
      ;($inputsParent.children[i] as HTMLInputElement).value = data
      ;($inputsParent.lastElementChild as HTMLInputElement).focus()
    }
  }

  const formRef = useRef<HTMLFormElement>(null)

  function autofill() {
    const $form = formRef.current
    if (!$form) return
    if (`OTPCredential` in window) {
      const abortController = new AbortController()
      $form.onsubmit = abortController.abort
      navigator.credentials
        .get({
          otp: { transport: [`sms`] },
          signal: abortController.signal,
        })
        .then(({ code }) => {
          alert(code)
          const inputsLength = $form.childElementCount
          for (let i = 0; i < inputsLength; i++) {
            const data = code[i]
            if (isNaN(+data)) {
              continue
            }
            // eslint-disable-next-line no-extra-semi
            ;($form.children[i] as HTMLInputElement).value = data
            ;($form.lastElementChild as HTMLInputElement).focus()
            $form.submit()
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
  useEffect(() => {
    window.addEventListener(`load`, autofill)
    return () => window.removeEventListener(`load`, autofill)
  }, [])
  return (
    <form
      className='form-otp'
      onSubmit={handleSubmit}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onPaste={handlePaste}
      ref={formRef}
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
            autoComplete='one-time-code'
          />
        ))}
      </div>
    </form>
  )
}
