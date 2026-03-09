import pdf from "pdf-parse"
import fs from "fs"

export const extractText = async (filePath) => {

const dataBuffer = fs.readFileSync(filePath)

const data = await pdf(dataBuffer)

return data.text

}