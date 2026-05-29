#!/bin/bash
# 用 curl 带完整浏览器头下载顽固网站的 favicon
# 用法：bash scripts/curl-logos.sh

LOGOS_DIR="$(dirname "$0")/../public/logos"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"

try_download() {
  local id=$1
  local url=$2
  local outfile="$LOGOS_DIR/$id.png"

  [ -f "$outfile" ] && echo "[$id] ⏭  已有" && return 0

  local tmp=$(mktemp)
  local http_code
  http_code=$(curl -s -L -A "$UA" \
    -H "Accept: image/avif,image/webp,image/apng,image/*,*/*;q=0.8" \
    -H "Accept-Language: en-US,en;q=0.9" \
    -H "Referer: $url" \
    --connect-timeout 8 --max-time 12 \
    -o "$tmp" -w "%{http_code}" "$url")

  local size=$(wc -c < "$tmp" 2>/dev/null || echo 0)

  if [ "$http_code" = "200" ] && [ "$size" -gt 200 ]; then
    cp "$tmp" "$outfile"
    echo "[$id] ✓  $url ($size bytes)"
  else
    echo "[$id] ✗  $url (http=$http_code, size=$size)"
  fi
  rm -f "$tmp"
}

echo "=== curl favicon 下载 ==="
echo ""

# Yusen Logistics (找到的真实路径)
try_download 3516 "https://www.yusen-logistics.com/themes/custom/yusen/favicon.ico"

# Kerry Express 系列 - 尝试多个路径
try_download 3356 "https://th.kerryexpress.com/favicon.ico"
try_download 3356 "https://th.kerryexpress.com/apple-touch-icon.png"
try_download 3367 "https://hk.kerryexpress.com/favicon.ico"
try_download 3388 "https://www.kerryexpress.com.tw/favicon.ico"

# Fastway Ireland
try_download 3326 "https://www.fastway.ie/favicon.ico"
try_download 3326 "https://www.fastway.ie/apple-touch-icon.png"
try_download 3326 "https://www.fastway.ie/content/themes/fastway/img/favicon.ico"

# MacAndrews
try_download 3045 "https://www.macandrews.com/favicon.ico"
try_download 3045 "https://www.macandrews.com/apple-touch-icon.png"

# HDSLINES
try_download 3032 "http://www.hdasco.com/favicon.ico"
try_download 3032 "http://www.hdasco.com/apple-touch-icon.png"

# Rifline
try_download 3077 "https://www.rifline.it/favicon.ico"
try_download 3077 "https://www.rifline.it/apple-touch-icon.png"

# ACL
try_download 3083 "https://www.aclship.com/favicon.ico"
try_download 3083 "https://www.aclship.com/apple-touch-icon.png"

# Portusline
try_download 3089 "https://www.portusline.com/favicon.ico"

# i-Parcel
try_download 3295 "https://www.i-parcel.com/favicon.ico"

# DPD UZ
try_download 3409 "https://www.dpd.uz/favicon.ico"
try_download 3409 "https://www.dpd.uz/apple-touch-icon.png"

# Wing
try_download 3428 "https://www.wing.ae/favicon.ico"
try_download 3428 "https://www.wing.ae/apple-touch-icon.png"

# SAEE
try_download 3441 "https://www.saee.sa/favicon.ico"
try_download 3441 "https://www.saee.sa/apple-touch-icon.png"
try_download 3441 "https://www.saee.sa/en/favicon.ico"

# Airfreightabc
try_download 2022 "https://www.airfreightabc.com/favicon.ico"

# AM Trucking
try_download 3526 "https://www.amtrucking.com/favicon.ico"

echo ""
echo "=== 完成 ==="
echo "查看结果: ls -la $LOGOS_DIR | grep -E '(3516|3356|3367|3388|3326|3045|3032|3077|3083|3089|3295|3409|3428|3441|2022|3526)'"
