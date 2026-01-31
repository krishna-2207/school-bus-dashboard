import React from 'react';
import {
  LayoutDashboard,
  MapPin,
  Gauge,
  Bell,
  UserSquare,
  Users,
  Settings,
  ShieldAlert,
  Wifi,
  Bus,
  Activity,
  Phone,
  AlertTriangle,
  Navigation,
  Clock,
  CheckCircle2,
  Home,
  UserCheck,
  Zap,
  Map as MapIcon,
  ShieldCheck,
  LifeBuoy,
  Shield,
  Eye,
  Car,
  Heart
} from 'lucide-react';
import { BusStop, TrafficSegment, Alert, StudentParentInfo } from './types';

export const ICONS: Record<string, React.ReactNode> = {
  Dashboard: <LayoutDashboard size={20} />,
  'Live Tracking': <MapPin size={20} />,
  'Speed Monitor': <Gauge size={20} />,
  Alerts: <Bell size={20} />,
  'Driver Details': <UserSquare size={20} />,
  Parents: <Users size={20} />,
  Settings: <Settings size={20} />,
  Safety: <ShieldAlert size={16} />,
  Signal: <Wifi size={16} />,
  Bus: <Bus size={20} />,
  Activity: <Activity size={16} />,
  Phone: <Phone size={16} />,
  Police: <Shield size={20} />,
  Ambulance: <Heart size={20} />,
  Alert: <AlertTriangle size={20} />,
  Route: <Navigation size={16} />,
  Clock: <Clock size={16} />,
  Check: <CheckCircle2 size={16} />,
  Home: <Home size={16} />,
  UserCheck: <UserCheck size={20} />,
  Zap: <Zap size={20} />,
  Map: <MapIcon size={20} />,
  Headset: <Phone size={20} />,
  ShieldCheck: <ShieldCheck size={20} />,
  LifeBuoy: <LifeBuoy size={20} />,
  Traffic: <Car size={16} />,
  Diversion: <Navigation size={16} />,
  Eye: <Eye size={16} />
};

export const INITIAL_ALERTS: Alert[] = [
  { id: '1', time: '08:45 AM', type: 'Geofence', message: "Bus entered Emma Johnson's geofence zone", status: 'Resolved' },
  { id: '2', time: '08:42 AM', type: 'Overspeed', message: "Speed exceeded 50 km/h in school zone", status: 'Resolved' },
  { id: '3', time: '08:38 AM', type: 'Normal', message: "Route started - Morning pickup", status: 'Active' },
  { id: '4', time: '08:35 AM', type: 'Geofence', message: "Bus entered Liam Smith's geofence zone", status: 'Resolved' },
  { id: '5', time: 'Yesterday', type: 'Emergency', message: "Emergency button pressed - False alarm", status: 'Resolved' },
];

export const STUDENT_PARENT_DATA: StudentParentInfo[] = [
  { id: '1', studentName: 'Emma Johnson', grade: 'Grade 4', parentName: 'Sarah Johnson', phone: '+1 (555) 234-5678', busId: 'SB-042', avatar: 'EJ' },
  { id: '2', studentName: 'Liam Smith', grade: 'Grade 3', parentName: 'Michael Smith', phone: '+1 (555) 345-6789', busId: 'SB-042', avatar: 'LS' },
  { id: '3', studentName: 'Olivia Davis', grade: 'Grade 5', parentName: 'Jennifer Davis', phone: '+1 (555) 456-7890', busId: 'SB-042', avatar: 'OD' },
  { id: '4', studentName: 'Noah Wilson', grade: 'Grade 4', parentName: 'David Wilson', phone: '+1 (555) 567-8901', busId: 'SB-042', avatar: 'NW' },
  { id: '5', studentName: 'Ava Brown', grade: 'Grade 2', parentName: 'Amanda Brown', phone: '+1 (555) 678-9012', busId: 'SB-042', avatar: 'AB' },
];

export const TRAFFIC_ZONES: TrafficSegment[] = [
  { id: 'tz1', x1: 300, y1: 100, x2: 500, y2: 100, level: 'Heavy' },
  { id: 'tz2', x1: 600, y1: 200, x2: 600, y2: 400, level: 'Moderate' },
  { id: 'tz3', x1: 100, y1: 400, x2: 200, y2: 400, level: 'Standstill' },
];

export const DIVERSION_POINTS = [
  { x: 400, y: 500, label: 'Road Work' }
];

export const STUDENT_LOCATIONS = [
  { id: 's1', name: 'Emma', x: 200, y: 215, route: 'Westside Loop' },
  { id: 's2', name: 'Noah', x: 400, y: 385, route: 'North Central' },
  { id: 's3', name: 'Olivia', x: 600, y: 215, route: 'South Park Express' },
  { id: 's4', name: 'Liam', x: 400, y: 115, route: 'Westside Loop' },
];

export const SCHOOL_LOCATION = { x: 100, y: 485, name: 'Central School' };

export const BUS_STOPS: (BusStop & { eta?: string; distance?: string })[] = [
  { id: 'stop1', name: 'Central School', time: '08:00 AM', status: 'completed', x: 100, y: 485, distance: '0 km' },
  { id: 'stop2', name: "Emma's Home", time: '08:15 AM', status: 'current', x: 200, y: 215, eta: '2 mins', distance: '1.2 km' },
  { id: 'stop3', name: "Liam's Home", time: '08:30 AM', status: 'upcoming', x: 400, y: 115, eta: '8 mins', distance: '3.4 km' },
  { id: 'stop4', name: "Noah's Home", time: '08:45 AM', status: 'upcoming', x: 400, y: 385, eta: '15 mins', distance: '5.1 km' },
  { id: 'stop5', name: "Olivia's Home", time: '09:00 AM', status: 'upcoming', x: 600, y: 215, eta: '22 mins', distance: '7.8 km' },
];

export const ACTIVE_BUS_ROUTE_PATH = "M 100 485 V 400 H 200 V 200 H 300 V 100 H 500 V 200 H 600 V 400 H 400 V 500 H 700 V 100";
export const DIVERSION_BUS_ROUTE_PATH = "M 100 485 V 400 H 200 V 200 H 300 V 100 H 500 V 200 H 600 V 400 H 400 V 450 H 350 V 550 H 700 V 100";
