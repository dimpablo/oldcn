#for d in lesson{1..60}; do [[ -d "$d" ]] && cp translateall.html "$d/"; done
for d in lesson{1..60}; do [[ -d "$d" ]] && cp vocab.html "$d/"; done
for d in lesson{1..60}; do [[ -d "$d" ]] && cp hanzi.html "$d/"; done
