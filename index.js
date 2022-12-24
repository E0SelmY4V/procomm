/**
 * 幻想私社进程间通信框架
 * @version 1.1223.2
 * @author E0SelmY4V
 * @link https://github.com/E0SelmY4V/procomm
 */
'use strict';

/**@typedef {NodeJS.Process} NowProce */
/**@typedef {(typeof import('child_process'))['ChildProcess']} SubProce */
/**@typedef {NowProce|SubProce} Proce */

const path = require('path');
const { normalize, extname, basename } = path;

const isRev = path.sep === '\\';

const resMpath = isRev
	? (mname = '', mdir = '') => mname.length < 3 || mname.slice(1, 3).indexOf(':\\') ? mdir + mname : mname
	: (mname = '', mdir = '') => mname[0].indexOf('/') ? mdir + mname : mname;

const DEF = isRev ? {
	MNAME: 'index',
	MDIR: 'C:\\',
	MPATH: 'C:\\index',
	KEY: 'C:\\index:C:\\index',
} : {
	MNAME: 'index',
	MDIR: '/',
	MPATH: '/index',
	KEY: '/index:/index',
};

const oriAny = n => n;

let alwaysJS = true;
const addExt = isRev
	? (n = '') => n[n.length - 1].indexOf('\\') && !extname(n) ? n + '.js' : n
	: (n = '') => n[n.length - 1].indexOf('/') && !extname(n) ? n + '.js' : n;
const oriStr = (n = '') => n;
let assocJS = alwaysJS ? addExt : oriStr;

const toKey = isRev
	? (a = '', b = '') => normalize(a) + ':' + normalize(b)
	: (a = '', b = '') => normalize(a).split('|').join('||').split(':').join('|:')
		+ ':' + normalize(b).split('|').join('||').split(':').join('|:');

/**@type {(mpfrom:string,mpsend?:string,msg?:unknown)=>MsgPack} */
function MsgPack(mpfrom = DEF.MPATH, mpsend = DEF.MPATH, msg = null) {
	this.key = toKey(mpfrom, mpsend);
	this.msg = msg;
}
MsgPack.prototype = {
	key: DEF.KEY,
	/**@type {unknown} */
	msg: null,
};

/**@type {{[pid:number]:ProceHdl}} */
const procing = {};
/**@type {(mpath?:string,subProce?:SubProce|null,mdir?:string)=>MpathHdl} */
const getHandle = (mpath = DEF.MPATH, subProce = null, mdir = '') => (procing[(subProce || process).pid] || new ProceHdl(subProce)).setMpath(assocJS(mpath), mdir);
getHandle.getHandle = getHandle;

/**@type {(l?:ProceHdl['liser'])=>(pack:MsgPack,handle:unknown)=>void} */
const getEar = (l = {}) => (pack, handle) => (l[pack.key] || (l[pack.key] = [])).forEach(e => e(pack.msg, handle));

/**@param {SubProce|null} subProce */
function ProceHdl(subProce = null) {
	this.mpath = {};
	procing[(subProce ? this.proce = subProce : process).on('message', getEar(this.liser = {})).pid] = this;
}
ProceHdl.prototype = {
	/**@param {string} mdir */
	setMpath(mpath = DEF.MPATH, mdir = '') {
		const smpath = mdir + mpath;
		return this.mpath[smpath] || (this.mpath[smpath] = new MpathHdl(this, mpath, mdir));
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
	this.liser = proceHdl.liser, this.proce = proceHdl.proce;
	mdir ? [this.mpath, this.mname, this.mdir] = [mdir + mpath, mpath, mdir] : (
		this.mname = basename((this.mpath = mpath) + ' ').slice(0, -1),
		this.mdir = mpath.slice(0, - this.mname.length)
	);
}
MpathHdl.prototype = {
	/**@type {Proce} */
	proce: null,
	mpath: DEF.MPATH,
	mdir: DEF.MDIR,
	mname: DEF.MNAME,
	/**@type {ProceHdl['liser']} */
	liser: null,
	/**@type {(target?:string,message?:any,proce?:Proce,handle?:unknown)=>MpathHdl} */
	tell(target = this.mpath, message = null, proce = this.proce, handle = null) {
		if (!proce.send) throw Error('This process cannot be told');
		proce.send(new MsgPack(this.mpath, resMpath(assocJS(target), this.mdir), message), handle);
		return this;
	},
	/**@type {(from?:string,listener?:NodeJS.MessageListener)=>MpathHdl} callback */
	listen(from = this.mpath, listener = oriAny) {
		const key = toKey(resMpath(assocJS(from), this.mdir), this.mpath);
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
	toKey,
};

module.exports = getHandle;