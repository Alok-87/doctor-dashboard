import {
  IconLayoutDashboard,
  IconCalendarEvent,
  IconUsers,
  IconClipboardList,
  IconPill,
  IconReportMedical,
  IconStethoscope,
  IconMessage,
  IconBell,
  IconSettings,
  IconLogin,
  IconUserPlus,
  IconChartBar,
  IconHeartbeat,
  IconReportMoney,
  IconCash,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "MAIN",
  },
  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },

  {
    navlabel: true,
    subheader: "APPOINTMENTS",
  },
  {
    id: uniqueId(),
    title: "Appointments",
    icon: IconCalendarEvent,
    href: "/appointments",
  },


  {
    navlabel: true,
    subheader: "FINANCE",
  },
  {
    id: uniqueId(),
    title: "wallet",
    icon: IconCash, // or IconWallet
    href: "/finance/wallet",
  },
  {
    id: uniqueId(),
    title: "ledger",
    icon: IconReportMoney, // or IconWallet
    href: "/finance/ledger",
  },


  {
    navlabel: true,
    subheader: "SETTINGS",
  },
  {
    id: uniqueId(),
    title: "Profile Settings",
    icon: IconSettings,
    href: "/profile",
  },

];

export default Menuitems;