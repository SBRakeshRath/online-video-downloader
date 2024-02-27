import "./errorMessageContainer.scss";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function errorMessageContainer(props: {
  message?: string;
  heading?: string;
}) {
  return (
    <div className="errorMessageContainer">
      <div className="iconContainer">
        <ErrorOutlineIcon />
      </div>
      {/* <h2>{props.heading || "ERROR"}</h2> */}
      <p>{props.message || "Something wrong Happened"}</p>
    </div>
  );
}
