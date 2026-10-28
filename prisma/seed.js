
require('dotenv').config();

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Tạo vai trò USER
    await prisma.role.upsert({
        where: { roleid: 1 },
        update: {},
        create: {
            roleid: 1,
            rolename: 'USER'
        }
    });

    // Tạo hạng thành viên NORMAL
    await prisma.memberShip.upsert({
        where: { mid: 1 },
        update: {},
        create: {
            mid: 1,
            mname: 'NORMAL',
            score: 10
        }
    });

    console.log('Seed completed successfully!');
}

main()
    .catch((error) => {
        console.error(error);
        process.exitCode = 1;
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
