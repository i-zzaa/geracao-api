export interface MusicProps {
  id?: number;
  name: string;
  artist: string;
  link: string;

  music: string;
  noteMusic: NoteProps[];
}

export interface NoteProps {
  id?: number;
  name: string;

  musicId?: number;
}

export abstract class MusicServiceInterface {
  abstract create(body: MusicProps);
  abstract getAll(): Promise<any[]>;
  abstract getAllNotes(): Promise<any[]>;
  abstract get(filter: any): Promise<any[]>;
  abstract search(notes: string[]): Promise<any[]>;
}
