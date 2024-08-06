import fs from "fs";
import path from "path";

export const getJsonFilenames = () => {
  const dataDirectory = path.join(process.cwd(), "src/data");
  const fileNames = fs.readdirSync(dataDirectory);
  const jsonFileNames = fileNames.filter((file) => file.endsWith(".json"));
  console.log(fileNames);
  return jsonFileNames;
};

export const getJsonContent = (fileName: string) => {
  const dataDirectory = path.join(process.cwd(), "src/data");
  const filePath = path.join(dataDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};

export function getJsonFiles(directory: string = "src/data"): string[] {
  const dataDirectory = path.join(process.cwd(), directory);
  const files = fs.readdirSync(dataDirectory);

  return files.flatMap((file): string[] => {
    const fullPath = path.join(dataDirectory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      return getJsonFiles(path.join(directory, file));
    } else if (file.endsWith(".json")) {
      return [path.join(directory, file)];
    }
    return [];
  });
}
