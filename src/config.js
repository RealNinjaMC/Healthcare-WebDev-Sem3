export const APP = {
  name: 'CarePoint',
  tagline: 'Book a doctor at CarePoint Clinic, pick a time that suits you and skip the waiting room queue.',

  entity: { singular: 'Appointment', plural: 'Appointments', table: 'appointments' },
  itemLabel: 'Department',

  useSupabase: false,
  supabaseUrl: '',
  supabaseAnonKey: '',

  currency: '₹',
  followUpDiscount: 0.5,

  items: [
    { id: 'general', name: 'General Medicine', doctor: 'Dr. Kavya Rao', price: 400, description: 'Fever, cold, BP and sugar checks, and anything you are not sure about.' },
    { id: 'paeds', name: 'Paediatrics', doctor: 'Dr. Arjun Menon', price: 500, description: 'Child health, vaccinations and growth check-ups up to 14 years.' },
    { id: 'derma', name: 'Dermatology', doctor: 'Dr. Sneha Iyer', price: 600, description: 'Skin, hair and nail problems, allergies and acne.' },
    { id: 'cardio', name: 'Cardiology', doctor: 'Dr. Rahul Shetty', price: 800, description: 'Chest pain, ECG review and heart check-ups.' },
  ],

  slots: ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '16:00', '16:30', '17:00', '17:30'],

  contact: { email: 'frontdesk@carepoint.example', phone: '+91 80 4123 5678', address: 'Yelahanka, Bengaluru' },
}
