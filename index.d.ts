export = getHandle;
declare const getHandle: (mpath?: string, subProce?: SubProce | null, mdir?: string) => MpathHdl;
type SubProce = (typeof import('child_process'))['ChildProcess'];
declare function MpathHdl(proceHdl: ProceHdl, mpath?: string | undefined, mdir?: string | null | undefined): MpathHdl;
declare class MpathHdl {
    constructor(proceHdl: ProceHdl, mpath?: string | undefined, mdir?: string | null | undefined);
    liser: ProceHdl['liser'];
    proce: Proce;
    mname: string;
    mpath: string;
    mdir: string;
    tell(target?: string | undefined, message?: any, proce?: Proce | undefined, handle?: unknown): MpathHdl;
    listen(from?: string | undefined, listener?: NodeJS.MessageListener | undefined): MpathHdl;
    reset(proce?: Proce, mpath?: string): MpathHdl;
    reProce(proce?: Proce): MpathHdl;
    reMpath(mpath?: string): MpathHdl;
    set alwaysJS(arg: boolean);
    get alwaysJS(): boolean;
    procing: {
        [pid: number]: ProceHdl;
    };
    getHandle: (mpath?: string, subProce?: SubProce | null, mdir?: string) => MpathHdl;
    MsgPack: typeof MsgPack;
    ProceHdl: typeof ProceHdl;
    MpathHdl: typeof MpathHdl;
    toKey: (a?: string, b?: string) => string;
}
declare function ProceHdl(subProce?: SubProce | null): void;
declare class ProceHdl {
    constructor(subProce?: SubProce | null);
    mpath: {
        [name: string]: MpathHdl;
    };
    proce: Proce;
    liser: {
        [key: string]: NodeJS.MessageListener[];
    };
    setMpath(mpath?: string, mdir?: string): MpathHdl;
}
type Proce = NowProce | SubProce;
declare function MsgPack(mpfrom?: string, mpsend?: string | undefined, msg?: unknown): MsgPack;
declare class MsgPack {
    constructor(mpfrom?: string, mpsend?: string | undefined, msg?: unknown);
    key: string;
    msg: unknown;
}
type NowProce = NodeJS.Process;
