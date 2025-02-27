import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const table = base("Task");

export interface Task {
  id: string;
  name: string;
  description: string;
  assignee: string;
  dueDate: string; // Format ISO (YYYY-MM-DD)
  status: "Pending" | "In Progress" | "Completed";
}

//Fetch all Tasks
export async function getTasks(): Promise<Task[]> {
  const records = await table.select({ view: "Grid view" }).firstPage();
  return records.map((record) => ({
    id: record.id,
    name: record.get("Name") as string,
    description: record.get("Description") as string,
    assignee: record.get("Assignee") as string,
    dueDate: record.get("DueDate") as string,
    status: record.get("Status") as "Pending" | "In Progress" | "Completed",
  }));
}

//Add task
export async function addTask(task: Omit<Task, "id">): Promise<Task> {
  const createdRecord = await table.create([
    {
      fields: {
        Name: task.name,
        Description: task.description,
        Assignee: task.assignee,
        DueDate: task.dueDate,
        Status: task.status,
      },
    },
  ]);
  return {
    id: createdRecord[0].id,
    ...task,
  };
}

//Update task
export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const updatedRecord = await table.update([
    {
      id,
      fields: {
        ...(updates.name && { Name: updates.name }),
        ...(updates.description && { Description: updates.description }),
        ...(updates.assignee && { Assignee: updates.assignee }),
        ...(updates.dueDate && { DueDate: updates.dueDate }),
        ...(updates.status && { Status: updates.status }),
      },
    },
  ]);
  return {
    id: updatedRecord[0].id,
    name: updatedRecord[0].fields.Name as string,
    description: updatedRecord[0].fields.Description as string,
    assignee: updatedRecord[0].fields.Assignee as string,
    dueDate: updatedRecord[0].fields.DueDate as string,
    status: updatedRecord[0].fields.Status as "Pending" | "In Progress" | "Completed",
  };
}

//Delete task
export async function deleteTask(id: string): Promise<void> {
  await table.destroy(id);
}
