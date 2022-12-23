/**
 * 幻想私社进程间通信框架
 * @author E0SelmY4V
 * @version 1.0.2022082700
 * @link https://github.com/E0SelmY4V/procomm
 */
'use strict';

import path from 'path';
import { ChildProcess } from 'child_process';

const DEFAULT_MODULE_NAME = 'common';
type Process = NodeJS.Process | ChildProcess;

function toKey(keyArr: string | string[]) {
	return typeof keyArr === 'string'
		? keyArr
		: keyArr.map(e => e.split(':').join('::').split('|').join(':|')).join('|');
}
function formatName(name = DEFAULT_MODULE_NAME, dir = '') {
	return path.resolve(__dirname, dir, name);
}
class MessagePack {
	constructor(moduleHandle: ModuleHandle, sendModule = DEFAULT_MODULE_NAME, message?: any) {
		this.key = toKey([moduleHandle.address, formatName(sendModule, moduleHandle.dirname)]);
		this.message = message;
	}
	key = toKey([DEFAULT_MODULE_NAME, DEFAULT_MODULE_NAME]);
	message: any;
};
const usingProce: { [pid: number]: ProcessHandle } = {};
function getHandle(moduleName = DEFAULT_MODULE_NAME, dirname = '', childProce?: Process) {
	return (
		usingProce[childProce?.pid || process.pid] ||
		new ProcessHandle(childProce)
	).createModule(moduleName, dirname);
}
class ProcessHandle {
	constructor(childProce?: Process) {
		this.listener = {};
		this.module = {};
		if (typeof childProce !== 'undefined') this.tpro = childProce;
		usingProce[this.tpro!.on('message', this.processEar.bind(this)).pid!] = this;
	}
	createModule(moduleName = DEFAULT_MODULE_NAME, dirname = '') {
		moduleName = formatName(moduleName, dirname);
		const mHdl = this.module[moduleName];
		return mHdl ? mHdl : new ModuleHandle(moduleName, this);
	}
	tpro?: Process;
	listener: { [key: string]: NodeJS.MessageListener[] };
	module: { [name: string]: ModuleHandle };
	processEar(pack: MessagePack, handle?: any) {
		this.listener[pack.key]?.forEach(e => e(pack.message, handle));
	}
};
class ModuleHandle {
	constructor(moduleName = DEFAULT_MODULE_NAME, processHandle: ProcessHandle) {
		this.pHandle = processHandle;
		this.listener = processHandle.listener;
		this.at(moduleName);
	}
	pHandle: ProcessHandle;
	address = DEFAULT_MODULE_NAME;
	dirname = '.';
	listener: ProcessHandle['listener'];
	at(n = this.address) {
		delete this.pHandle.module[this.address];
		this.address = formatName(n);
		this.dirname = path.dirname(this.address);
		this.pHandle.module[this.address] = this;
		return this;
	}
	tell(childProce = this.pHandle.tpro!, sendModule = this.address, message?: any, sendHandle?: any) {
		childProce.send && childProce.send(new MessagePack(this, sendModule, message), sendHandle);
		return this;
	}
	listen(from = this.address, callback: NodeJS.MessageListener) {
		const key = toKey([path.resolve(this.dirname, from), this.address]);
		(this.listener[key] || (this.listener[key] = [])).push(callback);
		return this;
	}
	reProcess(childProce = this.pHandle.tpro) {
		return getHandle(this.address, '', childProce);
	}
	reModule(moduleName = this.address) {
		return getHandle(moduleName, this.dirname, this.pHandle.tpro);
	}
	varexp = {
		toKey,
		formatName,
		usingProce,
		getHandle,
		MessagePack,
		ProcessHandle,
		ModuleHandle,
	};
};
module.exports = getHandle;