import { NextResponse } from "next/server";
import Airtable from "airtable";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID!);
const table = base(process.env.AIRTABLE_TABLE_NAME!);

//POST request
export async function POST(req: Request) {
    try {
      const { name, description, assignee, dueDate, status } = await req.json();
  
      if (!name || !description || !assignee || !dueDate || !status) {
        return NextResponse.json({ error: "All fields are required" }, { status: 400 });
      }

      //Convert the date in ISO  string format before sending to Airtable
      const formattedDueDate = new Date(dueDate).toISOString();
  
      const createdRecord = await table.create([
          {
              fields: {
                  Name: name,
                  Description: description,
                  Assignee: assignee,
                  DueDate: formattedDueDate, // Format ISO
                  Status: status,
              },
          },
      ]);
  
      return NextResponse.json(
        {
          id: createdRecord[0].id,
          name: createdRecord[0].fields.Name,
          description: createdRecord[0].fields.Description,
          assignee: createdRecord[0].fields.Assignee,
          dueDate: createdRecord[0].fields.DueDate,
          status: createdRecord[0].fields.Status,
        },
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }


//GET request
export async function GET() {
    try {
      const records = await table.select({ view: "Grid view" }).firstPage();
      const tasks = records.map((record) => ({
        id: record.id,
        name: record.get("Name") as string,
        description: record.get("Description") as string,
        assignee: record.get("Assignee"),
        dueDate: record.get("DueDate"),
        status: record.get("Status") as string,
      }));
      return NextResponse.json(tasks, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


//PUT request
export async function PUT(req: Request) {
    try {
      const { id, name, description, assignee, dueDate, status } = await req.json();
  
      if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });

      const fieldsToUpdate: any = {};
      if (name) fieldsToUpdate.Name = name;
      if (description) fieldsToUpdate.Description = description;
      if (assignee) fieldsToUpdate.Assignee = assignee;
      if (dueDate) fieldsToUpdate.DueDate = new Date(dueDate).toISOString(); // Convertir en format ISO
      if (status) fieldsToUpdate.Status = status;
  
      const updatedRecord = await table.update([{ id, fields: fieldsToUpdate }]);
  
      return NextResponse.json(
        {
          id: updatedRecord[0].id,
          name: updatedRecord[0].fields.Name,
          description: updatedRecord[0].fields.Description,
          assignee: updatedRecord[0].fields.Assignee,
          dueDate: updatedRecord[0].fields.DueDate,
          status: updatedRecord[0].fields.Status,
        },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}


  //DELETE request
export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
      if (!id) return NextResponse.json({ error: "ID is required" }, { status: 400 });
  
      await table.destroy(id);
      return NextResponse.json({ message: "Task deleted" }, { status: 200 });
    } catch (error) {
      return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
  }
  