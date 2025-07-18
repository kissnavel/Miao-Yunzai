import fs from "node:fs"
import childProcess from "child_process"

const _path = process.cwd()

fs.readFile(`${_path}/config/pm2/pm2.json`, "utf8", (err, data) => {
  if (err) {
    console.error("pm2.json文件读取错误:", err)
    return
  }

  try {
    const config = JSON.parse(data)
    if (config.apps && config.apps.length > 0 && config.apps[0].name) {
      const appName = config.apps[0].name
      runPm2Logs(appName)
    } else {
      console.error("读取失败：无法在pm2.json中找到name数组")
    }
  } catch (parseError) {
    console.error("读取失败：json文件解析发生了错误", parseError)
  }
})

function runPm2Logs(appName) {
  const command = process.platform === "win32" ? "pm2.cmd" : "pm2"
  const args = ["logs", "--lines", "400", appName]

  // console.log(`Command: ${command}`)
  // console.log(`Args: ${args.join(" ")}`)

  const pm2LogsProcess = childProcess.spawn(command, args, { stdio: "inherit", shell: true })

  pm2LogsProcess.on("error", error => {
    console.error("Error spawning pm2 logs process:", error)
  })

  pm2LogsProcess.on("exit", code => {
    if (code !== 0) {
      console.error(`pm2 logs process exited with code ${code}`)
    }
  })
}
