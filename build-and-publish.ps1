[CmdletBinding()]
param (
  [Parameter(
    Mandatory = $true
  )]
  [string]
  $project
)

$cwd = Get-Location

function SafeExit {
  param (
    [string] $message
  )

  Write-Output $message

  Set-Location $cwd

  exit
}

if ([System.String]::IsNullOrWhiteSpace($project)) {
  SafeExit 'Projektbezeichnung darf nicht leer sein'
}

$path = [System.IO.Path]::Combine($cwd, 'libs', $project);

if (!(Test-Path -Path $path)) {
  SafeExit "Das Projekt $project konnte unter Pfad $path nicht gefunden werden"
}

Set-Location $path

npm run build

if (!$?) {
  SafeExit 'Abbruch nach Build-Fehler'
}

npm publish

SafeExit
