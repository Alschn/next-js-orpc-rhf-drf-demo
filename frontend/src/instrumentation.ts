export async function register() {
  console.log("Preloading server-side oRPC client...");
  await import("./lib/orpc.server");
}
