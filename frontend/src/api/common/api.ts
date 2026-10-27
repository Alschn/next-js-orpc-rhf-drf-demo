import { AxiosClientInstance } from "./axios";

export class BaseAPI {
  constructor(protected client: AxiosClientInstance) {}

  protected makeDetailPath(
    templatedUrl: string,
    id: number | string,
    templateName = "id",
  ) {
    const searchValue = ["{", templateName, "}"].join("");
    const replacement = id.toString();
    return templatedUrl.replace(searchValue, replacement);
  }
}
