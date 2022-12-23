/**
 * 幻想私社进程间通信框架
 * @author E0SelmY4V
 * @version 1.0.2022082700
 * @module procomm
 * @link https://github.com/E0SelmY4V/procomm
 */
'use strict';

/**@typedef {NodeJS.Process} NowProce */
/**@typedef {(typeof import('child_process'))['ChildProcess']} SubProce */
/**@typedef {NowProce|SubProce} Proce */

const path = require('path');
const isRev = path.sep === '\\';
const resMpath = isRev
	? (mname = '', mdir = '') => mname.length < 3 || mname.slice(1, 3).indexOf(':\\') ? mdir + mname : mname
	: (mname = '', mdir = '') => mname[0].indexOf('/') ? mdir + mname : mname;
const DEF = isRev ? {
	MNAME: 'index',
	MDIR: 'C:\\',
	MPATH: 'C:\\index',
	KEY: 'C|:\\index:C|:\\index',
} : {
	MNAME: 'index',
	MDIR: '/',
	MPATH: '/index',
	KEY: '/index:/index',
};
let alwaysJS = true;
const addExt = (n = '') => n[n.length - 1].indexOf(path.sep) && !path.extname(n) ? n + '.js' : n;
const oriStr = (n = '') => n;
let assocJS = alwaysJS ? addExt : oriStr;

/**@param {[string,string]} keyArr */
function toKey(keyArr = []) {
	return keyArr.map(e => path.normalize(e).split('|').join('||').split(':').join('|:')).join(':');
}
/**@type {(mpfrom:string,mpsend?:string,mdir?:string,msg?:any)=>MsgPack} */
function MsgPack(mpfrom = DEF.MPATH, mpsend = DEF.MPATH, msg = null) {
	this.key = toKey([mpfrom, mpsend]);
	this.msg = msg;
}
MsgPack.prototype = {
	key: DEF.KEY,
	/**@type {any} */
	msg: null,
};
/**@type {{[pid:number]:ProceHdl}} */
const procing = {};
/**@type {(mpath?:string,subProce?:SubProce|null,mdir?:string)=>MpathHdl} */
function getHandle(mpath = DEF.MPATH, subProce = null, mdir = '') {
	return (procing[(subProce || process).pid] || new ProceHdl(subProce)).setMpath(assocJS(mpath), mdir);
}
getHandle.getHandle = getHandle;
/**@param {SubProce|null} subProce */
function ProceHdl(subProce = null) {
	return procing[(subProce ? this.proce = subProce : process).pid] || (
		this.mpath = {},
		procing[this.proce.on('message', ProceHdl.getEar(this.liser = {})).pid] = this
	);
}
/**@type {(l:ProceHdl['liser'])=>(pack:MsgPack,handle:unknown)=>void} */
ProceHdl.getEar = function (l) {
	return (pack, handle) => (l[pack.key] || (l[pack.key] = [])).forEach(e => e(pack.msg, handle));
};
ProceHdl.prototype = {
	/**@param {string} mdir */
	setMpath(mpath = DEF.MPATH, mdir = '') {
		return this.mpath[mdir + mpath] || new MpathHdl(this, mpath, mdir);
	},
	/**@type {Proce} */
	proce: process,
	/**@type {{[key:string]:NodeJS.MessageListener[]}} */
	liser: null,
	/**@type {{[name:string]:MpathHdl}} */
	mpath: null,
};
/**@type {(proceHdl:ProceHdl,mpath?:string,mdir?:string|null)=>MpathHdl} */
function MpathHdl(proceHdl, mpath = DEF.MPATH, mdir = null) {
	this.liser = (this.proceHdl = proceHdl).liser, this.proce = proceHdl.proce;
	mdir ? [this.mpath, this.mname, this.mdir] = [mdir + mpath, mpath, mdir] : (
		this.mname = path.basename((this.mpath = mpath) + ' ').slice(0, -1),
		this.mdir = mpath.slice(0, - this.mname.length)
	);
}
MpathHdl.prototype = {
	/**@type {Proce} */
	proce: null,
	/**@type {ProceHdl} */
	proceHdl: null,
	mpath: DEF.MPATH,
	mdir: DEF.MDIR,
	mname: DEF.MNAME,
	/**@type {ProceHdl['liser']} */
	liser: null,
	/**@type {(target?:string,message?:any,subProce?:Proce,handle?:unknown)=>MpathHdl} */
	tell(target = this.mpath, message = null, proce = this.proce, handle = null) {
		if (!proce.send) throw Error('This process cannot be told');
		proce.send(new MsgPack(this.mpath, resMpath(assocJS(target), this.mdir), message), handle);
		return this;
	},
	/**@type {(from?:string,listener?:NodeJS.MessageListener)=>MpathHdl} callback */
	listen(from = this.mpath, listener = _ => _) {
		const key = toKey([resMpath(assocJS(from), this.mdir), this.mpath]);
		(this.liser[key] || (this.liser[key] = [])).push(listener);
		return this;
	},
	/**@type {(proce:Proce,mpath:string)=>MpathHdl} */
	reset(proce = this.proce, mpath = this.mpath) {
		return getHandle(resMpath(mpath, this.mdir), proce);
	},
	/**@param {Proce} proce */
	reProce(proce = this.proce) {
		return getHandle(this.mname, proce, this.mdir);
	},
	/**@param {string} mpath */
	reMpath(mpath = this.mpath) {
		return getHandle(resMpath(mpath, this.mdir), this.proce);
	},
	get alwaysJS() {
		return alwaysJS;
	},
	set alwaysJS(n) {
		assocJS = (alwaysJS = n) ? addExt : oriStr;
	},
	procing,
	getHandle,
	MsgPack,
	ProceHdl,
	MpathHdl,
};
module.exports = getHandle;