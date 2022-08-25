
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

function Page({ data }) {

}

export async function Insert(req, res) {
  const tradeshopid = req.body.tradeshopid;
  const mmonth = req.body.mmonth;
  const discounttype = req.body.discounttype;
  const Amount = req.body.Amount;
  const state = req.body.state;
  const createdate = req.body.createdate;
  const createUser = req.body.createUser;
  
  const data = await prisma.$queryRaw`INSERT INTO [SMTExchange_Anungoo].[dbo].[t_DiscountTML]
        ([tradeshopid]
        ,[mmonth]
        ,[discounttype]
        ,[Amount]
        ,[state]
        ,[createdate]
        ,[createUser])
    VALUES (${tradeshopid}, '${mmonth}', '${discounttype}', ${Amount}, ${state}, ${createdate}, ${createUser})`
  res.status(200).send(data)
}

export async function Get(req, res) {
    const data = await prisma.$queryRaw`select * from SMTExchange_Anungoo.dbo.t_DiscountTML t`
    res.status(200).send(data)
}

export async function getServerSideProps() {
    // Instead of fetching your `/api` route you can call the same
    // function directly in `getStaticProps`
    const posts = await Get()
  
    // Props returned will be passed to the page component
    return { props: { posts } }
}

export default Page