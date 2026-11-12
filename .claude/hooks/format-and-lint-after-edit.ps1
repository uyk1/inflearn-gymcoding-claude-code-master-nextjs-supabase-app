# PostToolUse 훅: 편집한 파일을 prettier로 포맷한 뒤 eslint로 검사합니다
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
# eslint 출력과 stderr 메시지의 한글이 깨지지 않도록 BOM 없는 UTF-8을 사용합니다
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false

try {
  $payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
  # 입력을 해석하지 못하면 검사를 건너뜁니다
  exit 0
}

$filePath = [string]$payload.tool_input.file_path
if (-not $filePath) { exit 0 }
if ($filePath -notmatch '\.(ts|tsx|js|mjs|json|css)$') { exit 0 }
if ($filePath -match '[\\/](node_modules|\.next)[\\/]') { exit 0 }
if (-not (Test-Path -LiteralPath $filePath)) { exit 0 }

# 프로젝트 루트로 이동해야 설정 파일을 찾을 수 있습니다
$projectDir = $env:CLAUDE_PROJECT_DIR
if (-not $projectDir) { $projectDir = (Get-Location).Path }
Set-Location -LiteralPath $projectDir

# 1단계: prettier 포맷 (.prettierignore 대상 파일은 prettier가 알아서 건너뜁니다)
$prettierCmd = Join-Path $projectDir 'node_modules\.bin\prettier.cmd'
if (Test-Path -LiteralPath $prettierCmd) {
  & $prettierCmd --write --ignore-unknown --log-level warn $filePath | Out-Null
}

# 2단계: eslint 검사 (스크립트 파일만)
if ($filePath -notmatch '\.(ts|tsx|js|mjs)$') { exit 0 }

$eslintCmd = Join-Path $projectDir 'node_modules\.bin\eslint.cmd'
if (-not (Test-Path -LiteralPath $eslintCmd)) { exit 0 }

$output = & $eslintCmd $filePath

if ($LASTEXITCODE -ne 0) {
  # 종료 코드 2는 stderr 내용을 Claude에게 전달해 바로 수정하게 합니다
  [Console]::Error.WriteLine("eslint 오류가 있습니다 ($filePath):")
  [Console]::Error.WriteLine(($output | Out-String))
  exit 2
}

exit 0
