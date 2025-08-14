import Posts from '@/components/Post';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FeedLayout from '@/layouts/FeedLayout';
import { PostWithUser, PostWithUserLikeComment, User } from '@/types';
import { FormEventHandler, useEffect, useRef, useState } from 'react';
import { IoSend } from 'react-icons/io5';
import { MdEmojiEmotions } from 'react-icons/md';
import { RiImageAddFill } from 'react-icons/ri';
import { toast } from 'sonner';

interface Props {
    auth: { user: User };
    posts: PostWithUserLikeComment[];
    userId: number;
    currentUser: User;
}
const Post = (props: Props) => {
    const [formPost, setFormPost] = useState<{ description: string; image: File | null }>({ description: '', image: null });
    const [imagePreview, setImagePreview] = useState<string>('');
    const [posts, setPosts] = useState(props.posts);

    const imageRef = useRef<HTMLInputElement | null>(null);

    const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('description', formPost.description);
            if (formPost.image) {
                formData.append('image', formPost.image);
            }
            const res = await fetch('/api/posts', {
                method: 'POST',
                credentials: 'include',
                body: formData,
            });
            const result = await res.json();
            if (!res.ok || result.error) {
                throw new Error(result.message);
            }
            const newPost = result.data as PostWithUser;

            setFormPost({ description: '', image: null });
            if (imageRef.current?.value) {
                imageRef.current.value = '';
            }
            setPosts((prev) => [newPost as PostWithUserLikeComment, ...prev]);
            setFormPost({ description: '', image: null });
            if (imageRef.current) {
                imageRef.current.value = '';
            }
            setImagePreview('');
            // e.currentTarget.reset();
            toast.success('Post berhasil dipublish');
        } catch (error) {
            toast.error((error as Error).message || 'something went wrong');
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFormPost((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    return (
        <FeedLayout>
            <title>Feed</title>
            <main className="">
                <section className="m-auto w-fit">
                    <Card>
                        <CardHeader>
                            {/* <CardTitle></CardTitle> */}
                            <CardDescription>Buat Postingan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form className="w-sm" onSubmit={handleSubmit}>
                                <div className="flex gap-3">
                                    {imagePreview && (
                                        <div className="relative my-auto h-full flex-1/3">
                                            <Button
                                                onClick={() => {
                                                    setImagePreview('');
                                                    setFormPost((prev) => ({ ...prev, image: null }));
                                                    if (imageRef.current?.value) {
                                                        imageRef.current.value = '';
                                                    }
                                                }}
                                                className="absolute -top-[15%] -right-[15%] h-7 w-7 rounded-full"
                                                variant={'destructive'}
                                            >
                                                X
                                            </Button>
                                            <Label htmlFor="image">
                                                <img src={imagePreview} className="h-auto w-full rounded-md object-cover" />
                                            </Label>
                                        </div>
                                    )}
                                    <Textarea
                                        onChange={(e) => setFormPost((prev) => ({ ...prev, description: e.target.value }))}
                                        value={formPost.description}
                                    />
                                    <Button>
                                        <IoSend />
                                    </Button>
                                </div>
                                <div>
                                    <input type="file" hidden name="" id="image" ref={imageRef} onChange={handleImageChange} />
                                </div>
                            </form>
                        </CardContent>
                        <CardFooter className="flex items-center gap-3">
                            <Label htmlFor="image" className="cursor-pointer">
                                <RiImageAddFill className="h-5 w-5" />
                            </Label>
                            <Label htmlFor="image" className="cursor-pointer">
                                <MdEmojiEmotions className="h-5 w-5" />
                            </Label>
                        </CardFooter>
                    </Card>
                </section>
                <Posts currentUser={props.currentUser} posts={posts} />
            </main>
        </FeedLayout>
    );
};

export default Post;
