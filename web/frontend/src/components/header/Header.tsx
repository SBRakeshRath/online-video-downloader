import "./header.scss";
import { Link } from "react-router-dom";
export default function Header() {
  return (
    <header>
      <h1>Youtube Video Downloader</h1>
      <p>by SBRRath</p>
      <div className="telegramLink">
        <Link to="https://t.me/onlineVideoDownloaderBot">
          <div className="image">
            <img
              src="https://img.icons8.com/color/48/telegram-app--v1.png"
              alt="logo"
            />
          </div>
          Telegram BOT
        </Link>
      </div>
    </header>
  );
}
