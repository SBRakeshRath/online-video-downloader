import { createContext } from "react";

const initialState = {
  link: "",
  updateLink: () => {},
};

interface IContext {
  link: string;
  updateLink: React.Dispatch<React.SetStateAction<string>>;
}

const inputLinkContext =createContext<IContext>(initialState);
// const inputLinkContext = createContext<string>("");

export default inputLinkContext;

