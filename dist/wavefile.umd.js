(function (global, factory) {typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :typeof define === 'function' && define.amd ? define(factory) :(global.WaveFile = factory());}(this, (function () { 'use strict';var WaveFile=function(){/** @private @const */ var f64f32_=new Float32Array(1);/**
 @param {!TypedArray} input
 @param {string} original
 @param {string} target
 @param {!TypedArray} output
 */
function bitDepth(input,original,target,output){validateBitDepth_(original);validateBitDepth_(target);/** @type {!Function} */ var toFunction=getBitDepthFunction_(original,target);/** @type {!Object<string,number>} */ var options={oldMin:Math.pow(2,parseInt(original,10))/2,newMin:Math.pow(2,parseInt(target,10))/2,oldMax:Math.pow(2,parseInt(original,10))/2-1,newMax:Math.pow(2,parseInt(target,10))/2-1};/** @const @type {number} */ var len=input.length;if(original=="8")for(var i=0;i<len;i++)output[i]=
input[i]-=128;for(var i$0=0;i$0<len;i$0++)output[i$0]=toFunction(input[i$0],options);if(target=="8")for(var i$1=0;i$1<len;i$1++)output[i$1]=output[i$1]+=128}/**
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
function validateBitDepth_(bitDepth){if(bitDepth!="32f"&&bitDepth!="64"&&(parseInt(bitDepth,10)<"8"||parseInt(bitDepth,10)>"53"))throw new Error("Invalid bit depth.");}/**
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @param {number=} index
 @param {?number=} end
 @throws {Error}
 */
function endianness(bytes,offset,index,end){index=index===undefined?0:index;end=end===undefined?null:end;var len=end||bytes.length;var limit=parseInt(offset/2,10);if(len%offset)throw new Error("Bad buffer length.");while(index<len){swap(bytes,offset,index,limit);index+=offset}}/**
 @private
 @param {(!Array<(number|string)>|!Uint8Array)} bytes
 @param {number} offset
 @param {number} index
 */
function swap(bytes,offset,index,limit){var x=0;var y=offset-1;while(x<limit){var theByte=bytes[index+x];bytes[index+x]=bytes[index+y];bytes[index+y]=theByte;x++;y--}}/**
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
Integer.prototype.write=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);bytes[j++]=number&255;for(var i=2;i<=this.offset;i++)bytes[j++]=Math.floor(number/Math.pow(2,(i-1)*8))&255;return j};/**
 @private
 @param {!Array<number>} bytes
 @param {number} number
 @param {number=} j
 @return {number}
 */
Integer.prototype.writeEsoteric_=function(bytes,number,j){j=j===undefined?0:j;number=this.overflow_(number);j=this.writeFirstByte_(bytes,number,j);for(var i=2;i<this.offset;i++)bytes[j++]=Math.floor(number/Math.pow(2,(i-1)*8))&255;if(this.bits>8)bytes[j++]=Math.floor(number/Math.pow(2,(this.offset-1)*8))&this.lastByteMask_;return j};/**
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
function validateIntType_(theType){if(theType.bits<1||theType.bits>53)throw new Error("Bad type definition.");}/** @private @type {boolean} */ var HOST_BE_=(new Uint8Array((new Uint32Array([305419896])).buffer))[0]===18;/** @private @const @type {!Int8Array} */ var int8_=new Int8Array(8);/** @private @const @type {!Uint32Array} */ var ui32_=new Uint32Array(int8_.buffer);/** @private @const @type {!Float32Array} */ var f32_=new Float32Array(int8_.buffer);/** @private @const @type {!Float64Array} */ var f64_=
new Float64Array(int8_.buffer);/** @private @type {Function} */ var reader_;/** @private @type {Function} */ var writer_;/** @private @type {Object} */ var gInt_={};/**
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
function read16F_(bytes,i){var int=gInt_.read(bytes,i);var exponent=(int&31744)>>10;var fraction=int&1023;var floatValue;if(exponent)floatValue=Math.pow(2,exponent-15)*(1+fraction/1024);else floatValue=.00006103515625*(fraction/1024);return floatValue*(int>>15?-1:1)}/**
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
function read64F_(bytes,i){if(HOST_BE_){ui32_[1]=gInt_.read(bytes,i);ui32_[0]=gInt_.read(bytes,i+4)}else{ui32_[0]=gInt_.read(bytes,i);ui32_[1]=gInt_.read(bytes,i+4)}return f64_[0]}/**
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
function write16F_(bytes,number,j){f32_[0]=number;var x=ui32_[0];var bits=x>>16&32768;var m=x>>12&2047;var e=x>>23&255;if(e>=103){bits|=e-112<<10|m>>1;bits+=m&1}bytes[j++]=bits&255;bytes[j++]=bits>>>8&255;return j}/**
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
function write64F_(bytes,number,j){f64_[0]=number;if(HOST_BE_){j=gInt_.write(bytes,ui32_[1],j);j=gInt_.write(bytes,ui32_[0],j)}else{j=gInt_.write(bytes,ui32_[0],j);j=gInt_.write(bytes,ui32_[1],j)}return j}/**
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
function packString(str){var bytes=[];for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);validateASCIICode(code);bytes[i]=code}return bytes}/**
 @param {string} str
 @param {(!Uint8Array|!Array<number>)} buffer
 @param {number=} index
 @return {number}
 @throws {Error}
 */
function packStringTo(str,buffer,index){index=index===undefined?0:index;for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);validateASCIICode(code);buffer[index]=code;index++}return index}/**
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
function packArrayTo(values,theType,buffer,index){index=index===undefined?0:index;setUp_(theType);var be=theType.be;var offset=theType.offset;var len=values.length;for(var i=0;i<len;i++)index=writeBytes_(values[i],theType,buffer,index,index+offset,validateNotUndefined,be);return index}/**
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
function unpackArrayFrom(buffer,theType,index,end){index=index===undefined?0:index;end=end===undefined?null:end;setUp_(theType);if(theType.be)endianness(buffer,theType.offset);var len=end||buffer.length;while((len-index)%theType.offset)len--;var values=[];var step=theType.offset;while(index<len){values.push(reader_(buffer,index));index+=step}if(theType.be)endianness(buffer,theType.offset);return values}/**
 @param {!Uint8Array} buffer
 @param {!Object} theType
 @param {!TypedArray} output
 @param {number=} index
 @param {?number=} end
 @throws {Error}
 */
function unpackArrayTo(buffer,theType,output,index,end){index=index===undefined?0:index;end=end===undefined?null:end;setUp_(theType);if(theType.be)endianness(buffer,theType.offset);var len=end||buffer.length;while((len-index)%theType.offset)len--;var outputIndex=0;var step=theType.offset;while(index<len){output.set([reader_(buffer,index)],outputIndex);outputIndex++;index+=step}if(theType.be)endianness(buffer,theType.offset)}/** @private @const */ var uInt32_={bits:32};/** @type {number} */ var head_=
0;/**
 @param {!Uint8Array} buffer
 @return {!Object}
 */
function riffChunks(buffer){head_=0;var chunkId=getChunkId_(buffer,0);uInt32_.be=chunkId=="RIFX";var format=unpackString(buffer,8,4);head_+=4;return{chunkId:chunkId,chunkSize:getChunkSize_(buffer,0),format:format,subChunks:getSubChunksIndex_(buffer)}}/**
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
function getChunkSize_(buffer,index){head_+=4;return unpackFrom(buffer,uInt32_,index+4)}/** @private @const @type {!Array<number>} */ var INDEX_TABLE=[-1,-1,-1,-1,2,4,6,8,-1,-1,-1,-1,2,4,6,8];/** @private @const @type {!Array<number>} */ var STEP_TABLE=[7,8,9,10,11,12,13,14,16,17,19,21,23,25,28,31,34,37,41,45,50,55,60,66,73,80,88,97,107,118,130,143,157,173,190,209,230,253,279,307,337,371,408,449,494,544,598,658,724,796,876,963,1060,1166,1282,1411,1552,1707,1878,2066,2272,2499,2749,3024,3327,3660,
4026,4428,4871,5358,5894,6484,7132,7845,8630,9493,10442,11487,12635,13899,15289,16818,18500,20350,22385,24623,27086,29794,32767];/** @private @type {number} */ var encoderPredicted_=0;/** @private @type {number} */ var encoderIndex_=0;/** @private @type {number} */ var decoderPredicted_=0;/** @private @type {number} */ var decoderIndex_=0;/** @private @type {number} */ var decoderStep_=7;/**
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
function decode$1(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample(samples[i]);return pcmSamples}/** @private @const @type {number} */ var BIAS=132;/** @private @const @type {number} */ var CLIP=32635;/** @private @const @type {Array<number>} */ var encodeTable=[0,0,1,1,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,6,6,6,6,6,6,6,6,
6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7];/** @private @const @type {Array<number>} */ var decodeTable=[0,132,396,924,1980,4092,8316,16764];/**
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
function encode$2(samples){/** @type {!Uint8Array} */ var muLawSamples=new Uint8Array(samples.length);for(var i=0;i<samples.length;i++)muLawSamples[i]=encodeSample$1(samples[i]);return muLawSamples}/**
 @param {!Uint8Array} samples
 @return {!Int16Array}
 */
function decode$2(samples){/** @type {!Int16Array} */ var pcmSamples=new Int16Array(samples.length);for(var i=0;i<samples.length;i++)pcmSamples[i]=decodeSample$1(samples[i]);return pcmSamples}/** @const */ var chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";/** @const */ var lookup=new Uint8Array(256);for(var i=0;i<chars.length;i++)lookup[chars.charCodeAt(i)]=i;/** @const */ var encode$3=function(arraybuffer,byteOffset,length){/** @const */ var bytes=new Uint8Array(arraybuffer,
byteOffset,length);/** @const */ var len=bytes.length;var base64="";for(var i$2=0;i$2<len;i$2+=3){base64+=chars[bytes[i$2]>>2];base64+=chars[(bytes[i$2]&3)<<4|bytes[i$2+1]>>4];base64+=chars[(bytes[i$2+1]&15)<<2|bytes[i$2+2]>>6];base64+=chars[bytes[i$2+2]&63]}if(len%3===2)base64=base64.substring(0,base64.length-1)+"\x3d";else if(len%3===1)base64=base64.substring(0,base64.length-2)+"\x3d\x3d";return base64};/** @const */ var decode$3=function(base64){/** @const */ var len=base64.length;var bufferLength=
base64.length*.75;var p=0;var encoded1;var encoded2;var encoded3;var encoded4;if(base64[base64.length-1]==="\x3d"){bufferLength--;if(base64[base64.length-2]==="\x3d")bufferLength--}/** @const */ var arraybuffer=new ArrayBuffer(bufferLength);/** @const */ var bytes=new Uint8Array(arraybuffer);for(var i$3=0;i$3<len;i$3+=4){encoded1=lookup[base64.charCodeAt(i$3)];encoded2=lookup[base64.charCodeAt(i$3+1)];encoded3=lookup[base64.charCodeAt(i$3+2)];encoded4=lookup[base64.charCodeAt(i$3+3)];bytes[p++]=encoded1<<
2|encoded2>>4;bytes[p++]=(encoded2&15)<<4|encoded3>>2;bytes[p++]=(encoded3&3)<<6|encoded4&63}return arraybuffer};/**
 @struct
 @constructor
 @param {?Uint8Array} bytes
 @throws {Error}
 */
