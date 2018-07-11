(function (global, factory) {typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :typeof define === 'function' && define.amd ? define(factory) :(global.WaveFile = factory());}(this, (function () { 'use strict';var WaveFile=function(){/** @private @const */ var f64f32_=new Float32Array(1);/**
 @param {!TypedArray} input
 @param {string} original
 @param {string} target
 @param {!TypedArray} output
 */
function bitDepth(input,original,target,output){validateBitDepth_(original);validateBitDepth_(target);/** @type {!Function} */ var toFunction=getBitDepthFunction_(original,target);/** @type {!Object<string,number>} */ var options={oldMin:Math.pow(2,parseInt(original,10))/2,newMin:Math.pow(2,parseInt(target,10))/2,oldMax:Math.pow(2,parseInt(original,10))/2-1,newMax:Math.pow(2,parseInt(target,10))/2-1};/** @const @type {number} */ var len=input.length;if(original=="8")for(var i=0;i<len;i++)output[i]=
input[i]-=128;if(original=="32f"||original=="64")truncateSamples(input);for(var i$0=0;i$0<len;i$0++)output[i$0]=toFunction(input[i$0],options);if(target=="8")for(var i$1=0;i$1<len;i$1++)output[i$1]=output[i$1]+=128}/**
 @private
 @param {number} sample
 @param {!Object<string,number>} args
 @return {number}
 */
function intToInt_(sample,args){if(sample>0)sample=parseInt(sample/args.oldMax*args.newMax,10);else sample=parseInt(sample/args.oldMin*args.newMin,10);return sample}/**
 @private
 @param {number} sample
 @param {!Object<string,number>} args
 @return {number}
 */
function floatToInt_(sample,args){return parseInt(sample>0?sample*args.newMax:sample*args.newMin,10)}/**
 @private
 @param {number} sample
 @param {!Object<string,number>} args
 @return {number}
 */
function intToFloat_(sample,args){return sample>0?sample/args.oldMax:sample/args.oldMin}/**
 @private
 @param {number} sample
 @return {number}
 */
function floatToFloat_(sample){f64f32_[0]=sample;return f64f32_[0]}/**
 @private
 @param {string} original
 @param {string} target
 @return {!Function}
 */
function getBitDepthFunction_(original,target){/** @type {!Function} */ var func=function(x){return x};if(original!=target)if(["32f","64"].includes(original))if(["32f","64"].includes(target))func=floatToFloat_;else func=floatToInt_;else if(["32f","64"].includes(target))func=intToFloat_;else func=intToInt_;return func}/**
 @private
 @param {string} bitDepth
 @throws {Error}
 */
function validateBitDepth_(bitDepth){if(bitDepth!="32f"&&bitDepth!="64"&&(parseInt(bitDepth,10)<"8"||parseInt(bitDepth,10)>"53"))throw new Error("Invalid bit depth.");}/** @private */ function truncateSamples(samples){/** @type {number} */ var len=samples.length;for(var i=0;i<len;i++)if(samples[i]>1)samples[i]=1;else if(samples[i]<-1)samples[i]=-1}/** @private @const @type {!Array<number>} */ var INDEX_TABLE=[-1,-1,-1,-1,2,4,6,8,-1,-1,-1,-1,2,4,6,8];/** @private @const @type {!Array<number>} */ var STEP_TABLE=
[7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,3327,3660,4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,27086,29794,32767];/** @private @type {number} */ var encoderPredicted_=0;/** @private @type {number} */ var encoderIndex_=0;/** @private @type {number} */ var decoderPredicted_=
0;/** @private @type {number} */ var decoderIndex_=0;/** @private @type {number} */ var decoderStep_=7;/**
 @param {!Int16Array} samples
 @return {!Uint8Array}
 */
function encode(samples){/** @type {!Uint8Array} */ var adpcmSamples=new Uint8Array(samples.length/2+512);/** @type {!Array<number>} */ var block=[];/** @type {number} */ var fileIndex=0;for(var i=0;i<samples.length;i++){if(i%505==0&&i!=0){adpcmSamples.set(encodeBlock(block),fileIndex);fileIndex+=256;block=[]}block.push(samples[i])}return adpcmSamples}/**
 @param {!Uint8Array} adpcmSamples
 @param {number} blockAlign
 @return {!Int16Array}
 */
function decode(adpcmSamples,blockAlign){blockAlign=blockAlign===undefined?256:blockAlign;/** @type {!Int16Array} */ var samples=new Int16Array(adpcmSamples.length*2);/** @type {!Array<number>} */ var block=[];/** @type {number} */ var fileIndex=0;for(var i=0;i<adpcmSamples.length;i++){if(i%blockAlign==0&&i!=0){samples.set(decodeBlock(block),fileIndex);fileIndex+=blockAlign*2;block=[]}block.push(adpcmSamples[i])}return samples}/**
 @param {!Array<number>} block
 @return {!Array<number>}
 */
function encodeBlock(block){/** @type {!Array<number>} */ var adpcmSamples=blockHead_(block[0]);for(var i=3;i<block.length;i+=2){/** @type {number} */ var sample2=encodeSample_(block[i]);/** @type {number} */ var sample=encodeSample_(block[i+1]);adpcmSamples.push(sample<<4|sample2)}while(adpcmSamples.length<256)adpcmSamples.push(0);return adpcmSamples}/**
 @param {!Array<number>} block
 @return {!Array<number>}
 */
function decodeBlock(block){decoderPredicted_=sign_(block[1]<<8|block[0]);decoderIndex_=block[2];decoderStep_=STEP_TABLE[decoderIndex_];/** @type {!Array<number>} */ var result=[decoderPredicted_,sign_(block[3]<<8|block[2])];for(var i=4;i<block.length;i++){/** @type {number} */ var original_sample=block[i];/** @type {number} */ var second_sample=original_sample>>4;/** @type {number} */ var first_sample=second_sample<<4^original_sample;result.push(decodeSample_(first_sample));result.push(decodeSample_(second_sample))}return result}
/**
 @private
 @param {number} num
 @return {number}
 */
function sign_(num){return num>32768?num-65536:num}/**
 @private
 @param {number} sample
 @return {number}
 */
function encodeSample_(sample){/** @type {number} */ var delta=sample-encoderPredicted_;/** @type {number} */ var value=0;if(delta>=0)value=0;else{value=8;delta=-delta}/** @type {number} */ var step=STEP_TABLE[encoderIndex_];/** @type {number} */ var diff=step>>3;if(delta>step){value|=4;delta-=step;diff+=step}step>>=1;if(delta>step){value|=2;delta-=step;diff+=step}step>>=1;if(delta>step){value|=1;diff+=step}updateEncoder_(value,diff);return value}/**
 @private
 @param {number} value
 @param {number} diff
 */
function updateEncoder_(value,diff){if(value&8)encoderPredicted_-=diff;else encoderPredicted_+=diff;if(encoderPredicted_<-32768)encoderPredicted_=-32768;else if(encoderPredicted_>32767)encoderPredicted_=32767;encoderIndex_+=INDEX_TABLE[value&7];if(encoderIndex_<0)encoderIndex_=0;else if(encoderIndex_>88)encoderIndex_=88}/**
 @private
 @param {number} nibble
 @return {number}
 */
function decodeSample_(nibble){/** @type {number} */ var difference=0;if(nibble&4)difference+=decoderStep_;if(nibble&2)difference+=decoderStep_>>1;if(nibble&1)difference+=decoderStep_>>2;difference+=decoderStep_>>3;if(nibble&8)difference=-difference;decoderPredicted_+=difference;if(decoderPredicted_>32767)decoderPredicted_=32767;else if(decoderPredicted_<-32767)decoderPredicted_=-32767;updateDecoder_(nibble);return decoderPredicted_}/**
 @private
 @param {number} nibble
 */
function updateDecoder_(nibble){decoderIndex_+=INDEX_TABLE[nibble];if(decoderIndex_<0)decoderIndex_=0;else if(decoderIndex_>88)decoderIndex_=88;decoderStep_=STEP_TABLE[decoderIndex_]}/**
 @private
 @param {number} sample
 @return {!Array<number>}
 */
function blockHead_(sample){encodeSample_(sample);/** @type {!Array<number>} */ var adpcmSamples=[];adpcmSamples.push(sample&255);adpcmSamples.push(sample>>8&255);adpcmSamples.push(encoderIndex_);adpcmSamples.push(0);return adpcmSamples}/** @const @type {!Array<number>} */ var LOG_TABLE=[1,1,2,2,3,3,3,3,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,
7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/**
 @param {number} sample
 @return {number}
 */
function encodeSample(sample){/** @type {number} */ var compandedValue;sample=sample==-32768?-32767:sample;/** @type {number} */ var sign=~sample>>8&128;if(!sign)sample=sample*-1;if(sample>32635)sample=32635;if(sample>=256){/** @type {number} */ var exponent=LOG_TABLE[sample>>8&127];/** @type {number} */ var mantissa=sample>>exponent+3&15;compandedValue=exponent<<4|mantissa}else compandedValue=sample>>4;return compandedValue^(sign^85)}/**
 @param {number} aLawSample
 @return {number}
 */
function decodeSample(aLawSample){/** @type {number} */ var sign=0;aLawSample^=85;if(aLawSample&128){aLawSample&=~(1<<7);sign=-1}/** @type {number} */ var position=((aLawSample&240)>>4)+4;/** @type {number} */ var decoded=0;if(position!=4)decoded=1<<position|(aLawSample&15)<<position-4|1<<position-5;else decoded=aLawSample<<1|1;decoded=sign===0?decoded:-decoded;return decoded*8*-1}/**
 @param {!Int16Array} samples
 @return {!Uint8Array}
 */
function encode$1(samples){/** @type {!Uint8Array} */ var aLawSamples=new Uint8Array(samples.length);for(var i=0;i<samples.length;i++)aLawSamples[i]=encodeSample(samples[i]);return aLawSamples}/**
 @param {!Uint8Array} samples
 @return {!Int16Array}
 */
function decode$1(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample(samples[i]);return pcmSamples}var alaw=Object.freeze({encodeSample:encodeSample,decodeSample:decodeSample,encode:encode$1,decode:decode$1});/** @private @const @type {number} */ var BIAS=132;/** @private @const @type {number} */ var CLIP=32635;/** @private @const @type {Array<number>} */ var encodeTable=[0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,
4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/** @private @const @type {Array<number>} */ var decodeTable=
[0,132,396,924,1980,4092,8316,16764];/**
 @param {number} sample
 @return {number}
 */
function encodeSample$1(sample){/** @type {number} */ var sign;/** @type {number} */ var exponent;/** @type {number} */ var mantissa;/** @type {number} */ var muLawSample;sign=sample>>8&128;if(sign!=0)sample=-sample;if(sample>CLIP)sample=CLIP;sample=sample+BIAS;exponent=encodeTable[sample>>7&255];mantissa=sample>>exponent+3&15;muLawSample=~(sign|exponent<<4|mantissa);return muLawSample}/**
 @param {number} muLawSample
 @return {number}
 */
function decodeSample$1(muLawSample){/** @type {number} */ var sign;/** @type {number} */ var exponent;/** @type {number} */ var mantissa;/** @type {number} */ var sample;muLawSample=~muLawSample;sign=muLawSample&128;exponent=muLawSample>>4&7;mantissa=muLawSample&15;sample=decodeTable[exponent]+(mantissa<<exponent+3);if(sign!=0)sample=-sample;return sample}/**
 @param {!Int16Array} samples
 @return {!Uint8Array}
 */
function encode$1$1(samples){/** @type {!Uint8Array} */ var muLawSamples=new Uint8Array(samples.length);for(var i=0;i<samples.length;i++)muLawSamples[i]=encodeSample$1(samples[i]);return muLawSamples}/**
 @param {!Uint8Array} samples
 @return {!Int16Array}
 */
function decode$1$1(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample$1(samples[i]);return pcmSamples}var mulaw=Object.freeze({encodeSample:encodeSample$1,decodeSample:decodeSample$1,encode:encode$1$1,decode:decode$1$1});/** @const */ var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";/** @const */ var lookup=new Uint8Array(256);for(var i=0;i<chars.length;i++)lookup[chars.charCodeAt(i)]=
i;/** @const */ var encode$2=function(arraybuffer,byteOffset,length){/** @const */ var bytes=new Uint8Array(arraybuffer,byteOffset,length);/** @const */ var len=bytes.length;var base64="";for(var i$2=0;i$2<len;i$2+=3){base64+=chars[bytes[i$2]>>2];base64+=chars[(bytes[i$2]&3)<<4|bytes[i$2+1]>>4];base64+=chars[(bytes[i$2+1]&15)<<2|bytes[i$2+2]>>6];base64+=chars[bytes[i$2+2]&63]}if(len%3===2)base64=base64.substring(0,base64.length-1)+"\x3d";else if(len%3===1)base64=base64.substring(0,base64.length-2)+
"\x3d\x3d";return base64};/** @const */ var decode$2=function(base64){/** @const */ var len=base64.length;var bufferLength=base64.length*.75;var p=0;var encoded1;var encoded2;var encoded3;var encoded4;if(base64[base64.length-1]==="\x3d"){bufferLength--;if(base64[base64.length-2]==="\x3d")bufferLength--}/** @const */ var arraybuffer=new ArrayBuffer(bufferLength);/** @const */ var bytes=new Uint8Array(arraybuffer);for(var i$3=0;i$3<len;i$3+=4){encoded1=lookup[base64.charCodeAt(i$3)];encoded2=lookup[base64.charCodeAt(i$3+
1)];encoded3=lookup[base64.charCodeAt(i$3+2)];encoded4=lookup[base64.charCodeAt(i$3+3)];bytes[p++]=encoded1<<2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer};/**
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @param {number=} index
 @param {number=} end
 @throws {Error}
 */
function endianness(bytes,offset,index,end){index=index===undefined?0:index;end=end===undefined?bytes.length:end;if(end%offset)throw new Error("Bad buffer length.");for(;index<end;index+=offset)swap(bytes,offset,index)}/**
 @private
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @param {number} index
 */
function swap(bytes,offset,index){offset--;for(var x=0;x<offset;x++){/** @type {(number|string)} */ var theByte=bytes[index+x];bytes[index+x]=bytes[index+offset];bytes[index+offset]=theByte;offset--}}/**
 @struct
 @constructor
 @param {number} bits
 @param {boolean} signed
 @throws {Error}
 */
var Integer=function(bits,signed){/** @private @type {number} */ this.bits=bits;/** @private @type {boolean} */ this.signed=signed;/** @private @type {number} */ this.offset=0;/** @private @type {number} */ this.min=-Infinity;/** @private @type {number} */ this.max=Infinity;/** @private @type {number} */ this.realBits_=this.bits;/** @private @type {number} */ this.lastByteMask_=255;this.build_()};/**
 @param {!Uint8Array} bytes
 @param {number=} i
 @return {number}
 */
Integer.prototype.read=function(bytes,i){i=i===undefined?0:i;var num=0;var x=this.offset-1;while(x>0){num=bytes[x+i]<<x*8|num;x--}num=(bytes[i]|num)>>>0;return this.overflow_(this.sign_(num))};/**
 @param {!Array<number>} bytes
 @param {number} number
 @param {number=} j
 @return {number}
 */
Integer.prototype.write=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);bytes[j++]=number&255;for(var i$4=2;i$4<=this.offset;i$4++)bytes[j++]=Math.floor(number/Math.pow(2,(i$4-1)*8))&255;return j};/**
 @private
 @param {!Array<number>} bytes
 @param {number} number
 @param {number=} j
 @return {number}
 */
Integer.prototype.writeEsoteric_=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);j=this.writeFirstByte_(bytes,number,j);for(var i$5=2;i$5<this.offset;i$5++)bytes[j++]=Math.floor(number/Math.pow(2,(i$5-1)*8))&255;if(this.bits>8)bytes[j++]=Math.floor(number/Math.pow(2,(this.offset-1)*8))&this.lastByteMask_;return j};/**
 @private
 @param {!Uint8Array} bytes
 @param {number=} i
 @return {number}
 */
Integer.prototype.readBits_=function(bytes,i){i=i===undefined?0:i;var binary="";var j=0;while(j<this.offset){var bits=bytes[i+j].toString(2);binary=(new Array(9-bits.length)).join("0")+bits+binary;j++}return this.overflow_(this.sign_(parseInt(binary,2)))};/** @private @throws {Error} */ Integer.prototype.build_=function(){this.setRealBits_();this.setLastByteMask_();this.setMinMax_();this.offset=this.bits<8?1:Math.ceil(this.realBits_/8);if(this.realBits_!=this.bits||this.bits<8||this.bits>32){this.write=
this.writeEsoteric_;this.read=this.readBits_}};/**
 @private
 @param {number} num
 @return {number}
 */
Integer.prototype.sign_=function(num){if(num>this.max)num-=this.max*2+2;return num};/**
 @private
 @param {number} value
 @return {number}
 */
Integer.prototype.overflow_=function(value){if(value>this.max)throw new Error("Overflow.");else if(value<this.min)throw new Error("Underflow.");return value};/** @private */ Integer.prototype.setMinMax_=function(){var max=Math.pow(2,this.bits);if(this.signed){this.max=max/2-1;this.min=-max/2}else{this.max=max-1;this.min=0}};/** @private */ Integer.prototype.setRealBits_=function(){if(this.bits>8)this.realBits_=(this.bits-1|7)+1};/** @private */ Integer.prototype.setLastByteMask_=function(){var r=
8-(this.realBits_-this.bits);this.lastByteMask_=Math.pow(2,r>0?r:8)-1};/**
 @private
 @param {!Array<number>} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
Integer.prototype.writeFirstByte_=function(bytes,number,j){if(this.bits<8)bytes[j++]=number<0?number+Math.pow(2,this.bits):number;else bytes[j++]=number&255;return j};/**
 @param {number} code
 @throws {Error}
 */
function validateASCIICode(code){if(code>127)throw new Error("Bad ASCII code.");}/**
 @param {number} value
 @throws {Error}
 */
function validateNotUndefined(value){if(value===undefined)throw new Error("Undefined value.");}/**
 @param {!Object} theType
 @throws {Error}
 */
function validateType(theType){if(!theType)throw new Error("Undefined type.");if(theType.float)validateFloatType_(theType);else validateIntType_(theType)}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateFloatType_(theType){if([16,32,64].indexOf(theType.bits)==-1)throw new Error("Bad float type.");}/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function validateIntType_(theType){if(theType.bits<1||theType.bits>53)throw new Error("Bad type definition.");}/** @private @const @type {boolean} */ var BE_ENV=(new Uint8Array((new Uint32Array([305419896])).buffer))[0]===18;/** @const */ var HIGH=BE_ENV?1:0;/** @const */ var LOW=BE_ENV?0:1;/** @private @type {!Int8Array} */ var int8_=new Int8Array(8);/** @private @type {!Uint32Array} */ var ui32_=new Uint32Array(int8_.buffer);/** @private @type {!Float32Array} */ var f32_=new Float32Array(int8_.buffer);
/** @private @type {!Float64Array} */ var f64_=new Float64Array(int8_.buffer);/** @private @type {Function} */ var reader_;/** @private @type {Function} */ var writer_;/** @private @type {Object} */ var gInt_={};/**
 @private
 @param {!Object} theType
 @throws {Error}
 */
function setUp_(theType){validateType(theType);theType.offset=theType.bits<8?1:Math.ceil(theType.bits/8);theType.be=theType.be||false;setReader(theType);setWriter(theType);gInt_=new Integer(theType.bits==64?32:theType.bits,theType.float?false:theType.signed)}/**
 @private
 @param {number} value
 @param {!Object} theType
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number} index
 @param {number} len
 @param {!Function} validate
 @param {boolean} be
 @return {number}
 */
function writeBytes_(value,theType,buffer,index,len,validate,be){while(index<len){validate(value,theType);index=writer_(buffer,value,index)}if(be)endianness(buffer,theType.offset,index-theType.offset,index);return index}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} i
 @return {number}
 */
function readInt_(bytes,i){return gInt_.read(bytes,i)}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} i
 @return {number}
 */
function read16F_(bytes,i){/** @type {number} */ var int=gInt_.read(bytes,i);/** @type {number} */ var exponent=(int&31744)>>10;/** @type {number} */ var fraction=int&1023;/** @type {number} */ var floatValue;if(exponent)floatValue=Math.pow(2,exponent-15)*(1+fraction/1024);else floatValue=.00006103515625*(fraction/1024);return floatValue*(int>>15?-1:1)}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} i
 @return {number}
 */
function read32F_(bytes,i){ui32_[0]=gInt_.read(bytes,i);return f32_[0]}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} i
 @return {number}
 */
