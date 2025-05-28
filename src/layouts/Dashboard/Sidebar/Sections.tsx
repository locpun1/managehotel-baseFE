import { TFunction } from 'i18next';

import type { SvgIconComponent } from '@mui/icons-material';
import { Assignment, Badge, ConnectedTv, EventNote, HomeOutlined, MoreTime } from '@mui/icons-material';

import { ROUTE_PATH } from '@/constants/routes';
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

const Sections = (t: TFunction): Section[] => {  
  return AdminSections(t);
};
const AdminSections = (t: TFunction) : Section[] => [
  {
    section: null,
    items: [
      {
        title: t('home'),
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_HOME}`,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('manage-work'),
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_WORK}`,
        icon: Assignment,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('manage-display'),
        path: `${ROUTE_PATH.MANAGE}/${ROUTE_PATH.MANAGE_DISPLAY}`,
        icon: ConnectedTv,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('profile-user'),
        path: "#",
        icon: Badge,
      },
    ],
  },
]
const UserSection = (t: TFunction): Section[] => [
  {
    section: null,
    items: [
      {
        title: t('home'),
        path: ROUTE_PATH.HOME,
        icon: HomeOutlined,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('list-work'),
        path: "#",
        icon: EventNote,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('manage-work'),
        path: "#",
        icon: Assignment,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('updated-day'),
        path: "#",
        icon: MoreTime,
      },
    ],
  },
  {
    section: null,
    items: [
      {
        title: t('profile-user'),
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
