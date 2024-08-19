import fs from "fs";
import moby from "moby";
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
  const filePath = path.join(dataDirectory, fileName);
  const fileContents = fs.readFileSync(filePath, "utf8");
  return JSON.parse(fileContents);
};

// export function getJsonFiles(directory: string = "src/data"): string[] {
//   const dataDirectory = path.join(process.cwd(), directory);
//   const files = fs.readdirSync(dataDirectory);

//   return files.flatMap((file): string[] => {
//     const fullPath = path.join(dataDirectory, file);
//     const stat = fs.statSync(fullPath);

//     if (stat.isDirectory()) {
//       return getJsonFiles(path.join(directory, file));
//     } else if (file.endsWith(".json")) {
//       return [path.join(directory, file)];
//     }
//     return [];
//   });
// }

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
