import { TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
// import search icon
import SearchIcon from "@mui/icons-material/Search";
import "./linkContainer.scss";
import React from "react";
import LinkContext from "../../../context/inputLinkContext";

export default function LinkContainer() {
  const youtubeUrlRef = React.useRef<HTMLInputElement>(null);
  const { updateLink } = React.useContext(LinkContext);

  const handelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const link = youtubeUrlRef.current
      ?.getElementsByTagName("input")[0]
      .value.trim();

    if (!link || link === "") {
      alert("Please enter a link to download");
      return;
    }
    updateLink(link.trim());
  };

  return (
    <div className="linkContainer">
      <form className="inputBox" onSubmit={handelSubmit}>
        <TextField
          className="linkEnterBox"
          label="Enter Link to Download"
          name="link"
          ref={youtubeUrlRef}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <button type="submit">
                  <SearchIcon />
                </button>
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
      </form>
    </div>
  );
}
