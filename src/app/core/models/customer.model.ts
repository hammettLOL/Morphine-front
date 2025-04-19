export interface Customer {
  id: number;
  document: string;
  typeDocument: number
  name: string;
  lastName: string;
  email: string;
  birthday: string;
  cellphone: string;
  instagram: string;
  createdAt?: string;
  updatedAt?: string;
}