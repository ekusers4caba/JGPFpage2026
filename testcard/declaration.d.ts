declare module "*.css" {
  const content: string;
  export default content;
}

declare module "bun" {
  function file(path: string): Promise<File>;
  export { file };
}