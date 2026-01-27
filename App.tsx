
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import DashboardHome from './components/DashboardHome';
import DriverDetails from './components/DriverDetails';
import LiveTracking from './components/LiveTracking';
import SpeedMonitor from './components/SpeedMonitor';
import GeofencePopup from './components/GeofencePopup';
import AlertLog from './components/AlertLog';
import ParentsView from './components/ParentsView';
import SettingsView from './components/SettingsView';
import { NavigationTab, BusState, StudentMarker, Alert } from './types';
import { STUDENT_LOCATIONS, ACTIVE_BUS_ROUTE_PATH, DIVERSION_BUS_ROUTE_PATH, SCHOOL_LOCATION, INITIAL_ALERTS } from './constants';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('Dashboard');
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  const [busState, setBusState] = useState<BusState>({
    x: 100,
    y: 485,
    speed: 35,
    status: 'Normal',
    accidentDetected: false,
    gpsSignal: 'Strong',
    routePath: ACTIVE_BUS_ROUTE_PATH,
    isDiverted: false,
    trafficStatus: 'Clear'
  });
  const [showGeofence, setShowGeofence] = useState<string | null>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [progress, setProgress] = useState(0);
  
  // Internal simulation flags
  const [isSuddenStop, setIsSuddenStop] = useState(false);
  const [gpsOutageActive, setGpsOutageActive] = useState(false);

  // Add realistic alert to the state
  const addAlert = (type: Alert['type'], message: string) => {
    const newAlert: Alert = {
      id: Date.now().toString(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type,
      message,
      status: 'Active'
    };
    setAlerts(prev => {
      // Resolve previous 'Active' alert of same type to maintain realism
      const resolved = prev.map(a => a.type === type ? { ...a, status: 'Resolved' as const } : a);
      return [newAlert, ...resolved].slice(0, 10);
    });
  };

  useEffect(() => {
    const simulationInterval = setInterval(() => {
      setProgress(prev => {
        // If the bus is in a "Sudden Stop" state, decelerate but don't move progress forward much
        const nextProgress = isSuddenStop ? prev : (prev + (busState.speed / 100) * 0.0006) % 1;
        
        if (pathRef.current) {
          const totalLength = pathRef.current.getTotalLength();
          const currentPoint = pathRef.current.getPointAtLength(nextProgress * totalLength);
          
          const delta = 0.0005;
          const nextP = pathRef.current.getPointAtLength(Math.min(nextProgress + delta, 1) * totalLength);
          const angle = Math.atan2(nextP.y - currentPoint.y, nextP.x - currentPoint.x) * (180 / Math.PI);

          setBusState(prevBus => {
             let targetSpeed = prevBus.speed;
             const proximities = [...STUDENT_LOCATIONS, SCHOOL_LOCATION];
             let isNearAny = false;
             
             // Speed Logic
             if (isSuddenStop) {
                targetSpeed = Math.max(0, targetSpeed - 1.5); // Rapid deceleration
             } else {
                proximities.forEach(loc => {
                  const d = Math.sqrt(Math.pow(currentPoint.x - loc.x, 2) + Math.pow(currentPoint.y - loc.y, 2));
                  if (d < 50) isNearAny = true;
                  if ('name' in loc && d < 20 && !showGeofence) {
                     const studentName = loc.name as string;
                     setShowGeofence(studentName);
                     addAlert('Geofence', `Bus entered ${studentName}'s geofence zone`);
                     setTimeout(() => setShowGeofence(null), 5000);
                  }
                });

                if (isNearAny) {
                   targetSpeed = Math.max(12, targetSpeed - 0.4);
                } else if (targetSpeed < 45) {
                   targetSpeed = Math.min(48, targetSpeed + 0.2);
                }
                
                // Add some speed "jitter" for realism
                targetSpeed += (Math.random() - 0.5) * 0.5;

                if (prevBus.trafficStatus === 'Heavy') {
                   targetSpeed = Math.max(5, targetSpeed - 0.8);
                }
             }

             // Status Logic
             let newStatus: BusState['status'] = 'Normal';
             if (targetSpeed <= 0.5) newStatus = 'Stopped';
             else if (targetSpeed > 50) newStatus = 'Overspeed';

             // GPS Logic
             let currentGps: BusState['gpsSignal'] = gpsOutageActive ? (Math.random() > 0.5 ? 'Weak' : 'None') : 'Strong';

             return {
               ...prevBus,
               x: currentPoint.x,
               y: currentPoint.y,
               speed: Math.max(0, targetSpeed),
               status: newStatus,
               gpsSignal: currentGps,
               heading: angle
             };
          });
        }
        return nextProgress;
      });
    }, 16.6);

    return () => clearInterval(simulationInterval);
  }, [busState.speed, isSuddenStop, gpsOutageActive, showGeofence]);

  // Random Event Logic
  useEffect(() => {
    const eventTimer = setInterval(() => {
      const dice = Math.random();
      
      // 1. Random Diversion
      if (dice > 0.92 && !busState.isDiverted) {
        setBusState(prev => ({ 
          ...prev, 
          isDiverted: true, 
          trafficStatus: 'Rerouting',
          routePath: DIVERSION_BUS_ROUTE_PATH 
        }));
        addAlert('Diversion', 'Route diversion active due to road work');
        setTimeout(() => {
          setBusState(prev => ({ 
            ...prev, 
            isDiverted: false, 
            trafficStatus: 'Clear',
            routePath: ACTIVE_BUS_ROUTE_PATH 
          }));
        }, 12000);
      } 
      // 2. Sudden Stop (Traffic Light / Stop Sign)
      else if (dice < 0.08 && !isSuddenStop) {
        setIsSuddenStop(true);
        setTimeout(() => setIsSuddenStop(false), 4000);
      }
      // 3. GPS Fluctuation
      else if (dice > 0.4 && dice < 0.45 && !gpsOutageActive) {
        setGpsOutageActive(true);
        setTimeout(() => setGpsOutageActive(false), 5000);
      }
      // 4. Temporary Overspeeding
      else if (dice > 0.8 && dice < 0.85 && !isSuddenStop) {
        setBusState(prev => ({ ...prev, speed: 55 })); // Suddenly go faster
        addAlert('Overspeed', 'Bus speed reached 55 km/h on open road');
      }
    }, 8000);

    return () => clearInterval(eventTimer);
  }, [busState.isDiverted, isSuddenStop, gpsOutageActive]);

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0e17]">
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <path ref={pathRef} d={busState.routePath || ACTIVE_BUS_ROUTE_PATH} />
      </svg>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar title={`School Bus Safety & Tracking Dashboard`} />
        
        <main className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="p-4 md:p-6 lg:p-8">
            {activeTab === 'Dashboard' && (
              <DashboardHome busState={busState} studentLocations={STUDENT_LOCATIONS} />
            )}
            {activeTab === 'Live Tracking' && (
              <LiveTracking busState={busState} studentLocations={STUDENT_LOCATIONS} />
            )}
            {activeTab === 'Speed Monitor' && (
              <SpeedMonitor busState={busState} />
            )}
            {activeTab === 'Alerts' && (
              <AlertLog alerts={alerts} />
            )}
            {activeTab === 'Parents' && (
              <ParentsView />
            )}
            {activeTab === 'Driver Details' && (
              <DriverDetails />
            )}
            {activeTab === 'Settings' && (
              <SettingsView />
            )}
            {!['Dashboard', 'Live Tracking', 'Speed Monitor', 'Alerts', 'Parents', 'Driver Details', 'Settings'].includes(activeTab) && (
              <div className="flex items-center justify-center h-full text-slate-400 italic">
                View for "{activeTab}" is currently under construction for this hackathon demo.
              </div>
            )}
          </div>
        </main>
      </div>

      <GeofencePopup studentName={showGeofence} onClose={() => setShowGeofence(null)} />
    </div>
  );
};

export default App;
