import os from 'os';
import { errorOperationFailed } from '../navigation/navigation.js'

export class OperatingSystemInfo {

  showData(info) {

    try {
      const availableСommands = ['EOL', 'cpus', 'homedir', 'username', 'architecture'];
      const command = info.replace('--', '');
      if (!info.startsWith('--') || info[0] !== '-' || info[1] !== '-' || !availableСommands.includes(command)) {
        throw new Error(errorOperationFailed);
      }
  
      const osInfo = {
        EOL: () => {
          console.log(JSON.stringify(os.EOL));
        },
        cpus: () => {
          const arr = [];
  
          for (let cpu of os.cpus()) {
            arr.push({ model: cpu.model, speed: cpu.speed / 1000 });
          }
          console.log(arr);
        },
  
        homedir: () => {
          console.log(os.homedir());
        },
  
        username: () => {
          console.log(os.userInfo().username);
        },
  
        architecture: () => {
          console.log(os.arch());
        }
      }
  
      const showInfo = osInfo[command];
  
      showInfo();
    } catch (error) {
      console.log(errorOperationFailed)
    }
  }
}