import fs from "fs";
import path from "path";

export const getJsonFilenames = () => {
  const dataDirectory = path.join(process.cwd(), "src/data");
  console.log(dataDirectory);
  const fileNames = fs.readdirSync(dataDirectory);
  const jsonFileNames = fileNames.filter((file) => file.endsWith(".json"));
  console.log(jsonFileNames);
  return jsonFileNames;
};

export const getJsonContent = (fileName: string) => {
  const dataDirectory = path.join(process.cwd(), "src/data");
  const filePath = path.join(dataDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};
