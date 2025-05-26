import { TFunction } from 'i18next';

import type { SvgIconComponent } from '@mui/icons-material';
import { Assignment, Badge, ConnectedTv, EventNote, HomeOutlined, MoreTime } from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';
import { ROLE } from '@/constants/roles';
import { useAppSelector } from '@/store';

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

const Sections = (role?: string | string | null): Section[] => {
  switch (role) {
    case ROLE.MANAGER:
      return AdminSections();
    case ROLE.STAFF:
      return UserSection(); 
    default:
      return [];
  }
};
const AdminSections = () : Section[] => [
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
        path: "#",
        icon: Badge,
      },
    ],
  },
]
const UserSection = (): Section[] => [
  {
    section: null,
    items: [
      {
        title: 'Trang chủ',
        path: ROUTE_PATH.HOME,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Danh sách công việc',
        path: "#",
        icon: EventNote,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Quản lý công việc',
        path: "#",
        icon: Assignment,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Báo cáo công việc',
        path: "#",
        icon: MoreTime,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: 'Hồ sơ người dùng',
        path: "#",
        icon: Badge,
      },
    ],
  },
  
  // {
  //   section: null,
  //   items: [
  //     {
  //       title: t('customer'),
  //       path: ROUTE_PATH.CUSTOMERS,
  //       icon: PeopleOutlined,
  //       children: [
  //         {
  //           title: t('customer'),
  //           icon: PeopleOutline,
  //           path: ROUTE_PATH.CUSTOMERS_LIST,
  //         },
  //       ],
  //     },
  //   ],
  // },
];

export default Sections;