function read64F_(bytes,i){ui32_[HIGH]=gInt_.read(bytes,i);ui32_[LOW]=gInt_.read(bytes,i+4);return f64_[0]}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} number
 @param {number} j
 @return {!number}
 */
function writeInt_(bytes,number,j){return gInt_.write(bytes,number,j)}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write16F_(bytes,number,j){f32_[0]=number;/** @type {number} */ var x=ui32_[0];/** @type {number} */ var bits=x>>16&32768;/** @type {number} */ var m=x>>12&2047;/** @type {number} */ var e=x>>23&255;if(e>=103){bits|=e-112<<10|m>>1;bits+=m&1}bytes[j++]=bits&255;bytes[j++]=bits>>>8&255;return j}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write32F_(bytes,number,j){f32_[0]=number;return gInt_.write(bytes,ui32_[0],j)}/**
 @private
 @param {!Uint8Array} bytes
 @param {number} number
 @param {number} j
 @return {number}
 */
function write64F_(bytes,number,j){f64_[0]=number;j=gInt_.write(bytes,ui32_[HIGH],j);return gInt_.write(bytes,ui32_[LOW],j)}/**
 @private
 @param {!Object} theType
 */
function setReader(theType){if(theType.float)if(theType.bits==16)reader_=read16F_;else if(theType.bits==32)reader_=read32F_;else{if(theType.bits==64)reader_=read64F_}else reader_=readInt_}/**
 @private
 @param {!Object} theType
 */