var WaveFile=function(bytes){bytes=bytes===undefined?null:bytes;/** @private @type {!Object} */ this.uInt16_={bits:16,be:false};/** @private @type {!Object} */ this.uInt32_={bits:32,be:false};/** @type {string} */ this.container="";/** @type {number} */ this.chunkSize=0;/** @type {string} */ this.format="";/** @type {!Object<string,*>} */ this.fmt={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ audioFormat:0,/** @type {number} */ numChannels:0,/** @type {number} */ sampleRate:0,
/** @type {number} */ byteRate:0,/** @type {number} */ blockAlign:0,/** @type {number} */ bitsPerSample:0,/** @type {number} */ cbSize:0,/** @type {number} */ validBitsPerSample:0,/** @type {number} */ dwChannelMask:0,/** @type {!Array<number>} */ subformat:[]};/** @type {!Object<string,*>} */ this.fact={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ dwSampleLength:0};/** @type {!Object<string,*>} */ this.cue={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,
/** @type {number} */ dwCuePoints:0,/** @type {!Array<!Object>} */ points:[]};/** @type {!Object<string,*>} */ this.smpl={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ dwManufacturer:0,/** @type {number} */ dwProduct:0,/** @type {number} */ dwSamplePeriod:0,/** @type {number} */ dwMIDIUnityNote:0,/** @type {number} */ dwMIDIPitchFraction:0,/** @type {number} */ dwSMPTEFormat:0,/** @type {number} */ dwSMPTEOffset:0,/** @type {number} */ dwNumSampleLoops:0,
/** @type {number} */ dwSamplerData:0,/** @type {!Array<!Object>} */ loops:[]};/** @type {!Object<string,*>} */ this.bext={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {string} */ description:"",/** @type {string} */ originator:"",/** @type {string} */ originatorReference:"",/** @type {string} */ originationDate:"",/** @type {string} */ originationTime:"",/** @type {!Array<number>} */ timeReference:[0,0],/** @type {number} */ version:0,/** @type {string} */ UMID:"",
/** @type {number} */ loudnessValue:0,/** @type {number} */ loudnessRange:0,/** @type {number} */ maxTruePeakLevel:0,/** @type {number} */ maxMomentaryLoudness:0,/** @type {number} */ maxShortTermLoudness:0,/** @type {string} */ reserved:"",/** @type {string} */ codingHistory:""};/** @type {!Object<string,*>} */ this.ds64={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {number} */ riffSizeHigh:0,/** @type {number} */ riffSizeLow:0,/** @type {number} */ dataSizeHigh:0,
/** @type {number} */ dataSizeLow:0,/** @type {number} */ originationTime:0,/** @type {number} */ sampleCountHigh:0,/** @type {number} */ sampleCountLow:0};/** @type {!Object<string,*>} */ this.data={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {!Uint8Array} */ samples:new Uint8Array(0)};/** @type {!Array<!Object>} */ this.LIST=[];/** @type {!Object<string,*>} */ this.junk={/** @type {string} */ chunkId:"",/** @type {number} */ chunkSize:0,/** @type {!Array<number>} */ chunkData:[]};
/** @type {string} */ this.bitDepth="0";/** @private @enum {number} */ this.audioFormats_={4:17,8:1,"8a":6,"8m":7,16:1,24:1,32:1,"32f":3,64:3};/** @private @type {number} */ this.head_=0;/** @private @type {!Object} */ this.dataType={};if(bytes)this.fromBuffer(bytes)};/**
 @param {number} numChannels
 @param {number} sampleRate
 @param {string} bitDepthCode
 @param {(!Array<number>|!Array<!Array<number>>|!ArrayBufferView)} samples
 @param {?Object} options
 @throws {Error}
 */
