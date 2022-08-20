interface CurrentPlayingTrackInfo {
  durationMs: number;
  progressMs: number;
  songName: string;
  artistsNames: string[];
}

export interface StorageData {
  currentPlayingTrack: CurrentPlayingTrackInfo | null;
  lastSetTgStatus: string | null;
  lastTimeSetTgStatusMs: number;
  cantSetTgStatusUntilMs: number;
}
