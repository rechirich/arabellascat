Add-Type -AssemblyName System.Drawing

$img1 = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038650734_aae04f65.jpg'
$img2 = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038957163_64b89b75.jpg'
$imgFamily = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038159602_f2c99919.jpg'

$b1 = [System.Drawing.Bitmap]::FromFile($img1)
$b2 = [System.Drawing.Bitmap]::FromFile($img2)
$bf = [System.Drawing.Bitmap]::FromFile($imgFamily)

Write-Output "Arabella Sheet 1: $($b1.Width) x $($b1.Height)"
Write-Output "Arabella Sheet 2: $($b2.Width) x $($b2.Height)"
Write-Output "Family Sheet: $($bf.Width) x $($bf.Height)"

$b1.Dispose()
$b2.Dispose()
$bf.Dispose()