WaveFile.prototype.fromScratch=function(numChannels,sampleRate,bitDepthCode,samples,options){options=options===undefined?{}:options;if(!options.container)options.container="RIFF";this.container=options.container;this.bitDepth=bitDepthCode;samples=this.interleave_(samples);/** @type {number} */ var numBytes=((parseInt(bitDepthCode,10)-1|7)+1)/8;this.updateDataType_();this.data.samples=new Uint8Array(samples.length*numBytes);packArrayTo(samples,this.dataType,this.data.samples);this.createPCMHeader_(bitDepthCode,
numChannels,sampleRate,numBytes,options);if(bitDepthCode=="4")this.createADPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);else if(bitDepthCode=="8a"||bitDepthCode=="8m")this.createALawMulawHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);else if(Object.keys(this.audioFormats_).indexOf(bitDepthCode)==-1||this.fmt.numChannels>2)this.createExtensibleHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);this.data.chunkId="data";this.data.chunkSize=this.data.samples.length;
this.validateHeader_();this.LEorBE_()};/**
 @param {!Uint8Array} bytes
 @param {boolean=} samples
 @throws {Error}
 */
WaveFile.prototype.fromBuffer=function(bytes,samples){samples=samples===undefined?true:samples;this.head_=0;this.clearHeader_();this.readRIFFChunk_(bytes);/** @type {!Object} */ var chunk=riffChunks(bytes);this.readDs64Chunk_(bytes,chunk.subChunks);this.readFmtChunk_(bytes,chunk.subChunks);this.readFactChunk_(bytes,chunk.subChunks);this.readBextChunk_(bytes,chunk.subChunks);this.readCueChunk_(bytes,chunk.subChunks);this.readSmplChunk_(bytes,chunk.subChunks);this.readDataChunk_(bytes,chunk.subChunks,
samples);this.readJunkChunk_(bytes,chunk.subChunks);this.readLISTChunk_(bytes,chunk.subChunks);this.bitDepthFromFmt_();this.updateDataType_()};/**
 @return {!Uint8Array}
 @throws {Error}
 */
WaveFile.prototype.toBuffer=function(){this.validateHeader_();return this.createWaveFile_()};/**
 @param {string} base64String
 @throws {Error}
 */
WaveFile.prototype.fromBase64=function(base64String){this.fromBuffer(new Uint8Array(decode$3(base64String)))};/**
 @return {string}
 @throws {Error}
 */
WaveFile.prototype.toBase64=function(){/** @type {!Uint8Array} */ var buffer=this.toBuffer();return encode$3(buffer,0,buffer.length)};/**
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
WaveFile.prototype.toBitDepth=function(newBitDepth,changeResolution){changeResolution=changeResolution===undefined?true:changeResolution;var toBitDepth=newBitDepth;var thisBitDepth=this.bitDepth;if(!changeResolution){toBitDepth=this.realBitDepth_(newBitDepth);thisBitDepth=this.realBitDepth_(this.bitDepth)}this.assureUncompressed_();var sampleCount=this.data.samples.length/(this.dataType.bits/8);var typedSamplesInput=new Float64Array(sampleCount+1);var typedSamplesOutput=new Float64Array(sampleCount+
1);unpackArrayTo(this.data.samples,this.dataType,typedSamplesInput);this.truncateSamples(typedSamplesInput);bitDepth(typedSamplesInput,thisBitDepth,toBitDepth,typedSamplesOutput);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,newBitDepth,typedSamplesOutput,{container:this.correctContainer_()})};/** @throws {Error} */ WaveFile.prototype.toIMAADPCM=function(){if(this.fmt.sampleRate!=8E3)throw new Error("Only 8000 Hz files can be compressed as IMA-ADPCM.");else if(this.fmt.numChannels!=1)throw new Error("Only mono files can be compressed as IMA-ADPCM.");
else{this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"4",encode(output),{container:this.correctContainer_()})}};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromIMAADPCM=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",decode(this.data.samples,this.fmt.blockAlign),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};WaveFile.prototype.toALaw=function(){this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,
this.fmt.sampleRate,"8a",encode$1(output),{container:this.correctContainer_()})};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromALaw=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",decode$1(this.data.samples),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};WaveFile.prototype.toMuLaw=function(){this.assure16Bit_();var output=new Int16Array(this.data.samples.length/2);unpackArrayTo(this.data.samples,this.dataType,output);this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,
"8m",encode$2(output),{container:this.correctContainer_()})};/**
 @param {string} bitDepthCode
 */
