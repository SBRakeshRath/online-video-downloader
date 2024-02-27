import { useState } from "react";
import inputLinkContext from "./inputLinkContext";

export default function InputLinkContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [link, updateLink] = useState<string>("");

  return (
    <inputLinkContext.Provider
      value={{
        link,
        updateLink,
      }}
    >
      {children}
    </inputLinkContext.Provider>
  );
}
