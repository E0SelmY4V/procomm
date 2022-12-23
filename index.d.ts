/// <reference types="node" />
export = getHandle;
/**@type {(mpath?:string,subProce?:SubProce|null,mdir?:string)=>MpathHdl} */
declare function getHandle(mpath?: string | undefined, subProce?: typeof import("child_process").ChildProcess | null | undefined, mdir?: string | undefined): MpathHdl;
declare namespace getHandle {
    export { getHandle, NowProce, SubProce, Proce };
}
/**@type {(proceHdl:ProceHdl,mpath?:string,mdir?:string|null)=>MpathHdl} */
declare function MpathHdl(proceHdl: ProceHdl, mpath?: string | undefined, mdir?: string | null | undefined): MpathHdl;
declare class MpathHdl {
    /**@type {(proceHdl:ProceHdl,mpath?:string,mdir?:string|null)=>MpathHdl} */
    constructor(proceHdl: ProceHdl, mpath?: string | undefined, mdir?: string | null | undefined);
    liser: ProceHdl['liser'];
    proceHdl: ProceHdl;
    proce: Proce;
    mname: string;
    mpath: string;
    mdir: string;
    /**@type {(target?:string,message?:any,subProce?:Proce,handle?:unknown)=>MpathHdl} */
    tell(target?: string | undefined, message?: any, proce?: Proce | undefined, handle?: unknown): MpathHdl;
    /**@type {(from?:string,listener?:NodeJS.MessageListener)=>MpathHdl} callback */
    listen(from?: string | undefined, listener?: NodeJS.MessageListener | undefined): MpathHdl;
    /**@type {(proce:Proce,mpath:string)=>MpathHdl} */
    reset(proce?: Proce, mpath?: string): MpathHdl;
    /**@param {Proce} proce */
    reProce(proce?: Proce): MpathHdl;
    /**@param {string} mpath */
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
}
type NowProce = NodeJS.Process;
type SubProce = (typeof import('child_process'))['ChildProcess'];
type Proce = NowProce | SubProce;
/**@param {SubProce|null} subProce */
declare function ProceHdl(subProce?: SubProce | null): ProceHdl;
declare class ProceHdl {
    /**@param {SubProce|null} subProce */
    constructor(subProce?: SubProce | null);
    proce: Proce;
    mpath: {
        [name: string]: MpathHdl;
    };
    liser: {
        [key: string]: NodeJS.MessageListener[];
    };
    /**@param {string} mdir */
    setMpath(mpath?: string, mdir?: string): MpathHdl;
}
declare namespace ProceHdl {
    export { getEar };
}
/**@type {(mpfrom:string,mpsend?:string,mdir?:string,msg?:any)=>MsgPack} */
declare function MsgPack(mpfrom?: string, mpsend?: string | undefined, msg?: string | undefined): MsgPack;
declare class MsgPack {
    /**@type {(mpfrom:string,mpsend?:string,mdir?:string,msg?:any)=>MsgPack} */
    constructor(mpfrom?: string, mpsend?: string | undefined, msg?: string | undefined);
    key: string;
    msg: any;
}
declare function getEar(l: ProceHdl['liser']): (pack: MsgPack, handle: unknown) => void;
