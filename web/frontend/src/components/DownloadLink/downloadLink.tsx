import { doc, onSnapshot } from "firebase/firestore";

import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import db from "../../firebase/firebase";
import "./downloadLink.scss";
import { Button } from "@mui/material";
import ErrorMessageContainer from "../error/errorMessageContainer";
import LoadingContainer from "../LoadingConatiner/loadingContainer";

export default function DownloadLink() {
  const dbId = useParams().id;
  const [downloadLink, setDownloadLink] = useState<string | false>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const stepsContainer = useRef<HTMLDivElement | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!dbId) return;

    const unsub = onSnapshot(
      doc(db, "queue", dbId as string),
      (doc) => {
        const data = doc.data();
        if (!data) {
          setErrorMessage("Error in retrieving data");

          return;
        }

        if (loading) setLoading(false);

        if (!stepsContainer.current || stepsContainer.current == null) return;

        const status = data.status;
        setErrorMessage("");

        if (status === "failed") {
          setErrorMessage("Failed to generate link, please try again later.");

          return;
        }

        let currentStep = 1;

        if (status === "downloading-video") {
          currentStep = 1;
        } else if (status === "downloading-audio") {
          currentStep = 2;
        } else if (status === "merging") {
          currentStep = 3;
        } else if (status === "uploading") {
          currentStep = 4;
        } else if (status === "uploaded") {
          currentStep = 5;
          setDownloadLink(data.link);
        } else if (status === "failed") {
          currentStep = 6;
        } else {
          currentStep = 1;
        }

        const steps = stepsContainer.current?.querySelectorAll(".step");
        steps?.forEach((step, index) => {
          if (index < currentStep) {
            step.classList.add("completeStep");
          } else {
            step.classList.remove("completeStep");
          }
        });

        const joiningLines =
          stepsContainer.current?.querySelectorAll(".comPleteLine");
        joiningLines?.forEach((line, index) => {
          if (index < currentStep - 1) {
            line.classList.add("comPleteLineComplete");
            (line as HTMLElement).style.width = 100 + "%";
          } else {
            line.classList.remove("comPleteLineComplete");
          }

          if (index === currentStep - 1) {
            line.classList.add("currentLine");

            (line as HTMLElement).style.width =
              Math.floor(data.statusPercentage) + "%";
          } else {
            line.classList.remove("currentLine");
          }
        });
      },
      (e) => {
        if (loading) setLoading(false);
        console.log(e);

        setErrorMessage("Error in retrieving data");
      }
    );

    return () => {
      unsub();
    };
  }, [dbId, loading, stepsContainer]);

  if (errorMessage.trim() !== "" || dbId === "undefined") {
    return (
      <main className="downloadLinkComponentWrapper">
        <ErrorMessageContainer message={errorMessage} />
      </main>
    );
  }

  if (loading) {
    return (
      <main className="downloadLinkComponentWrapper">
        <LoadingContainer />
      </main>
    );
  }

  return (
    <main className="downloadLinkComponentWrapper">
      <h2>Generating Link Please Wait...</h2>
      <p className="message">
        You can copy the page url and check the status latter
      </p>
      <p className="message timeLimitMessage">
        Once the link is created it is valid for 2hours
      </p>

      <div className="statusContainer">
        <div className="steps" ref={stepsContainer}>
          <div className="step completeStep">
            <div className="stepNumber ">1</div>
            {/* <div className="stepName">Downloading Video</div> */}
          </div>
          <div className="joiningLine">
            <div className="comPleteLine"></div>
          </div>
          <div className="step">
            <div className="stepNumber">2</div>
            {/* <div className="stepName">Downloading audio</div> */}
          </div>
          <div className="joiningLine">
            <div className="comPleteLine"></div>
          </div>

          <div className="step">
            <div className="stepNumber">3</div>
            {/* <div className="stepName">Merging</div> */}
          </div>
          <div className="joiningLine">
            <div className="comPleteLine"></div>
          </div>

          <div className="step">
            <div className="stepNumber">4</div>
            {/* <div className="stepName">uploading</div> */}
          </div>
          <div className="joiningLine">
            <div className="comPleteLine"></div>
          </div>

          <div className="step">
            <div className="stepNumber">5</div>
            {/* <div className="stepName">uploading</div> */}
          </div>
        </div>
      </div>

      <div className="buttonContainer">
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to={downloadLink?.toString()}
          disabled={downloadLink ? false : true}
        >
          Download
        </Button>
      </div>
    </main>
  );
}
