import { PostWithUserLikeComment, User } from '@/types';
import { FormEventHandler, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { BiSolidLike } from 'react-icons/bi';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { IoSend } from 'react-icons/io5';
import { RxAvatar } from 'react-icons/rx';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { Card, CardContent, CardFooter, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';

interface Props {
    post: PostWithUserLikeComment;
    currentUser: User;
}

const SinglePost = (props: Props) => {
    const [postNeeds, setPostNeeds] = useState({ post: props.post, isDeleted: false });
    const [postMenu, setPostMenu] = useState({ dropdown: false, editDialog: false });
    const [postFooter, setPostFooter] = useState({
        like: {
            likeCount: postNeeds.post.likes.length,
            isLiked: postNeeds.post.likes.some((like) => like.user_id === props.currentUser.id),
        },
        commentSection: {
            isOpen: false,
            comments: postNeeds.post.comments,
        },
    });
    const { post } = postNeeds;

    const handleSwitchPostDropDownMenu = () => {
        setPostMenu((prev) => ({ ...prev, dropdown: !prev.dropdown }));
    };

    const handleOpenPostEdit = () => {
        handleSwitchPostDropDownMenu();
        setPostMenu((prev) => ({ ...prev, editDialog: !prev.editDialog }));
    };

    const handleDeletePost = () => {
        handleSwitchPostDropDownMenu();
        setTimeout(() => {
            setPostNeeds((prev) => ({ ...prev, isHidden: true }));
        }, 100);
        toast('postingan berhasil dihapus');
    };

    const handleEditFormActionEditPost: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const description = formData.get('description') as string;
        setPostNeeds((prev) => ({ ...prev, post: { ...prev.post, description } }));
        setTimeout(() => {
            setPostMenu({ editDialog: false, dropdown: false });
        }, 100);
        toast('postingan berhasil diedit');
    };

    const handleLike = () => {
        setPostFooter((prev) => ({
            ...prev,
            like: { isLiked: !prev.like.isLiked, likeCount: prev.like.isLiked ? prev.like.likeCount - 1 : prev.like.likeCount + 1 },
        }));
    };

    const handleOpenCommentSection = () => {
        setPostFooter((prev) => ({ ...prev, commentSection: { ...prev.commentSection, isOpen: !prev.commentSection.isOpen } }));
    };

    const handleAddComment: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const description = formData.get('description') as string;
        setPostFooter((prev) => ({
            ...prev,
            commentSection: {
                isOpen: true,
                comments: [
                    {
                        user: props.currentUser,
                        description,
                        id: prev.commentSection.comments.length + Math.random() * Math.random() * 10000,
                        post_id: postNeeds.post.id,
                        user_id: props.currentUser.id,
                    },
                    ...prev.commentSection.comments,
                ],
            },
        }));
    };

    if (postNeeds.isDeleted) return null;

    return (
        <div key={post.id}>
            <Card className="w-full max-w-lg bg-zinc-200/50 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                <CardTitle className="m-3">
                    <div className="flex items-center">
                        <div className="flex flex-1 items-center gap-3">
                            <Avatar>
                                <AvatarImage src={post.user.avatar || ''} />
                                <AvatarFallback>
                                    <RxAvatar className="h-7 w-7" />
                                </AvatarFallback>
                            </Avatar>
                            <span>
                                {post.user.firstname && post.user.lastname ? post.user.firstname + ' ' + post.user.lastname : post.user.username}
                            </span>
                        </div>
                        <span>
                            <DropdownMenu open={postMenu.dropdown} onOpenChange={() => handleSwitchPostDropDownMenu()}>
                                <DropdownMenuTrigger asChild>
                                    <span
                                        onClick={() => handleSwitchPostDropDownMenu()}
                                        className="flex cursor-pointer items-center gap-0.5 rounded-md bg-zinc-800 p-2 dark:bg-zinc-200"
                                    >
                                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                        <div className="h-1 w-1 rounded-full bg-zinc-200 dark:bg-zinc-800" />
                                    </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Post Option</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {post.user_id === props.currentUser.id ? (
                                        <>
                                            <DropdownMenuItem onClick={handleOpenPostEdit}>Edit</DropdownMenuItem>

                                            <DropdownMenuItem onClick={handleDeletePost}>Delete</DropdownMenuItem>
                                        </>
                                    ) : null}
                                    <DropdownMenuItem onClick={() => handleSwitchPostDropDownMenu()}>Cancel</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </span>
                    </div>
                </CardTitle>
                {/* <CardDescription className="mb-2">
                </CardDescription> */}
                <CardContent className="m-3 flex flex-col gap-1 rounded-lg border border-zinc-500 p-3">
                    <span className="mb-3">{post.description}</span>
                    {post.image && <img className="flex-1 rounded-md object-cover" src={post.image} />}
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="itc flex flex-1/3 items-center justify-center gap-1">
                            <Button onClick={() => handleLike()}>{postFooter.like.isLiked ? <BiSolidLike /> : <AiOutlineLike />}</Button>
                            <span>|</span>
                            <span>{postFooter.like.likeCount}</span>
                            <span>Like</span>
                        </div>
                        <div className="flex-1/3 text-center">
                            <Button onClick={() => handleOpenCommentSection()} className="">
                                Comment
                                {postFooter.commentSection.isOpen ? <IoIosArrowDown /> : <IoIosArrowUp />}
                            </Button>
                        </div>
                        <div className="flex-1/3 text-center">
                            <Button>Share</Button>
                        </div>
                    </div>
                    <div className="h-0.5 w-full rounded-md bg-zinc-500" />
                    <div className="flex min-h-12 w-full flex-col gap-3 rounded-md">
                        <div className="flex flex-1 gap-2">
                            <Avatar>
                                <AvatarImage className="h-5 w-5" src={props.currentUser.avatar} />
                                <AvatarFallback>
                                    <RxAvatar className="h-5 w-5" />
                                </AvatarFallback>
                            </Avatar>
                            <form onSubmit={handleAddComment} className="flex w-full gap-2">
                                <Textarea className="ring ring-zinc-500" name="description" placeholder="Tulis komentar" />
                                <Button>
                                    <IoSend />
                                </Button>
                            </form>
                        </div>
                        {postFooter.commentSection.isOpen && postFooter.commentSection.comments.length ? (
                            <div className="flex flex-1 flex-col gap-2">
                                {postFooter.commentSection.comments.map((comt) => (
                                    <div className="flex flex-1 flex-col gap-1 rounded-md border border-zinc-500 p-2" key={comt.id}>
                                        <div className="flex items-center gap-2">
                                            <Avatar>
                                                <AvatarImage className="h-5 w-5" src={props.currentUser.avatar} />
                                                <AvatarFallback>
                                                    <RxAvatar className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                            <span>
                                                {comt.user.firstname && comt.user.lastname
                                                    ? comt.user.firstname + ' ' + comt.user.lastname
                                                    : comt.user.username}
                                            </span>
                                        </div>
                                        <span className="ml-10">{comt.description}</span>
                                    </div>
                                ))}
                            </div>
                        ) : postFooter.commentSection.isOpen && !postFooter.commentSection.comments.length ? (
                            <div className="text-center">Belum ada Komentar</div>
                        ) : null}
                    </div>
                </CardFooter>
            </Card>
            <Dialog open={postMenu.editDialog} onOpenChange={handleOpenPostEdit}>
                <DialogContent>
                    <DialogTrigger></DialogTrigger>
                    <DialogHeader>
                        <DialogTitle>Edit the post</DialogTitle>
                        <DialogDescription asChild>
                            <form className="space-y-6" onSubmit={handleEditFormActionEditPost}>
                                <div className="flex flex-col gap-3">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea defaultValue={post.description} id="description" name="description" />
                                </div>
                                <Button>Submit</Button>
                            </form>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SinglePost;
