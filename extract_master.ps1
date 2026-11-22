Add-Type -AssemblyName System.Drawing

$u = "C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded"
$outDir = "C:\Users\Rechi\.gemini\antigravity\scratch\arabellas-cat\assets\characters"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Force -Path $outDir | Out-Null }

function Clean-And-Crop-Sprite($srcBmp, [int]$x, [int]$y, [int]$w, [int]$h, [string]$destName, [int]$bgThresh = 215) {
    # 1. Initial crop
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $target = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
    $g.DrawImage($srcBmp, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()

    # 2. Outer flood fill from 4 boundaries
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
        $maxDiff = [Math]::Max([Math]::Abs($c.R - $c.G), [Math]::Max([Math]::Abs($c.G - $c.B), [Math]::Abs($c.R - $c.B)))
        $isBg = ($c.R -ge $bgThresh -and $c.G -ge $bgThresh -and $c.B -ge $bgThresh) -or
                ($c.R -gt 195 -and $c.G -gt 195 -and $c.B -gt 195 -and $maxDiff -lt 18) -or
                ($c.R -gt 240 -and $c.G -gt 240) -or
                ($c.R -gt 225 -and $c.B -gt 225)

        if ($isBg) {
            $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
            $q.Enqueue((New-Object System.Drawing.Point(($px + 1), $py)))
            $q.Enqueue((New-Object System.Drawing.Point(($px - 1), $py)))
            $q.Enqueue((New-Object System.Drawing.Point($px, ($py + 1))))
            $q.Enqueue((New-Object System.Drawing.Point($px, ($py - 1))))
        }
    }

    # 3. Clean boundary fringe / halos (light ringing noise)
    for ($iter = 0; $iter -lt 3; $iter++) {
        for ($py = 1; $py -lt ($h - 1); $py++) {
            for ($px = 1; $px -lt ($w - 1); $px++) {
                $c = $target.GetPixel($px, $py)
                if ($c.A -gt 0) {
                    $borderingTransparent = ($target.GetPixel(($px-1), $py).A -eq 0 -or 
                                             $target.GetPixel(($px+1), $py).A -eq 0 -or 
                                             $target.GetPixel($px, ($py-1)).A -eq 0 -or 
                                             $target.GetPixel($px, ($py+1)).A -eq 0)
                    if ($borderingTransparent) {
                        # Remove if it's near-white or pale halo
                        if (($c.R -gt 190 -and $c.G -gt 190 -and $c.B -gt 190) -or ($c.R -gt 210 -and $c.G -gt 200)) {
                            $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                        }
                    }
                }
            }
        }
    }

    # 4. Anti-dust filter: remove isolated 1-pixel or 2-pixel islands
    for ($py = 1; $py -lt ($h - 1); $py++) {
        for ($px = 1; $px -lt ($w - 1); $px++) {
            $c = $target.GetPixel($px, $py)
            if ($c.A -gt 0) {
                $neighbors = 0
                for ($dy = -1; $dy -le 1; $dy++) {
                    for ($dx = -1; $dx -le 1; $dx++) {
                        if ($dx -ne 0 -or $dy -ne 0) {
                            if ($target.GetPixel(($px+$dx), ($py+$dy)).A -gt 0) { $neighbors++ }
                        }
                    }
                }
                if ($neighbors -le 2) {
                    $target.SetPixel($px, $py, [System.Drawing.Color]::FromArgb(0, 0, 0, 0))
                }
            }
        }
    }

    # 5. Find tight bounding box of remaining content
    $minX = $w; $minY = $h; $maxX = 0; $maxY = 0
    $hasPixels = $false
    for ($py = 0; $py -lt $h; $py++) {
        for ($px = 0; $px -lt $w; $px++) {
            if ($target.GetPixel($px, $py).A -gt 0) {
                $hasPixels = $true
                if ($px -lt $minX) { $minX = $px }
                if ($px -gt $maxX) { $maxX = $px }
                if ($py -lt $minY) { $minY = $py }
                if ($py -gt $maxY) { $maxY = $py }
            }
        }
    }

    if (-not $hasPixels) {
        Write-Warning "No pixels found for $destName!"
        $target.Dispose()
        return
    }

    # Add 2px safety padding
    $pad = 2
    $cropX = [Math]::Max(0, $minX - $pad)
    $cropY = [Math]::Max(0, $minY - $pad)
    $cropW = [Math]::Min($w - $cropX, ($maxX - $minX + 1) + ($pad * 2))
    $cropH = [Math]::Min($h - $cropY, ($maxY - $minY + 1) + ($pad * 2))

    $cropped = New-Object System.Drawing.Bitmap($cropW, $cropH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $gc = [System.Drawing.Graphics]::FromImage($cropped)
    $gc.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
    $srcRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $destRect = New-Object System.Drawing.Rectangle(0, 0, $cropW, $cropH)
    $gc.DrawImage($target, $destRect, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
    $gc.Dispose()
    $target.Dispose()

    $destPath = "$outDir\$destName.png"
    $cropped.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    Write-Output "Cleanly extracted: $destName.png (${cropW}x${cropH})"
}

# Load Source Bitmaps
$bFam = [System.Drawing.Bitmap]::FromFile("$u\media_1794038159602_f2c99919.jpg")
$bA1  = [System.Drawing.Bitmap]::FromFile("$u\media_1794038650734_aae04f65.jpg")
$bA2  = [System.Drawing.Bitmap]::FromFile("$u\media_1794038957163_64b89b75.jpg")

Write-Output "`n--- EXTRACTING ARABELLA DIALOGUE BUSTS ---"
# School busts (Y starts strictly at 158 to avoid shoes above!)
Clean-And-Crop-Sprite $bFam 12 158 68 88 "arabel_dialogue_school_normal" 210
Clean-And-Crop-Sprite $bFam 95 158 80 88 "arabel_dialogue_school_happy" 210
Clean-And-Crop-Sprite $bFam 182 158 72 88 "arabel_dialogue_school_curious" 210

# High-Res Pink Arabella Portrait (From Sheet 1)
Clean-And-Crop-Sprite $bA1 25 22 170 220 "arabel_dialogue_pink_big" 215
Clean-And-Crop-Sprite $bA1 22 525 170 230 "arabel_dialogue_pink_happy" 215

# Red Indonesia Arabella Portraits (From Sheet 1)
Clean-And-Crop-Sprite $bA1 180 525 170 230 "arabel_dialogue_red_happy" 215
Clean-And-Crop-Sprite $bA1 410 525 155 230 "arabel_dialogue_red_curious" 215

# Sheet 2 Portraits (Surprised, Sleepy, Pouting)
Clean-And-Crop-Sprite $bA2 18 20 135 135 "arabel_dialogue_happy_face" 215
Clean-And-Crop-Sprite $bA2 152 20 135 135 "arabel_dialogue_pout_face" 215
Clean-And-Crop-Sprite $bA2 290 20 175 135 "arabel_dialogue_sleep_face" 215
Clean-And-Crop-Sprite $bA2 18 165 135 135 "arabel_dialogue_wink_face" 215
Clean-And-Crop-Sprite $bA2 152 165 135 135 "arabel_dialogue_surprised_face" 215

# Black Meowtallica Peace Sign Bust (Sheet 2)
Clean-And-Crop-Sprite $bA2 55 320 250 280 "arabel_dialogue_meow_peace" 215
Clean-And-Crop-Sprite $bA2 215 650 205 350 "arabel_dialogue_batik_sit" 215

Write-Output "`n--- EXTRACTING PAPA DIALOGUE BUSTS & STAGE ---"
# Papa Dialogue Busts (from Family sheet)
Clean-And-Crop-Sprite $bFam 100 415 80 90 "papa_dialogue_normal" 210
Clean-And-Crop-Sprite $bFam 180 415 86 90 "papa_dialogue_happy" 210
Clean-And-Crop-Sprite $bFam 180 262 86 150 "papa_dialogue_phone" 210

# Papa Stage Full-body
Clean-And-Crop-Sprite $bFam 0 260 100 245 "papa_stage_standing" 210
Clean-And-Crop-Sprite $bFam 100 260 80 150 "papa_stage_walking" 210

Write-Output "`n--- EXTRACTING MAMA DIALOGUE BUSTS & STAGE ---"
# Mama Dialogue Busts
Clean-And-Crop-Sprite $bFam 100 665 80 90 "mama_dialogue_waving" 210
Clean-And-Crop-Sprite $bFam 180 665 86 90 "mama_dialogue_happy" 210
Clean-And-Crop-Sprite $bFam 180 520 86 100 "mama_dialogue_normal" 210

# Mama Stage Full-body
Clean-And-Crop-Sprite $bFam 0 520 100 240 "mama_stage_standing" 210
Clean-And-Crop-Sprite $bFam 100 520 80 145 "mama_stage_sitting" 210

Write-Output "`n--- EXTRACTING BU GUN DIALOGUE BUSTS & STAGE ---"
# Bu Gun Dialogue Busts
Clean-And-Crop-Sprite $bFam 100 775 75 90 "bugun_dialogue_thinking" 210
Clean-And-Crop-Sprite $bFam 175 775 90 90 "bugun_dialogue_waving" 210
Clean-And-Crop-Sprite $bFam 175 870 90 145 "bugun_dialogue_welcome" 210

# Bu Gun Stage Full-body
Clean-And-Crop-Sprite $bFam 0 775 100 248 "bugun_stage_standing" 210
Clean-And-Crop-Sprite $bFam 100 870 75 150 "bugun_stage_walking" 210

Write-Output "`n--- EXTRACTING ARABELLA STAGE SPRITES ---"
# School Uniform
Clean-And-Crop-Sprite $bFam 15 12 65 140 "arabel_stage_school" 210
Clean-And-Crop-Sprite $bFam 95 12 72 140 "arabel_stage_school_walk" 210

# Pink Pajamas Standing (Sheet 1)
Clean-And-Crop-Sprite $bA1 220 22 105 225 "arabel_stage_pink" 215

# Red Indonesia Jersey Standing (Sheet 1)
Clean-And-Crop-Sprite $bA1 165 270 120 230 "arabel_stage_red" 215

# Manchester City Blue Jersey Dancing/Posing (Sheet 1)
Clean-And-Crop-Sprite $bA1 225 770 205 250 "arabel_stage_mancity" 215

# Sleeping on Pillow (Sheet 1)
Clean-And-Crop-Sprite $bA1 5 770 215 250 "arabel_stage_sleeping" 215

# Black Meowtallica Cat T-shirt Standing (Sheet 2)
Clean-And-Crop-Sprite $bA2 395 230 170 380 "arabel_stage_blackcat" 215

# Black Meowtallica Cat Sitting Peace (Sheet 2)
Clean-And-Crop-Sprite $bA2 55 320 250 280 "arabel_stage_blackcat_sit" 215

# Batik Daster Standing (Sheet 2)
Clean-And-Crop-Sprite $bA2 20 635 180 370 "arabel_stage_daster" 215

# Batik Daster Sitting (Sheet 2) - GREAT FOR DINING ROOM / EATING!
Clean-And-Crop-Sprite $bA2 215 650 205 350 "arabel_stage_daster_sit" 215

$bFam.Dispose()
$bA1.Dispose()
$bA2.Dispose()

Write-Output "`nAll character sprites extracted successfully!"
