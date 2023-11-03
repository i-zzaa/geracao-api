import { Injectable } from '@nestjs/common';
const package_json = require('../package.json');
const os = require('os');

@Injectable()
export class AppService {
  getVersion(): string {
    return 'versão backend  ' + package_json.version.toString();
  }
}
