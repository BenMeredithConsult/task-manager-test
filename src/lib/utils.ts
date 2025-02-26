import Airtable from "airtable"


type AirTables = "Task"

// The columns in the table are defined here

// Columns in the knowledge base table = {
//   Name: string,
//   Description: string,
//  Assignee: string,
//   DueDate: Date,
//   Status: "Pending" | "In Progress" | "Completed",
// }


Airtable.configure({
  apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_KEY!, //Laurette
});
const base = Airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export async function FetchRecords<T>(table: AirTables, filter?: Record<string, any>, filterByFormula?: string) {
  return new Promise((resolve, reject) => {
    const recordArray: Array<T> = []
    base(table)
      .select({
        view: 'Grid view',
        ...filter,
        filterByFormula: filterByFormula

      })
      .eachPage(
        (records, fetchNextPage) => {
          for (const record of records) {
            recordArray.push({
              id: record.id,
              ...record.fields,
            } as T)
          }
          fetchNextPage()
        },
        (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(recordArray)
          }
        }
      )
  })
}

export async function UpdateRecord({ table, id, data }: { table: AirTables; id: string; data: any }) {
  return new Promise((resolve, reject) => {
    base(table)
      .update(id, data)
      .then((record) => {
        resolve(record)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function AddRecord({ table, data }: { table: AirTables; data: any }) {
  return new Promise((resolve, reject) => {
    base(table)
      .create(data)
      .then((record) => {
        resolve(record)
      })
      .catch((err) => {
        reject(err)
      })
  })
}

export async function DeleteRecord({ table, id }: { table: AirTables; id: string }) {
  return new Promise((resolve, reject) => {
    base(table)
      .destroy(id)
      .then((record) => {
        resolve(record)
      })
      .catch((err) => {
        reject(err)
      })
  })
}