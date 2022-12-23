import type { ChildProcess } from "child_process";
export = getHandle;
declare function getHandle(moduleName?: string, dirname?: string, childProce?: Process): ModuleHandle;
declare namespace getHandle {
    export { Process };
}
type Process = NodeJS.Process | ChildProcess;
declare function ModuleHandle(moduleName: string, processHandle: ProcessHandle): void;
declare class ModuleHandle {
    constructor(moduleName: string, processHandle: ProcessHandle);
    pHandle: ProcessHandle;
    listener: {
        [key: string]: NodeJS.MessageListener[];
    };
    address: string;
    dirname: string;
    at(n?: any): ModuleHandle;
    tell(childProce?: any, sendModule?: any, message?: any, sendHandle?: any): ModuleHandle;
    listen(from?: any, callback?: NodeJS.MessageListener): ModuleHandle;
    reProcess(childProce?: any): ModuleHandle;
    reModule(moduleName?: any): ModuleHandle;
    varexp: {
        toKey: typeof toKey;
        formatName: typeof formatName;
        usingProce: {
            [pid: number]: ProcessHandle;
        };
        getHandle: typeof getHandle;
        MessagePack: typeof MessagePack;
        ProcessHandle: typeof ProcessHandle;
        ModuleHandle: typeof ModuleHandle;
    };
}
declare function ProcessHandle(childProce?: Process): void;
declare class ProcessHandle {
    constructor(childProce?: Process);
    listener: {
        [key: string]: NodeJS.MessageListener[];
    };
    module: {
        [name: string]: ModuleHandle;
    };
    tpro: Process;
    createModule(moduleName?: string, dirname?: string): ModuleHandle;
    processEar(pack: MessagePack, handle: any): void;
}
declare function toKey(keyArr: string[] | string): string;
declare function formatName(name?: string, dir?: string): any;
declare function MessagePack(moduleHandle: ModuleHandle, sendModule?: string, message?: any): void;
declare class MessagePack {
    constructor(moduleHandle: ModuleHandle, sendModule?: string, message?: any);
    key: string;
    message: any;
}
