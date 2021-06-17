import "path";
import path from "path/posix";

/** Valid tags that can be passed to the config.
 * If the new version is 3.2.1 then the below tags will also push the following tags if defined.
 * - major: myreg.com/myimage:3
 * - minor: myreg.com/myimage:3.2
 * - latest: myreg.com/myimage:latest
 */
type Tags =  "major" | "minor" | "latest"

/** The Plugin Config */
interface DockerPluginConfig {
  /** Name of the registry */
  registry: string;
  /** Name of the image */
  name: string;
  /** Environment variable holding the registry username. Defaults to DOCKER_USERNAME */
  username?: string;
  /** Environment variable holding the registry password. Defaults to DOCKER_PASSWORD */
  password?: string;
  /** The docker folder context. Will default to . */
  context?: string;
  /** The dockerfile to build. Will default to {context}/Dockerfile */
  dockerfile?: string;
  /** List of build args to pass to the docker build */
  buildArgs?: string[];
  /** List of labels to add to the resulting image */
  labels?: string[];
  /** Target stage in the dockerfile to build */
  target?: string;
  /** Whether or not to publish the image to the registry */
  push?: boolean;
  /** List of tags to publish along with the full version */
  tags?: Tags[];
  /** Setting this will allow the underlying execution library (execa) to use a shell */
  shell?: boolean;
  /** boolean toggle to enable buildkit */
  enableBuildkit?: boolean;
  //TODO Add secret support
}


export function setConfigDefaults(pluginConfig: DockerPluginConfig): Required<DockerPluginConfig> {
  let defaultDockerfile = "./Dockerfile"
  if (pluginConfig.context != null && pluginConfig.dockerfile == null) {
    defaultDockerfile = path.join(pluginConfig.context, "Dockerfile")
  }
  return {
    username: "DOCKER_USERNAME",
    password: "DOCKER_PASSWORD",
    context: ".",
    dockerfile: defaultDockerfile,
    buildArgs: [],
    labels: [],
    target: "",
    push: true,
    tags: ["latest","major","minor"],
    shell: false,
    enableBuildkit: false,
    ...pluginConfig
  }
}

export {
  DockerPluginConfig,
  Tags
}

