import fse from "fs-extra";

export async function getLocaleResources(path: string) {
  const resources: Record<string, Record<string, any>> = {};

  // Get list of language directories
  const localesList = await fse.readdir(path);

  // Iterate through each language directory
  for (const langDir of localesList) {
    const lang = langDir.replace("/", ""); // Remove trailing slash if present
    resources[lang] = {};

    // Get list of namespace files in this language directory
    const namespaceFiles = await fse.readdir(`${path}/${lang}`);

    // Iterate through each namespace file
    for (const nsFile of namespaceFiles) {
      if (!nsFile.endsWith(".json")) continue;

      const namespace = nsFile.replace(".json", "");
      const content = await fse.readFile(`${path}/${lang}/${nsFile}`);
      resources[lang][namespace] = JSON.parse(content.toString());
    }
  }

  return resources;
}
