export interface MusicProps {
  id?: number;
  name: string;
}

export abstract class LocationServiceInterface {
  abstract create(body: any);
  abstract getAll(): Promise<any[]>;
  abstract search(word: string): Promise<any[]>;
}
