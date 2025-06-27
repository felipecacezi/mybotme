import { jwtVerify } from 'jose'
import { cookies } from "next/headers";

const JWT_SECRET = process.env.NEXT_PUBLIC_JWT_SECRET as string

export const actualUserLogged = async () => {
  const cookieStore = cookies();
  const token = (await cookieStore).get("token")?.value;  
  if (!token) {
      return {};
  }
  const secret = new TextEncoder().encode(JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  
  const { id, name, email } = payload;
  return { id, name, email, token };
}