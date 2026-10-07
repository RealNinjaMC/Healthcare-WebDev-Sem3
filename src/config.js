export const APP = {
  name: 'SlotBook',
  tagline: 'Book a service, pick a date and see the full price before you confirm.',

  entity: { singular: 'Booking', plural: 'Bookings', table: 'bookings' },
  itemLabel: 'Service',

  useSupabase: false,
  supabaseUrl: '',
  supabaseAnonKey: '',

  currency: '₹',
  taxRate: 0.18,

  items: [
    { id: 'consult', name: 'Consultation', price: 499, description: '30-minute one-on-one session with an expert.' },
    { id: 'workshop', name: 'Workshop Seat', price: 999, description: 'Hands-on group workshop with all materials included.' },
    { id: 'studio', name: 'Studio Session', price: 1499, description: 'Two hours of fully equipped studio time.' },
    { id: 'premium', name: 'Premium Package', price: 2999, description: 'Priority slot, extended time and a follow-up call.' },
  ],

  team: [
    { name: 'Member One', role: 'Frontend & UI' },
    { name: 'Member Two', role: 'Forms & Validation' },
    { name: 'Member Three', role: 'Data & CRUD' },
    { name: 'Member Four', role: 'Docs & Presentation' },
  ],

  contact: { email: 'hello@slotbook.example', phone: '+91 98765 43210', address: 'Bengaluru, India' },
}
