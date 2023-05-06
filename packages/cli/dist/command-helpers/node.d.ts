/// <reference types="node" />
import { URL } from 'url';
export declare const validateNodeUrl: (node: string) => URL;
export declare const normalizeNodeUrl: (node: string) => string;
export declare function chooseNodeUrl({ product, studio, node, allowSimpleName, }: {
    product: string | undefined;
    studio: boolean | undefined;
    node?: string;
    allowSimpleName?: boolean;
}): {
    node: string | undefined;
    allowSimpleName: boolean | undefined;
};