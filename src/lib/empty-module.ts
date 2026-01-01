// Empty module stub for Node.js modules that don't work in browser
export default {};
export const readFileSync = () => null;
export const existsSync = () => false;
export const join = (...args: string[]) => args.join("/");
export const resolve = (...args: string[]) => args.join("/");
export const dirname = () => "";
export const basename = () => "";
