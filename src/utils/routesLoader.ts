import glob from "glob"

type Routes = string[];

export const RoutesLoader = (dirname: string): Promise<Routes> => {
  return new Promise((resolve, reject) => {
    const routes: Routes = []
    glob(
      `${dirname}/*`,
      {
        ignore: "**/index.ts"
      },
      (err, files) => {
        if (err) {
          return reject(err)
        }
        files.forEach(file => {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const route = require(file)
          routes.push(route)
        })
        return resolve(routes)
      }
    )
  })
}
