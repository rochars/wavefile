// Type definitions for wavefile 8.2
// Project: https://github.com/rochars/wavefile
// Definitions by: Rafael S. Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/wavefile

export default WaveFile;

declare class WaveFile {
    
    constructor(bytes?: Uint8Array);

    fromScratch(numChannels: number, sampleRate: number, bitDepthCode: string, samples: Array<number>, options?: object): void;

    fromBuffer(bytes: Uint8Array, samples?:boolean): void;

    toBuffer(): Uint8Array;

    fromBase64(base64String: string): void;

    toBase64(): string;

    toDataURI(): string;

    fromDataURI(dataURI: string): void;

    toRIFF(): void;

    toRIFX(): void;

    toBitDepth(newBitDepth: string, changeResolution?: boolean): void;

    toIMAADPCM(): void;

    fromIMAADPCM(bitDepthCode?: string): void;

    toALaw(): void;

    fromALaw(bitDepthCode?: string): void;

    toMuLaw(): void;

    fromMuLaw(bitDepthCode?: string): void;

    setTag(tag: string, value: string): void;

    getTag(tag: string): string|null;

    deleteTag(tag: string): boolean;

    setCuePoint(position: number, labl?: string): void;

    deleteCuePoint(index: number): void;

    updateLabel(pointIndex: number, label: string): void;

    listTags(): object;

    listCuePoints(): Array<object>;
}
