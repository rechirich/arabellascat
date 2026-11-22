Add-Type -AssemblyName System.Drawing

$dir = 'C:\Users\Rechi\.gemini\antigravity\scratch\arabellas-cat\assets\characters'
if (-not (Test-Path $dir)) { New-Item -ItemType Directory -Force -Path $dir | Out-Null }

$familyFile = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038159602_f2c99919.jpg'
$arabella1File = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038650734_aae04f65.jpg'
$arabella2File = 'C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038957163_64b89b75.jpg'

# Clean extraction function: Flood fill from borders to eliminate all JPEG compression artifacts
function Extract-Clean-Sprite($srcBmp, $x, $y, $w, $h, $destName, $threshold = 230) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $target = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # Flood fill from edge to remove background
    $visited = New-Object 'bool[,]' $w, $h
    $queue = New-Object System.Collections.Generic.Queue[System.Drawing.Point]

    # Seed all border pixels
    for ($px = 0; $px -lt $w; $px++) {
        $queue.Enqueue((New-Object System.Drawing.Point($px, 0)))
        $queue.Enqueue((New-Object System.Drawing.Point($px, ($h - 1))))
    }
    for ($py = 0; $py -lt $h; $py++) {
        $queue.Enqueue((New-Object System.Drawing.Point(0, $py)))
        $queue.Enqueue((New-Object System.Drawing.Point(($w - 1), $py)))
    }

    while ($queue.Count -gt 0) {
        $pt = $queue.Dequeue()
        $px = $pt.X; $py = $pt.Y
        if ($px -lt 0 -or $px -ge $w -or $py -lt 0 -or $py -ge $h) { continue }
        if ($visited[$px, $py]) { continue }
        $visited[$px, $py] = $true

        $c = $target.GetPixel($px, $py)
        # Check if color is background (light grey / white / near-white)
        # Also remove light fringe around characters
        if (($c.R -gt $threshold -and $c.G -gt $threshold -and $c.B -gt $threshold) -or ($c.R -gt 240 -and $c.G -gt 240) -or ($c.R -gt 210 -and $c.G -gt 210 -and $c.B -gt 210 -and [Math]::Abs($c.R - $c.G) -lt 8 -and [Math]::Abs($c.G - $c.B) -lt 8)) {
            $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $queue.Enqueue((New-Object System.Drawing.Point(($px + 1), $py)))
            $queue.Enqueue((New-Object System.Drawing.Point(($px - 1), $py)))
            $queue.Enqueue((New-Object System.Drawing.Point($px, ($py + 1))))
            $queue.Enqueue((New-Object System.Drawing.Point($px, ($py - 1))))
        }
    }

    # Second pass: remove any isolated lone floating pixels (anti-dust)
    for ($py = 1; $py -lt ($h - 1); $py++) {
        for ($px = 1; $px -lt ($w - 1); $px++) {
            $c = $target.GetPixel($px, $py)
            if ($c.A -gt 0) {
                # If surrounded mostly by transparent pixels, it's noise
                $transCount = 0
                if ($target.GetPixel(($px-1), $py).A -eq 0) { $transCount++ }
                if ($target.GetPixel(($px+1), $py).A -eq 0) { $transCount++ }
                if ($target.GetPixel($px, ($py-1)).A -eq 0) { $transCount++ }
                if ($target.GetPixel($px, ($py+1)).A -eq 0) { $transCount++ }
                if ($transCount -ge 3 -and ($c.R -gt 200 -and $c.G -gt 200 -and $c.B -gt 200)) {
                    $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                }
            }
        }
    }

    $outPath = "$dir\$destName.png"
    $target.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $target.Dispose()
    Write-Output "Cleanly extracted: $destName.png ($w x $h)"
}

$bFam = [System.Drawing.Bitmap]::FromFile($familyFile)
$bA1 = [System.Drawing.Bitmap]::FromFile($arabella1File)
$bA2 = [System.Drawing.Bitmap]::FromFile($arabella2File)

# ==========================================
# 1. DIALOGUE BUSTS (Extracted cleanly & accurately)
# ==========================================

