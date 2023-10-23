import type { Password, User } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "~/db.server";


export type AnonymousUser = {
  anonymousId: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  countryId: string;
};
export async function getUserById({ id }: Pick<User, 'id'>) {
  return prisma.user.findUnique({ where: { id }, include: { country: true } });
}

export const checkUserByEmail = async ({ email }: Pick<User, "email">) =>
  prisma.user.findUnique({ where: { email } });

  export const getUserByEmail = async (email: User["email"]) =>
  prisma.user.findUnique({ where: { email } });

export const getUserReviewInformationByEmail = ({ email}: Pick<User, 'email'>) => prisma.user.findUnique({ where: { email }, include: { country: true }});



export async function createUser({
  email,
  password,
  countryId,
  username,
  phoneNumber,
}: AnonymousUser) {
  const hashedPassword = await bcrypt.hash(password, 10);

  return prisma.user.create({
    include: {
    country: true,
    },
    data: {
      email,
      username,
      phoneNumber,
      country: {
        connect: { countryId },
      },
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function verifyLogin(
  email: User["email"],
  password: Password["hash"],
) {
  const userWithPassword = await prisma.user.findUnique({
    where: { email },
    include: {
      country: true,
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }

  const isValid = await bcrypt.compare(
    password,
    userWithPassword.password.hash,
  );

  if (!isValid) {
    return null;
  }


  const { password: _password, ...userWithoutPassword } = userWithPassword;
  console.log(_password)
  Object.assign({_password}, {_password: null})
console.log({_password})
  return userWithoutPassword;
}
