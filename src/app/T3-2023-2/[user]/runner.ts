import { $ } from "zx";
import { existsSync as fileExists } from "fs";
// $.verbose = false;

const thisDir = "./src/app/T3-2023-2/[user]";

const runInContainer = (containerId: string, command: string) => $`docker exec ${containerId} bash -c ${command}`;

export async function run(repo: string) {
  const runnerDir = (await $`mktemp -d`).stdout.trim();
  const containerIdP = await $`docker run -d -v ${runnerDir}:/runner carlogauss33/edd-runner sleep infinity`;
  const containerId = containerIdP.stdout.trim();
  try {
    console.log(`Running ${repo} in ${runnerDir}`);
    await $`git clone ${repo} ${runnerDir} --depth 1`;

    await runInContainer(containerId, "make");

    await $`mkdir -p ${runnerDir}/tests`;
    await $`cp -r ${thisDir}/tests/. ${runnerDir}/tests/.`;

    if (!fileExists(`${runnerDir}/magic`)) {
      throw new Error("magic binary not found");
    }

    await $`ls -l ${runnerDir}`;
    await $`ls -l ${runnerDir}/tests`;
    const timeP = await runInContainer(
      containerId,
      "/usr/bin/time -f '%e' ./magic ./tests/magic/easy/test1.txt output.txt"
    );
    const time = parseFloat(timeP.toString().trim());

    const returned = (await $`cat ${runnerDir}/output.txt`).stdout.trim();
    const expected = (await $`cat ${thisDir}/tests/magic/easy/output1.txt`).stdout.trim();
    return { returned, expected, time };
  } finally {
    await $`rm -rf ${runnerDir}`;
    await $`docker container rm --force ${containerId}`;
  }
}
