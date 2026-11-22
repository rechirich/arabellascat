Add-Type -AssemblyName System.Drawing

$src = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038650734_aae04f65.jpg"
$bmp = [System.Drawing.Bitmap]::FromFile($src)

function Clean-Cutout($srcBmp, $x, $y, $w, $h, $outName) {
    # 1. Exact crop
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $target = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # 2. Outer flood fill from 4 borders
    $visited = New-Object 'bool[,]' $w, $h
    $q = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

    for ($px = 0; $px -lt $w; $px++) {
        $q.Enqueue((New-Object System.Drawing.Point($px, 0)))
        $q.Enqueue((New-Object System.Drawing.Point($px, ($h - 1))))
    }
    for ($py = 0; $py -lt $h; $py++) {
        $q.Enqueue((New-Object System.Drawing.Point(0, $py)))
        $q.Enqueue((New-Object System.Drawing.Point(($w - 1), $py)))
    }

    while ($q.Count -gt 0) {
        $pt = $q.Dequeue()
        $px = $pt.X; $py = $pt.Y
        if ($px -lt 0 -or $px -ge $w -or $py -lt 0 -or $py -ge $h) { continue }
        if ($visited[$px, $py]) { continue }
        $visited[$px, $py] = $true

        $c = $target.GetPixel($px, $py)
        # Background condition: high brightness and low saturation (grey/white compression noise)
        $maxDiff = [Math]::Max([Math]::Abs($c.R - $c.G), [Math]::Max([Math]::Abs($c.G - $c.B), [Math]::Abs($c.R - $c.B)))
        $isBg = ($c.R -gt 215 -and $c.G -gt 215 -and $c.B -gt 215) -or
                ($c.R -gt 195 -and $c.G -gt 195 -and $c.B -gt 195 -and $maxDiff -lt 15) -or
                ($c.R -gt 238 -and $c.G -gt 238)

        if ($isBg) {
            $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $q.Enqueue((New-Object System.Drawing.Point(($px + 1), $py)))
            $q.Enqueue((New-Object System.Drawing.Point(($px - 1), $py)))
            $q.Enqueue((New-Object System.Drawing.Point($px, ($py + 1))))
            $q.Enqueue((New-Object System.Drawing.Point($px, ($py - 1))))
        }
    }

    # 3. Clean fringe/halo: pixels adjacent to transparent that are light-colored
    for ($iter = 0; $iter -lt 2; $iter++) {
        for ($py = 1; $py -lt ($h - 1); $py++) {
            for ($px = 1; $px -lt ($w - 1); $px++) {
                $c = $target.GetPixel($px, $py)
                if ($c.A -gt 0) {
                    $hasTransNeighbor = ($target.GetPixel(($px-1), $py).A -eq 0 -or 
                                         $target.GetPixel(($px+1), $py).A -eq 0 -or 
                                         $target.GetPixel($px, ($py-1)).A -eq 0 -or 
                                         $target.GetPixel($px, ($py+1)).A -eq 0)
                    if ($hasTransNeighbor) {
                        # If it's a light artifact pixel on edge
                        if ($c.R -gt 205 -and $c.G -gt 205 -and $c.B -gt 205) {
                            $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                        }
                    }
                }
            }
        }
    }

    # 4. Anti-dust filter: remove any remaining isolated pixel island
    for ($py = 1; $py -lt ($h - 1); $py++) {
        for ($px = 1; $px -lt ($w - 1); $px++) {
            $c = $target.GetPixel($px, $py)
            if ($c.A -gt 0) {
                $opaqueCount = 0
                for ($dy = -1; $dy -le 1; $dy++) {
                    for ($dx = -1; $dx -le 1; $dx++) {
                        if ($target.GetPixel(($px+$dx), ($py+$dy)).A -gt 0) { $opaqueCount++ }
                    }
                }
                # If only 1 or 2 opaque pixels in a 3x3 block, it is floating dust!
                if ($opaqueCount -le 2) {
                    $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                }
            }
        }
    }

    $dest = "C:\Users\Rechi\.gemini\antigravity\scratch\arabellas-cat\assets\characters\$outName.png"
    $target.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Output "Cleaned and saved $outName.png ($w x $h)"
}

# Test Big Portrait on Sheet 1
Clean-Cutout $bmp 25 22 170 220 "test_arabel_big_portrait"
$bmp.Dispose()
