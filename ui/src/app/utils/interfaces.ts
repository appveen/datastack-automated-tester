export interface UserDetails {
  _id?: string;
  token?: string;
}

export interface GetOptions {
  page?: number;
  count?: number;
  select?: string;
  sort?: string;
  filter?: any;
  app?: string;
  noApp?: boolean;
  serviceIds?: string;
  url?: string;
  username?: string;
  password?: string;
}

export interface Environment {
  _id?: string;
  name?: string;
  url?: string;
  username?: string;
  password?: string;
  app?: string;
  dataServices?: EnvironmentDataService;
}

export interface EnvironmentDataService {
  _id?: string;
  name?: string;
}
