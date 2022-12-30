const { PrismaClient } = require('@prisma/client');
const faker = require('@faker-js/faker').faker;
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    await prisma.user.create({
        data: {
            username: 'admin',
            password: await bcrypt.hash('admin123', await bcrypt.genSalt()),
            role: 'admin',
        },
    });
    await prisma.user.create({
        data: {
            username: 'user',
            password: await bcrypt.hash('user1234', await bcrypt.genSalt()),
            role: 'user',
        },
    });

    for (let i = 0; i < 10; i++) {
        await prisma.user.create({
            data: {
                username: faker.internet.userName(),
                password: await bcrypt.hash('password', await bcrypt.genSalt()),
                role: 'user',
            },
        });
    }
}

main()
    .catch(e => console.log(e))
    .finally(() => prisma.$disconnect());
