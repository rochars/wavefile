/*
 * Copyright (c) 2017-2019 Rafael da Silva Rocha.
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 */

/**
 * @fileoverview The WaveFileMetaEditor class.
 * @see https://github.com/rochars/wavefile
 */

import { WaveFileCreator } from './wavefile-creator';
import fixRIFFTag from './fix-riff-tag';

/**
 * A class to edit meta information in wav files.
 * @extends WaveFileCreator
 * @ignore
 */
export class WaveFileMetaEditor extends WaveFileCreator {

  /**
   * Return the value of a RIFF tag in the INFO chunk.
   * @param {string} tag The tag name.
   * @return {?string} The value if the tag is found, null otherwise.
   */
  getTag(tag) {
    /** @type {!Object} */
    let index = this.getTagIndex_(tag);
    if (index.TAG !== null) {
      return this.LIST[index.LIST].subChunks[index.TAG].value;
    }
    return null;
  }

  /**
   * Write a RIFF tag in the INFO chunk. If the tag do not exist,
   * then it is created. It if exists, it is overwritten.
   * @param {string} tag The tag name.
   * @param {string} value The tag value.
   * @throws {Error} If the tag name is not valid.
   */
  setTag(tag, value) {
    tag = fixRIFFTag(tag);
    /** @type {!Object} */
    let index = this.getTagIndex_(tag);
    if (index.TAG !== null) {
      this.LIST[index.LIST].subChunks[index.TAG].chunkSize =
        value.length + 1;
      this.LIST[index.LIST].subChunks[index.TAG].value = value;
    } else if (index.LIST !== null) {
      this.LIST[index.LIST].subChunks.push({
        chunkId: tag,
        chunkSize: value.length + 1,
        value: value});
    } else {
      this.LIST.push({
        chunkId: 'LIST',
        chunkSize: 8 + value.length + 1,
        format: 'INFO',
        subChunks: []});
      this.LIST[this.LIST.length - 1].subChunks.push({
        chunkId: tag,
        chunkSize: value.length + 1,
        value: value});
    }
  }

  /**
   * Remove a RIFF tag from the INFO chunk.
   * @param {string} tag The tag name.
   * @return {boolean} True if a tag was deleted.
   */
  deleteTag(tag) {
    /** @type {!Object} */
    let index = this.getTagIndex_(tag);
    if (index.TAG !== null) {
      this.LIST[index.LIST].subChunks.splice(index.TAG, 1);
      return true;
    }
    return false;
  }

  /**
   * Return a Object<tag, value> with the RIFF tags in the file.
   * @return {!Object<string, string>} The file tags.
   */
  listTags() {
    /** @type {?number} */
    let index = this.getLISTINFOIndex_();
    /** @type {!Object} */
    let tags = {};
    if (index !== null) {
      for (let i = 0, len = this.LIST[index].subChunks.length; i < len; i++) {
        tags[this.LIST[index].subChunks[i].chunkId] =
          this.LIST[index].subChunks[i].value;
      }
    }
    return tags;
  }

  /**
   * Return an array with all cue points in the file, in the order they appear
   * in the file.
   * The difference between this method and using the list in WaveFile.cue
   * is that the return value of this method includes the position in
   * milliseconds of each cue point (WaveFile.cue only have the sample offset)
   * @return {!Array<!Object>}
   */
  listCuePoints() {
    /** @type {!Array<!Object>} */
    let points = this.getCuePoints_();
    for (let i = 0, len = points.length; i < len; i++) {
      points[i].milliseconds =
        (points[i].dwSampleOffset / this.fmt.sampleRate) * 1000;
    }
    return points;
  }

