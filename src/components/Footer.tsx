export default function Footer() {
  return (
    <footer style={{ backgroundColor: "#1a2744" }} className="text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm text-center">
        <p>&copy; {new Date().getFullYear()} FindAPawnShop.com &mdash; The largest pawn shop directory in the United States.</p>
      </div>
    </footer>
  );
}
