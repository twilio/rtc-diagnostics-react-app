import { useState, useEffect } from 'react';

export function useDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const getDevices = () =>
      navigator.mediaDevices
        .enumerateDevices()
        .then((mediaDevices) =>
          mediaDevices
            .filter((device) => device.kind === 'audioinput' || device.kind === 'audiooutput')
            .every((device) => !(device.deviceId && device.label))
        )
        .then((shouldAskForMediaPermissions) => {
          if (shouldAskForMediaPermissions) {
            return navigator.mediaDevices.getUserMedia({ audio: true });
          }
        })
        .then(() => navigator.mediaDevices.enumerateDevices().then((mediaDevices) => setDevices(mediaDevices)));

    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    getDevices();

    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, []);

  return devices;
}
