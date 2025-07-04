import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const ManagementHome = Loadable(lazy(() => import('@/views/Manager/ManagementHome/index')));
const ManagementWork = Loadable(lazy(() => import('@/views/Manager/ManagementWork/index')));
const ManagementDisplayRemote = Loadable(lazy(() => import('@/views/Manager/ManagementDisplayRemote/index')));
const ManagementProfile= Loadable(lazy(() => import('@/views/Manager/Profile/index')));
const ManagementReport= Loadable(lazy(() => import('@/views/Manager/ManagementReport/index')));
const ManagementTimekeeping= Loadable(lazy(() => import('@/views/Manager/ManagementTimekeepings/index')));
const ManagementHistoryCreateTask= Loadable(lazy(() => import('@/views/History/CreateTask/index')));

const Manager: RouteObject = {
    path:ROUTE_PATH.MANAGE,
    element:<Outlet/>,
    children: [
        { path: ROUTE_PATH.MANAGE_HOME, element:<ManagementHome />},
        { path: ROUTE_PATH.MANAGE_WORK, element:<ManagementWork />},
        { path: ROUTE_PATH.MANAGE_DISPLAY, element:<ManagementDisplayRemote />},
        { path: ROUTE_PATH.MANAGE_REPORT, element:<ManagementReport />},
        { path: ROUTE_PATH.MANAGE_TIMEKEEPINGS, element:<ManagementTimekeeping />},
        { path: ROUTE_PATH.MANAGE_PROFILE, element:<ManagementProfile />},
        { path: ROUTE_PATH.MANAGE_HISTORY_CREATE_TASK, element:<ManagementHistoryCreateTask />},
    ]
}

export default Manager;