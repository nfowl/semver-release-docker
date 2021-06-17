import { DockerPluginConfig, setConfigDefaults } from "./config";
import { parse } from "semver";
import execa from "execa";

export async function publish(
  pluginConfig: DockerPluginConfig,
  context: PreparePublishContext
) {
  let sanitizedConfig = setConfigDefaults(pluginConfig);
  let semanticVersion = parse(context.nextRelease.version);
  let tags: string[] = [];

  if (sanitizedConfig.enableBuildkit) {
    process.env.DOCKER_BUILDKIT = "1"
  }

  if (sanitizedConfig.tags.includes("major") && semanticVersion?.major) {
    tags.push(`${semanticVersion.major}`);
  }
  if (sanitizedConfig.tags.includes("minor") && semanticVersion?.minor) {
    tags.push(`${semanticVersion.major}.${semanticVersion.minor}`);
  }

  for (const tag of tags) {
    await execa(
      "docker",
      [
        "tag",
        `${sanitizedConfig.registry}/${sanitizedConfig.name}:latest`,
        `${sanitizedConfig.registry}/${sanitizedConfig.name}:${tag}`,
      ],
      { shell: sanitizedConfig.shell, stdio: "inherit" }
    ).stdout?.pipe(process.stdout);
  }

  await execa(
    "docker",["push", "--all-tags", `${sanitizedConfig.registry}/${sanitizedConfig.name}`]
  ).stdout?.pipe(process.stdout);

  for (const tag of tags) {
    await execa("docker", [
      "tag",
      `${sanitizedConfig.registry}/${sanitizedConfig.name}:latest`,
      `${sanitizedConfig.registry}/${sanitizedConfig.name}:${tag}`,
    ]).stdout?.pipe(process.stdout);
  }
}
