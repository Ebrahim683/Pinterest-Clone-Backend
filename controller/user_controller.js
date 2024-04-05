import prisma from "../db/db.config.js";

export async function fetchUser(req, res) {
    const id = req.params.id;
    const data = await prisma.user.findUnique({
        where: {
            id: id,
        },
        select: {
            id: true,
            email: true,
            name: true,
            profile_pic: true,
            created_at: true,
            updated_at: true,
        },
    });

    if (data) res.json({ success: true, status: 200, message: 'User data fetched', data: data });
    else res.json({ success: false, status: 404, message: 'Not found' });
}

export async function fetchAllUser(req, res) {
    const data = await prisma.user.findMany();

    if (data) res.json({ success: true, status: 200, message: 'User data fetched', data: data });
    else res.json({ success: false, status: 404, message: 'Not found' });
}

export async function updateUser(req, res) {
    const id = req.params.id;
    const { name, profile_pic } = req.body;

    const findUser = await prisma.user.findFirst({
        where: {
            id: id,
        }
    });

    if (findUser) {
        const data = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                name,
                profile_pic,
            },
            select: {
                id: true,
                email: true,
                name: true,
                profile_pic: true,
                created_at: true,
                updated_at: true,
            },
        });
        res.json({ success: true, status: 200, message: 'User updated', data: data });
    } else res.json({ success: false, status: 404, message: 'Not found' });

}


export async function followUser(req, res) {
    const follower_id = req.params.id;
    const following_id = req.body.following_id;
    try {
        const isFollowed = await prisma.follow.findFirst({
            where: {
                follower_id: follower_id,
                following_id: following_id,
            },
        });
        if (!isFollowed) {
            await prisma.follow.create({
                data: {
                    follower_id: follower_id,
                    following_id: following_id,
                }
            });
            await prisma.user.update({
                where: {
                    id: follower_id,
                },
                data: {
                    following: {
                        increment: 1,
                    },
                },
            });
            await prisma.user.update({
                where: {
                    id: following_id,
                },
                data: {
                    followers: {
                        increment: 1,
                    },
                },
            });
            res.json({ success: true, status: 200, message: 'following' });
        } else {
            await prisma.follow.delete({
                where: {
                    id: isFollowed.id,
                },
            });
            await prisma.user.update({
                where: {
                    id: follower_id,
                },
                data: {
                    following: {
                        decrement: 1,
                    },
                },
            });
            await prisma.user.update({
                where: {
                    id: following_id,
                },
                data: {
                    followers: {
                        decrement: 1,
                    },
                },
            });
            res.json({ success: true, status: 200, message: 'unfollowing' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, status: 400, message: 'follow fail' });
    }
}