WaveFile.prototype.fromMuLaw=function(bitDepthCode){bitDepthCode=bitDepthCode===undefined?"16":bitDepthCode;this.fromScratch(this.fmt.numChannels,this.fmt.sampleRate,"16",decode$2(this.data.samples),{container:this.correctContainer_()});if(bitDepthCode!="16")this.toBitDepth(bitDepthCode)};/**
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
WaveFile.prototype.setCuePoint=function(position,labl){labl=labl===undefined?"":labl;this.cue.chunkId="cue ";position=position*this.fmt.sampleRate/1E3;/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];/** @type {boolean} */ var hasSet=false;if(len===0)this.setCuePoint_(position,1,labl);else{for(var i$4=0;i$4<len;i$4++)if(existingPoints[i$4].dwPosition>position&&!hasSet){this.setCuePoint_(position,
i$4+1,labl);this.setCuePoint_(existingPoints[i$4].dwPosition,i$4+2,existingPoints[i$4].label);hasSet=true}else this.setCuePoint_(existingPoints[i$4].dwPosition,i$4+1,existingPoints[i$4].label);if(!hasSet)this.setCuePoint_(position,this.cue.points.length+1,labl)}this.cue.dwCuePoints=this.cue.points.length};/**
 @param {number} index
 */
WaveFile.prototype.deleteCuePoint=function(index){this.cue.chunkId="cue ";/** @type {!Array<!Object>} */ var existingPoints=this.getCuePoints_();this.clearLISTadtl_();/** @type {number} */ var len=this.cue.points.length;this.cue.points=[];for(var i$5=0;i$5<len;i$5++)if(i$5+1!=index)this.setCuePoint_(existingPoints[i$5].dwPosition,i$5+1,existingPoints[i$5].label);this.cue.dwCuePoints=this.cue.points.length;if(this.cue.dwCuePoints)this.cue.chunkId="cue ";else{this.cue.chunkId="";this.clearLISTadtl_()}};
/**
 @param {number} pointIndex
 @param {string} label
 */
WaveFile.prototype.updateLabel=function(pointIndex,label){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i$6=0;i$6<this.LIST[adtlIndex].subChunks.length;i$6++)if(this.LIST[adtlIndex].subChunks[i$6].dwName==pointIndex)this.LIST[adtlIndex].subChunks[i$6].value=label};/** @private */ WaveFile.prototype.updateDataType_=function(){/** @type {!Object} */ this.dataType={bits:(parseInt(this.bitDepth,10)-1|7)+1,float:this.bitDepth=="32f"||this.bitDepth=="64",signed:this.bitDepth!=
"8",be:this.container=="RIFX"};if(["4","8a","8m"].indexOf(this.bitDepth)>-1){this.dataType.bits=8;this.dataType.signed=false}};/**
 @private
 @param {(!Array<number>|!Array<!Array<number>>|!ArrayBufferView)} samples
 */
WaveFile.prototype.interleave_=function(samples){if(samples.length>0)if(samples[0].constructor===Array){/** @type {!Array<number>} */ var finalSamples=[];for(var i$7=0;i$7<samples[0].length;i$7++)for(var j=0;j<samples.length;j++)finalSamples.push(samples[j][i$7]);samples=finalSamples}return samples};/**
 @private
 @param {number} position
 @param {number} dwName
 */
WaveFile.prototype.setCuePoint_=function(position,dwName,label){this.cue.points.push({dwName:dwName,dwPosition:position,fccChunk:"data",dwChunkStart:0,dwBlockStart:0,dwSampleOffset:position});this.setLabl_(dwName,label)};/**
 @private
 @return {!Array<!Object>}
 */
WaveFile.prototype.getCuePoints_=function(){/** @type {!Array<!Object>} */ var points=[];for(var i$8=0;i$8<this.cue.points.length;i$8++)points.push({dwPosition:this.cue.points[i$8].dwPosition,label:this.getLabelForCuePoint_(this.cue.points[i$8].dwName)});return points};/**
 @private
 @param {number} pointDwName
 @return {string}
 */
WaveFile.prototype.getLabelForCuePoint_=function(pointDwName){/** @type {?number} */ var adtlIndex=this.getAdtlChunk_();if(adtlIndex!==null)for(var i$9=0;i$9<this.LIST[adtlIndex].subChunks.length;i$9++)if(this.LIST[adtlIndex].subChunks[i$9].dwName==pointDwName)return this.LIST[adtlIndex].subChunks[i$9].value;return""};/** @private */ WaveFile.prototype.clearLISTadtl_=function(){for(var i$10=0;i$10<this.LIST.length;i$10++)if(this.LIST[i$10].format=="adtl")this.LIST.splice(i$10)};/**
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
WaveFile.prototype.getAdtlChunk_=function(){for(var i$11=0;i$11<this.LIST.length;i$11++)if(this.LIST[i$11].format=="adtl")return i$11;return null};/**
 @private
 @param {string} tag
 @return {!Object<string,?number>}
 */
WaveFile.prototype.getTagIndex_=function(tag){/** @type {!Object<string,?number>} */ var index={LIST:null,TAG:null};for(var i$12=0;i$12<this.LIST.length;i$12++)if(this.LIST[i$12].format=="INFO"){index.LIST=i$12;for(var j=0;j<this.LIST[i$12].subChunks.length;j++)if(this.LIST[i$12].subChunks[j].chunkId==tag){index.TAG=j;break}break}return index};/**
 @private
 @param {string} tag
 @return {string}
 */
WaveFile.prototype.fixTagName_=function(tag){if(tag.constructor!==String)throw new Error("Invalid tag name.");else if(tag.length<4)for(var i$13=0;i$13<4-tag.length;i$13++)tag+=" ";return tag};/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createADPCMHeader_=function(bitDepthCode,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);this.chunkSize=40+this.data.samples.length;this.fmt.chunkSize=20;this.fmt.byteRate=4055;this.fmt.blockAlign=256;this.fmt.bitsPerSample=4;this.fmt.cbSize=2;this.fmt.validBitsPerSample=505;this.fact.chunkId="fact";this.fact.chunkSize=4;this.fact.dwSampleLength=this.data.samples.length*2;this.data.chunkSize=this.data.samples.length};
/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createExtensibleHeader_=function(bitDepthCode,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);this.chunkSize=36+24+this.data.samples.length;this.fmt.chunkSize=40;this.fmt.bitsPerSample=(parseInt(bitDepthCode,10)-1|7)+1;this.fmt.cbSize=22;this.fmt.validBitsPerSample=parseInt(bitDepthCode,10);this.fmt.dwChannelMask=this.getDwChannelMask_();this.fmt.subformat=[1,1048576,2852126848,1905997824]};/**
 @private
 @return {number}
 */