function setWriter(theType){if(theType.float)if(theType.bits==16)writer_=write16F_;else if(theType.bits==32)writer_=write32F_;else{if(theType.bits==64)writer_=write64F_}else writer_=writeInt_}/**
 @param {!Uint8Array} bytes
 @param {number=} index
 @param {?number=} len
 @return {string}
 @throws {Error}
 */
function unpackString(bytes,index,len){index=index===undefined?0:index;len=len===undefined?null:len;var chrs="";len=len?index+len:bytes.length;while(index<len){validateASCIICode(bytes[index]);chrs+=String.fromCharCode(bytes[index]);index++}return chrs}/**
 @param {string} str
 @return {!Array<number>}
 @throws {Error}
 */
function packString(str){var bytes=[];for(var i$6=0;i$6<str.length;i$6++){var code=str.charCodeAt(i$6);validateASCIICode(code);bytes[i$6]=code}return bytes}/**
 @param {string} str
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number=} index
 @return {number}
 @throws {Error}
 */
function packStringTo(str,buffer,index){index=index===undefined?0:index;for(var i$7=0;i$7<str.length;i$7++){var code=str.charCodeAt(i$7);validateASCIICode(code);buffer[index]=code;index++}return index}/**
 @param {number} value
 @param {!Object} theType
 @return {!Array<number>}
 @throws {Error}
 */
function pack(value,theType){var output=[];packTo(value,theType,output);return output}/**
 @param {number} value
 @param {!Object} theType
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number=} index
 @return {number}
 @throws {Error}
 */
function packTo(value,theType,buffer,index){index=index===undefined?0:index;setUp_(theType);return writeBytes_(value,theType,buffer,index,index+theType.offset,validateNotUndefined,theType.be)}/**
 @param {(!Array<number>|!TypedArray)} values
 @param {!Object} theType
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number=} index
 @return {number}
 @throws {Error}
 */
function packArrayTo(values,theType,buffer,index){index=index===undefined?0:index;setUp_(theType);var be=theType.be;var offset=theType.offset;var len=values.length;for(var i$8=0;i$8<len;i$8++)index=writeBytes_(values[i$8],theType,buffer,index,index+offset,validateNotUndefined,be);return index}/**
 @param {!Uint8Array} buffer
 @param {!Object} theType
 @return {!Array<number>}
 @throws {Error}
 */
function unpackArray(buffer,theType){return unpackArrayFrom(buffer,theType)}/**
 @param {!Uint8Array} buffer
 @param {!Object} theType
 @param {number=} index
 @return {number}
 @throws {Error}
 */
function unpackFrom(buffer,theType,index){index=index===undefined?0:index;setUp_(theType);if(theType.be)endianness(buffer,theType.offset,index,index+theType.offset);var value=reader_(buffer,index);if(theType.be)endianness(buffer,theType.offset,index,index+theType.offset);return value}/**
 @param {!Uint8Array} buffer
 @param {!Object} theType
 @param {number=} index
 @param {?number=} end
 @return {!Array<number>}
 @throws {Error}
 */
function unpackArrayFrom(buffer,theType,index,end){index=index===undefined?0:index;end=end===undefined?null:end;setUp_(theType);var len=end||buffer.length;while((len-index)%theType.offset)len--;if(theType.be)endianness(buffer,theType.offset,index,len);var values=[];var step=theType.offset;for(var i$9=index;i$9<len;i$9+=step)values.push(reader_(buffer,i$9));if(theType.be)endianness(buffer,theType.offset,index,len);return values}/**
 @param {!Uint8Array} buffer
 @param {!Object} theType
 @param {!TypedArray} output
 @param {number=} index
 @param {?number=} end
 @throws {Error}
 */
function unpackArrayTo(buffer,theType,output,index,end){index=index===undefined?0:index;end=end===undefined?null:end;setUp_(theType);var len=end||buffer.length;while((len-index)%theType.offset)len--;if(theType.be)endianness(buffer,theType.offset,index,len);var outputIndex=0;var step=theType.offset;for(var i$10=index;i$10<len;i$10+=step){output.set([reader_(buffer,i$10)],outputIndex);outputIndex++}if(theType.be)endianness(buffer,theType.offset,index,len)}/** @private @const @enum {number} */ var AUDIO_FORMATS=
{4:17,8:1,"8a":6,"8m":7,16:1,24:1,32:1,"32f":3,64:3};/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {number} samplesLength
 @param {!Object} options
 */
function wavHeader(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options){var header={};if(bitDepthCode=="4")header=createADPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);else if(bitDepthCode=="8a"||bitDepthCode=="8m")header=createALawMulawHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);else if(Object.keys(AUDIO_FORMATS).indexOf(bitDepthCode)==-1||numChannels>2)header=createExtensibleHeader_(bitDepthCode,numChannels,sampleRate,
numBytes,samplesLength,options);else header=createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);return header}/** @private @throws {Error} */ function validateHeader_(header){validateBitDepth_$1(header);validateNumChannels_(header);validateSampleRate_(header)}/**
 @private
 @return {boolean}
 @throws {Error}
 */
function validateBitDepth_$1(header){if(!AUDIO_FORMATS[header.bitDepth]){if(parseInt(header.bitDepth,10)>8&&parseInt(header.bitDepth,10)<54)return true;throw new Error("Invalid bit depth.");}return true}/**
 @private
 @return {boolean}
 @throws {Error}
 */
