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
  apiKey: 'pat7IGsUTdW6hodET.57f45153411c4790f1facb171b8e350cf6397f8648e8a0ee48f6047bee3900ef', //Ahmed
})
const base = Airtable.base('appN9l2gQKpLgPbcJ')

export async function FetchRecords<T>(table: AirTables,  filterByFormula?: string) {
  return new Promise((resolve, reject) => {
    const recordArray: Array<T> = []
    base(table)
      .select({
        view: 'Grid view',
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


export async function RetreiveRecord(table:AirTables, id:string){
  return new Promise((resolve, reject) => {
    base(table)
     .find(id)
     .then((record) => {
        resolve(record)
      })
     .catch((err) => {
      alert("error")
        reject(err)
      })
  })
}