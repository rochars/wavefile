// Type definitions for wavefile 7.0
// Project: https://github.com/rochars/wavefile
// Definitions by: Rafael S. Rocha <https://github.com/rochars>
// Definitions: https://github.com/rochars/wavefile

export default WaveFile;

declare class WaveFile {
    
    constructor(bytes?: Uint8Array);

    fromScratch(numChannels: number, sampleRate: number, bitDepth: string, samples: Array<number>, options?: object): void;

    fromBuffer(bytes: Uint8Array): void;

    toBuffer(): Uint8Array;

    fromBase64(base64String: string): void;

    toBase64(): string;

    toDataURI(): string;

    fromDataURI(dataURI: string): void;

    toRIFF(): void;

    toRIFX(): void;

    toBitDepth(bitDepth: string, changeResolution?: boolean): void;

    interleave(): void;

    deInterleave(): void;

    toIMAADPCM(): void;

    fromIMAADPCM(bitDepth?: string): void;

    toALaw(): void;

    fromALaw(bitDepth?: string): void;

    toMuLaw(): void;

    fromMuLaw(bitDepth?: string): void;

    setTag(tag: string, value: string): void;

    getTag(tag: string): string|null;

    deleteTag(tag: string): boolean;

    setCuePoint(position: number, labl?: string): void;

    deleteCuePoint(index: number): void;

    updateLabel(pointIndex: number, label: string): void;
}