function validateNumChannels_(header){/** @type {number} */ var blockAlign=header.fmt.numChannels*header.fmt.bitsPerSample/8;if(header.fmt.numChannels<1||blockAlign>65535)throw new Error("Invalid number of channels.");return true}/**
 @private
 @return {boolean}
 @throws {Error}
 */
function validateSampleRate_(header){/** @type {number} */ var byteRate=header.fmt.numChannels*(header.fmt.bitsPerSample/8)*header.fmt.sampleRate;if(header.fmt.sampleRate<1||byteRate>4294967295)throw new Error("Invalid sample rate.");return true}/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {number} samplesLength
 @param {!Object} options
 */
function createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options){return{container:options.container,chunkSize:36+samplesLength,format:"WAVE",bitDepth:bitDepthCode,fmt:{chunkId:"fmt ",chunkSize:16,audioFormat:AUDIO_FORMATS[bitDepthCode]?AUDIO_FORMATS[bitDepthCode]:65534,numChannels:numChannels,sampleRate:sampleRate,byteRate:numChannels*numBytes*sampleRate,blockAlign:numChannels*numBytes,bitsPerSample:parseInt(bitDepthCode,10),cbSize:0,validBitsPerSample:0,dwChannelMask:0,
subformat:[]}}}/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {number} samplesLength
 @param {!Object} options
 */
function createADPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options){var header=createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);header.chunkSize=40+samplesLength;header.fmt.chunkSize=20;header.fmt.byteRate=4055;header.fmt.blockAlign=256;header.fmt.bitsPerSample=4;header.fmt.cbSize=2;header.fmt.validBitsPerSample=505;header.fact={chunkId:"fact",chunkSize:4,dwSampleLength:samplesLength*2};return header}/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {number} samplesLength
 @param {!Object} options
 */
function createExtensibleHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options){var header=createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);header.chunkSize=36+24+samplesLength;header.fmt.chunkSize=40;header.fmt.bitsPerSample=(parseInt(bitDepthCode,10)-1|7)+1;header.fmt.cbSize=22;header.fmt.validBitsPerSample=parseInt(bitDepthCode,10);header.fmt.dwChannelMask=getDwChannelMask_(numChannels);header.fmt.subformat=[1,1048576,2852126848,1905997824];
return header}/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {number} samplesLength
 @param {!Object} options
 */
function createALawMulawHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options){var header=createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,samplesLength,options);header.chunkSize=40+samplesLength;header.fmt.chunkSize=20;header.fmt.cbSize=2;header.fmt.validBitsPerSample=8;header.fact={chunkId:"fact",chunkSize:4,dwSampleLength:samplesLength};return header}/**
 @private
 @return {number}
 */
function getDwChannelMask_(numChannels){/** @type {number} */ var dwChannelMask=0;if(numChannels===1)dwChannelMask=4;else if(numChannels===2)dwChannelMask=3;else if(numChannels===4)dwChannelMask=51;else if(numChannels===6)dwChannelMask=63;else if(numChannels===8)dwChannelMask=1599;return dwChannelMask}/** @private @const */ var uInt32_={bits:32};/** @type {number} */ var head_=0;/**
 @param {!Uint8Array} buffer
 @return {!Object}
 */
function riffChunks(buffer){head_=0;var chunkId=getChunkId_(buffer,0);uInt32_.be=chunkId=="RIFX";var format=unpackString(buffer,8,4);head_+=4;return{chunkId:chunkId,chunkSize:getChunkSize_(buffer,0),format:format,subChunks:getSubChunksIndex_(buffer)}}/**
 @private
 @param {!Object} chunks
 @param {string} chunkId
 @param {boolean} multiple
 @return {?Array<!Object>}
 */
function findChunk_(chunks,chunkId,multiple){multiple=multiple===undefined?false:multiple;/** @type {!Array<!Object>} */ var chunk=[];for(var i$11=0;i$11<chunks.length;i$11++)if(chunks[i$11].chunkId==chunkId)if(multiple)chunk.push(chunks[i$11]);else return chunks[i$11];if(chunkId=="LIST")return chunk.length?chunk:null;return null}/**
 @private
 @param {!Uint8Array} buffer
 @return {!Array<Object>}
 */
function getSubChunksIndex_(buffer){var chunks=[];var i=head_;while(i<=buffer.length-8){chunks.push(getSubChunkIndex_(buffer,i));i+=8+chunks[chunks.length-1].chunkSize;i=i%2?i+1:i}return chunks}/**
 @private
 @param {!Uint8Array} buffer
 @param {number} index
 @return {!Object}
 */
function getSubChunkIndex_(buffer,index){var chunk={chunkId:getChunkId_(buffer,index),chunkSize:getChunkSize_(buffer,index)};if(chunk.chunkId=="LIST"){chunk.format=unpackString(buffer,index+8,4);head_+=4;chunk.subChunks=getSubChunksIndex_(buffer)}else{var realChunkSize=chunk.chunkSize%2?chunk.chunkSize+1:chunk.chunkSize;head_=index+8+realChunkSize;chunk.chunkData={start:index+8,end:head_}}return chunk}/**
 @private
 @param {!Uint8Array} buffer
 @param {number} index
 @return {string}
 */
function getChunkId_(buffer,index){head_+=4;return unpackString(buffer,index,4)}/**
 @private
 @param {!Uint8Array} buffer
 @param {number} index
 @return {number}
 */
function getChunkSize_(buffer,index){head_+=4;return unpackFrom(buffer,uInt32_,index+4)}/** @struct @constructor */ var BufferIO=function(){/** @private @type {number} */ this.head_=0};/**
 @private
 @param {string} str
 @param {number} maxSize
 @return {!Array<number>}
 */
BufferIO.prototype.writeString_=function(str,maxSize,push){push=push===undefined?true:push;/** @type {!Array<number>} */ var bytes=packString(str);if(push)for(var i$12=bytes.length;i$12<maxSize;i$12++)bytes.push(0);return bytes};/**
 @private
 @param {!Uint8Array} bytes
 @return {string}
 */
BufferIO.prototype.readZSTR_=function(bytes,index){index=index===undefined?0:index;/** @type {string} */ var str="";for(var i$13=index;i$13<bytes.length;i$13++){this.head_++;if(bytes[i$13]===0)break;str+=unpackString(bytes,i$13,1)}return str};/**
 @private
 @param {!Uint8Array} bytes
 @param {number} maxSize
 @return {string}
 */
BufferIO.prototype.readString_=function(bytes,maxSize){/** @type {string} */ var str="";for(var i$14=0;i$14<maxSize;i$14++){str+=unpackString(bytes,this.head_,1);this.head_++}return str};/**
 @private
 @param {!Uint8Array} bytes
 @param {!Object} bdType
 @return {number}
 */
BufferIO.prototype.read_=function(bytes,bdType){/** @type {number} */ var size=bdType.bits/8;/** @type {number} */ var value=unpackFrom(bytes,bdType,this.head_);this.head_+=size;return value};var io=new BufferIO;/**
 @private
 @return {!Uint8Array}
 */
function writeWavBuffer(wav){var uInt32_={bits:32,be:false};var uInt16_={bits:16,be:false};uInt16_.be=wav.container==="RIFX";uInt32_.be=uInt16_.be;/** @type {!Array<!Array<number>>} */ var fileBody=[getJunkBytes_(wav,uInt32_),getDs64Bytes_(wav,uInt32_),getBextBytes_(wav,uInt32_,uInt16_),getFmtBytes_(wav,uInt32_,uInt16_),getFactBytes_(wav,uInt32_),packString(wav.data.chunkId),pack(wav.data.samples.length,uInt32_),wav.data.samples,getCueBytes_(wav,uInt32_),getSmplBytes_(wav,uInt32_),getLISTBytes_(wav,
uInt32_,uInt16_)];/** @type {number} */ var fileBodyLength=0;for(var i$15=0;i$15<fileBody.length;i$15++)fileBodyLength+=fileBody[i$15].length;/** @type {!Uint8Array} */ var file=new Uint8Array(fileBodyLength+12);/** @type {number} */ var index=0;index=packStringTo(wav.container,file,index);index=packTo(fileBodyLength+4,uInt32_,file,index);index=packStringTo(wav.format,file,index);for(var i$16=0;i$16<fileBody.length;i$16++){file.set(fileBody[i$16],index);index+=fileBody[i$16].length}return file}/**
 @private
 @return {!Array<number>}
 */
