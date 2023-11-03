export interface MusicProps {
  id?: number;
  name: string;
  artist: string;

  music: string;
  notes: NoteProps[];
}

export interface NoteProps {
  id?: number;
  name: string;
}

export abstract class MusicServiceInterface {
  abstract create(body: any);
  abstract getAll(): Promise<any[]>;
  abstract get(filter: any): Promise<any[]>;
  abstract search(notes: string[]): Promise<any[]>;
}
