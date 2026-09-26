$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot

if ((git branch --show-current) -ne 'main') {
    throw 'Switch to the main branch before deploying.'
}

git -c 'http.proxy=http://127.0.0.1:20808' pull --rebase --autostash origin main
if ($LASTEXITCODE -ne 0) { throw 'Could not sync with GitHub. Resolve the Git error above and run this command again.' }

npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Build failed. Nothing was committed or pushed.' }

git add -A
if ($LASTEXITCODE -ne 0) { throw 'Could not stage the changes.' }

git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    git commit -m 'Update website'
    if ($LASTEXITCODE -ne 0) { throw 'Could not commit the changes.' }
} elseif ($LASTEXITCODE -ne 0) {
    throw 'Could not inspect the staged changes.'
}

$ahead = git rev-list --count origin/main..HEAD
if ($LASTEXITCODE -ne 0) { throw 'Could not check pending commits.' }
if ($ahead -eq '0') {
    Write-Host 'No new changes to deploy.'
    exit 0
}

git -c 'http.proxy=http://127.0.0.1:20808' push origin main
if ($LASTEXITCODE -ne 0) { throw 'Push failed. The commit is saved locally; run this command again after resolving the Git error.' }

Write-Host 'Pushed to GitHub. Check Cloudflare Deployments for the build result.'