function getBextBytes_(wav,uInt32_,uInt16_){/** @type {!Array<number>} */ var bytes=[];enforceBext_(wav);if(wav.bext.chunkId){wav.bext.chunkSize=602+wav.bext.codingHistory.length;bytes=bytes.concat(packString(wav.bext.chunkId),pack(602+wav.bext.codingHistory.length,uInt32_),io.writeString_(wav.bext.description,256),io.writeString_(wav.bext.originator,32),io.writeString_(wav.bext.originatorReference,32),io.writeString_(wav.bext.originationDate,10),io.writeString_(wav.bext.originationTime,8),pack(wav.bext.timeReference[0],
uInt32_),pack(wav.bext.timeReference[1],uInt32_),pack(wav.bext.version,uInt16_),io.writeString_(wav.bext.UMID,64),pack(wav.bext.loudnessValue,uInt16_),pack(wav.bext.loudnessRange,uInt16_),pack(wav.bext.maxTruePeakLevel,uInt16_),pack(wav.bext.maxMomentaryLoudness,uInt16_),pack(wav.bext.maxShortTermLoudness,uInt16_),io.writeString_(wav.bext.reserved,180),io.writeString_(wav.bext.codingHistory,wav.bext.codingHistory.length))}return bytes}/** @private */ function enforceBext_(wav){for(var prop in wav.bext)if(wav.bext.hasOwnProperty(prop))if(wav.bext[prop]&&
prop!="timeReference"){wav.bext.chunkId="bext";break}if(wav.bext.timeReference[0]||wav.bext.timeReference[1])wav.bext.chunkId="bext"}/**
 @private
 @return {!Array<number>}
 */
function getDs64Bytes_(wav,uInt32_){/** @type {!Array<number>} */ var bytes=[];if(wav.ds64.chunkId)bytes=bytes.concat(packString(wav.ds64.chunkId),pack(wav.ds64.chunkSize,uInt32_),pack(wav.ds64.riffSizeHigh,uInt32_),pack(wav.ds64.riffSizeLow,uInt32_),pack(wav.ds64.dataSizeHigh,uInt32_),pack(wav.ds64.dataSizeLow,uInt32_),pack(wav.ds64.originationTime,uInt32_),pack(wav.ds64.sampleCountHigh,uInt32_),pack(wav.ds64.sampleCountLow,uInt32_));return bytes}/**
 @private
 @return {!Array<number>}
 */
function getCueBytes_(wav,uInt32_){/** @type {!Array<number>} */ var bytes=[];if(wav.cue.chunkId){/** @type {!Array<number>} */ var cuePointsBytes=getCuePointsBytes_(wav,uInt32_);bytes=bytes.concat(packString(wav.cue.chunkId),pack(cuePointsBytes.length+4,uInt32_),pack(wav.cue.dwCuePoints,uInt32_),cuePointsBytes)}return bytes}/**
 @private
 @return {!Array<number>}
 */
function getCuePointsBytes_(wav,uInt32_){/** @type {!Array<number>} */ var points=[];for(var i$17=0;i$17<wav.cue.dwCuePoints;i$17++)points=points.concat(pack(wav.cue.points[i$17].dwName,uInt32_),pack(wav.cue.points[i$17].dwPosition,uInt32_),packString(wav.cue.points[i$17].fccChunk),pack(wav.cue.points[i$17].dwChunkStart,uInt32_),pack(wav.cue.points[i$17].dwBlockStart,uInt32_),pack(wav.cue.points[i$17].dwSampleOffset,uInt32_));return points}/**
 @private
 @return {!Array<number>}
 */
function getSmplBytes_(wav,uInt32_){/** @type {!Array<number>} */ var bytes=[];if(wav.smpl.chunkId){/** @type {!Array<number>} */ var smplLoopsBytes=getSmplLoopsBytes_(wav,uInt32_);bytes=bytes.concat(packString(wav.smpl.chunkId),pack(smplLoopsBytes.length+36,uInt32_),pack(wav.smpl.dwManufacturer,uInt32_),pack(wav.smpl.dwProduct,uInt32_),pack(wav.smpl.dwSamplePeriod,uInt32_),pack(wav.smpl.dwMIDIUnityNote,uInt32_),pack(wav.smpl.dwMIDIPitchFraction,uInt32_),pack(wav.smpl.dwSMPTEFormat,uInt32_),pack(wav.smpl.dwSMPTEOffset,
uInt32_),pack(wav.smpl.dwNumSampleLoops,uInt32_),pack(wav.smpl.dwSamplerData,uInt32_),smplLoopsBytes)}return bytes}/**
 @private
 @return {!Array<number>}
 */
function getSmplLoopsBytes_(wav,uInt32_){/** @type {!Array<number>} */ var loops=[];for(var i$18=0;i$18<wav.smpl.dwNumSampleLoops;i$18++)loops=loops.concat(pack(wav.smpl.loops[i$18].dwName,uInt32_),pack(wav.smpl.loops[i$18].dwType,uInt32_),pack(wav.smpl.loops[i$18].dwStart,uInt32_),pack(wav.smpl.loops[i$18].dwEnd,uInt32_),pack(wav.smpl.loops[i$18].dwFraction,uInt32_),pack(wav.smpl.loops[i$18].dwPlayCount,uInt32_));return loops}/**
 @private
 @return {!Array<number>}
 */
function getFactBytes_(wav,uInt32_){/** @type {!Array<number>} */ var bytes=[];if(wav.fact.chunkId)bytes=bytes.concat(packString(wav.fact.chunkId),pack(wav.fact.chunkSize,uInt32_),pack(wav.fact.dwSampleLength,uInt32_));return bytes}/**
 @private
 @return {!Array<number>}
 @throws {Error}
 */
function getFmtBytes_(wav,uInt32_,uInt16_){/** @type {!Array<number>} */ var fmtBytes=[];if(wav.fmt.chunkId)return fmtBytes.concat(packString(wav.fmt.chunkId),pack(wav.fmt.chunkSize,uInt32_),pack(wav.fmt.audioFormat,uInt16_),pack(wav.fmt.numChannels,uInt16_),pack(wav.fmt.sampleRate,uInt32_),pack(wav.fmt.byteRate,uInt32_),pack(wav.fmt.blockAlign,uInt16_),pack(wav.fmt.bitsPerSample,uInt16_),getFmtExtensionBytes_(wav,uInt32_,uInt16_));throw Error('Could not find the "fmt " chunk');}/**
 @private
 @return {!Array<number>}
 */
function getFmtExtensionBytes_(wav,uInt32_,uInt16_){/** @type {!Array<number>} */ var extension=[];if(wav.fmt.chunkSize>16)extension=extension.concat(pack(wav.fmt.cbSize,uInt16_));if(wav.fmt.chunkSize>18)extension=extension.concat(pack(wav.fmt.validBitsPerSample,uInt16_));if(wav.fmt.chunkSize>20)extension=extension.concat(pack(wav.fmt.dwChannelMask,uInt32_));if(wav.fmt.chunkSize>24)extension=extension.concat(pack(wav.fmt.subformat[0],uInt32_),pack(wav.fmt.subformat[1],uInt32_),pack(wav.fmt.subformat[2],
uInt32_),pack(wav.fmt.subformat[3],uInt32_));return extension}/**
 @return {!Array<number>}
 */
function getLISTBytes_(wav,uInt32_,uInt16_){/** @type {!Array<number>} */ var bytes=[];for(var i$19=0;i$19<wav.LIST.length;i$19++){/** @type {!Array<number>} */ var subChunksBytes=getLISTSubChunksBytes_(wav.LIST[i$19].subChunks,wav.LIST[i$19].format,wav,uInt32_,uInt16_);bytes=bytes.concat(packString(wav.LIST[i$19].chunkId),pack(subChunksBytes.length+4,uInt32_),packString(wav.LIST[i$19].format),subChunksBytes)}return bytes}/**
 @private
 @param {!Array<!Object>} subChunks
 @param {string} format
 @return {!Array<number>}
 */
function getLISTSubChunksBytes_(subChunks,format,wav,uInt32_,uInt16_){/** @type {!Array<number>} */ var bytes=[];for(var i$20=0;i$20<subChunks.length;i$20++){if(format=="INFO"){bytes=bytes.concat(packString(subChunks[i$20].chunkId),pack(subChunks[i$20].value.length+1,uInt32_),io.writeString_(subChunks[i$20].value,subChunks[i$20].value.length));bytes.push(0)}else if(format=="adtl")if(["labl","note"].indexOf(subChunks[i$20].chunkId)>-1){bytes=bytes.concat(packString(subChunks[i$20].chunkId),pack(subChunks[i$20].value.length+
4+1,uInt32_),pack(subChunks[i$20].dwName,uInt32_),io.writeString_(subChunks[i$20].value,subChunks[i$20].value.length));bytes.push(0)}else if(subChunks[i$20].chunkId=="ltxt")bytes=bytes.concat(getLtxtChunkBytes_(subChunks[i$20],wav,uInt32_,uInt16_));if(bytes.length%2)bytes.push(0)}return bytes}/**
 @private
 @param {!Object} ltxt
 @return {!Array<number>}
 */
function getLtxtChunkBytes_(ltxt,wav,uInt32_,uInt16_){return[].concat(packString(ltxt.chunkId),pack(ltxt.value.length+20,uInt32_),pack(ltxt.dwName,uInt32_),pack(ltxt.dwSampleLength,uInt32_),pack(ltxt.dwPurposeID,uInt32_),pack(ltxt.dwCountry,uInt16_),pack(ltxt.dwLanguage,uInt16_),pack(ltxt.dwDialect,uInt16_),pack(ltxt.dwCodePage,uInt16_),io.writeString_(ltxt.value,ltxt.value.length))}/**
 @private
 @return {!Array<number>}
 */
