# carepoint 🩺

lil clinic booking site we made for our 3rd sem web dev course

pick a doctor, pick a time, skip the waiting room :)

live here → https://carepoint-clinic-ruby.vercel.app

## how it works

- react 19 + vite, styled with tailwind 4
- no backend, all data is saved in your browser's localStorage:
  - `app:users` → accounts (name, email, hashed password)
  - `app:session` → who's logged in rn
  - `app:appointments` → all the bookings
- so it only stays on that browser, clearing site data wipes it
- passwords get hashed with sha-256 before saving, never stored plain
- form validation is hand written, checks phone, age, dates, sundays, past slots and double bookings
- tests use node's built in test runner (`npm test`)

## run it

```
npm install
npm run dev
```

thats it, have fun 💚