WaveFile.prototype.getDwChannelMask_=function(){/** @type {number} */ var dwChannelMask=0;if(this.fmt.numChannels===1)dwChannelMask=4;else if(this.fmt.numChannels===2)dwChannelMask=3;else if(this.fmt.numChannels===4)dwChannelMask=51;else if(this.fmt.numChannels===6)dwChannelMask=63;else if(this.fmt.numChannels===8)dwChannelMask=1599;return dwChannelMask};/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createALawMulawHeader_=function(bitDepthCode,numChannels,sampleRate,numBytes,options){this.createPCMHeader_(bitDepthCode,numChannels,sampleRate,numBytes,options);this.chunkSize=40+this.data.samples.length;this.fmt.chunkSize=20;this.fmt.cbSize=2;this.fmt.validBitsPerSample=8;this.fact.chunkId="fact";this.fact.chunkSize=4;this.fact.dwSampleLength=this.data.samples.length};/**
 @private
 @param {string} bitDepthCode
 @param {number} numChannels
 @param {number} sampleRate
 @param {number} numBytes
 @param {!Object} options
 */
WaveFile.prototype.createPCMHeader_=function(bitDepthCode,numChannels,sampleRate,numBytes,options){this.clearHeader_();this.container=options.container;this.chunkSize=36+this.data.samples.length;this.format="WAVE";this.fmt.chunkId="fmt ";this.fmt.chunkSize=16;this.fmt.byteRate=numChannels*numBytes*sampleRate;this.fmt.blockAlign=numChannels*numBytes;this.fmt.audioFormat=this.audioFormats_[bitDepthCode]?this.audioFormats_[bitDepthCode]:65534;this.fmt.numChannels=numChannels;this.fmt.sampleRate=sampleRate;
this.fmt.bitsPerSample=parseInt(bitDepthCode,10);this.fmt.cbSize=0;this.fmt.validBitsPerSample=0};/**
 @private
 @param {string} bitDepthCode
 @return {string}
 */
WaveFile.prototype.realBitDepth_=function(bitDepthCode){if(bitDepthCode!="32f")bitDepthCode=((parseInt(bitDepthCode,10)-1|7)+1).toString();return bitDepthCode};/** @private @throws {Error} */ WaveFile.prototype.validateHeader_=function(){this.validateBitDepth_();this.validateNumChannels_();this.validateSampleRate_()};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateBitDepth_=function(){if(!this.audioFormats_[this.bitDepth]){if(parseInt(this.bitDepth,10)>8&&parseInt(this.bitDepth,10)<54)return true;throw new Error("Invalid bit depth.");}return true};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateNumChannels_=function(){/** @type {number} */ var blockAlign=this.fmt.numChannels*this.fmt.bitsPerSample/8;if(this.fmt.numChannels<1||blockAlign>65535)throw new Error("Invalid number of channels.");return true};/**
 @private
 @return {boolean}
 @throws {Error}
 */
WaveFile.prototype.validateSampleRate_=function(){/** @type {number} */ var byteRate=this.fmt.numChannels*(this.fmt.bitsPerSample/8)*this.fmt.sampleRate;if(this.fmt.sampleRate<1||byteRate>4294967295)throw new Error("Invalid sample rate.");return true};/** @private */ WaveFile.prototype.clearHeader_=function(){this.fmt.cbSize=0;this.fmt.validBitsPerSample=0;this.fact.chunkId="";this.ds64.chunkId=""};/** @private */ WaveFile.prototype.assure16Bit_=function(){this.assureUncompressed_();if(this.bitDepth!=
"16")this.toBitDepth("16")};/** @private */ WaveFile.prototype.assureUncompressed_=function(){if(this.bitDepth=="8a")this.fromALaw();else if(this.bitDepth=="8m")this.fromMuLaw();else if(this.bitDepth=="4")this.fromIMAADPCM()};/**
 @private
 @return {boolean}
 */
WaveFile.prototype.LEorBE_=function(){/** @type {boolean} */ var bigEndian=this.container==="RIFX";this.uInt16_.be=bigEndian;this.uInt32_.be=bigEndian;return bigEndian};/**
 @private
 @param {!Object} chunks
 @param {string} chunkId
 @param {boolean} multiple
 @return {?Array<!Object>}
 */
WaveFile.prototype.findChunk_=function(chunks,chunkId,multiple){multiple=multiple===undefined?false:multiple;/** @type {!Array<!Object>} */ var chunk=[];for(var i$14=0;i$14<chunks.length;i$14++)if(chunks[i$14].chunkId==chunkId)if(multiple)chunk.push(chunks[i$14]);else return chunks[i$14];if(chunkId=="LIST")return chunk.length?chunk:null;return null};/**
 @private
 @param {!Uint8Array} bytes
 @throws {Error}
 */
WaveFile.prototype.readRIFFChunk_=function(bytes){this.head_=0;this.container=this.readString_(bytes,4);if(["RIFF","RIFX","RF64"].indexOf(this.container)===-1)throw Error("Not a supported format.");this.LEorBE_();this.chunkSize=this.read_(bytes,this.uInt32_);this.format=this.readString_(bytes,4);if(this.format!="WAVE")throw Error('Could not find the "WAVE" format identifier');};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @throws {Error}
 */
WaveFile.prototype.readFmtChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"fmt ");if(chunk){this.head_=chunk.chunkData.start;this.fmt.chunkId=chunk.chunkId;this.fmt.chunkSize=chunk.chunkSize;this.fmt.audioFormat=this.read_(buffer,this.uInt16_);this.fmt.numChannels=this.read_(buffer,this.uInt16_);this.fmt.sampleRate=this.read_(buffer,this.uInt32_);this.fmt.byteRate=this.read_(buffer,this.uInt32_);this.fmt.blockAlign=this.read_(buffer,this.uInt16_);this.fmt.bitsPerSample=
this.read_(buffer,this.uInt16_);this.readFmtExtension_(buffer)}else throw Error('Could not find the "fmt " chunk');};/**
 @private
 @param {!Uint8Array} buffer
 */
