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


const baseUrl = import.meta.env.MODE === "development" ? import.meta.env.VITE_BASE_URL : import.meta.env.VITE_API_BASE_URL; 


export function convertRoomPathToDisplayRemoteUrl(path: string): string {
  // path từ BE là "/room/101" → muốn "/display-remote/room/101"
  return `${baseUrl}/display-remote${path}`;
}