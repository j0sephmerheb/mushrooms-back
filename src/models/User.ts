// models/User.ts
interface User {
    id: string;
    username: string;
    position: { x: number; y: number; z: number };
  }
  
export default User;