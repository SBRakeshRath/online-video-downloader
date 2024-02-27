import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import Main from "./components/main/main";
import GenerateLink from "./components/generateLink/generateLink";
import DownloadLink from "./components/DownloadLink/downloadLink";
import Footer from "./components/footer/footer";

export default function App() {
  return (
    <>
      <Header />
      {/* <Main /> */}

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/generateLInk" element={<GenerateLink />} />
        <Route path="/download/:id" element={<DownloadLink />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
      {/* <h1>App</h1> */}
    </>
  );
}
