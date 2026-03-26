import { SiFacebook, SiInstagram, SiWhatsapp } from "react-icons/si";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      id="contact"
      className="text-white"
      style={{ backgroundColor: "#0F5B3A" }}
    >
      <div className="max-w-6xl mx-auto px-4 py-12 grid sm:grid-cols-3 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">🕌</span>
            <span className="font-bold text-xl">BMC App</span>
          </div>
          <p className="text-white/75 text-sm leading-relaxed">
            Bugesera Muslim Community — guhuza abanyamuryango, guteza imbere
            transparency no gutanga inkunga binyuze mu buryo bugezweho.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold mb-4 text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li>
              <a href="#about" className="hover:text-white transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="hover:text-white transition-colors"
              >
                Fundraising
              </a>
            </li>
            <li>
              <a
                href="#community"
                className="hover:text-white transition-colors"
              >
                Community Hub
              </a>
            </li>
            <li>
              <a href="#contact" className="hover:text-white transition-colors">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact & Social */}
        <div>
          <h4 className="font-bold mb-4 text-white">Contact</h4>
          <p className="text-white/75 text-sm mb-4">
            Bugesera District, Rwanda
            <br />📞 +250 788 000 000
            <br />
            ✉️ info@bugamslim.rw
          </p>
          <div className="flex gap-3">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Facebook"
            >
              <SiFacebook className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Instagram"
            >
              <SiInstagram className="w-5 h-5" />
            </a>
            <a
              href="https://wa.me/250788000000"
              target="_blank"
              rel="noreferrer"
              className="text-white/70 hover:text-white transition-colors"
              aria-label="WhatsApp"
            >
              <SiWhatsapp className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-white/20 px-4 py-4 max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
        <span>© {year} Bugesera Muslim Community. All rights reserved.</span>
        <span>
          Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="underline hover:text-white"
            target="_blank"
            rel="noreferrer"
          >
            caffeine.ai
          </a>
        </span>
      </div>
    </footer>
  );
}
