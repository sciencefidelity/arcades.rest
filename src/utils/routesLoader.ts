import glob from "glob"

export const RoutesLoader = (dirname: string): Promise<string[]> => new Promise((resolve, reject) => {
    const routes: string[] = []
    glob(`${dirname}/*`, { ignore: "**/index.ts" }, (err, files) => {
      if (err) return reject(err)
      files.forEach((file) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const route = require(file)
        routes.push(route)
      })
      return resolve(routes)
    })
  })
