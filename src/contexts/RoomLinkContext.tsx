import { createContext, useContext, useState, ReactNode } from "react";

interface RoomLinkContextType {
  link: Record<any, string>;
  setLink: (roomId: any, link: string) => void;
}

const RoomLinkContext = createContext<RoomLinkContextType | undefined>(undefined);

export const RoomLinkProvider = ({ children }: { children: ReactNode }) => {
  const [link, setRoomLinks] = useState<Record<any, string>>({});

  const setLink = (roomId: any, link: string) => {
    setRoomLinks((prev) => ({ ...prev, [roomId]: link }));
  };

  return (
    <RoomLinkContext.Provider value={{ link, setLink }}>
      {children}
    </RoomLinkContext.Provider>
  );
};

export const useRoomLinkContext = () => {
  const context = useContext(RoomLinkContext);
  if (!context) {
    throw new Error("useRoomLinkContext must be used within RoomLinkProvider");
  }
  return context;
};
