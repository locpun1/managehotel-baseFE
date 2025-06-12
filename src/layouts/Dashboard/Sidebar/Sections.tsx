import type { SvgIconComponent } from '@mui/icons-material';
import { Assignment, Badge, ConnectedTv, EventNote, HomeOutlined } from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';
import { ID_ROOM } from '@/views/Staff/Home';

export interface SectionItem {
  title: string;
  path: string;
  children?: SectionItem[];
  info?: () => JSX.Element;
  icon?: SvgIconComponent;
}

interface Section {
  section: string | null;
  items: SectionItem[];
}

const Sections = (section: Section[]): Section[] => {  
  return section
};
export const AdminSections = () : Section[] => [
  {
    section: null,
    items: [
      {
        title: 'Trang chủ',
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Quản lý công việc',
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_WORK}`,
        icon: Assignment,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Quản lý Display Remote',
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_DISPLAY}`,
        icon: ConnectedTv,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Hồ sơ người dùng',
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_PROFILE}`,
        icon: Badge,
      },
    ],
  },
]
const roomId = localStorage.getItem(ID_ROOM);

export const UserSection = (): Section[] => [
  {
    section: null,
    items: [
      {
        title: 'Trang chủ',
        path:  `${ROUTE_PATH.STAFF}/${ROUTE_PATH.STAFF_HOME}/${roomId}`,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Danh sách công việc',
        path: `${ROUTE_PATH.STAFF}/${ROUTE_PATH.STAFF_WORK}`,
        icon: EventNote,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Báo cáo công việc',
        path: `${ROUTE_PATH.STAFF}/${ROUTE_PATH.STAFF_REPORT}`,
        icon: Assignment,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Hồ sơ người dùng',
        path: `${ROUTE_PATH.STAFF}/${ROUTE_PATH.STAFF_PROFILE}`,
        icon: Badge,
      },
    ],
  },
];

export default Sections;
