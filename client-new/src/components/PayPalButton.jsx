import { useEffect, useRef } from 'react'

export default function PayPalButton({ amount, description, email, onApprove }) {
  const containerRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    if (!window.paypal || !amount || !containerRef.current) return

    if (buttonRef.current) {
      buttonRef.current.close()
    }

    buttonRef.current = window.paypal.Buttons({
      createOrder: (data, actions) => {
        return actions.order.create({
          purchase_units: [{
            amount: { value: `${amount}` },
            description,
            payee: { email_address: email },
          }],
        })
      },
      onApprove: (data, actions) => {
        if (onApprove) onApprove()
        return actions.order.capture()
      },
    })

    buttonRef.current.render(containerRef.current)

    return () => {
      if (buttonRef.current) {
        buttonRef.current.close()
        buttonRef.current = null
      }
    }
  }, [amount, description, email, onApprove])

  return <div ref={containerRef} />
}
