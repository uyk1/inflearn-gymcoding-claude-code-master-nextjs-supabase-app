# PreToolUse 훅: 위험한 파일 수정과 셸 명령을 실행 전에 차단합니다
# 차단 시 종료 코드 2와 사유를 stderr로 보내 Claude가 다른 방법을 찾게 합니다
# 사용자 확인이 필요한 경우에는 permissionDecision "ask"를 JSON으로 출력합니다
[Console]::InputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false

try {
  $payload = [Console]::In.ReadToEnd() | ConvertFrom-Json
} catch {
  # 입력을 해석하지 못하면 작업을 막지 않습니다
  exit 0
}

$toolName = [string]$payload.tool_name
$toolInput = $payload.tool_input
$reason = $null
$askReason = $null

switch ($toolName) {
  { $_ -in @('Edit', 'Write') } {
    $filePath = [string]$toolInput.file_path
    $leaf = Split-Path -Leaf $filePath

    if ($leaf -like '.env*' -and $leaf -ne '.env.example') {
      $reason = '.env 파일은 직접 수정할 수 없습니다. 예시 값은 .env.example을 사용하세요.'
    } elseif ($leaf -eq 'package-lock.json') {
      $reason = 'package-lock.json은 직접 편집하지 마세요. npm 명령으로 변경하세요.'
    } elseif ($filePath -match '[\\/]node_modules[\\/]') {
      $reason = 'node_modules 안의 파일은 수정하지 마세요.'
    } elseif ($filePath -match '[\\/]\.next[\\/]') {
      $reason = '.next는 빌드 산출물입니다. 소스 파일을 수정하세요.'
    } elseif ($filePath -match '[\\/]types[\\/]database\.ts$') {
      # 타입 재생성 시에는 파일을 써야 하므로 차단하지 않고 사용자 확인을 요청합니다
      $askReason = 'types/database.ts는 Supabase 자동 생성 파일입니다. 직접 수정하지 말고 generate_typescript_types로 재생성한 결과인지 확인하세요.'
    }
  }
  { $_ -in @('PowerShell', 'Bash') } {
    # 커밋 메시지 등 인용문 안의 텍스트는 명령으로 보지 않도록 here-string과 따옴표 내용을 제거합니다
    $command = [string]$toolInput.command
    $scan = $command -replace "(?s)@'.*?'@", '' -replace '(?s)@".*?"@', ''
    $scan = $scan -replace '"[^"]*"', '' -replace "'[^']*'", ''

    if ($scan -match '\brm\s+-(rf|fr|Rf|fR|rF|Fr)\b') {
      $reason = 'rm -rf는 차단됩니다. 삭제 대상을 명시해 하나씩 제거하세요.'
    } elseif ($scan -match 'Remove-Item.*-Recurse.*-Force|Remove-Item.*-Force.*-Recurse') {
      $reason = 'Remove-Item -Recurse -Force는 차단됩니다. 삭제 대상을 확인한 뒤 진행하세요.'
    } elseif ($scan -match 'git\s+push\s.*(--force(?![-\w])|\s-f(\s|$))') {
      $reason = 'git push --force는 차단됩니다. 필요하면 사용자가 직접 실행하세요.'
    } elseif ($scan -match 'git\s+reset\s+--hard') {
      $reason = 'git reset --hard는 차단됩니다. 변경 사항이 사라지므로 사용자 확인이 필요합니다.'
    } elseif ($scan -match 'git\s+clean\s+-\w*f') {
      $reason = 'git clean -f는 차단됩니다. 추적되지 않는 파일이 삭제됩니다.'
    } elseif ($scan -match 'git\s+(commit|push)\b.*--no-verify') {
      $reason = '--no-verify는 차단됩니다. Husky 검사를 우회하지 말고 lint/타입 오류를 먼저 해결하세요.'
    } elseif ($scan -match '(?i)\b(cat|type|get-content|gc|more|less|head|tail|bat)\s+[^|;&\r\n]*\.env(?!\.example)(\.\S+)?(\s|$)') {
      $reason = '.env 파일 내용을 읽는 명령은 차단됩니다. 비밀 값은 노출하지 마세요.'
    }
  }
}

if ($reason) {
  [Console]::Error.WriteLine("[훅 차단] $reason")
  exit 2
}

if ($askReason) {
  $output = @{
    hookSpecificOutput = @{
      hookEventName            = 'PreToolUse'
      permissionDecision       = 'ask'
      permissionDecisionReason = $askReason
    }
  } | ConvertTo-Json -Compress -Depth 5
  [Console]::Out.WriteLine($output)
  exit 0
}

exit 0
