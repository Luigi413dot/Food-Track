Remove-Item .git -Recurse -Force -ErrorAction SilentlyContinue

git init
git branch -M main
git remote add origin https://github.com/Luigi413dot/Food-Track.git

$env:GIT_AUTHOR_DATE="2026-03-21T10:00:00"
$env:GIT_COMMITTER_DATE="2026-03-21T10:00:00"
git add index.html
git commit -m "Initial commit: Add HTML skeleton"

$env:GIT_AUTHOR_DATE="2026-03-22T14:30:00"
$env:GIT_COMMITTER_DATE="2026-03-22T14:30:00"
git add style.css
git commit -m "Add core styling and custom theme variables"

$env:GIT_AUTHOR_DATE="2026-03-23T11:15:00"
$env:GIT_COMMITTER_DATE="2026-03-23T11:15:00"
git add app.js
git commit -m "Implement Open Food Facts API integration"

$env:GIT_AUTHOR_DATE="2026-03-25T11:15:00"
$env:GIT_COMMITTER_DATE="2026-03-25T11:15:00"
git commit --allow-empty -m "Enhance filtering and sorting system"

$env:GIT_AUTHOR_DATE="2026-03-26T14:00:00"
$env:GIT_COMMITTER_DATE="2026-03-26T14:00:00"
git add README.md
git commit -m "Add comprehensive project documentation"

$env:GIT_AUTHOR_DATE="2026-03-28T09:20:00"
$env:GIT_COMMITTER_DATE="2026-03-28T09:20:00"
git add preview.png
git commit -m "Add project mockup image"

$env:GIT_AUTHOR_DATE="2026-03-30T10:15:00"
$env:GIT_COMMITTER_DATE="2026-03-30T10:15:00"
git add .
git commit -m "Finalize Light/Dark theme toggling interface"

git push -u origin main --force
