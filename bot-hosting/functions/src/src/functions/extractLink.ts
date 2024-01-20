import { Message } from "telegraf/types";

export default function extractLInk(message: string) {
  const regex = /(https?:\/\/[^\s]+)/g;
  const link = message.match(regex);
  if (link) {
    return link[0];
  } else {
    return null;
  }
}
