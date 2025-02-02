# Установка исходной и целевой папок
$sourceDir = Join-Path -Path $env:USERPROFILE -ChildPath ".privateNotes"
$destDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Имя папки для копирования (в данном случае .privateNotes)
$folderName = Split-Path -Leaf $sourceDir

# Целевой путь включая имя папки
$destPath = Join-Path -Path $destDir -ChildPath $folderName

# Копирование папки целиком
Copy-Item -Path $sourceDir -Destination $destPath -Recurse -Force
