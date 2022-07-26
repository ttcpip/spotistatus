import { StorageData } from './types';

export class MemoryStorage {
  data: StorageData = {
    currentPlayingTrack: null,
    lastSetTgStatus: null,
    lastTimeSetTgStatusMs: 0,
  };
}
