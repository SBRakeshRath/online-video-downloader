import "./footer.scss";
import { GitHub } from "@mui/icons-material";

export default function Footer() {
  return (
    <footer>
      <div className="disclaimerContainer">
        <p>
          This website is not affiliated with YouTube or any of its partners.
          You can download any video from YouTube using this website. The only
          restriction is that you must respect the rights of the content owners.
          The Videos that you download from YouTube are for personal use only,
          and you should not use them for any commercial purpose.
        </p>
      </div>
      <div className="footerLinksContainer">
        <a
          href="https://github.com/SBRakeshRath"
          target="_blank"
          rel="noreferrer"
        >

            <GitHub style={{ fontSize: 48 }} />
          {/* <img
            width="48"
            height="48"
            src="./../../assets/github-mark-white.png"
            alt="github"
          /> */}
        </a>
        <a
          href="https://www.linkedin.com/in/s-b-rakesh-rath-0bb336215?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
          target="_blank"
          rel="noreferrer"
        >
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/fluency/48/linkedin.png"
            alt="linkedin"
          />
        </a>
        <a
          href="https://www.instagram.com/s.b.rakeshrath/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            width="48"
            height="48"
            src="https://img.icons8.com/fluency/48/instagram-new.png"
            alt="instagram-new"
          />
        </a>
      </div>
    </footer>
  );
}