  /**
   * Create a cue point in the wave file.
   * @param {number} position The cue point position in milliseconds.
   * @param {string} labl The LIST adtl labl text of the marker. Optional.
   */
  setCuePoint(position, labl='') {
    this.cue.chunkId = 'cue ';

    /**
     * Load the existing points before erasing
     * the LIST 'adtl' chunk and the cue attr
     * @type {!Array<!Object>}
     */
    let existingPoints = this.getCuePoints_();

    // Clear any LIST labeled 'adtl'
    // The LIST chunk should be re-written
    // after the new cue point is created
    this.clearLISTadtl_();

    /**
     * Get the current len of the cue points
     * in the file before erasing the cue attr
     * @type {number}
     */
    let len = this.cue.points.length;

    // Erase this.cue so it can be re-written
    // after the point is added
    this.cue.points = [];

    /**
     * Cue position param is informed in milliseconds,
     * here its value is converted to the sample offset
     * @type {number}
     */
    let sampleOffset = (position * this.fmt.sampleRate) / 1000;

    // If there were no cue points in the file,
    // insert the new cue point as the first
    if (len === 0) {
      this.setCuePoint_(sampleOffset, 1, labl);

    // If the file already had cue points, This new one
    // must be added in the list according to its position.
    } else {

      /** @type {boolean} */
      let hasSet = false;

      // Iterate over the cue points that existed
      // before this one was added
      for (let i = 0; i < len; i++) {

        // If the new point is located before this original point
        // and the new point have not been created, create the
        // new point and then the original point
        if (existingPoints[i].dwSampleOffset > sampleOffset && !hasSet) {
          // create the new point
          this.setCuePoint_(sampleOffset, i + 1, labl);

          // create the original point
          this.setCuePoint_(
            existingPoints[i].dwSampleOffset,
            i + 2,
            existingPoints[i].label);
          hasSet = true;

        // Otherwise, re-create the original point
        } else {
          this.setCuePoint_(
            existingPoints[i].dwSampleOffset,
            hasSet ? i + 2 : i + 1,
            existingPoints[i].label);
        }
      }
      // If no point was created in the above loop,
      // create the new point as the last one
      if (!hasSet) {
        this.setCuePoint_(sampleOffset, this.cue.points.length + 1, labl);
      }
    }
    this.cue.dwCuePoints = this.cue.points.length;
  }

  /**
   * Remove a cue point from a wave file.
   * @param {number} index the index of the point. First is 1,
   *    second is 2, and so on.
   */
  deleteCuePoint(index) {
    this.cue.chunkId = 'cue ';
    /** @type {!Array<!Object>} */
    let existingPoints = this.getCuePoints_();
    this.clearLISTadtl_();
    /** @type {number} */
    let len = this.cue.points.length;
    this.cue.points = [];
    for (let i = 0; i < len; i++) {
      if (i + 1 !== index) {
        this.setCuePoint_(
          existingPoints[i].dwSampleOffset,
          i + 1,
          existingPoints[i].label);
      }
    }
    this.cue.dwCuePoints = this.cue.points.length;
    if (this.cue.dwCuePoints) {
      this.cue.chunkId = 'cue ';
    } else {
      this.cue.chunkId = '';
      this.clearLISTadtl_();
    }
  }

  /**
   * Update the label of a cue point.
   * @param {number} pointIndex The ID of the cue point.
   * @param {string} label The new text for the label.
   */
  updateLabel(pointIndex, label) {
    /** @type {?number} */
    let cIndex = this.getAdtlChunk_();
    if (cIndex !== null) {
      for (let i = 0, len = this.LIST[cIndex].subChunks.length; i < len; i++) {
        if (this.LIST[cIndex].subChunks[i].dwName ==
            pointIndex) {
          this.LIST[cIndex].subChunks[i].value = label;
        }
      }
    }
  }

  /**
   * Return an array with all cue points in the file, in the order they appear
   * in the file.
   * @return {!Array<!Object>}
   * @private
   */
  getCuePoints_() {
    /** @type {!Array<!Object>} */
    let points = [];
    for (let i = 0; i < this.cue.points.length; i++) {
      // Raw cue point data
      let cuePointData = this.getDataForCuePoint_(this.cue.points[i].dwName);
      cuePointData.label = cuePointData.value ? cuePointData.value : '';
      Object.assign(cuePointData, this.cue.points[i]);
      points.push(cuePointData);
    }
    return points;
  }

  /**
   * Return the label of a cue point.
   * @param {number} pointDwName The ID of the cue point.
   * @return {!Object}
   * @private
   */
  getDataForCuePoint_(pointDwName) {
    /** @type {?number} */
    let cIndex = this.getAdtlChunk_();
    let pointData = {};
    if (cIndex !== null) {
      // got through all chunks in the adtl LIST checking
      // for references to this cue point
      for (let i = 0, len = this.LIST[cIndex].subChunks.length; i < len; i++) {
        if (this.LIST[cIndex].subChunks[i].dwName ==
            pointDwName && this.LIST[cIndex].subChunks[i].chunkId) {
          Object.assign(pointData, this.LIST[cIndex].subChunks[i]);
        }
      }
    }
    return pointData;
  }

