import "./globals.css";
import Link from "next/link";
import MotionShell from "../components/MotionShell";
export const metadata={title:{default:"Diamond Valley Towing | Development preview",template:"%s | Diamond Valley Towing"},robots:{index:false,follow:false}};
export default function RootLayout({children}){return <html lang="en-CA"><body><header className="site-header"><Link href="/" className="brand">DIAMOND VALLEY<span>TOWING</span></Link><nav aria-label="Main navigation"><Link href="/#services">Services</Link><Link href="/#coverage">Coverage</Link></nav><span className="preview-label">Development preview</span></header><main id="main">{children}</main><footer className="site-footer">Diamond Valley Towing · Development preview. Service availability pending customer approval.</footer><MotionShell/></body></html>}
