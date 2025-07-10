import { PostWithUser } from '@/pages/feed';
import { User } from '@/types';
import { FormEventHandler, useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
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
    post: PostWithUser;
    currentUser: User;
}

const SinglePost = (props: Props) => {
    const [postNeeds, setPostNeeds] = useState({ post: props.post, isHidden: false });
    const [postMenu, setPostMenu] = useState({ dropdown: false, editDialog: false });
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

    return (
        <>
            <Card hidden={postNeeds.isHidden} className="w-full max-w-lg bg-zinc-200/50 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200">
                <CardTitle className="m-3">
                    <div className="flex items-center">
                        <div className="flex flex-1 items-center gap-3">
                            <Avatar>
                                <AvatarImage src={post.user.avatar} />
                                <AvatarFallback>
                                    <RxAvatar className="h-7 w-7" />
                                </AvatarFallback>
                            </Avatar>
                            <span>
                                {post.user.firstname && post.user.lastname ? post.user.firstname + ' ' + post.user.lastname : post.user.username}
                            </span>
                        </div>
                        {post.user_id === props.currentUser.id}
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
                                    <DropdownMenuItem onClick={handleOpenPostEdit}>Edit</DropdownMenuItem>

                                    <DropdownMenuItem onClick={handleDeletePost}>Delete</DropdownMenuItem>
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
                    <img className="flex-1 rounded-md object-cover" src={post.image} />
                </CardContent>
                <CardFooter>
                    <div className="flex w-full items-center justify-between gap-4">
                        <div className="itc flex flex-1/3 items-center justify-center gap-1">
                            <Button>
                                <AiOutlineLike />
                            </Button>
                            <span>|</span>
                            <span>{0}</span>
                            <span>Like</span>
                        </div>
                        <div className="flex-1/3 text-center">
                            <Button className="">Comment</Button>
                        </div>
                        <div className="flex-1/3 text-center">
                            <Button>Share</Button>
                        </div>
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
        </>
    );
};

export default SinglePost;
