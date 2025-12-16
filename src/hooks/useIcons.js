export default function useIcons() {
  // Accept SVG, PNG, JPG, JPEG
  const icons = import.meta.glob('../assets/*.{svg,png,jpg,jpeg}', {
    eager: true,
    query: '?url',
    import: 'default'
  });

  const formatted = {};
  
  for (const path in icons) {
    const file = path.split('/').pop(); // ex: "avatar.png"
    const key = file.replace(/\.(svg|png|jpg|jpeg)$/i, ""); // remove extension
    formatted[key] = icons[path];
  }
  return formatted;
}

