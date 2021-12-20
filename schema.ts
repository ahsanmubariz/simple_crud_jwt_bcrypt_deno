export interface StudentSchema {
  _id: { $oid: string } ;
  name: string;
  studentID : string;
  password : string;
  grade: number;
}