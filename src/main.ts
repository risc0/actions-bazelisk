import * as core from '@actions/core'
import * as tc from '@actions/tool-cache'
import * as fs from 'fs'

const BAZELISK_VERSION = 'v1.12.0'

async function run(): Promise<void> {
  core.info('Running actions-bazelisk')

  const GITHUB_SERVER_URL = process.env.GITHUB_SERVER_URL
  const bazelisk = await tc.downloadTool(
    `${GITHUB_SERVER_URL}/bazelbuild/bazelisk/releases/download/${BAZELISK_VERSION}/${releaseName()}`
  )

  await fs.promises.chmod(bazelisk, 0o755)

  const cachedPath = await tc.cacheFile(
    bazelisk,
    process.platform === 'win32' ? 'bazelisk.exe' : 'bazelisk',
    'bazelisk',
    BAZELISK_VERSION
  )

  core.info(`bazelisk downloaded and cached at ${cachedPath}`)
  core.addPath(cachedPath)
}

function releaseName(): string {
  switch (process.platform) {
    case 'win32':
      return 'bazelisk-windows-amd64.exe'
    case 'darwin':
      return 'bazelisk-darwin-amd64'
    default:
      return 'bazelisk-linux-amd64'
  }
}

run()
