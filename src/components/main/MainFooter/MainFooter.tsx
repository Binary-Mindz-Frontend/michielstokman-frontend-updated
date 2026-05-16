import Link from 'next/link';

function MainFooter() {
  return (
    <footer className="w-full py-6">
      <div className="mx-auto w-full max-w-400 px-4">
        {/* Top Border Line */}
        <div className="bg-primary/20 mb-8 h-px w-full" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Logo / Brand Name */}
          <div className="text-center md:text-left">
            <span className="text-primary font-serif text-xl font-bold tracking-tight">
              Transform to <span className="text-primary">Liberation</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav>
            <ul className="text-dark-primary flex flex-wrap items-center justify-center gap-6 text-center text-xs font-medium tracking-wider md:gap-10">
              <li>
                <Link href="/" className="hover:text-primary transition-colors">
                  HOME
                </Link>
              </li>
              <li>
                <Link href="/create" className="hover:text-primary transition-colors">
                  CREATE
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  ABOUT
                </Link>
              </li>
              <li>
                <Link href="/safety-freedom-rules" className="hover:text-primary transition-colors">
                  SAFETY RULES
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary transition-colors">
                  PROFILE
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        {/* Copyright or Secondary Info */}
        <div className="mt-10 text-center">
          <p className="text-dark-primary text-[10px] tracking-widest opacity-80">
            © {new Date().getFullYear()} LIBERATION. ALL RIGHTS RESERVED.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default MainFooter;
