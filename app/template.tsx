/**
 * Transisi antar halaman: fade 200ms murni CSS.
 * Sengaja TANPA Motion/JS: konten harus terlihat walau JS gagal dimuat,
 * dan versi HP tidak memakai animasi entrance sama sekali.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="rk-page-enter">{children}</div>
}