WaveFile.prototype.readFmtExtension_=function(buffer){if(this.fmt.chunkSize>16){this.fmt.cbSize=this.read_(buffer,this.uInt16_);if(this.fmt.chunkSize>18){this.fmt.validBitsPerSample=this.read_(buffer,this.uInt16_);if(this.fmt.chunkSize>20){this.fmt.dwChannelMask=this.read_(buffer,this.uInt32_);this.fmt.subformat=[this.read_(buffer,this.uInt32_),this.read_(buffer,this.uInt32_),this.read_(buffer,this.uInt32_),this.read_(buffer,this.uInt32_)]}}}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readFactChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"fact");if(chunk){this.head_=chunk.chunkData.start;this.fact.chunkId=chunk.chunkId;this.fact.chunkSize=chunk.chunkSize;this.fact.dwSampleLength=this.read_(buffer,this.uInt32_)}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readCueChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"cue ");if(chunk){this.head_=chunk.chunkData.start;this.cue.chunkId=chunk.chunkId;this.cue.chunkSize=chunk.chunkSize;this.cue.dwCuePoints=this.read_(buffer,this.uInt32_);for(var i$15=0;i$15<this.cue.dwCuePoints;i$15++)this.cue.points.push({dwName:this.read_(buffer,this.uInt32_),dwPosition:this.read_(buffer,this.uInt32_),fccChunk:this.readString_(buffer,4),dwChunkStart:this.read_(buffer,
this.uInt32_),dwBlockStart:this.read_(buffer,this.uInt32_),dwSampleOffset:this.read_(buffer,this.uInt32_)})}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readSmplChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"smpl");if(chunk){this.head_=chunk.chunkData.start;this.smpl.chunkId=chunk.chunkId;this.smpl.chunkSize=chunk.chunkSize;this.smpl.dwManufacturer=this.read_(buffer,this.uInt32_);this.smpl.dwProduct=this.read_(buffer,this.uInt32_);this.smpl.dwSamplePeriod=this.read_(buffer,this.uInt32_);this.smpl.dwMIDIUnityNote=this.read_(buffer,this.uInt32_);this.smpl.dwMIDIPitchFraction=this.read_(buffer,
this.uInt32_);this.smpl.dwSMPTEFormat=this.read_(buffer,this.uInt32_);this.smpl.dwSMPTEOffset=this.read_(buffer,this.uInt32_);this.smpl.dwNumSampleLoops=this.read_(buffer,this.uInt32_);this.smpl.dwSamplerData=this.read_(buffer,this.uInt32_);for(var i$16=0;i$16<this.smpl.dwNumSampleLoops;i$16++)this.smpl.loops.push({dwName:this.read_(buffer,this.uInt32_),dwType:this.read_(buffer,this.uInt32_),dwStart:this.read_(buffer,this.uInt32_),dwEnd:this.read_(buffer,this.uInt32_),dwFraction:this.read_(buffer,
this.uInt32_),dwPlayCount:this.read_(buffer,this.uInt32_)})}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @param {boolean} samples
 @throws {Error}
 */
WaveFile.prototype.readDataChunk_=function(buffer,signature,samples){/** @type {?Object} */ var chunk=this.findChunk_(signature,"data");if(chunk){this.data.chunkId="data";this.data.chunkSize=chunk.chunkSize;if(samples)this.data.samples=buffer.slice(chunk.chunkData.start,chunk.chunkData.end)}else throw Error('Could not find the "data" chunk');};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readBextChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"bext");if(chunk){this.head_=chunk.chunkData.start;this.bext.chunkId=chunk.chunkId;this.bext.chunkSize=chunk.chunkSize;this.bext.description=this.readString_(buffer,256);this.bext.originator=this.readString_(buffer,32);this.bext.originatorReference=this.readString_(buffer,32);this.bext.originationDate=this.readString_(buffer,10);this.bext.originationTime=this.readString_(buffer,
8);this.bext.timeReference=[this.read_(buffer,this.uInt32_),this.read_(buffer,this.uInt32_)];this.bext.version=this.read_(buffer,this.uInt16_);this.bext.UMID=this.readString_(buffer,64);this.bext.loudnessValue=this.read_(buffer,this.uInt16_);this.bext.loudnessRange=this.read_(buffer,this.uInt16_);this.bext.maxTruePeakLevel=this.read_(buffer,this.uInt16_);this.bext.maxMomentaryLoudness=this.read_(buffer,this.uInt16_);this.bext.maxShortTermLoudness=this.read_(buffer,this.uInt16_);this.bext.reserved=
this.readString_(buffer,180);this.bext.codingHistory=this.readString_(buffer,this.bext.chunkSize-602)}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 @throws {Error}
 */
WaveFile.prototype.readDs64Chunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"ds64");if(chunk){this.head_=chunk.chunkData.start;this.ds64.chunkId=chunk.chunkId;this.ds64.chunkSize=chunk.chunkSize;this.ds64.riffSizeHigh=this.read_(buffer,this.uInt32_);this.ds64.riffSizeLow=this.read_(buffer,this.uInt32_);this.ds64.dataSizeHigh=this.read_(buffer,this.uInt32_);this.ds64.dataSizeLow=this.read_(buffer,this.uInt32_);this.ds64.originationTime=this.read_(buffer,
this.uInt32_);this.ds64.sampleCountHigh=this.read_(buffer,this.uInt32_);this.ds64.sampleCountLow=this.read_(buffer,this.uInt32_)}else if(this.container=="RF64")throw Error('Could not find the "ds64" chunk');};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readLISTChunk_=function(buffer,signature){/** @type {?Object} */ var listChunks=this.findChunk_(signature,"LIST",true);if(listChunks===null)return;for(var j=0;j<listChunks.length;j++){/** @type {!Object} */ var subChunk=listChunks[j];this.LIST.push({chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,format:subChunk.format,subChunks:[]});for(var x=0;x<subChunk.subChunks.length;x++)this.readLISTSubChunks_(subChunk.subChunks[x],subChunk.format,buffer)}};/**
 @private
 @param {!Object} subChunk
 @param {string} format
 @param {!Uint8Array} buffer
 */
WaveFile.prototype.readLISTSubChunks_=function(subChunk,format,buffer){if(format=="adtl"){if(["labl","note","ltxt"].indexOf(subChunk.chunkId)>-1){this.head_=subChunk.chunkData.start;/** @type {!Object<string,(string|number)>} */ var item={chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,dwName:this.read_(buffer,this.uInt32_)};if(subChunk.chunkId=="ltxt"){item.dwSampleLength=this.read_(buffer,this.uInt32_);item.dwPurposeID=this.read_(buffer,this.uInt32_);item.dwCountry=this.read_(buffer,this.uInt16_);
item.dwLanguage=this.read_(buffer,this.uInt16_);item.dwDialect=this.read_(buffer,this.uInt16_);item.dwCodePage=this.read_(buffer,this.uInt16_)}item.value=this.readZSTR_(buffer,this.head_);this.LIST[this.LIST.length-1].subChunks.push(item)}}else if(format=="INFO"){this.head_=subChunk.chunkData.start;this.LIST[this.LIST.length-1].subChunks.push({chunkId:subChunk.chunkId,chunkSize:subChunk.chunkSize,value:this.readZSTR_(buffer,this.head_)})}};/**
 @private
 @param {!Uint8Array} buffer
 @param {!Object} signature
 */