function getJunkBytes_(wav,uInt32_){/** @type {!Array<number>} */ var bytes=[];if(wav.junk.chunkId)return bytes.concat(packString(wav.junk.chunkId),pack(wav.junk.chunkData.length,uInt32_),wav.junk.chunkData);return bytes}var io$1=new BufferIO;/**
 @param {!Uint8Array} buffer
 @param {boolean} samples
 @param {!Object} wav
 @throws {Error}
 */
function readWavBuffer(buffer,samples,wav){io$1.head_=0;var uInt32_={bits:32,be:false};var uInt16_={bits:16,be:false};readRIFFChunk_(buffer,wav,uInt32_,uInt16_);/** @type {!Object} */ var chunk=riffChunks(buffer);readDs64Chunk_(buffer,chunk.subChunks,wav,uInt32_);readFmtChunk_(buffer,chunk.subChunks,wav,uInt32_,uInt16_);readFactChunk_(buffer,chunk.subChunks,wav,uInt32_);readBextChunk_(buffer,chunk.subChunks,wav,uInt32_,uInt16_);readCueChunk_(buffer,chunk.subChunks,wav,uInt32_);readSmplChunk_(buffer,
chunk.subChunks,wav,uInt32_);readDataChunk_(buffer,chunk.subChunks,samples,wav);readJunkChunk_(buffer,chunk.subChunks,wav);readLISTChunk_(buffer,chunk.subChunks,wav,uInt32_,uInt16_);bitDepthFromFmt_(wav)}/** @private */ function bitDepthFromFmt_(wav){if(wav.fmt.audioFormat===3&&wav.fmt.bitsPerSample===32)wav.bitDepth="32f";else if(wav.fmt.audioFormat===6)wav.bitDepth="8a";else if(wav.fmt.audioFormat===7)wav.bitDepth="8m";else wav.bitDepth=wav.fmt.bitsPerSample.toString()}/**
 @private
 @param {!Uint8Array} bytes
 @throws {Error}
 */
function readRIFFChunk_(bytes,wav,uInt32_,uInt16_){io$1.head_=0;wav.container=io$1.readString_(bytes,4);if(["RIFF","RIFX","RF64"].indexOf(wav.container)===-1)throw Error("Not a supported format.");uInt16_.be=wav.container==="RIFX";uInt32_.be=uInt16_.be;wav.chunkSize=io$1.read_(bytes,uInt32_);wav.format=io$1.readString_(bytes,4);if(wav.format!="WAVE")throw Error('Could not find the "WAVE" format identifier');}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @throws {Error}
 */
function readFmtChunk_(buffer,signature,wav,uInt32_,uInt16_){/** @type {?Object} */ var chunk=findChunk_(signature,"fmt ");if(chunk){io$1.head_=chunk.chunkData.start;wav.fmt.chunkId=chunk.chunkId;wav.fmt.chunkSize=chunk.chunkSize;wav.fmt.audioFormat=io$1.read_(buffer,uInt16_);wav.fmt.numChannels=io$1.read_(buffer,uInt16_);wav.fmt.sampleRate=io$1.read_(buffer,uInt32_);wav.fmt.byteRate=io$1.read_(buffer,uInt32_);wav.fmt.blockAlign=io$1.read_(buffer,uInt16_);wav.fmt.bitsPerSample=io$1.read_(buffer,
uInt16_);readFmtExtension_(buffer,wav,uInt32_,uInt16_)}else throw Error('Could not find the "fmt " chunk');}/**
 @private
 @param {!Uint8Array} buffer
 */
