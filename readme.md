# Supabase Simple CRUD Demo with Auth

Written in Vanilla JS

## Demo

[https://supabase.nickschnee.ch/](supabase.nickschnee.ch)

## Installation

1) If you want to make this demo work in your own environment, you have to create a new file called `supabase.js` in the folder `js`

2) Add the following lines and your personal keys to the `js/supabase.js` you just created:

```
const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-public-anon-key'
const supa = supabase.createClient(supabaseUrl, supabaseKey)

export { supa }
```

3) Also you'll need to create a table named `todos` with a column `todo` in your supabase dashboard.