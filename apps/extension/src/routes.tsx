import { TRoute } from '@/types/route';
import Dashboard from './pages/Dashboard';
import Receive from './pages/Receive';
import Settings from './pages/Settings';
import Connect from './pages/Connect';
import SendTx from './pages/SendTx';
import Alert from './pages/Alert';
import Sign from './pages/Sign';
import TxConfirm from './pages/TxConfirm';
import CreateNewAddress from './pages/CreateNewAddress';
import LocalProfile from './pages/LocalProfile';
import Connection from './pages/Connection';
import ChainChange from './pages/ChainChange';
import Launch from './pages/Launch';

export const SIDE_PANEL_ROUTE_PATHS = {
  Home: '/',
  Settings: '/settings',
  Unlock: '/unlock',
  Dashboard: '/dashboard',
  Activate: '/activate',
  Receive: '/receive',
  Connect: '/connect',
  SendTx: '/sendTx',
  Alert: '/alert',
  Sign: '/sign',
  TxConfirm: '/tx-confirm',
  CreateNewAddress: '/create-new-address',
  LocalProfile: '/local-profile',
  Connection: '/connection',
  ChainChange: '/chain-change',
  Launch: '/launch',
} as const;

export const routes: TRoute[] = [
  {
    path: SIDE_PANEL_ROUTE_PATHS.Home,
    component: Launch,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Launch,
    component: Launch,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Dashboard,
    component: Dashboard,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Settings,
    component: Settings,
  },

  {
    path: SIDE_PANEL_ROUTE_PATHS.Receive,
    component: Receive,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Connect,
    component: Connect,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.SendTx,
    component: SendTx,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Alert,
    component: Alert,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Sign,
    component: Sign,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.TxConfirm,
    component: TxConfirm,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.CreateNewAddress,
    component: CreateNewAddress,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.LocalProfile,
    component: LocalProfile,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.Connection,
    component: Connection,
  },
  {
    path: SIDE_PANEL_ROUTE_PATHS.ChainChange,
    component: ChainChange,
  },
];
