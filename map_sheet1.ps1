Add-Type -AssemblyName System.Drawing

function Find-SubSprites($filePath, $name) {
    $bmp = [System.Drawing.Bitmap]::FromFile($filePath)
    $w = $bmp.Width
    $h = $bmp.Height
    Write-Output "=== $name ($w x $h) ==="

    # Find connected components or high density boxes
    # Let's grid sample 10x10 blocks
    $grid = New-Object 'int[,]' ($w / 8), ($h / 8)
    $gw = [Math]::Floor($w / 8)
    $gh = [Math]::Floor($h / 8)

    for ($gy = 0; $gy -lt $gh; $gy++) {
        for ($gx = 0; $gx -lt $gw; $gx++) {
            $hasDark = $false
            for ($dy = 0; $dy -lt 8; $dy++) {
                for ($dx = 0; $dx -lt 8; $dx++) {
                    $c = $bmp.GetPixel(($gx * 8 + $dx), ($gy * 8 + $dy))
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

    # Print a mini ASCII map of the sheet
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
Find-SubSprites "$u\media_1794038650734_aae04f65.jpg" "Sheet 1"
