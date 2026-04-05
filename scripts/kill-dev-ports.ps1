# 结束占用指定端口的进程（默认：货代导航网 3018）
# 用法：右键「使用 PowerShell 运行」或在项目根目录执行：
#   powershell -ExecutionPolicy Bypass -File scripts/kill-dev-ports.ps1
# 自定义端口：
#   powershell -ExecutionPolicy Bypass -File scripts/kill-dev-ports.ps1 -Ports 3018,5173,8080

param(
  [int[]]$Ports = @(3018)
)

foreach ($p in $Ports) {
  $conns = Get-NetTCPConnection -LocalPort $p -ErrorAction SilentlyContinue | Where-Object { $_.State -eq "Listen" }
  if (-not $conns) {
    Write-Host "端口 $p 无监听进程"
    continue
  }
  $pids = $conns.OwningProcess | Sort-Object -Unique
  foreach ($pid in $pids) {
    try {
      $proc = Get-Process -Id $pid -ErrorAction Stop
      Write-Host "结束 PID=$pid ($($proc.ProcessName)) 占用端口 $p"
      Stop-Process -Id $pid -Force
    } catch {
      Write-Host "跳过 PID=$pid : $_"
    }
  }
}

Write-Host "完成。"
