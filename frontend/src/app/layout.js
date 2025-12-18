import "./globals.css";
import { Providers } from "../components/Providers";

export const metadata = {
  title: "StudyRoom",
  description: "Connect and study with your classmates",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
