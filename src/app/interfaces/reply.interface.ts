export interface Reply {
  idReply: string;
  idPost: string;
  uid?:string;
  content: string;
  img?: string;
  entries: string[];
  date: Date;
}
