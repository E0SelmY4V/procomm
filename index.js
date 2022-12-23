/**
 * 幻想私社进程间通信框架
 * @author E0SelmY4V
 * @version 1.0.2022082700
 * @module procomm
 * @link https://github.com/E0SelmY4V/procomm
 */
'use strict';

const path = require('path');
const child_process = require('child_process');
const { ChildProcess } = require('child_process');
const DEFAULT_MODULE_NAME = 'common';

/**@typedef {NodeJS.Process|ChildProcess} Process */

/**@param {string[]|string} keyArr */
function toKey(keyArr) {
	return typeof keyArr === 'string'
		? keyArr
		: keyArr.map(e => e.split(':').join('::').split('|').join(':|')).join('|');
}
function formatName(name = DEFAULT_MODULE_NAME, dir = '') {
	return path.resolve(__dirname, dir, name);
}
/**
 * @param {ModuleHandle} moduleHandle
 * @param {any} message
 */
function MessagePack(moduleHandle, sendModule = DEFAULT_MODULE_NAME, message = null) {
	this.key = toKey([moduleHandle.address, formatName(sendModule, moduleHandle.dirname)]);
	this.message = message;
}
MessagePack.prototype = {
	key: toKey([DEFAULT_MODULE_NAME, DEFAULT_MODULE_NAME]),
	/**@type {any} */
	message: null,
};
/**@type {{[pid:number]:ProcessHandle}} */
const usingProce = {};
/**@param {Process} childProce */
function getHandle(moduleName = DEFAULT_MODULE_NAME, dirname = '', childProce = null) {
	return (
		usingProce[(childProce || process).pid] ||
		new ProcessHandle(childProce)
	).createModule(moduleName, dirname);
}
/**@param {Process} childProce */
function ProcessHandle(childProce = null) {
	this.listener = {};
	this.module = {};
	if (childProce !== null) this.tpro = childProce;
	usingProce[this.tpro.on('message', this.processEar.bind(this)).pid] = this;
}
ProcessHandle.prototype = {
	/**@returns {ModuleHandle} */
	createModule(moduleName = DEFAULT_MODULE_NAME, dirname = '') {
		moduleName = formatName(moduleName, dirname);
		const mHdl = this.module[moduleName];
		return mHdl ? mHdl : new ModuleHandle(moduleName, this);
	},
	/**@type {Process} */
	tpro: process,
	/**@type {{[key:string]:NodeJS.MessageListener[]}} */
	listener: null,
	/**@type {{[name:string]:ModuleHandle}} */
	module: null,
	/**@param {MessagePack} pack */
	processEar(pack, handle) {
		this.listener[pack.key]
			&& this.listener[pack.key].forEach(e => e(pack.message, handle));
	},
};
/**@param {ProcessHandle} processHandle */
function ModuleHandle(moduleName = DEFAULT_MODULE_NAME, processHandle) {
	this.pHandle = processHandle;
	this.listener = processHandle.listener;
	this.at(moduleName);
}
ModuleHandle.prototype = {
	/**@type {ProcessHandle} */
	pHandle: null,
	address: DEFAULT_MODULE_NAME,
	dirname: '.',
	/**@type {{[key:string]:NodeJS.MessageListener[]}} */
	listener: null,
	at(n = this.address) {
		delete this.pHandle.module[this.address];
		this.address = formatName(n);
		this.dirname = path.dirname(this.address);
		this.pHandle.module[this.address] = this;
		return this;
	},
	/**
	 * @param {any} message
	 * @param {any} sendHandle
	 */
	tell(childProce = this.tpro, sendModule = this.address, message = null, sendHandle = null) {
		childProce.send(new MessagePack(this, sendModule, message), sendHandle);
		return this;
	},
	/**@param {NodeJS.MessageListener} callback */
	listen(from = this.address, callback = () => { }) {
		const key = toKey([path.resolve(this.dirname, from), this.address]);
		(this.listener[key] || (this.listener[key] = [])).push(callback);
		return this;
	},
	reProcess(childProce = this.tpro) {
		return getHandle(this.address, '', childProce);
	},
	reModule(moduleName = this.address) {
		return getHandle(moduleName, this.dirname, this.pHandle.tpro);
	},
	varexp: {
		toKey,
		formatName,
		usingProce,
		getHandle,
		MessagePack,
		ProcessHandle,
		ModuleHandle,
	},
};
module.exports = getHandle;