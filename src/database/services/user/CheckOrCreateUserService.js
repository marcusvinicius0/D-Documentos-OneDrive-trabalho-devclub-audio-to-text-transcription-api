import prismaClient from "../../../prisma/connect.js";

class CheckOrCreateUserService {
  async execute({ email, name }) {
    let isUser = await prismaClient.user.findFirst({
      where: {
        email: email,
      }
    })

    if (!isUser) {
      isUser = await prismaClient.user.create({
        data: {
          email: email,
          name: name,
        }
      })
    }

    return isUser.id;
  }
}

export { CheckOrCreateUserService };