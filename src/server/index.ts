
export default (signal: AbortSignal) : void => {
  Deno.serve({port: 8080, signal}, () => {
    return new Response("Hello from Deno server!");
  });
};
