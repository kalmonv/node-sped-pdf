declare class danfe {
    #private;
    constructor(data?: {
        xml?: Record<string, any>;
        xmlRes?: Record<string, any> | null;
        logo?: string | null;
        imgDemo?: string | null;
    });
    getPDF(): Promise<string>;
}
export { danfe };