function readFmtExtension_(buffer,wav,uInt32_,uInt16_){if(wav.fmt.chunkSize>16){wav.fmt.cbSize=io$1.read_(buffer,uInt16_);if(wav.fmt.chunkSize>18){wav.fmt.validBitsPerSample=io$1.read_(buffer,uInt16_);if(wav.fmt.chunkSize>20){wav.fmt.dwChannelMask=io$1.read_(buffer,uInt32_);wav.fmt.subformat=[io$1.read_(buffer,uInt32_),io$1.read_(buffer,uInt32_),io$1.read_(buffer,uInt32_),io$1.read_(buffer,uInt32_)]}}}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readFactChunk_(buffer,signature,wav,uInt32_){/** @type {?Object} */ var chunk=findChunk_(signature,"fact");if(chunk){io$1.head_=chunk.chunkData.start;wav.fact.chunkId=chunk.chunkId;wav.fact.chunkSize=chunk.chunkSize;wav.fact.dwSampleLength=io$1.read_(buffer,uInt32_)}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readCueChunk_(buffer,signature,wav,uInt32_){/** @type {?Object} */ var chunk=findChunk_(signature,"cue ");if(chunk){io$1.head_=chunk.chunkData.start;wav.cue.chunkId=chunk.chunkId;wav.cue.chunkSize=chunk.chunkSize;wav.cue.dwCuePoints=io$1.read_(buffer,uInt32_);for(var i$21=0;i$21<wav.cue.dwCuePoints;i$21++)wav.cue.points.push({dwName:io$1.read_(buffer,uInt32_),dwPosition:io$1.read_(buffer,uInt32_),fccChunk:io$1.readString_(buffer,4),dwChunkStart:io$1.read_(buffer,uInt32_),dwBlockStart:io$1.read_(buffer,
uInt32_),dwSampleOffset:io$1.read_(buffer,uInt32_)})}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readSmplChunk_(buffer,signature,wav,uInt32_){/** @type {?Object} */ var chunk=findChunk_(signature,"smpl");if(chunk){io$1.head_=chunk.chunkData.start;wav.smpl.chunkId=chunk.chunkId;wav.smpl.chunkSize=chunk.chunkSize;wav.smpl.dwManufacturer=io$1.read_(buffer,uInt32_);wav.smpl.dwProduct=io$1.read_(buffer,uInt32_);wav.smpl.dwSamplePeriod=io$1.read_(buffer,uInt32_);wav.smpl.dwMIDIUnityNote=io$1.read_(buffer,uInt32_);wav.smpl.dwMIDIPitchFraction=io$1.read_(buffer,uInt32_);wav.smpl.dwSMPTEFormat=
io$1.read_(buffer,uInt32_);wav.smpl.dwSMPTEOffset=io$1.read_(buffer,uInt32_);wav.smpl.dwNumSampleLoops=io$1.read_(buffer,uInt32_);wav.smpl.dwSamplerData=io$1.read_(buffer,uInt32_);for(var i$22=0;i$22<wav.smpl.dwNumSampleLoops;i$22++)wav.smpl.loops.push({dwName:io$1.read_(buffer,uInt32_),dwType:io$1.read_(buffer,uInt32_),dwStart:io$1.read_(buffer,uInt32_),dwEnd:io$1.read_(buffer,uInt32_),dwFraction:io$1.read_(buffer,uInt32_),dwPlayCount:io$1.read_(buffer,uInt32_)})}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @param {boolean} samples
 @throws {Error}
 */
function readDataChunk_(buffer,signature,samples,wav){/** @type {?Object} */ var chunk=findChunk_(signature,"data");if(chunk){wav.data.chunkId="data";wav.data.chunkSize=chunk.chunkSize;if(samples)wav.data.samples=buffer.slice(chunk.chunkData.start,chunk.chunkData.end)}else throw Error('Could not find the "data" chunk');}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readBextChunk_(buffer,signature,wav,uInt32_,uInt16_){/** @type {?Object} */ var chunk=findChunk_(signature,"bext");if(chunk){io$1.head_=chunk.chunkData.start;wav.bext.chunkId=chunk.chunkId;wav.bext.chunkSize=chunk.chunkSize;wav.bext.description=io$1.readString_(buffer,256);wav.bext.originator=io$1.readString_(buffer,32);wav.bext.originatorReference=io$1.readString_(buffer,32);wav.bext.originationDate=io$1.readString_(buffer,10);wav.bext.originationTime=io$1.readString_(buffer,8);wav.bext.timeReference=
[io$1.read_(buffer,uInt32_),io$1.read_(buffer,uInt32_)];wav.bext.version=io$1.read_(buffer,uInt16_);wav.bext.UMID=io$1.readString_(buffer,64);wav.bext.loudnessValue=io$1.read_(buffer,uInt16_);wav.bext.loudnessRange=io$1.read_(buffer,uInt16_);wav.bext.maxTruePeakLevel=io$1.read_(buffer,uInt16_);wav.bext.maxMomentaryLoudness=io$1.read_(buffer,uInt16_);wav.bext.maxShortTermLoudness=io$1.read_(buffer,uInt16_);wav.bext.reserved=io$1.readString_(buffer,180);wav.bext.codingHistory=io$1.readString_(buffer,
wav.bext.chunkSize-602)}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @throws {Error}
 */
function readDs64Chunk_(buffer,signature,wav,uInt32_){/** @type {?Object} */ var chunk=findChunk_(signature,"ds64");if(chunk){io$1.head_=chunk.chunkData.start;wav.ds64.chunkId=chunk.chunkId;wav.ds64.chunkSize=chunk.chunkSize;wav.ds64.riffSizeHigh=io$1.read_(buffer,uInt32_);wav.ds64.riffSizeLow=io$1.read_(buffer,uInt32_);wav.ds64.dataSizeHigh=io$1.read_(buffer,uInt32_);wav.ds64.dataSizeLow=io$1.read_(buffer,uInt32_);wav.ds64.originationTime=io$1.read_(buffer,uInt32_);wav.ds64.sampleCountHigh=io$1.read_(buffer,
uInt32_);wav.ds64.sampleCountLow=io$1.read_(buffer,uInt32_)}else if(wav.container=="RF64")throw Error('Could not find the "ds64" chunk');}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readLISTChunk_(buffer,signature,wav,uInt32_,uInt16_){/** @type {?Object} */ var listChunks=findChunk_(signature,"LIST",true);if(listChunks===null)return;for(var j=0;j<listChunks.length;j++){/** @type {!Object} */ var subChunk=listChunks[j];wav.LIST.push({chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,format:subChunk.format,subChunks:[]});for(var x=0;x<subChunk.subChunks.length;x++)readLISTSubChunks_(subChunk.subChunks[x],subChunk.format,buffer,wav,uInt32_,uInt16_)}}/**
 @private
 @param {!Object} subChunk
 @param {string} format
 @param {!Uint8Array} buffer
 */
function readLISTSubChunks_(subChunk,format,buffer,wav,uInt32_,uInt16_){if(format=="adtl"){if(["labl","note","ltxt"].indexOf(subChunk.chunkId)>-1){io$1.head_=subChunk.chunkData.start;/** @type {!Object<string,(string|number)>} */ var item={chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,dwName:io$1.read_(buffer,uInt32_)};if(subChunk.chunkId=="ltxt"){item.dwSampleLength=io$1.read_(buffer,uInt32_);item.dwPurposeID=io$1.read_(buffer,uInt32_);item.dwCountry=io$1.read_(buffer,uInt16_);item.dwLanguage=
io$1.read_(buffer,uInt16_);item.dwDialect=io$1.read_(buffer,uInt16_);item.dwCodePage=io$1.read_(buffer,uInt16_)}item.value=io$1.readZSTR_(buffer,io$1.head_);wav.LIST[wav.LIST.length-1].subChunks.push(item)}}else if(format=="INFO"){io$1.head_=subChunk.chunkData.start;wav.LIST[wav.LIST.length-1].subChunks.push({chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,value:io$1.readZSTR_(buffer,io$1.head_)})}}/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
function readJunkChunk_(buffer,signature,wav){/** @type {?Object} */ var chunk=findChunk_(signature,"junk");if(chunk)wav.junk={chunkId:chunk.chunkId,chunkSize:chunk.chunkSize,chunkData:[].slice.call(buffer.slice(chunk.chunkData.start,chunk.chunkData.end))}}/**
 @struct
 @constructor
 @param {?Uint8Array} bytes
 @throws {Error}
 */
var WaveFile=function(bytes){bytes=bytes===undefined?null:bytes;/** @type {string} */ this.container="";/** @type {number} */ this.chunkSize=0;/** @type {string} */ this.format="";/** @type {!Object<string,*>} */ this.fmt={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ audioFormat:0,/** @type {number} */ numChannels:0,/** @type {number} */ sampleRate:0,/** @type {number} */ byteRate:0,/** @type {number} */ blockAlign:0,/** @type {number} */ bitsPerSample:0,
/** @type {number} */ cbSize:0,/** @type {number} */ validBitsPerSample:0,/** @type {number} */ dwChannelMask:0,/** @type {!Array<number>} */ subformat:[]};/** @type {!Object<string,*>} */ this.fact={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ dwSampleLength:0};/** @type {!Object<string,*>} */ this.cue={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ dwCuePoints:0,/** @type {!Array<!Object>} */ points:[]};/** @type {!Object<string,*>} */ this.smpl=
{/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ dwManufacturer:0,/** @type {number} */ dwProduct:0,/** @type {number} */ dwSamplePeriod:0,/** @type {number} */ dwMIDIUnityNote:0,/** @type {number} */ dwMIDIPitchFraction:0,/** @type {number} */ dwSMPTEFormat:0,/** @type {number} */ dwSMPTEOffset:0,/** @type {number} */ dwNumSampleLoops:0,/** @type {number} */ dwSamplerData:0,/** @type {!Array<!Object>} */ loops:[]};/** @type {!Object<string,*>} */ this.bext=
{/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {string} */ description:"",/** @type {string} */ originator:"",/** @type {string} */ originatorReference:"",/** @type {string} */ originationDate:"",/** @type {string} */ originationTime:"",/** @type {!Array<number>} */ timeReference:[0,0],/** @type {number} */ version:0,/** @type {string} */ UMID:"",/** @type {number} */ loudnessValue:0,/** @type {number} */ loudnessRange:0,/** @type {number} */ maxTruePeakLevel:0,/** @type {number} */ maxMomentaryLoudness:0,
/** @type {number} */ maxShortTermLoudness:0,/** @type {string} */ reserved:"",/** @type {string} */ codingHistory:""};/** @type {!Object<string,*>} */ this.ds64={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ riffSizeHigh:0,/** @type {number} */ riffSizeLow:0,/** @type {number} */ dataSizeHigh:0,/** @type {number} */ dataSizeLow:0,/** @type {number} */ originationTime:0,/** @type {number} */ sampleCountHigh:0,/** @type {number} */ sampleCountLow:0};/** @type {!Object<string,*>} */ this.data=
{/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {!Uint8Array} */ samples:new Uint8Array(0)};/** @type {!Array<!Object>} */ this.LIST=[];/** @type {!Object<string,*>} */ this.junk={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {!Array<number>} */ chunkData:[]};/** @type {string} */ this.bitDepth="0";/** @private @type {!Object} */ this.dataType={};this.io=new BufferIO;if(bytes)this.fromBuffer(bytes)};/**
 @param {number} numChannels
 @param {number} sampleRate
 @param {string} bitDepthCode
 @param {(!Array<number>|!Array<!Array<number>>|!ArrayBufferView)} samples
 @param {?Object} options
 @throws {Error}
 */
WaveFile.prototype.fromScratch=function(numChannels,sampleRate,bitDepthCode,samples,options){options=options===undefined?{}:options;if(!options.container)options.container="RIFF";this.container=options.container;this.bitDepth=bitDepthCode;samples=this.interleave_(samples);this.updateDataType_();/** @type {number} */ var numBytes=this.dataType.bits/8;this.data.samples=new Uint8Array(samples.length*numBytes);packArrayTo(samples,this.dataType,this.data.samples);/** @type {!Object} */ var header=wavHeader(bitDepthCode,
numChannels,sampleRate,numBytes,this.data.samples.length,options);this.clearHeader_();this.chunkSize=header.chunkSize;this.format=header.format;this.fmt=header.fmt;if(header.fact)this.fact=header.fact;this.data.chunkId="data";this.data.chunkSize=this.data.samples.length;validateHeader_(this)};/**
 @param {!Uint8Array} bytes
 @param {boolean=} samples
 @throws {Error}
 */
WaveFile.prototype.fromBuffer=function(bytes,samples){samples=samples===undefined?true:samples;this.clearHeader_();readWavBuffer(bytes,samples,this);this.updateDataType_()};/**
 @return {!Uint8Array}
 @throws {Error}
 */
WaveFile.prototype.toBuffer=function(){validateHeader_(this);return writeWavBuffer(this)};/**
 @param {string} base64String
 @throws {Error}
 */
WaveFile.prototype.fromBase64=function(base64String){this.fromBuffer(new Uint8Array(decode$2(base64String)))};/**
 @return {string}
 @throws {Error}
 */
WaveFile.prototype.toBase64=function(){/** @type {!Uint8Array} */ var buffer=this.toBuffer();return encode$2(buffer,0,buffer.length)};/**
 @return {string}
 @throws {Error}
 */
WaveFile.prototype.toDataURI=function(){return"data:audio/wav;base64,"+this.toBase64()};/**
 @param {string} dataURI
 @throws {Error}
 */
WaveFile.prototype.fromDataURI=function(dataURI){this.fromBase64(dataURI.replace("data:audio/wav;base64,",""))};WaveFile.prototype.toRIFF=function(){if(this.container=="RF64")this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,this.bitDepth,unpackArray(this.data.samples,this.dataType));else{this.dataType.be=true;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,this.bitDepth,unpackArray(this.data.samples,this.dataType))}};WaveFile.prototype.toRIFX=function(){if(this.container=="RF64")this.fromScratch(this.fmt.numChannels,
this.fmt.sampleRate,this.bitDepth,unpackArray(this.data.samples,this.dataType),{container:"RIFX"});else this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,this.bitDepth,unpackArray(this.data.samples,this.dataType),{container:"RIFX"})};/**
 @param {string} newBitDepth
 @param {boolean} changeResolution
 @throws {Error}
 */
WaveFile.prototype.toBitDepth=function(newBitDepth,changeResolution){changeResolution=changeResolution===undefined?true:changeResolution;/** @type {string} */ var toBitDepth=newBitDepth;/** @type {string} */ var thisBitDepth=this.bitDepth;if(!changeResolution){if(newBitDepth!="32f")toBitDepth=this.dataType.bits.toString();thisBitDepth=this.dataType.bits}this.assureUncompressed_();/** @type {number} */ var sampleCount=this.data.samples.length/(this.dataType.bits/8);/** @type {!Float64Array} */ var typedSamplesInput=
new Float64Array(sampleCount+1);/** @type {!Float64Array} */ var typedSamplesOutput=new Float64Array(sampleCount+1);unpackArrayTo(this.data.samples,this.dataType,typedSamplesInput);bitDepth(typedSamplesInput,thisBitDepth,toBitDepth,typedSamplesOutput);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,newBitDepth,typedSamplesOutput,{container:this.correctContainer_()})};/** @throws {Error} */ WaveFile.prototype.toIMAADPCM=function(){if(this.fmt.sampleRate!==8E3)throw new Error("Only 8000 Hz files can be compressed as IMA-ADPCM.");
else if(this.fmt.numChannels!==1)throw new Error("Only mono files can be compressed as IMA-ADPCM.");else{this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"4",encode(output),{container:this.correctContainer_()})}};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromIMAADPCM=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",decode(this.data.samples,this.fmt.blockAlign),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};WaveFile.prototype.toALaw=function(){this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,
this.fmt.sampleRate,"8a",alaw.encode(output),{container:this.correctContainer_()})};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromALaw=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",alaw.decode(this.data.samples),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};WaveFile.prototype.toMuLaw=function(){this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,
"8m",mulaw.encode(output),{container:this.correctContainer_()})};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromMuLaw=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",mulaw.decode(this.data.samples),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};/**
 @param {string} tag
 @param {string} value
 @throws {Error}
 */
