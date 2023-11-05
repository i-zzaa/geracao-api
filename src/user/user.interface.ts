export interface UserProps {
  id?: number;
  name: string;
  login: string;
  password?: string;
  profileId?: number;
  locationId?: number;
  profile?: PerfilProps;

  classes?: ClassProps[];
}

export interface ClassProps {
  instrumentId?: number;
  teacherId?: number;
  week?: string;
  start?: string;
  end?: string;
}

export interface PerfilProps {
  id: number;
  name: string;
}

export interface UserAuthProps {
  password: string;
  username: string;
}

export interface UserRequestProps {
  id: number;
  nome: string;
  login: string;
  senha: string;
  ativo: boolean;
  perfilId: number;

  permissoesId: number[];

  especialidadeId?: number;
  funcoesId?: any[];
  fazDevolutiva?: boolean;
  cargaHoraria?: any[];
}

export enum PROFILE_ID {
  adm = 1,
  aluno = 2,
  professor = 3,
}
