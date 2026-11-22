Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794040080409_15d22442.jpg"
$destDir = "C:\Users\Rechi\.gemini\antigravity\scratch\arabellas-cat\assets\items"
if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Force -Path $destDir | Out-Null }

$src = [System.Drawing.Bitmap]::FromFile($srcPath)

$items = @(
    @{ name = "yogurt";     x = 20;  y = 19;  w = 317; h = 483 },
    @{ name = "teh_kotak";  x = 354; y = 19;  w = 316; h = 483 },
    @{ name = "mie_instan"; x = 687; y = 19;  w = 317; h = 483 },
    @{ name = "permen";     x = 20;  y = 522; w = 317; h = 485 },
    @{ name = "snack";      x = 354; y = 522; w = 316; h = 485 },
    @{ name = "es_krim";    x = 687; y = 522; w = 317; h = 485 }
)

foreach ($it in $items) {
    $rect = New-Object System.Drawing.Rectangle($it.x, $it.y, $it.w, $it.h)
    $target = New-Object System.Drawing.Bitmap($it.w, $it.h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $it.w, $it.h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    $outPanel = "$destDir\$($it.name).jpg"
    $target.Save($outPanel, [System.Drawing.Imaging.ImageFormat]::Jpeg)
    $target.Dispose()
    Write-Output "Saved $($it.name).jpg ($($it.w) x $($it.h))"
}

$src.Dispose()
