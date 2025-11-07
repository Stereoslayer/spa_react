import toast from "react-hot-toast";
export const notify = {
    ok: (msg: string) => toast.success(msg),
    err: (msg: string) => toast.error(msg),
    info: (msg: string) => toast(msg),
};