# Arabella Busts
# From Family Sheet:
# Arabella School Normal Bust: (x: 12, y: 150, w: 75, h: 95)
Extract-Clean-Sprite $bFam 12 150 75 95 "arabel_dialogue_school_normal" 220
# Arabella School Happy Bust (eyes closed & wave): (x: 96, y: 150, w: 82, h: 95)
Extract-Clean-Sprite $bFam 96 150 82 95 "arabel_dialogue_happy" 220
# Arabella School Curious Bust (? & finger on cheek): (x: 184, y: 150, w: 75, h: 95)
Extract-Clean-Sprite $bFam 184 150 75 95 "arabel_dialogue_curious" 220

# From Arabella Sheet 1:
# Big High-Res Arabella Portrait (Top-left, x: 25, y: 20, w: 170, h: 200)
Extract-Clean-Sprite $bA1 25 20 170 200 "arabel_dialogue_big_pink" 225
# Arabella Red Indonesia Waving (x: 160, y: 500, w: 180, h: 200)
Extract-Clean-Sprite $bA1 160 500 180 200 "arabel_dialogue_red_happy" 225
# Arabella Red Indonesia Thinking (x: 430, y: 500, w: 130, h: 200)
Extract-Clean-Sprite $bA1 430 500 130 200 "arabel_dialogue_red_curious" 225

# Papa Busts:
Extract-Clean-Sprite $bFam 10 255 80 95 "papa_dialogue_normal" 220
Extract-Clean-Sprite $bFam 100 395 86 105 "papa_dialogue_phone" 220
Extract-Clean-Sprite $bFam 185 395 80 105 "papa_dialogue_happy" 220

# Mama Busts:
Extract-Clean-Sprite $bFam 12 510 80 95 "mama_dialogue_normal" 220
Extract-Clean-Sprite $bFam 94 640 88 105 "mama_dialogue_waving" 220
Extract-Clean-Sprite $bFam 178 640 82 105 "mama_dialogue_happy" 220

# Bu Gun Busts:
Extract-Clean-Sprite $bFam 108 770 75 90 "bugun_dialogue_thinking" 220
Extract-Clean-Sprite $bFam 178 770 78 90 "bugun_dialogue_waving" 220
Extract-Clean-Sprite $bFam 160 848 98 110 "bugun_dialogue_welcome" 220

# ==========================================
# 2. FULL BODY STAGE SPRITES (No more ugly SVGs!)
# ==========================================

# Arabella Stage Outfits:
# 1. School Uniform (Standing):
Extract-Clean-Sprite $bFam 15 15 65 135 "arabel_stage_school" 220

# 2. Pink Floral / Polka-dot Outfit (Standing):
Extract-Clean-Sprite $bA1 225 25 100 205 "arabel_stage_pink" 220

# 3. Red Indonesia Outfit (Standing):
Extract-Clean-Sprite $bA1 170 255 105 210 "arabel_stage_red" 220

# 4. Manchester City Sky Blue Jersey (Dancing / Raising Arm):
Extract-Clean-Sprite $bA1 205 725 165 245 "arabel_stage_mancity" 220

# 5. Daster Batik (Standing):
Extract-Clean-Sprite $bA2 25 585 160 380 "arabel_stage_daster" 220

# 6. Black Cat T-shirt ("MEOWTALLICA" with 4 cats):
Extract-Clean-Sprite $bA2 335 215 165 375 "arabel_stage_blackcat" 220

# 7. Arabella Sleeping on Pillow:
Extract-Clean-Sprite $bA1 15 790 170 150 "arabel_stage_sleeping" 220

# Papa Stage Full Body:
Extract-Clean-Sprite $bFam 10 255 90 238 "papa_stage_standing" 220

# Mama Stage Full Body:
Extract-Clean-Sprite $bFam 10 510 85 230 "mama_stage_standing" 220

# Bu Gun Stage Full Body:
Extract-Clean-Sprite $bFam 8 760 90 235 "bugun_stage_standing" 220

$bFam.Dispose()
$bA1.Dispose()
$bA2.Dispose()
Write-Output "All character sprites extracted cleanly!"
