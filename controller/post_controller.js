import prisma from "../db/db.config.js";
import { fetchCategory } from "./category_controller.js";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRETE,
});

export async function createPost(req, res) {
    const user_id = req.params.id;
    const { title, description, category } = req.body;
    const file = req.files.media;
    try {
        const categoryItemExists = await fetchCategory(category);

        if (categoryItemExists) {
            const cloudMedia = await cloudinary.uploader.upload(file.tempFilePath, {
                resource_type: 'auto',
            },);
            if (cloudMedia.url != null || cloudMedia.url != '') {
                let type;
                if (file.mimetype.includes('image')) {
                    type = 'photo';
                } else if (file.mimetype.includes('video')) {
                    type = 'video'
                } else {
                    res.json({ success: false, status: 404, message: 'file type is not valid' });
                }
                const post = await prisma.post.create({
                    data: {
                        title: title,
                        description: description,
                        media: cloudMedia.url,
                        user_id: user_id,
                        category: categoryItemExists.category,
                        type: type,
                    },
                });
                if (post) res.json({ success: true, status: 200, message: 'Post uploaded', data: post });
                else res.json({ success: false, status: 404, message: 'Post upload error' });
            } else {
                res.json({ success: false, status: 404, message: `${type} upload fail` });
            }
        } else {
            res.json({ success: false, status: 404, message: 'category not found' });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, status: 404, message: 'fail to add post' });
    }
}

export async function fetchAllPost(req, res) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    if (page <= 0) {
        page = 1;
    }
    if (limit <= 0 || limit >= 20) {
        limit = 10;
    }

    //if page is 1 then skip will be 0. here no need to skip.
    //if page is more then 1 then it will take previous page number usign -1 and multipie by limit and skip previous page and data
    const skip = (page - 1) * limit;
    //page = 1 ===> skip = (1-1)*10 = 0; || 0 post skip
    //page = 2 ===> skip = (2-1)*10 = 10; || 10 post skip

    const posts = await prisma.post.findMany({
        skip: skip,
        take: limit,
        include: {
            like: true,
        },
    });
    if (posts) {
        const totalPost = await prisma.post.count();
        const totalPage = Math.ceil(totalPost / limit);
        res.json({
            success: true, status: 200, message: 'Post fetched', meta: {
                totalPage: totalPage,
                totalPost: totalPost,
                page: page,
                limit: limit,
            },
            data: posts
        });
    }
    else res.json({ success: false, status: 404, message: 'Post fetched error' });
}


export async function deletePost(req, res) {
    const id = req.params.id;
    const deletePost = await prisma.post.delete({
        where: {
            id: id,
        },
    });

    if (deletePost) res.json({ success: true, status: 200, message: 'Post deleted' });
    else res.json({ success: false, status: 404, message: 'Post delete fail' });

}

export async function giveLike(req, res) {
    const post_id = req.params.id;
    const user_id = req.body.user_id;
    try {
        const isLiked = await prisma.like.findFirst({
            where: {
                post_id: post_id,
                user_id: user_id,
            },
        });
        if (!isLiked) {
            const likedPost = await prisma.like.create({
                data: {
                    user_id: user_id,
                    post_id: post_id,
                },
            });
            await prisma.post.update({
                where: {
                    id: likedPost.post_id,
                },
                data: {
                    like_count: {
                        increment: 1,
                    },
                },
            });
            res.json({ success: true, status: 200, message: 'Liked', data: likedPost });
        } else {
            await prisma.like.delete({
                where: {
                    id: isLiked.id,
                },
            });

            const totalLike = await prisma.post.findFirst({
                where: {
                    id: isLiked.post_id,
                },
                select: {
                    like_count: true,
                },
            });

            if (totalLike <= 0) {
                res.json({ success: true, status: 400, message: 'Like removed without update' });
            } else {
                await prisma.post.update({
                    where: {
                        id: isLiked.post_id,
                    },
                    data: {
                        like_count: {
                            decrement: 1,
                        },
                    },
                });
                res.json({ success: true, status: 400, message: 'like removed' });
            }
        }
    } catch (error) {
        res.json({ success: false, status: 400, message: 'like fail' });
        console.log(error);
    }
}


export async function pinPost(req, res) {
    const { user_id, post_id } = req.body;

    try {
        const isPinned = await prisma.pinPostModel.findFirst({
            where: {
                user_id: user_id,
                post_id: post_id,
            },
        });

        if (!isPinned) {
            const data = await prisma.pinPostModel.create({
                data: {
                    user_id: user_id,
                    post_id: post_id,
                },
            });
            res.json({ success: true, status: 200, message: 'pinned', data: data });
        } else {
            await prisma.pinPostModel.delete({
                where: {
                    id: isPinned.id,
                },
            });
            res.json({ success: false, status: 400, message: 'removed from pin' });
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, status: 400, message: 'post pin fail' });
    }
}

export async function fetchPinnedPost(req, res) {
    const user_id = req.params.id;

    try {
        const data = await prisma.pinPostModel.findMany({
            where: {
                user_id: user_id,
            },
        });
        res.json({ success: true, status: 200, message: 'pinned post fetched', data: data });
    } catch (error) {
        console.log(error);
        res.json({ success: false, status: 400, message: 'pinned post fetch fail' });
    }
}


export async function searchPost(req, res) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const title = req.query.title || '';
    const category = req.query.category || '';
    if (page <= 0) {
        page = 1;
    }
    if (limit <= 0 || limit >= 20) {
        limit = 10;
    }

    //if page is 1 then skip will be 0. here no need to skip.
    //if page is more then 1 then it will take previous page number usign -1 and multipie by limit and skip previous page and data
    const skip = (page - 1) * limit;
    //page = 1 ===> skip = (1-1)*10 = 0; || 0 post skip
    //page = 2 ===> skip = (2-1)*10 = 10; || 10 post skip

    const searchedPost = await prisma.post.findMany({
        skip: skip,
        take: limit,
        include: {
            like: true,
        },
        where: {
            AND: [
                { title: { contains: title } },
                { category: { contains: category } },
            ],
        },
    });
    if (searchedPost) {
        const totalPost = await prisma.post.count();
        const totalPage = Math.ceil(totalPost / limit);
        res.json({
            success: true, status: 200, message: 'post fetched', meta: {
                totalPage: totalPage,
                totalPost: totalPost,
                page: page,
                limit: limit,
            },
            data: searchedPost,
        });
    }
    else res.json({ success: false, status: 404, message: 'post fetched error' });
}