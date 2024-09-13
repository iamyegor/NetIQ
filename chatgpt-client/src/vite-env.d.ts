/// <reference types="vite/client" />

import { ImportMetaEnv } from "vite/types/importMeta";
import React from "react";

interface ImportMeta {
    readonly env: ImportMetaEnv;
}

declare module "*.svg" {
    import * as React from "react";

    export const ReactComponent: React.FunctionComponent<
        React.SVGProps<SVGSVGElement> & { title?: string }
    >;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "l-ring-2": React.DetailedHTMLProps<any, HTMLElement>;
        }
    }
}
