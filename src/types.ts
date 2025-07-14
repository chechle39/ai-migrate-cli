export interface ProjectFile {
  path: string;
  extension: string;
}

export interface ClassifiedFile extends ProjectFile {
  type: string;
}
