import "./downloadInstruction.scss";

export default function DownloadInstruction() {
  return (
    <div className="instructionComponentWrapper">
      <div className="instructionContainer">
        <h2>How to Download</h2>
        <div className="instruction">
          <div className="instructionMessageContainer">
            <div className="circle">
              <h3>1</h3>
            </div>
            <p>Copy the URL of the video you want to download</p>{" "}
          </div>

          <div className="instructionMessageContainer">
            <div className="circle">
              <h3>2</h3>
            </div>
            <p>
              Paste the URL in the search bar and click on the search button
            </p>
          </div>

          <div className="instructionMessageContainer">
            <div className="circle">
              <h3>3</h3>
            </div>
            <p>Search for available options</p>
          </div>

          <div className="instructionMessageContainer">
            <div className="circle">
              <h3>4</h3>
            </div>
            <p>Choose the format</p>
          </div>

          <div className="instructionMessageContainer">
            <div className="circle">
              <h3>5</h3>
            </div>
            <p>Download</p>
          </div>
        </div>
      </div>
    </div>
  );
}
