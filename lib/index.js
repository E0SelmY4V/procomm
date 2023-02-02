'use strict';

/**@typedef {NodeJS.Process} NowProce */
/**@typedef {import('child_process').ChildProcess} SubProce */
/**@typedef {NowProce|SubProce} Proce */
/**@typedef {import('child_process').SendHandle} SendHandle */

const path = require('path');
const { normalize, extname, basename } = path;

const isRev = path.sep === '\\';

/**@type {(mname:string,mdir:string)=>string} */
const resMpath = isRev
	? (mname, mdir) => mname.length < 3 || mname.slice(1, 3).indexOf(':\\') ? mdir + mname : mname
	: (mname, mdir) => mname[0].indexOf('/') ? mdir + mname : mname;

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

/**@type {<T>(n:T)=>T} */
const oriAny = n => n;

let alwaysJS = true;
/**@type {(n:string)=>string} */
const addExt = isRev
	? (n) => n[n.length - 1].indexOf('\\') && !extname(n) ? n + '.js' : n
	: (n) => n[n.length - 1].indexOf('/') && !extname(n) ? n + '.js' : n;
let assocJS = alwaysJS ? addExt : oriAny;

/**@type {(a:string,b:string)=>string} */
const toKey = isRev
	? (a, b) => normalize(a) + ':' + normalize(b)
	: (a, b) => normalize(a).split('|').join('||').split(':').join('|:')
		+ ':' + normalize(b).split('|').join('||').split(':').join('|:');

/**@type {<T>(n:{[x:keyof any]:T},k:keyof any,c:()=>T)=>T} */
const memTake = (n, k, c) => k in n ? n[k] : n[k] = c();

/**@template N */
class MsgPack {
	/**
	 * @param {string} mpfrom
	 * @param {string} mpsend
	 * @param {N} msg
	 */
	constructor(mpfrom, mpsend, msg) {
		this.key = toKey(mpfrom, mpsend);
		this.msg = msg;
	}
	key;
	msg;
}

/**@type {{[pid:number]:ProceHdl}} */
const procing = {};
/**
 * 幻想私社进程间通信框架
 * @version 1.1223.2
 * @author E0SelmY4V
 * @link https://github.com/E0SelmY4V/procomm
 * @param {Proce} subProce
 */
function getHandle(mpath = DEF.MPATH, subProce = process, mdir = '') {
	return memTake(procing, subProce?.pid ?? -1, () => new ProceHdl(subProce))
		.setMpath(assocJS(mpath), mdir);
}
getHandle.getHandle = getHandle;

/**@type {(l?:ProceHdl['liser'])=><N,H extends SendHandle>(pack:MsgPack<N>,handle:H)=>void} */
const getEar = (l = {}) => (pack, handle) => (l[pack.key] || (l[pack.key] = [])).forEach(e => e(pack.msg, handle));

/**
 * @constructor
 * @param {Proce|null} subProce
 */
function ProceHdl(subProce = null) {
	this.mpath = {};
	(subProce ? this.proce = subProce : process).on('message', getEar(this.liser = {}));
}
ProceHdl.prototype = {
	/**@param {string} mdir */
	setMpath(mpath = DEF.MPATH, mdir = '') {
		const smpath = mdir + mpath;
		return memTake(this.mpath, smpath, () => new MpathHdl(this, mpath, mdir));
	},
	/**@type {Proce} */
	proce: process,
	/**@type {{[key:string]:NodeJS.MessageListener[]}} */
	liser: {},
	/**@type {{[name:string]:MpathHdl}} */
	mpath: {},
};

/**
 * @constructor
 * @param {ProceHdl} proceHdl
 * @param {string} mpath
 * @param {string} mdir
 */
function MpathHdl(proceHdl, mpath = DEF.MPATH, mdir = '') {
	this.liser = proceHdl.liser, this.proce = proceHdl.proce;
	mdir ? [this.mpath, this.mname, this.mdir] = [mdir + mpath, mpath, mdir] : (
		this.mname = basename((this.mpath = mpath) + ' ').slice(0, -1),
		this.mdir = mpath.slice(0, - this.mname.length)
	);
}
MpathHdl.prototype = {
	/**@type {Proce} */
	proce: process,
	mpath: DEF.MPATH,
	mdir: DEF.MDIR,
	mname: DEF.MNAME,
	/**@type {ProceHdl['liser']} */
	liser: {},
	/**
	 * @template N
	 * @param {N|null} message
	 * @param {Proce|null} proce
	 * @param {SendHandle|null} handle
	 */
	tell(target = '', message = null, proce = null, handle = null) {
		proce || (proce = this.proce);
		if (!proce.send) throw Error('This process cannot be told');
		// @ts-ignore
		proce.send(new MsgPack(this.mpath, resMpath(assocJS(target || this.mpath), this.mdir), message), handle);
		return this;
	},
	/**@param {NodeJS.MessageListener} listener */
	listen(from = '', listener = oriAny) {
		const key = toKey(resMpath(assocJS(from || this.mpath), this.mdir), this.mpath);
		(this.liser[key] || (this.liser[key] = [])).push(listener);
		return this;
	},
	/**@param {Proce|null} proce */
	reset(proce = null, mpath = '') {
		return getHandle(resMpath(mpath || this.mpath, this.mdir), proce || this.proce);
	},
	/**@param {Proce|null} proce */
	reProce(proce = null) {
		return getHandle(this.mname, proce || this.proce, this.mdir);
	},
	reMpath(mpath = '') {
		return getHandle(resMpath(mpath || this.mpath, this.mdir), this.proce);
	},
	get alwaysJS() {
		return alwaysJS;
	},
	set alwaysJS(n) {
		assocJS = (alwaysJS = n) ? addExt : oriAny;
	},
	procing,
	getHandle,
	MsgPack,
	ProceHdl,
	MpathHdl,
	toKey,
};

module.exports = getHandle;