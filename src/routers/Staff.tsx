import Loadable from "@/components/Loadable";
import { ROUTE_PATH } from "@/constants/routes";
import { lazy } from "react";
import { Outlet, RouteObject } from "react-router-dom";

const StaffHome = Loadable(lazy(() => import('@/views/Staff/Home/index')));
const StaffWork = Loadable(lazy(() => import('@/views/Staff/TaskList/index')));
const StaffReport = Loadable(lazy(() => import('@/views/Staff/Report/index')));
const StaffProfile= Loadable(lazy(() => import('@/views/Staff/Profile/index')));

const Staff: RouteObject = {
    path:ROUTE_PATH.STAFF,
    element:<Outlet/>,
    children: [
        { path: `${ROUTE_PATH.STAFF_HOME}/:roomId`, element:<StaffHome />},
        { path: ROUTE_PATH.STAFF_WORK, element:<StaffWork />},
        { path: ROUTE_PATH.STAFF_REPORT, element:<StaffReport />},
        { path: ROUTE_PATH.STAFF_PROFILE, element:<StaffProfile />}
    ]
}

export default Staff;