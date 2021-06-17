import execa from "execa";
import { DockerPluginConfig, setConfigDefaults } from "./config";

export async function verifyConditions(pluginConfig: DockerPluginConfig, context: VerifyConditionsContext ){
  let sanitizedConfig = setConfigDefaults(pluginConfig);
  if (sanitizedConfig.enableBuildkit) {
    process.env.DOCKER_BUILDKIT = "1"
  }
  if (sanitizedConfig.name == null) {
    throw new Error("docker image name is not defined")
  }
  if (sanitizedConfig.registry == null) {
    throw new Error("docker image registry is not defined")
  }
  try {
    await execa("docker",[
      "login",
      sanitizedConfig.registry,
      '-u=' + process.env[sanitizedConfig.username],
      '-p=' + process.env[sanitizedConfig.password],
    ],
    {
      shell: sanitizedConfig.shell,
      stdio: 'inherit'
    }).stdout?.pipe(process.stdout);
  } catch (err) {
    throw new Error(`failed to login to docker due to ${err.message}`);
  }
}