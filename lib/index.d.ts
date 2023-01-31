export = getHandle;
declare function getHandle(mpath?: string, subProce?: Proce | null, mdir?: string): MpathHdl;
declare namespace getHandle {
    export { getHandle, NowProce, SubProce, Proce, SendHandle };
}
type Proce = NowProce | SubProce;
declare function MpathHdl(proceHdl: ProceHdl, mpath?: string, mdir?: string): void;
declare class MpathHdl {
    constructor(proceHdl: ProceHdl, mpath?: string, mdir?: string);
    liser: ProceHdl['liser'];
    proce: Proce;
    mname: string;
    mpath: string;
    mdir: string;
    tell<N>(target?: string, message?: N | null, proce?: Proce | null, handle?: SendHandle | null): MpathHdl;
    listen(from?: string, listener?: NodeJS.MessageListener): MpathHdl;
    reset(proce?: Proce | null, mpath?: string): MpathHdl;
    reProce(proce?: Proce | null): MpathHdl;
    reMpath(mpath?: string): MpathHdl;
    set alwaysJS(arg: boolean);
    get alwaysJS(): boolean;
    procing: {
        [pid: number]: ProceHdl;
    };
    getHandle: typeof getHandle;
    MsgPack: typeof MsgPack;
    ProceHdl: typeof ProceHdl;
    MpathHdl: typeof MpathHdl;
    toKey: (a: string, b: string) => string;
}
type NowProce = NodeJS.Process;
type SubProce = import('child_process').ChildProcess;
type SendHandle = import('child_process').SendHandle;
declare function ProceHdl(subProce?: Proce | null): void;
declare class ProceHdl {
    constructor(subProce?: Proce | null);
    mpath: {
        [name: string]: MpathHdl;
    };
    proce: Proce;
    liser: {
        [key: string]: NodeJS.MessageListener[];
    };
    setMpath(mpath?: string, mdir?: string): MpathHdl;
}
declare class MsgPack<N> {
    constructor(mpfrom: string, mpsend: string, msg: N);
    key: string;
    msg: N;
}
