export function isDev() {
  return process.env.VITE_DEV_SERVER_URL ? true : false
}
