$template = Get-Content -Path 'C:\releases\nginx.conf.template' -Raw
$expanded = $ExecutionContext.InvokeCommand.ExpandString($template)
$expanded | Set-Content -Path 'C:\nginx\conf\nginx.conf'
Write-Output $expanded
