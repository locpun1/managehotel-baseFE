import { createContext, useContext } from "react";

export const SidebarTitleContext = createContext<
{
    title: string, setTitle:(title: string) =>  void
}>({
  title: '',
  setTitle: () => {},
});

export const useSidebarTitle = () => useContext(SidebarTitleContext);