WaveFile.prototype.setTag=function(tag,value){tag=this.fixTagName_(tag);/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null){this.LIST[index.LIST].subChunks[index.TAG].chunkSize=value.length+1;this.LIST[index.LIST].subChunks[index.TAG].value=value}else if(index.LIST!==null)this.LIST[index.LIST].subChunks.push({chunkId:tag,chunkSize:value.length+1,value:value});else{this.LIST.push({chunkId:"LIST",chunkSize:8+value.length+1,format:"INFO",subChunks:[]});this.LIST[this.LIST.length-
1].subChunks.push({chunkId:tag,chunkSize:value.length+1,value:value})}};/**
 @param {string} tag
 @return {?string}
 */
WaveFile.prototype.getTag=function(tag){/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null)return this.LIST[index.LIST].subChunks[index.TAG].value;return null};/**
 @param {string} tag
 @return {boolean}
 */
WaveFile.prototype.deleteTag=function(tag){/** @type {!Object} */ var index=this.getTagIndex_(tag);if(index.TAG!==null){this.LIST[index.LIST].subChunks.splice(index.TAG,1);return true}return false};/**
 @param {number} position
 @param {string} labl
 */
WaveFile.prototype.setCuePoint=function(position,labl){labl=labl===undefined?"":labl;this.cue.chunkId="cue ";position=position*this.fmt.sampleRate/1E3;/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];/** @type {boolean} */ var hasSet=false;if(len===0)this.setCuePoint_(position,1,labl);else{for(var i$23=0;i$23<len;i$23++)if(existingPoints[i$23].dwPosition>position&&!hasSet){this.setCuePoint_(position,
i$23+1,labl);this.setCuePoint_(existingPoints[i$23].dwPosition,i$23+2,existingPoints[i$23].label);hasSet=true}else this.setCuePoint_(existingPoints[i$23].dwPosition,i$23+1,existingPoints[i$23].label);if(!hasSet)this.setCuePoint_(position,this.cue.points.length+1,labl)}this.cue.dwCuePoints=this.cue.points.length};/**
 @param {number} index
 */
WaveFile.prototype.deleteCuePoint=function(index){this.cue.chunkId="cue ";/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];for(var i$24=0;i$24<len;i$24++)if(i$24+1!==index)this.setCuePoint_(existingPoints[i$24].dwPosition,i$24+1,existingPoints[i$24].label);this.cue.dwCuePoints=this.cue.points.length;if(this.cue.dwCuePoints)this.cue.chunkId="cue ";else{this.cue.chunkId="";this.clearLISTadtl_()}};
/**
 @param {number} pointIndex
 @param {string} label
 */
WaveFile.prototype.updateLabel=function(pointIndex,label){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i$25=0;i$25<this.LIST[adtlIndex].subChunks.length;i$25++)if(this.LIST[adtlIndex].subChunks[i$25].dwName==pointIndex)this.LIST[adtlIndex].subChunks[i$25].value=label};/**
 @private
 @param {number} position
 @param {number} dwName
 */
WaveFile.prototype.setCuePoint_=function(position,dwName,label){this.cue.points.push({dwName:dwName,dwPosition:position,fccChunk:"data",dwChunkStart:0,dwBlockStart:0,dwSampleOffset:position});this.setLabl_(dwName,label)};/**
 @private
 @return {!Array<!Object>}
 */
WaveFile.prototype.getCuePoints_=function(){/** @type {!Array<!Object>} */ var points=[];for(var i$26=0;i$26<this.cue.points.length;i$26++)points.push({dwPosition:this.cue.points[i$26].dwPosition,label:this.getLabelForCuePoint_(this.cue.points[i$26].dwName)});return points};/**
 @private
 @param {number} pointDwName
 @return {string}
 */
WaveFile.prototype.getLabelForCuePoint_=function(pointDwName){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i$27=0;i$27<this.LIST[adtlIndex].subChunks.length;i$27++)if(this.LIST[adtlIndex].subChunks[i$27].dwName==pointDwName)return this.LIST[adtlIndex].subChunks[i$27].value;return""};/** @private */ WaveFile.prototype.clearLISTadtl_=function(){for(var i$28=0;i$28<this.LIST.length;i$28++)if(this.LIST[i$28].format=="adtl")this.LIST.splice(i$28)};/**
 @private
 @param {number} dwName
 @param {string} label
 */
WaveFile.prototype.setLabl_=function(dwName,label){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex===null){this.LIST.push({chunkId:"LIST",chunkSize:4,format:"adtl",subChunks:[]});adtlIndex=this.LIST.length-1}this.setLabelText_(adtlIndex===null?0:adtlIndex,dwName,label)};/**
 @private
 @param {number} adtlIndex
 @param {number} dwName
 @param {string} label
 */
WaveFile.prototype.setLabelText_=function(adtlIndex,dwName,label){this.LIST[adtlIndex].subChunks.push({chunkId:"labl",chunkSize:label.length,dwName:dwName,value:label});this.LIST[adtlIndex].chunkSize+=label.length+4+4+4+1};/**
 @private
 @return {?number}
 */
WaveFile.prototype.getAdtlChunk_=function(){for(var i$29=0;i$29<this.LIST.length;i$29++)if(this.LIST[i$29].format=="adtl")return i$29;return null};/**
 @private
 @param {string} tag
 @return {!Object<string,?number>}
 */
WaveFile.prototype.getTagIndex_=function(tag){/** @type {!Object<string,?number>} */ var index={LIST:null,TAG:null};for(var i$30=0;i$30<this.LIST.length;i$30++)if(this.LIST[i$30].format=="INFO"){index.LIST=i$30;for(var j=0;j<this.LIST[i$30].subChunks.length;j++)if(this.LIST[i$30].subChunks[j].chunkId==tag){index.TAG=j;break}break}return index};/**
 @private
 @param {string} tag
 @return {string}
 */
WaveFile.prototype.fixTagName_=function(tag){if(tag.constructor!==String)throw new Error("Invalid tag name.");else if(tag.length<4)for(var i$31=0;i$31<4-tag.length;i$31++)tag+=" ";return tag};/** @private */ WaveFile.prototype.clearHeader_=function(){this.fmt.cbSize=0;this.fmt.validBitsPerSample=0;this.fact.chunkId="";this.ds64.chunkId=""};/** @private */ WaveFile.prototype.assure16Bit_=function(){this.assureUncompressed_();if(this.bitDepth!="16")this.toBitDepth("16")};/** @private */ WaveFile.prototype.assureUncompressed_=
function(){if(this.bitDepth=="8a")this.fromALaw();else if(this.bitDepth=="8m")this.fromMuLaw();else if(this.bitDepth=="4")this.fromIMAADPCM()};/**
 @private
 @param {(!Array<number>|!Array<!Array<number>>|!ArrayBufferView)} samples
 */
WaveFile.prototype.interleave_=function(samples){if(samples.length>0)if(samples[0].constructor===Array){/** @type {!Array<number>} */ var finalSamples=[];for(var i$32=0;i$32<samples[0].length;i$32++)for(var j=0;j<samples.length;j++)finalSamples.push(samples[j][i$32]);samples=finalSamples}return samples};/** @private */ WaveFile.prototype.updateDataType_=function(){/** @type {!Object} */ this.dataType={bits:(parseInt(this.bitDepth,10)-1|7)+1,float:this.bitDepth=="32f"||this.bitDepth=="64",signed:this.bitDepth!=
"8",be:this.container=="RIFX"};if(["4","8a","8m"].indexOf(this.bitDepth)>-1){this.dataType.bits=8;this.dataType.signed=false}};/**
 @private
 @return {string}
 */
WaveFile.prototype.correctContainer_=function(){return this.container=="RF64"?"RIFF":this.container};return WaveFile}();return WaveFile; })));
