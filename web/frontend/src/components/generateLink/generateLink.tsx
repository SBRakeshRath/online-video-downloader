import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Navigate } from "react-router-dom";
import LoadingContainer from "../LoadingConatiner/loadingContainer";
import "./generateLink.scss";
import ErrorMessageContainer from "../error/errorMessageContainer";

export default function GenerateLink() {
  //now get params from the url
  const url = new URL(window.location.href);
  const q = url.searchParams.get("q");
  const l = url.searchParams.get("l");

  //now make the request to the server

  const { isFetching, error, data } = useQuery({
    queryKey: ["generateLink", q, l],
    queryFn: async () => {
      const data = {
        url: l,
        quality: q,
      };
      const response = await axios(
        import.meta.env.VITE_BACKEND_URL + "/createVideoToMerge",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        }
      );

      return response.data;
    },
  });

  if (isFetching) {
    return (
      <div className="generateLinkContainerWrapper">
        <div className="generateLinkContainer">
          <LoadingContainer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="generateLinkContainerWrapper">
        <div className="generateLinkContainer">
          <ErrorMessageContainer message={error.message} />
        </div>
      </div>
    );
  }

  return <Navigate to={`/download/${data.dbId}`} />;
}
