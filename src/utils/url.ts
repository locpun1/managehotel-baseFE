// fill data to pattern's params
export const prepareRealPath = (
  pattern: string = '',
  params: Record<string, string | number> = {},
) => {
  let path = pattern;

  Object.keys(params).forEach((key) => {
    const value = params[key]?.toString();
    path = path.replace(`:${key}`, value);
  });

  return path;
};

const VITE_BASE_URL_PRODUCTION ='https://managehotel.vercel.app'
const baseUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_BASE_URL : VITE_BASE_URL_PRODUCTION; 


export function convertRoomPathToDisplayRemoteUrl(path: string): string {
  // path từ BE là "/room/101" → muốn "/display-remote/room/101"
  return `${baseUrl}/display-remote${path}`;
}