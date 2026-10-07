import "./globals.css";
import type { Metadata } from "next";
export const metadata: Metadata = {title:"SolarPredict | Solar Energy Prediction Portal",description:"Physics-informed solar energy prediction and forecasting portal"};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}