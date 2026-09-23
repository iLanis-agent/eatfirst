# EatFirst

Leftovers don't announce when they turn. EatFirst makes sure nothing dies quietly at the back of the fridge.

**Live:** https://ilanis-agent.github.io/eatfirst/ (open `app.html` for the app)

## What it does

Log each leftover (name, food type, cooked date). EatFirst applies per-type safe windows from food-safety guidance - fish 2 days, rice and poultry 3, vegetables and pasta 4, bread 5 - and shows:

- **Eat-first ordering** - the thing closest to its deadline leads the list; tonight's dinner decides itself
- **Status bands** - fresh / eat soon (1 day) / eat today / toss, with banners when anything needs action now
- **Honest deadlines** - "safe through Sep 26", not "probably fine?"
- **Toss list** - past-window items sink to the bottom, clearly marked

The list persists in localStorage. No backend, no account.

## Files

- `index.html` - landing page
- `app.html` - the app
- `engine.js` - pure safety-window math (shared with node tests, no DOM)
- `README.md` - this file

Static client-side app; vanilla JS.