WaveFile.prototype.readJunkChunk_=function(buffer,signature){/** @type {?Object} */ var chunk=this.findChunk_(signature,"junk");if(chunk)this.junk={chunkId:chunk.chunkId,chunkSize:chunk.chunkSize,chunkData:[].slice.call(buffer.slice(chunk.chunkData.start,chunk.chunkData.end))}};/**
 @private
 @param {!Uint8Array} bytes
 @return {string}
 */
WaveFile.prototype.readZSTR_=function(bytes,index){index=index===undefined?0:index;/** @type {string} */ var str="";for(var i$17=index;i$17<bytes.length;i$17++){this.head_++;if(bytes[i$17]===0)break;str+=unpackString(bytes,i$17,1)}return str};/**
 @private
 @param {!Uint8Array} bytes
 @param {number} maxSize
 @return {string}
 */
WaveFile.prototype.readString_=function(bytes,maxSize){/** @type {string} */ var str="";for(var i$18=0;i$18<maxSize;i$18++){str+=unpackString(bytes,this.head_,1);this.head_++}return str};/**
 @private
 @param {!Uint8Array} bytes
 @param {!Object} bdType
 @return {number}
 */
WaveFile.prototype.read_=function(bytes,bdType){/** @type {number} */ var size=bdType.bits/8;/** @type {number} */ var value=unpackFrom(bytes,bdType,this.head_);this.head_+=size;return value};/**
 @private
 @param {string} str
 @param {number} maxSize
 @return {!Array<number>}
 */
WaveFile.prototype.writeString_=function(str,maxSize,push){push=push===undefined?true:push;/** @type {!Array<number>} */ var bytes=packString(str);if(push)for(var i$19=bytes.length;i$19<maxSize;i$19++)bytes.push(0);return bytes};/** @private */ WaveFile.prototype.truncateSamples=function(samples){if(this.fmt.audioFormat===3){/** @type {number} */ var len=samples.length;for(var i$20=0;i$20<len;i$20++)if(samples[i$20]>1)samples[i$20]=1;else if(samples[i$20]<-1)samples[i$20]=-1}};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getBextBytes_=function(){/** @type {!Array<number>} */ var bytes=[];this.enforceBext_();if(this.bext.chunkId){this.bext.chunkSize=602+this.bext.codingHistory.length;bytes=bytes.concat(packString(this.bext.chunkId),pack(602+this.bext.codingHistory.length,this.uInt32_),this.writeString_(this.bext.description,256),this.writeString_(this.bext.originator,32),this.writeString_(this.bext.originatorReference,32),this.writeString_(this.bext.originationDate,10),this.writeString_(this.bext.originationTime,
8),pack(this.bext.timeReference[0],this.uInt32_),pack(this.bext.timeReference[1],this.uInt32_),pack(this.bext.version,this.uInt16_),this.writeString_(this.bext.UMID,64),pack(this.bext.loudnessValue,this.uInt16_),pack(this.bext.loudnessRange,this.uInt16_),pack(this.bext.maxTruePeakLevel,this.uInt16_),pack(this.bext.maxMomentaryLoudness,this.uInt16_),pack(this.bext.maxShortTermLoudness,this.uInt16_),this.writeString_(this.bext.reserved,180),this.writeString_(this.bext.codingHistory,this.bext.codingHistory.length))}return bytes};
/** @private */ WaveFile.prototype.enforceBext_=function(){for(var prop in this.bext)if(this.bext.hasOwnProperty(prop))if(this.bext[prop]&&prop!="timeReference"){this.bext.chunkId="bext";break}if(this.bext.timeReference[0]||this.bext.timeReference[1])this.bext.chunkId="bext"};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getDs64Bytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.ds64.chunkId)bytes=bytes.concat(packString(this.ds64.chunkId),pack(this.ds64.chunkSize,this.uInt32_),pack(this.ds64.riffSizeHigh,this.uInt32_),pack(this.ds64.riffSizeLow,this.uInt32_),pack(this.ds64.dataSizeHigh,this.uInt32_),pack(this.ds64.dataSizeLow,this.uInt32_),pack(this.ds64.originationTime,this.uInt32_),pack(this.ds64.sampleCountHigh,this.uInt32_),pack(this.ds64.sampleCountLow,this.uInt32_));return bytes};
/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getCueBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.cue.chunkId){/** @type {!Array<number>} */ var cuePointsBytes=this.getCuePointsBytes_();bytes=bytes.concat(packString(this.cue.chunkId),pack(cuePointsBytes.length+4,this.uInt32_),pack(this.cue.dwCuePoints,this.uInt32_),cuePointsBytes)}return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getCuePointsBytes_=function(){/** @type {!Array<number>} */ var points=[];for(var i$21=0;i$21<this.cue.dwCuePoints;i$21++)points=points.concat(pack(this.cue.points[i$21].dwName,this.uInt32_),pack(this.cue.points[i$21].dwPosition,this.uInt32_),packString(this.cue.points[i$21].fccChunk),pack(this.cue.points[i$21].dwChunkStart,this.uInt32_),pack(this.cue.points[i$21].dwBlockStart,this.uInt32_),pack(this.cue.points[i$21].dwSampleOffset,this.uInt32_));return points};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getSmplBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.smpl.chunkId){/** @type {!Array<number>} */ var smplLoopsBytes=this.getSmplLoopsBytes_();bytes=bytes.concat(packString(this.smpl.chunkId),pack(smplLoopsBytes.length+36,this.uInt32_),pack(this.smpl.dwManufacturer,this.uInt32_),pack(this.smpl.dwProduct,this.uInt32_),pack(this.smpl.dwSamplePeriod,this.uInt32_),pack(this.smpl.dwMIDIUnityNote,this.uInt32_),pack(this.smpl.dwMIDIPitchFraction,this.uInt32_),pack(this.smpl.dwSMPTEFormat,
this.uInt32_),pack(this.smpl.dwSMPTEOffset,this.uInt32_),pack(this.smpl.dwNumSampleLoops,this.uInt32_),pack(this.smpl.dwSamplerData,this.uInt32_),smplLoopsBytes)}return bytes};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getSmplLoopsBytes_=function(){/** @type {!Array<number>} */ var loops=[];for(var i$22=0;i$22<this.smpl.dwNumSampleLoops;i$22++)loops=loops.concat(pack(this.smpl.loops[i$22].dwName,this.uInt32_),pack(this.smpl.loops[i$22].dwType,this.uInt32_),pack(this.smpl.loops[i$22].dwStart,this.uInt32_),pack(this.smpl.loops[i$22].dwEnd,this.uInt32_),pack(this.smpl.loops[i$22].dwFraction,this.uInt32_),pack(this.smpl.loops[i$22].dwPlayCount,this.uInt32_));return loops};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getFactBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.fact.chunkId)bytes=bytes.concat(packString(this.fact.chunkId),pack(this.fact.chunkSize,this.uInt32_),pack(this.fact.dwSampleLength,this.uInt32_));return bytes};/**
 @private
 @return {!Array<number>}
 @throws {Error}
 */
