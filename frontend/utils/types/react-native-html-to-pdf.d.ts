// declare a module augmentation
declare module "react-native-html-to-pdf" {
  export function convert(options: {
    html: string;
    fileName?: string;
    directory?: string;
    base64?: boolean;
  }): Promise<{ filePath: string; base64?: string }>;
}
