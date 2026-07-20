const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '254700000000'

export default function WhatsAppButton({ message, children, className = '' }) {
  const text = encodeURIComponent(message || 'Hi 109 Tavern, I would like to make a booking!')
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-2.5 font-medium text-white transition hover:bg-green-500 ${className}`}
    >
      {children || 'Book on WhatsApp'}
    </a>
  )
}
