import * as dotenv from "dotenv";
import "module-alias/register";
import Koa from "koa";
import koaBody from "koa-body";
import error from "koa-json-error";
import Mongoose from "mongoose";
import { networkInterfaces } from "node:os";
import arcadesRoute from "routes/arcades";
import mainRoute from "routes/index";
import usersRoute from "routes/users";

dotenv.config({ path: ".env" });

// conect to DB
const connectionString = process.env.MONGO_ATLAS_STRING;
if (connectionString) {
  await Mongoose.connect(connectionString);
}
Mongoose.connection.on("error", console.error);

// init koa server
const app = new Koa();
const port = process.env.PORT || 3000;

// get the local network address
let address: string;

networkInterfaces().en0?.filter((details) => {
  if (details.family === "IPv4") {
    address = details.address;
  }
  return address;
});

app
  .use(
    koaBody({
      formidable: { uploadDir: "./uploads" },
      multipart: true,
      urlencoded: true,
    })
  )
  .use(mainRoute.routes())
  .use(mainRoute.allowedMethods())
  .use(arcadesRoute.routes())
  .use(arcadesRoute.allowedMethods())
  .use(usersRoute.routes())
  .use(usersRoute.allowedMethods())
  .use(error());

// start server
app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`);
  console.log(`local network http://${address}:${port}`);
});
