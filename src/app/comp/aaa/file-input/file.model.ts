export class FileOutput {
  constructor(
    public file?: File,
    public buffer?: any
  ) {
    const Obj = {
      file: file || null,
      buffer: buffer || null
    };
    return Obj;
  }
}
