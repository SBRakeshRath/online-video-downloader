import { useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect } from "react";
import inputLinkContext from "../../../context/inputLinkContext";
import LoadingContainer from "../../LoadingConatiner/loadingContainer";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import axios, { AxiosError } from "axios";
import "./resultContainer.scss";
import FlashOnIcon from "@mui/icons-material/FlashOn";
import DownloadInstruction from "../../instruction/instruction";
import ErrorMessageContainer from "../../error/errorMessageContainer";
export default function ResultContainer() {
  const { link } = useContext(inputLinkContext);
  const [downloadOption, setDownloadOption] = React.useState<
    { [x: string]: boolean | string | number }[]
  >([]);

  const [downloadFormat, setDownloadFormat] = React.useState<
    "audio" | "video" | "videoNoAudio"
  >("video");

  const [currentDownloadFormat, setCurrentDownloadFormat] = React.useState<
    "audio" | "video" | "videoNoAudio"
  >("video");

  const { data, isFetching, error } = useQuery({
    queryKey: ["videoInfo", link],
    staleTime: 1000 * 60 * 60 * 24 * 7, // 1 week
    enabled: !!link && link !== "",
    queryFn: async ({ queryKey }) => {
      const [, link] = queryKey;

      if (!link) {
        throw {
          reason: "NO_LINK_PROVIDED",
        };
      }
      const data = {
        url: link,
      };
      const res = await axios({
        method: "POST",
        url: import.meta.env.VITE_BACKEND_URL + "/getVideoInfo",
        data: data,
      });
      return res.data;
    },
  });

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handelOptionClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const buttons = e.currentTarget.parentElement?.children;

    if (!buttons) return;

    if (!e.currentTarget) return;

    const downloadOption = e.currentTarget.dataset.downloadOption;
    setCurrentDownloadFormat(
      downloadOption as "audio" | "video" | "videoNoAudio"
    );
  };

  const videoGenerateLink = (q: string, l: string) => {
    const link = window.location.href + "generateLink";

    const url = new URL(link);

    url.searchParams.set("q", q);
    url.searchParams.set("l", l);

    return url.href;
  };

  //

  useEffect(() => {

    if (!data) return;

    setDownloadFormat(currentDownloadFormat);

    if (currentDownloadFormat === "video") {
      const uniqueFormats = [...data.videoFormats];

      uniqueFormats.forEach((format: { [x: string]: boolean }) => {
        format["instant"] = true;
      });

      //now remove duplicate formats bsed on quality label

      data.videoWithoutAudio.forEach((format: { [x: string]: boolean }) => {
        if (
          !uniqueFormats.find((f: { [x: string]: boolean }) => {
            return f.qualityLabel === format.qualityLabel;
          })
        ) {
          uniqueFormats.push(format);
        }
      });

      uniqueFormats.sort((a, b) => {
        return a.qualityLabel - b.qualityLabel;
      });

      setDownloadOption(uniqueFormats);
    } else if (currentDownloadFormat === "audio") {
      setDownloadOption(data.audioFormats);
    } else if (currentDownloadFormat === "videoNoAudio") {
      setDownloadOption(data.videoWithoutAudio);
    } else {
      setDownloadOption([]);
    }
  }, [data, currentDownloadFormat]);


  return (
    <div className="resultContainerWrapper">
      {/* Loading Message Container */}
      {isFetching && <LoadingContainer />}
      {!link && link == "" && <DownloadInstruction />}
      {error && (
        <ErrorMessageContainer
          message={
            error instanceof AxiosError &&
            error.response?.data.error === "Invalid URL"
              ? "Please provide a valid link"
              : "Failed to fetch video information"
          }
        />
      )}

      {data && (
        <div className="resultContainer">
          <div className="showVideoInfo">
            <div className="wrapper">
              <div className="videoThumbnail">
                <img
                  src={
                    data.videoDetails.thumbnails[
                      data.videoDetails.thumbnails.length - 1
                    ].url
                  }
                  alt="video thumbnail"
                  width="100%"
                  height="100%"
                />
              </div>
              <div className="videoInfo">
                <h2>{data.videoDetails.title}</h2>
                <p>{data.videoDetails.description}</p>
              </div>
            </div>
          </div>
          <div className="downloadLinkContainerWrapper">
            <div className="downloadLinkContainer">
              <div className="buttonContainer">
                <button
                  onClick={handelOptionClick}
                  data-download-option="video"
                  className={downloadFormat === "video" ? "active" : ""}
                >
                  Video
                </button>
                <button
                  onClick={handelOptionClick}
                  data-download-option="audio"
                  className={downloadFormat === "audio" ? "active" : ""}
                >
                  Audio
                </button>
                <button
                  onClick={handelOptionClick}
                  data-download-option="videoNoAudio"
                  className={downloadFormat === "videoNoAudio" ? "active" : ""}
                >
                  Video <VolumeOffIcon />
                </button>
              </div>

              <div className="downloadDetailsContainer">
                {downloadOption.map((option) => {
                  return (
                    <a
                      href={
                        downloadFormat === "video" && !option.instant
                          ? videoGenerateLink(
                              option.qualityLabel.toString(),
                              link
                            )
                          : option.url.toString()

                        // option.url.toString()
                      }
                      target="_blank"
                      rel="noreferrer"
                      key={option.url.toString()}
                      className="downloadOption"
                    >
                      <div className="downloadOptionDetails">
                        {option.qualityLabel && <p>{option.qualityLabel}</p>}
                        {downloadFormat !== "video" && (
                          <p>{option.container}</p>
                        )}

                        {option.instant && <FlashOnIcon />}

                        {option.contentLength ? (
                          <p>
                            {formatBytes(
                              parseInt(option.contentLength.toString())
                            )}
                          </p>
                        ) : (
                          <p>Unknown Size</p>
                        )}
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
