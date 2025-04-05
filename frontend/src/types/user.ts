export interface User {
  id: string
  username: string
  password: string
}

export type SafeUser = Omit<User, 'password'>

export type UserFromInputs = Omit<User, 'id'>
