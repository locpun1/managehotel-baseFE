import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const ManagementHome = Loadable(lazy(() => import('@/views/Manager/ManagementHome/index')));
const ManagementWork = Loadable(lazy(() => import('@/views/Manager/ManagementWork/index')));
const ManagementDisplayRemote = Loadable(lazy(() => import('@/views/Manager/ManagementDisplayRemote/index')));



const Manager: RouteObject = {
    path:ROUTE_PATH.MANAGE,
    element:<Outlet/>,
    children: [
        { path: ROUTE_PATH.MANAGE_HOME, element:<ManagementHome />},
        { path: ROUTE_PATH.MANAGE_WORK, element:<ManagementWork />},
        { path: ROUTE_PATH.MANAGE_DISPLAY, element:<ManagementDisplayRemote />}

    ]
}

export default Manager;