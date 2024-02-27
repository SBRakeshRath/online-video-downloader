import { CloudTasksClient, protos } from "@google-cloud/tasks";

const queue_name = "video-audio-merger";
const project_id = "online-video-downloader-410712";
const location = "asia-south1";


export default async  function createTask(task:protos.google.cloud.tasks.v2beta3.ITask) {
    
  const client = new CloudTasksClient();
  const parent = client.queuePath(project_id, location, queue_name);

  await client.createTask({
        parent: parent,
        task: task,
    });
}