import { ReactNode } from 'react';
import { Toaster } from 'sonner';

const FeedLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="max-w-screen overflow-x-hidden">
            <div className="flex w-screen justify-between gap-6">
                <div className="min-h-screen w-[25%]"></div>
                {children}
                <div className="min-h-screen w-[25%]"></div>
            </div>
            <Toaster />
        </div>
    );
};

export default FeedLayout;