  /**
   * Return the index of the INFO chunk in the LIST chunk.
   * @return {?number} the index of the INFO chunk.
   * @private
   */
  getLISTINFOIndex_() {
    /** @type {?number} */
    let index = null;
    for (let i = 0, len = this.LIST.length; i < len; i++) {
      if (this.LIST[i].format === 'INFO') {
        index = i;
        break;
      }
    }
    return index;
  }

  /**
   * Return the index of the 'adtl' LIST in this.LIST.
   * @return {?number}
   * @private
   */
  getAdtlChunk_() {
    for (let i = 0, len = this.LIST.length; i < len; i++) {
      if (this.LIST[i].format == 'adtl') {
        return i;
      }
    }
    return null;
  }

  /**
   * Return the index of a tag in a FILE chunk.
   * @param {string} tag The tag name.
   * @return {!Object<string, ?number>}
   *    Object.LIST is the INFO index in LIST
   *    Object.TAG is the tag index in the INFO
   * @private
   */
  getTagIndex_(tag) {
    /** @type {!Object<string, ?number>} */
    let index = {LIST: null, TAG: null};
    for (let i = 0, len = this.LIST.length; i < len; i++) {
      if (this.LIST[i].format == 'INFO') {
        index.LIST = i;
        for (let j=0, subLen = this.LIST[i].subChunks.length; j < subLen; j++) {
          if (this.LIST[i].subChunks[j].chunkId == tag) {
            index.TAG = j;
            break;
          }
        }
        break;
      }
    }
    return index;
  }

  /**
   * Push a new cue point in this.cue.points.
   * @param {number} position The position in milliseconds.
   * @param {number} dwName the dwName of the cue point
   * @private
   */
  setCuePoint_(position, dwName, label) {
    this.cue.points.push({
      dwName: dwName,
      dwPosition: 0, // should not be hardcoded
      fccChunk: 'data', // should not be hardcoded
      dwChunkStart: 0, // should not be hardcoded
      dwBlockStart: 0, // should not be hardcoded
      dwSampleOffset: position,
    });
    this.setLabl_(dwName, label);
  }

  /**
   * Clear any LIST chunk labeled as 'adtl'.
   * @private
   */
  clearLISTadtl_() {
    for (let i = 0, len = this.LIST.length; i < len; i++) {
      if (this.LIST[i].format == 'adtl') {
        this.LIST.splice(i);
      }
    }
  }

  /**
   * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
   * This method creates a LIST adtl chunk in the file if one
   * is not present.
   * @param {number} dwName The ID of the cue point.
   * @param {string} label The label for the cue point.
   * @private
   */
  setLabl_(dwName, label) {
    /**
     * Get the index of the LIST chunk labeled as adtl.
     * A file can have many LIST chunks with unique labels.
     * @type {?number}
     */
    let adtlIndex = this.getAdtlChunk_();
    // If there is no adtl LIST, create one
    if (adtlIndex === null) {
      // Include a new item LIST chunk
      this.LIST.push({
        chunkId: 'LIST',
        chunkSize: 4,
        format: 'adtl',
        subChunks: []});
      // Get the index of the new LIST chunk
      adtlIndex = this.LIST.length - 1;
    }
    this.setLabelText_(adtlIndex, dwName, label);
  }

  /**
   * Create a new 'labl' subchunk in a 'LIST' chunk of type 'adtl'.
   * @param {number} adtlIndex The index of the 'adtl' LIST in this.LIST.
   * @param {number} dwName The ID of the cue point.
   * @param {string} label The label for the cue point.
   * @private
   */
  setLabelText_(adtlIndex, dwName, label) {
    this.LIST[adtlIndex].subChunks.push({
      chunkId: 'labl',
      chunkSize: label.length,
      dwName: dwName,
      value: label
    });
    this.LIST[adtlIndex].chunkSize += label.length + 4 + 4 + 4 + 1;
  }
}
