declare module "*.worker?worker" {
  const workerConstructor: new () => Worker;
  export default workerConstructor;
}

declare module "*?raw" {
  const content: string;
  export default content;
}
