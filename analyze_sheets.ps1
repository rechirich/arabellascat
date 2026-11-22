Add-Type -AssemblyName System.Drawing

function Find-Sprites($filePath, $sheetName) {
    $bmp = [System.Drawing.Bitmap]::FromFile($filePath)
    $w = $bmp.Width
    $h = $bmp.Height
    Write-Output "`n=========================================="
    Write-Output "ANALYZING SHEET: $sheetName ($w x $h)"
    Write-Output "=========================================="

    $inRow = $false
    $rowStart = 0
    $rows = @()

    for ($y = 0; $y -lt $h; $y++) {
        $hasPixel = $false
        for ($x = 0; $x -lt $w; $x++) {
            $c = $bmp.GetPixel($x, $y)
            if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) {
                $hasPixel = $true
                break
            }
        }
        if ($hasPixel -and -not $inRow) {
            $inRow = $true
            $rowStart = $y
        } elseif (-not $hasPixel -and $inRow) {
            $inRow = $false
            if (($y - $rowStart) -gt 15) {
                $rows += @{ start = $rowStart; end = $y }
            }
        }
    }
    if ($inRow) {
        $rows += @{ start = $rowStart; end = $h }
    }

    Write-Output "Detected $($rows.Count) distinct horizontal bands:"
    $rIdx = 1
    foreach ($r in $rows) {
        $ry1 = [Math]::Max(0, $r.start - 2)
        $ry2 = [Math]::Min($h, $r.end + 2)
        $rh = $ry2 - $ry1

        $inCol = $false
        $colStart = 0
        $cols = @()
        for ($x = 0; $x -lt $w; $x++) {
            $colPixel = $false
            for ($y = $ry1; $y -lt $ry2; $y++) {
                $c = $bmp.GetPixel($x, $y)
                if ($c.R -lt 230 -or $c.G -lt 230 -or $c.B -lt 230) {
                    $colPixel = $true
                    break
                }
            }
            if ($colPixel -and -not $inCol) {
                $inCol = $true
                $colStart = $x
            } elseif (-not $colPixel -and $inCol) {
                $inCol = $false
                if (($x - $colStart) -gt 15) {
                    $cols += @{ start = $colStart; end = $x }
                }
            }
        }
        if ($inCol) {
            $cols += @{ start = $colStart; end = $w }
        }

        Write-Output "Band $rIdx (Y: $ry1 to $ry2, H=$rh): $($cols.Count) sprites"
        $cIdx = 1
        foreach ($c in $cols) {
            $cx1 = [Math]::Max(0, $c.start - 2)
            $cx2 = [Math]::Min($w, $c.end + 2)
            $cw = $cx2 - $cx1
            Write-Output "   Sprite ${cIdx}: X=${cx1}, Y=${ry1}, W=${cw}, H=${rh}"
            $cIdx++
        }
        $rIdx++
    }
    $bmp.Dispose()
}

$u = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded"
Find-Sprites "$u\media_1794038159602_f2c99919.jpg" "Family Sheet"
Find-Sprites "$u\media_1794038650734_aae04f65.jpg" "Arabel Sheet 1 (Pink/Red/City)"
Find-Sprites "$u\media_1794038957163_64b89b75.jpg" "Arabel Sheet 2 (Meow/Batik)"
