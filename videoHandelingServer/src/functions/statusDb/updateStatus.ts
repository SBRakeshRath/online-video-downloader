import axios from "axios";

export default async function updateStatus(
  status: string,
  id: string,
  statusPercentage: number,

  link?: string
) {
  await axios.post(process.env.STATUS_DB_LINK, {
    data: {
      id,
      status,
      link: link ? link : null,
      statusPercentage: statusPercentage,
      updatedAt: new Date().toISOString(),
    },
  });
}
