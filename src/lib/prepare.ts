import execa from "execa";
import { DockerPluginConfig, setConfigDefaults } from "./config";

/**
 * Runs the docker build steps
 * @param pluginConfig
 * @param context
 */
export function prepare(
  pluginConfig: DockerPluginConfig,
  context: PreparePublishContext
) {
  let sanitizedConfig = setConfigDefaults(pluginConfig);
  if (sanitizedConfig.enableBuildkit) {
    process.env.DOCKER_BUILDKIT = "1"
  }
  let args: Array<string> = ["build"]
  args.push("--file",sanitizedConfig.dockerfile)
  if (sanitizedConfig.target) {
    args.push("--target", sanitizedConfig.target)
  }
  for (const buildArg of sanitizedConfig.buildArgs) {
    args.push("--build-arg", buildArg)
  }
  for (const label of sanitizedConfig.labels) {
    args.push("--label", label)
  }
  args.push(sanitizedConfig.context)
  try {
    execa("docker", args, {
      shell: sanitizedConfig.shell,
      stdio: "inherit",
    }).stdout?.pipe(process.stdout);
  } catch (err) {
    throw new Error(`docker build failed due to ${err.message}`);
  }
}
