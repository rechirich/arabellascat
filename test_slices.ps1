Add-Type -AssemblyName System.Drawing

$b = [System.Drawing.Bitmap]::FromFile("C:\Users\Rechi\.gemini\antigravity\brain\0c93d2e3-2183-40e7-9ca2-91c26219bf76\.user_uploaded\media_1794038159602_f2c99919.jpg")

function Slice($x, $y, $w, $h, $name) {
    global:b
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $target = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($target)
    $g.DrawImage($b, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $target.Save("C:\Users\Rechi\.gemini\antigravity\scratch\arabellas-cat\assets\characters\test_$name.png")
    $target.Dispose()
    Write-Output "Saved test_$name.png ($w x $h)"
}

# Family Papa rows
# Papa standing: X=0 to 100, Y=260 to 500
Slice 0 260 100 240 "papa_standing"
# Papa walking: X=100 to 180, Y=260 to 410
Slice 100 260 80 150 "papa_walking"
# Papa phone: X=180 to 266, Y=260 to 410
Slice 180 260 86 150 "papa_phone"
# What is below papa walking and phone? Y=410 to 505:
Slice 100 410 80 95 "papa_bust1"
Slice 180 410 86 95 "papa_bust2"

# Mama rows (Y=520 to 760)
# Mama standing: X=0 to 100, Y=520 to 760
Slice 0 520 100 240 "mama_standing"
# Mama sitting: X=100 to 180, Y=520 to 660
Slice 100 520 80 140 "mama_sitting"
# Mama bust top right: X=180 to 266, Y=520 to 620
Slice 180 520 86 100 "mama_bust_phone"
# Mama bust bottom middle: X=100 to 180, Y=660 to 755
Slice 100 660 80 95 "mama_bust_wave"
# Mama bust bottom right: X=180 to 266, Y=660 to 755
Slice 180 660 86 95 "mama_bust_happy"

# Bu Gun rows (Y=775 to 1024)
# Bu Gun standing: X=0 to 100, Y=775 to 1020
Slice 0 775 100 245 "bugun_standing"
# Bu Gun walking: X=100 to 175, Y=870 to 1020
Slice 100 870 75 150 "bugun_walking"
# Bu Gun bust top middle: X=100 to 175, Y=775 to 865
Slice 100 775 75 90 "bugun_bust_thinking"
# Bu Gun bust top right: X=175 to 266, Y=775 to 865
Slice 175 775 90 90 "bugun_bust_waving"
# Bu Gun bust bottom right: X=175 to 266, Y=870 to 1020
Slice 175 870 90 150 "bugun_bust_talking"

$b.Dispose()
