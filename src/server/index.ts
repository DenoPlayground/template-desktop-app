Deno.readTextFile('./dist/bundle/index.html').then(
  (file) => Deno.serve({port: 8080}, () => {
    return new Response(file);
  })
);