WaveFile.prototype.getFmtBytes_=function(){/** @type {!Array<number>} */ var fmtBytes=[];if(this.fmt.chunkId)return fmtBytes.concat(packString(this.fmt.chunkId),pack(this.fmt.chunkSize,this.uInt32_),pack(this.fmt.audioFormat,this.uInt16_),pack(this.fmt.numChannels,this.uInt16_),pack(this.fmt.sampleRate,this.uInt32_),pack(this.fmt.byteRate,this.uInt32_),pack(this.fmt.blockAlign,this.uInt16_),pack(this.fmt.bitsPerSample,this.uInt16_),this.getFmtExtensionBytes_());throw Error('Could not find the "fmt " chunk');
};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getFmtExtensionBytes_=function(){/** @type {!Array<number>} */ var extension=[];if(this.fmt.chunkSize>16)extension=extension.concat(pack(this.fmt.cbSize,this.uInt16_));if(this.fmt.chunkSize>18)extension=extension.concat(pack(this.fmt.validBitsPerSample,this.uInt16_));if(this.fmt.chunkSize>20)extension=extension.concat(pack(this.fmt.dwChannelMask,this.uInt32_));if(this.fmt.chunkSize>24)extension=extension.concat(pack(this.fmt.subformat[0],this.uInt32_),pack(this.fmt.subformat[1],
this.uInt32_),pack(this.fmt.subformat[2],this.uInt32_),pack(this.fmt.subformat[3],this.uInt32_));return extension};/**
 @return {!Array<number>}
 */
WaveFile.prototype.getLISTBytes_=function(){/** @type {!Array<number>} */ var bytes=[];for(var i$23=0;i$23<this.LIST.length;i$23++){/** @type {!Array<number>} */ var subChunksBytes=this.getLISTSubChunksBytes_(this.LIST[i$23].subChunks,this.LIST[i$23].format);bytes=bytes.concat(packString(this.LIST[i$23].chunkId),pack(subChunksBytes.length+4,this.uInt32_),packString(this.LIST[i$23].format),subChunksBytes)}return bytes};/**
 @private
 @param {!Array<!Object>} subChunks
 @param {string} format
 @return {!Array<number>}
 */
WaveFile.prototype.getLISTSubChunksBytes_=function(subChunks,format){/** @type {!Array<number>} */ var bytes=[];for(var i$24=0;i$24<subChunks.length;i$24++){if(format=="INFO"){bytes=bytes.concat(packString(subChunks[i$24].chunkId),pack(subChunks[i$24].value.length+1,this.uInt32_),this.writeString_(subChunks[i$24].value,subChunks[i$24].value.length));bytes.push(0)}else if(format=="adtl")if(["labl","note"].indexOf(subChunks[i$24].chunkId)>-1){bytes=bytes.concat(packString(subChunks[i$24].chunkId),
pack(subChunks[i$24].value.length+4+1,this.uInt32_),pack(subChunks[i$24].dwName,this.uInt32_),this.writeString_(subChunks[i$24].value,subChunks[i$24].value.length));bytes.push(0)}else if(subChunks[i$24].chunkId=="ltxt")bytes=bytes.concat(this.getLtxtChunkBytes_(subChunks[i$24]));if(bytes.length%2)bytes.push(0)}return bytes};/**
 @private
 @param {!Object} ltxt
 @return {!Array<number>}
 */
WaveFile.prototype.getLtxtChunkBytes_=function(ltxt){return[].concat(packString(ltxt.chunkId),pack(ltxt.value.length+20,this.uInt32_),pack(ltxt.dwName,this.uInt32_),pack(ltxt.dwSampleLength,this.uInt32_),pack(ltxt.dwPurposeID,this.uInt32_),pack(ltxt.dwCountry,this.uInt16_),pack(ltxt.dwLanguage,this.uInt16_),pack(ltxt.dwDialect,this.uInt16_),pack(ltxt.dwCodePage,this.uInt16_),this.writeString_(ltxt.value,ltxt.value.length))};/**
 @private
 @return {!Array<number>}
 */
WaveFile.prototype.getJunkBytes_=function(){/** @type {!Array<number>} */ var bytes=[];if(this.junk.chunkId)return bytes.concat(packString(this.junk.chunkId),pack(this.junk.chunkData.length,this.uInt32_),this.junk.chunkData);return bytes};/**
 @private
 @return {string}
 */
WaveFile.prototype.correctContainer_=function(){return this.container=="RF64"?"RIFF":this.container};/** @private */ WaveFile.prototype.bitDepthFromFmt_=function(){if(this.fmt.audioFormat===3&&this.fmt.bitsPerSample===32)this.bitDepth="32f";else if(this.fmt.audioFormat===6)this.bitDepth="8a";else if(this.fmt.audioFormat===7)this.bitDepth="8m";else this.bitDepth=this.fmt.bitsPerSample.toString()};/**
 @private
 @return {!Uint8Array}
 */
WaveFile.prototype.createWaveFile_=function(){/** @type {!Array<!Array<number>>} */ var fileBody=[this.getJunkBytes_(),this.getDs64Bytes_(),this.getBextBytes_(),this.getFmtBytes_(),this.getFactBytes_(),packString(this.data.chunkId),pack(this.data.samples.length,this.uInt32_),this.data.samples,this.getCueBytes_(),this.getSmplBytes_(),this.getLISTBytes_()];/** @type {number} */ var fileBodyLength=0;for(var i$25=0;i$25<fileBody.length;i$25++)fileBodyLength+=fileBody[i$25].length;/** @type {!Uint8Array} */ var file=
new Uint8Array(fileBodyLength+12);/** @type {number} */ var index=0;index=packStringTo(this.container,file,index);index=packTo(fileBodyLength+4,this.uInt32_,file,index);index=packStringTo(this.format,file,index);for(var i$26=0;i$26<fileBody.length;i$26++){file.set(fileBody[i$26],index);index+=fileBody[i$26].length}return file};return WaveFile}();return WaveFile; })));
