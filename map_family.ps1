Add-Type -AssemblyName System.Drawing

function Find-SubSprites($filePath, $name) {
    $bmp = [System.Drawing.Bitmap]::FromFile($filePath)
    $w = $bmp.Width
    $h = $bmp.Height
    Write-Output "=== $name ($w x $h) ==="

    $gw = [Math]::Floor($w / 4)
    $gh = [Math]::Floor($h / 8)
    $grid = New-Object 'int[,]' $gw, $gh

    for ($gy = 0; $gy -lt $gh; $gy++) {
        for ($gx = 0; $gx -lt $gw; $gx++) {
            $hasDark = $false
            for ($dy = 0; $dy -lt 8; $dy++) {
                for ($dx = 0; $dx -lt 4; $dx++) {
                    $c = $bmp.GetPixel(($gx * 4 + $dx), ($gy * 8 + $dy))
                    if ($c.R -lt 220 -or $c.G -lt 220 -or $c.B -lt 220) {
                        $hasDark = $true
                        break
                    }
                }
                if ($hasDark) { break }
            }
            if ($hasDark) { $grid[$gx, $gy] = 1 }
        }
    }

    for ($gy = 0; $gy -lt $gh; $gy += 2) {
        $line = ""
        for ($gx = 0; $gx -lt $gw; $gx++) {
            $line += $(if ($grid[$gx, $gy] -eq 1) { "#" } else { "." })
        }
        Write-Output ("{0:D3}: {1}" -f ($gy * 8), $line)
    }
    $bmp.Dispose()
}

$u = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded"
Find-SubSprites "$u\media_1794038159602_f2c99919.jpg" "Family Sheet"
