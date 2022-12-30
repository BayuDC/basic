import { body } from 'express-validator';
import validate from '../helpers/validate';
import db from '../core/db';

export default {
    store: validate([
        body('username')
            .notEmpty()
            .withMessage('The username field is required')
            .trim()
            .custom(async value => {
                const user = await db.user.findFirst({
                    select: { id: true },
                    where: { username: value },
                });

                if (user) throw new Error('A user with this username already exists');
            }),
        body('password')
            .notEmpty()
            .withMessage('The password field is required')
            .trim()
            .isLength({ min: 8 })
            .withMessage('The minimum password length is 8 characters'),
    ]),
    update: validate([
        body('username')
            .optional()
            .trim()
            .custom(async (value, { req }) => {
                const id = parseInt(req.params?.id);
                const user = await db.user.findFirst({
                    select: { id: true },
                    where: { username: value, NOT: { id } },
                });

                if (user) throw new Error('A user with this username already exists');
            }),
        body('password')
            .optional()
            .trim()
            .isLength({ min: 8 })
            .withMessage('The minimum password length is 8 characters'),
    ]),
};
