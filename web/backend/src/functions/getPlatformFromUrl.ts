export default function getPlatformFromUrl(link: string) {
  //CHECK FOR VALID URL

  if (!link) {
    return false;
  }
  try {
    const url = new URL(link);
    const host = url.host;

    if (host.includes("youtube") || host.includes("youtu.be")) {
      return "youtube";
    }
  } catch (error) {
    return false;
  }

  return false;
}
