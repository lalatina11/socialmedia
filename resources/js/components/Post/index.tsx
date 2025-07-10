import { PostWithUser } from '@/pages/feed';
import { User } from '@/types';
import SinglePost from './SinglePost';
interface Props {
    posts: PostWithUser[];
    currentUser: User;
}

const Posts = (props: Props) => {
    const { posts } = props;
    return (
        <section className="my-10 flex flex-col gap-5">
            {posts.length ? (
                posts.map((post) => {
                    return <SinglePost key={post.id} currentUser={props.currentUser} post={post} />;
                })
            ) : (
                <span className="text-center">Belum ada postingan</span>
            )}
        </section>
    );
};

export default Posts;
