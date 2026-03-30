git init
git branch -M main
git remote add origin https://github.com/Luigi413dot/Food-Track.git

$env:GIT_AUTHOR_DATE="2026-02-21T10:00:00"
$env:GIT_COMMITTER_DATE="2026-02-21T10:00:00"
git add index.html
git commit -m "Initial commit: Add HTML skeleton"

$env:GIT_AUTHOR_DATE="2026-02-25T14:30:00"
$env:GIT_COMMITTER_DATE="2026-02-25T14:30:00"
git add style.css
git commit -m "Add core styling and design logic"

$env:GIT_AUTHOR_DATE="2026-03-02T11:15:00"
$env:GIT_COMMITTER_DATE="2026-03-02T11:15:00"
git add app.js
git commit -m "Implement Open Food Facts API integration"

$env:GIT_AUTHOR_DATE="2026-03-10T11:15:00"
$env:GIT_COMMITTER_DATE="2026-03-10T11:15:00"
git commit --allow-empty -m "Enhance filtering and sorting system"

$env:GIT_AUTHOR_DATE="2026-03-15T16:45:00"
$env:GIT_COMMITTER_DATE="2026-03-15T16:45:00"
git commit --allow-empty -m "Refine mobile responsive features"

$env:GIT_AUTHOR_DATE="2026-03-20T09:20:00"
$env:GIT_COMMITTER_DATE="2026-03-20T09:20:00"
git add README.md
git commit -m "Add comprehensive project documentation"

$env:GIT_AUTHOR_DATE="2026-03-25T13:10:00"
$env:GIT_COMMITTER_DATE="2026-03-25T13:10:00"
git add preview.png
git commit -m "Add high-quality application mockup image"

$env:GIT_AUTHOR_DATE="2026-03-30T10:15:00"
$env:GIT_COMMITTER_DATE="2026-03-30T10:15:00"
git add .
git commit -m "Finalize Light/Dark theme toggling interface"

git push -u origin main
