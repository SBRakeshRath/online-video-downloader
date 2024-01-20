export default function getPlatform(link: string) {
  const regex = /https?:\/\/(www\.)?([^\/]+)/g;
  const platform = link.match(regex);

  if (!platform) return false;
  let platformName: boolean | string = false;
  if (platform[0].includes("youtube") || platform[0].includes("youtu.be")) platformName = "youtube";
  if (platform[0].includes("instagram")) platformName = "instagram";

  return platformName;
}
