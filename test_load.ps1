Add-Type -AssemblyName System.Drawing

$u = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded"
$famPath = "$u\media_1794038159602_f2c99919.jpg"
$a1Path = "$u\media_1794038650734_aae04f65.jpg"
$a2Path = "$u\media_1794038957163_64b89b75.jpg"

$bFam = [System.Drawing.Bitmap]::FromFile($famPath)
$bA1 = [System.Drawing.Bitmap]::FromFile($a1Path)
$bA2 = [System.Drawing.Bitmap]::FromFile($a2Path)

Write-Output "Loaded all 3 sheets successfully."
$bFam.Dispose()
$bA1.Dispose()
$bA2.Dispose()
