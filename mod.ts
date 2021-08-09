import { addCors } from "./cors.ts";
import { staticFns } from "./src/statics/mod.ts";
import { dynamicFns } from "./src/dynamics/mod.ts";
import { serve } from "https://deno.land/std@0.101.0/http/server.ts";
import { handleFakeDb } from "./src/utils/bootstrap/initializeDB.ts";
import { firstPageSlice } from "./src/isdb/blog/blogFirstPage/mod.ts";
import { DynamicModels, parsBody, StaticModels } from "./src/utils/mod.ts";

const s = serve({ port: 8000 });
console.log("http://localhost:8000/");

await firstPageSlice.setup();
Deno.args.includes("--gen-data") && (await handleFakeDb());

const corsRespond = {
  headers: addCors(),
};

for await (const req of s) {
  try {
    //for handling cors issue
    req.method === "OPTIONS" &&
      req.respond({
        ...corsRespond,
      });

    const response = async () => {
      const {
        contents,
        wants: { model, doit },
        details,
        context,
      } = await parsBody(req);

      return {
        ["dynamic"]: () =>
          dynamicFns(model as DynamicModels, doit, details, context),
        ["static"]: () => staticFns(model as StaticModels, doit),
      }[contents]();
    };
    req.respond({
      ...corsRespond,
      body: JSON.stringify({
        success: true,
        body: await response(),
      }),
      status: 200,
    });
  } catch (error) {
    req.respond({
      ...corsRespond,
      body: JSON.stringify({
        success: false,
        body: error.message || "I don't know what happens ...",
      }),
      status: 500,
    });
  }
}
