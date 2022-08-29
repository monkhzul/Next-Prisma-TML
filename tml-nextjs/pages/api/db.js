// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default async function getServerSideProps(req, res) {
  const data = await prisma.$queryRaw`select * from SMTExchange_Anungoo.dbo.t_DiscountTML t`
  res.status(200).send(data)

  return {
    props: {
      data
    }
  }
}
