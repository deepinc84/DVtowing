import "@fontsource/barlow-condensed/700.css";
import "@fontsource/barlow-condensed/800.css";
import "@fontsource/barlow-condensed/800-italic.css";
import "@fontsource/barlow-condensed/900-italic.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "./globals.css";
import "./towing-quotes.css";
import TowingCalculator from "../components/TowingCalculator";
import Script from "next/script";
import generated from "../generated/concept-pages.json";
export const metadata={title:"Diamond Valley Tow & Recovery",description:"Towing and roadside assistance in Diamond Valley and the Alberta Foothills.",robots:{index:false,follow:false}};
export default function RootLayout({children}){return <html lang="en-CA"><body><div style={{display:"contents"}} dangerouslySetInnerHTML={{__html:generated.header}}/>{children}<div style={{display:"contents"}} dangerouslySetInnerHTML={{__html:generated.footer}}/><TowingCalculator/><Script src="/concept/interactions.js" strategy="afterInteractive"/></body></html>}
