import './App.css'
import otpInputDescSrc from './assets/otp-input_desc.png'
import { OTPInput } from './input'

function App() {
  return (
    <div>
      <img
        src={otpInputDescSrc}
        alt='word cloud forming the text otp-input in ASCII format with a green gradient effect'
      />
      <p
        style={{
          fontSize: `2rem`,
          letterSpacing: `-.052em`,
          fontWeight: 600,
        }}
      >
        An event-based, numbers-only, one-time password component with SMS
        autofill support using the WebOTP API; inspired an{' '}
        <a href='https://contigen.hashnode.dev/dont-entirely-trust-reacts-events'>
          article
        </a>{' '}
        that talks about React’s synthetic event system and event delegation.
      </p>
      <OTPInput />
    </div>
  )
}

export default App
