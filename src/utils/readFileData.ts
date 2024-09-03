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
  const dataDirectory = path.join(process.cwd(), "src");
  console.log("DATA_DIR: ", { dataDirectory, cwd: process.cwd() });
  const filePath = path.join(dataDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};

export interface Directory {
  dirName: string;
  directories: Directory[];
  files: string[];
}

/**
 * Generates a directory structure object
 * @param {string} dirPath - Path to the directory
 * @returns {Directory}
 */
function generateDirectoryStructure(dirPath: string): Directory {
  const dirName = path.basename(dirPath);
  const dirContent = fs.readdirSync(dirPath);

  const directories: Directory[] = [];
  const files: string[] = [];

  dirContent.forEach((item) => {
    const itemPath = path.join(dirPath, item);
    const itemStat = fs.statSync(itemPath);

    if (itemStat.isDirectory()) {
      directories.push(generateDirectoryStructure(itemPath));
    } else if (itemStat.isFile() && item.endsWith(".json")) {
      files.push(item);
    }
  });

  return {
    dirName,
    directories,
    files,
  };
}

export function getJsonFiles(directory: string = "src/data"): Directory {
  const dataDirectory = path.join(process.cwd(), directory);
  return generateDirectoryStructure(dataDirectory);
}
