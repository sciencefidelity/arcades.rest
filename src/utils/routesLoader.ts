import glob from 'glob'

export default function(dirname:any) {
  return new Promise((resolve, reject) => {
    const routes:any[] = []
    glob(
      `${dirname}/*`,
      {
        ignore: '**/index.ts'
      },
      (err, files) => {
        if (err) {
          return reject(err)
        }
        files.forEach(file => {
          const route = require(file)
          routes.push(route)
        })
        return resolve(routes)
      }
    )
  })
}
