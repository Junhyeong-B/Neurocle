declare module "*.css" {
  interface ClassNamesInterface {
    [className: string]: string;
  }

  const classNames: ClassNamesInterface;
  export = classNames;
}
