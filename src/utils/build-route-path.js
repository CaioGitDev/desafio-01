export function buildRoutePath(path) {
  const routeParametersRegex = /:([a-zA-Z]+)/g
  const pathWithParams = path.replace(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
  return new RegExp(`^${pathWithParams}(?<query>\\?(.*))?$`)
}